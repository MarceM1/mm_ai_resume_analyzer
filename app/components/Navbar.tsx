import { Link } from "react-router";
import { LanguageSwitch } from "./LanguageSwith";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to={"/"}>
                <p className="text-2xl font-bold text-gradient">Resumind</p>
            </Link>
            <Link to={"/upload"} className="primary-button w-fit">
                Upload Resume
            </Link>
            {/* <LanguageSwitch /> */}
        </nav>
    );
};

export default Navbar;