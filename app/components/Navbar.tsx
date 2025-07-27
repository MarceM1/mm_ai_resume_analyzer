import { Link } from "react-router";
import { LanguageSwitch } from "./LanguageSwith";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to={"/"}>
                <p className="text-2xl font-bold text-gradient">Resumind</p>
            </Link>
            <div className="flex flex-row gap-2">
                <Link to={"/upload"} className="primary-button w-fit">
                    Upload Resume
                </Link>
                {/* <LanguageSwitch /> */}
            </div>
        </nav>
    );
};

export default Navbar;