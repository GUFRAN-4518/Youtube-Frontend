const SkeletonCard = () => {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="bg-white/5 border border-white/5 aspect-video rounded-2xl w-full"></div>      
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-full shrink-0"></div>
        
        <div className="flex flex-col flex-1 gap-2 pt-1">
          <div className="h-4 bg-white/10 rounded-md w-11/12"></div>
          <div className="h-3 bg-white/5 rounded-md w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;