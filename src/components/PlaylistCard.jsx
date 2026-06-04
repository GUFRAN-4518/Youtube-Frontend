import { Link } from "react-router-dom";
import { ListVideo } from "lucide-react";

const PlaylistCard = ({ playlist }) => {
  const firstVideo = playlist.videos?.[0];

  return (
    <Link
      to={`/playlist/${playlist._id}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-lg">
        {firstVideo ? (
          <img
            src={firstVideo.thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-white/5 text-gray-600">
            <ListVideo size={32} className="opacity-50" />
          </div>
        )}

        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center border-l border-white/10 opacity-90 group-hover:bg-red-600/80 transition-colors duration-300">
          <ListVideo className="text-white w-6 h-6 mb-1" />
          <span className="text-white text-xs font-medium">
            {playlist.videos?.length || 0}
          </span>
        </div>

        {/* Hover Play Indicator */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pr-[33%]">
            <span className="bg-white/20 backdrop-blur-md text-white font-medium text-sm px-4 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/10">
              View full playlist
            </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-1">
        <h3 className="font-semibold text-gray-100 text-[15px] line-clamp-2 leading-snug group-hover:text-red-400 transition-colors duration-200">
          {playlist.name}
        </h3>

        <p className="text-gray-400 text-sm mt-1 hover:text-gray-300 transition-colors">
          {playlist.owner?.username || "Unknown Author"}
        </p>
      </div>
    </Link>
  );
};

export default PlaylistCard;