import { useLanguageStore } from "~/lib/language";

export const LanguageSwitch = ()=> {
    const { language, setLanguage } = useLanguageStore((state) => state);

    const handleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <button className="primary-button" onClick={handleLanguage}>
            {language === 'en' ? 'ES' : 'EN'}
        </button>
    )
}