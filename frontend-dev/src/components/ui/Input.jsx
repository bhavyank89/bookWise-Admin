const Input = ({ className, ...props }) => {
    return (
        <input
            className={`border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
        />
    );
};

export { Input };
