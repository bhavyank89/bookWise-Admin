const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-300 rounded-md ${className}`}
            {...props}
        />
    );
};

export { Skeleton };
