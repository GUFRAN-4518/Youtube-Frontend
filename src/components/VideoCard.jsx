import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const VideoCard = ({ video }) => {
  const thumbnail =
    video?.thumbnail?.url ||
    video?.thumbnail ||
    "https://via.placeholder.com/1280x720?text=No+Thumbnail";

  const avatar =
    video?.owner?.avatar?.url ||
    video?.owner?.avatar ||
    "https://via.placeholder.com/150?text=User";

  return (
    <Link
      to={`/video/${video._id}`}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-gray-900 border border-white/5 shadow-lg">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-red-600/90 backdrop-blur-sm p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <Play className="text-white w-6 h-6 fill-current pl-0.5" />
            </div>
        </div>

        {!video.isPublished && (
          <span className="absolute top-3 left-3 bg-yellow-500/90 backdrop-blur-md text-black font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
            Draft
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex gap-3 px-1">
        <img
          src={avatar}
          alt="channel avatar"
          className="w-9 h-9 rounded-full object-cover bg-gray-800 border border-white/10 shrink-0 mt-0.5"
        />

        <div className="flex flex-col overflow-hidden">
          <h3 className="font-semibold text-gray-100 text-[15px] line-clamp-2 leading-snug group-hover:text-red-400 transition-colors duration-200">
            {video.title}
          </h3>

          <p className="text-gray-400 text-sm mt-1 hover:text-gray-300 transition-colors">
            {video.owner?.username || "Unknown Channel"}
          </p>

          <p className="text-gray-500 text-xs mt-0.5 font-medium">
            {video.views?.toLocaleString() ?? 0} views <span className="mx-1">•</span>{" "}
            {video.createdAt
              ? new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;