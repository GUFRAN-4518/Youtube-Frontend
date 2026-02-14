import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  const firstVideo = playlist.videos?.[0];

  return (
    <Link
      to={`/playlist/${playlist._id}`}
      className="group block cursor-pointer"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">

        {firstVideo ? (
          <img
            src={firstVideo.thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Videos
          </div>
        )}

        {/* Overlay */}
        <div className="absolute bottom-0 right-0 bg-black/70 px-3 py-1 text-sm rounded-tl-lg">
          {playlist.videos?.length || 0} videos
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3">
        <h3 className="font-semibold line-clamp-2">
          {playlist.name}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {playlist.owner?.username || "Unknown"}
        </p>
      </div>
    </Link>
  );
};

export default PlaylistCard;