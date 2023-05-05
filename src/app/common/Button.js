const Button = ({ children, onClick, color = "pink", type = "button" }) => (
    <button
        type={type}
        className={`bg-${color}-500 text-white uppercase font-bold text-sm py-3 px-6 my-3 rounded-md`}
        onClick={onClick}
    >
        {children}
    </button>
)

export default Button;