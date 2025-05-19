const Button = ({ variant = 'default', children, className, ...props }) => {
    const baseStyles = 'px-4 py-2 rounded-md text-sm font-semibold';
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button };
