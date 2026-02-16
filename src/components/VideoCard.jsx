import { Link } from "react-router-dom";

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
      className="group cursor-pointer block"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-800">

        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {!video.isPublished && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
            Draft
          </span>
        )}
      </div>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">

        {/* Avatar */}
        <img
          src={avatar}
          alt="channel avatar"
          className="w-10 h-10 rounded-full object-cover bg-gray-700"
        />

        <div className="flex flex-col flex-1">

          <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
            {video.title}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {video.owner?.username || "Unknown Channel"}
          </p>

          <p className="text-gray-500 text-xs mt-1">
            {video.views ?? 0} views •{" "}
            {video.createdAt
              ? new Date(video.createdAt).toLocaleDateString()
              : ""}
          </p>

        </div>
      </div>
    </Link>
  );
};

export default VideoCard;