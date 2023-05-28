const Button = ({ children, onClick, color = "pink", type = "button" }) => (
    <button
        type={type}
        // className={`bg-${color}-500 text-white uppercase font-bold text-sm py-3 px-6 my-3 mr-1 rounded-md`}
        className={`bg-white text-gray-700 uppercase font-bold text-xs py-1 px-3 mr-1 rounded-sm border border-gray-700`}
        onClick={onClick}
    >
        {children}
    </button>
)

export default Button;