import { Link } from "react-router";
import { LanguageSwitch } from "./LanguageSwith";
import { useI18n } from "~/hooks/useI8n";

const Navbar = () => {
    const t = useI18n();
    return (
        <nav className="navbar">
            <Link to={"/"}>
                <p className="text-2xl font-bold text-gradient">Resumind</p>
            </Link>
            <div className="flex flex-row gap-2">
                <Link to={"/upload"} className="primary-button w-fit">
                    {t.navbar.upload}
                </Link>
                <LanguageSwitch />
            </div>
        </nav>
    );
};

export default Navbar;