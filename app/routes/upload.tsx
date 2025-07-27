import Navbar from "~/components/Navbar";
import { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { prepareInstructions, prepareInstructionsSpanish } from "../../constants/index";
import { generateUUID } from "~/lib/utils";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useI18n } from "~/hooks/useI8n";
import { useLanguageStore } from "~/lib/language";

const Upload = () => {
    const u = useI18n()
    const lang = useLanguageStore.getState().language;

    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        console.log('uploadedImage:', uploadedImage)
        console.log('uploadedFile:', uploadedFile)

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        console.log('uuid:', uuid)

        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        console.log('lang:', lang)
        const instructions =
            lang === 'es'
                ? prepareInstructionsSpanish({ jobTitle, jobDescription })
                : prepareInstructions({ jobTitle, jobDescription });

        console.log('instructions:', instructions)
        try {
            const feedback = await ai.feedback(
                uploadedFile.path,
                instructions
            );

            if (!feedback) {
                setStatusText('Error: Failed to analyze resume');
                return;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error('AI feedback error:', error);
            // Analizamos si es el error de límite de uso
            const errorCode = error?.error?.code || error?.code;
            const isUsageError = errorCode === 'error_400_from_delegate';

            if (isUsageError) {
                setStatusText(lang === 'es'
                    ? 'Se ha alcanzado el límite de uso. Serás redirigido al panel de Puter...'
                    : 'Usage limit reached. Redirecting to Puter dashboard...'
                );

                setTimeout(() => {
                    window.location.href = 'https://puter.ai/dashboard';
                }, 2500);

                return;
            }

            
            setStatusText(lang === 'es'
                ? 'Hubo un error al analizar tu CV. Intenta nuevamente.'
                : 'There was an error analyzing your resume. Please try again.'
            );
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>{u.upload.title}</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="resumen scan" className="w-full" />
                        </>
                    ) : (
                        <h2>{u.upload.subtitle}</h2>
                    )}
                    {!isProcessing ? (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8" action="">
                            <div className="form-div">
                                <label htmlFor="company-name">{u.uploadForm.label_companyName}</label>
                                <input type="text" name="company-name" id="company-name"
                                    placeholder={u.uploadForm.placeholder_companyName} />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">{u.uploadForm.label_jobTitle}</label>
                                <input type="text" name="job-title" id="job-title" placeholder={u.uploadForm.placeholder_jobTitle} />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">{u.uploadForm.label_jobDescription}</label>
                                <textarea rows={5} name="job-description" id="job-description"
                                    placeholder={u.uploadForm.placeholder_jobDescription} />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">{u.uploadForm.label_uploadResume}</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button type="submit" className="primary-button">{u.uploadForm.analyzeResume}</button>
                        </form>
                    ) : (
                        <></>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;