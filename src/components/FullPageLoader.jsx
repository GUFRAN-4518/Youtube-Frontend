const FullPageLoader = ({ text = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xs bg-black/50">
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-red-500 border-r-transparent border-red-500 border-l-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-gray-400 border-b-transparent border-gray-400 animate-[spin_0.8s_linear_infinite_reverse]"></div>
            </div>
        </div>
        </div>
    );
};

export default FullPageLoader;