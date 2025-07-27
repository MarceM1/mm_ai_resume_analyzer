import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useI18n } from "~/hooks/useI8n";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Resumind - Smart Resume Feedbac" },
        { name: "description", content: "AI feedback for your dream job!" },
    ];
}

export default function Home() {
    const t = useI18n();

    const { auth, kv } = usePuterStore()
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loadingResumes, setLoadingResumes] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/')
    }, [auth.isAuthenticated])


    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true)
            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes || [])

            setLoadingResumes(false)
        }
        loadResumes()
    }, [])


    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>
                    {t.home.heroTitle}
                </h1>
                {!loadingResumes && resumes?.length === 0 ? (
                    <h2>{t.home.heroSubtitle_alt}</h2>
                ) : (
                    <h2>
                        {t.home.heroSubtitle}
                    </h2>
                )}

            </div>
            {loadingResumes && (
                <div className="flex flex-col items-center justify-center">
                    <img src="/images/resume-scan-2.gif" alt="resume scan" className="w-[200px]" />
                </div>
            )}

            {
                !loadingResumes && resumes.length > 0 && (
                    <div className="resumes-section">
                        {
                            resumes.map((resume: Resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))
                        }
                    </div>
                )
            }

            {!loadingResumes && resumes.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                        {t.navbar.upload}
                    </Link>
                </div>
            )}
        </section>


    </main>;
}
