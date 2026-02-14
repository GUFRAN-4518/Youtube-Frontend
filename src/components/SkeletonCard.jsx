const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 aspect-video rounded-xl"></div>
      <div className="flex gap-3 mt-3">
        <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded mb-2"></div>
          <div className="h-3 bg-gray-800 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;