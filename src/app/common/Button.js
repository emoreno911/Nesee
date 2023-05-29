import { strokeButtonStyle } from "../utils";

const Button = ({ children, onClick, type = "button" }) => (
    <button
        type={type}
        className={strokeButtonStyle}
        onClick={onClick}
    >
        {children}
    </button>
)

export default Button;