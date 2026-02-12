// src/components/findmyspace/PostCard.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
function PostCard({ post, onClick }) {
  const images = post.images
    ? post.images
    : post.posts
    ? post.posts.map((p) => p.roomImage).filter(Boolean)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group relative hover:shadow-lg transition-all duration-300">
      <div className="cursor-pointer" onClick={onClick}>
        {/* Image Slider */}
        <div className="relative w-full h-52 bg-gray-200 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
              />

              {/* Left Arrow */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentIndex ? "bg-white" : "bg-white/50"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Post Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {post.description?.length > 70
              ? `${post.description.substring(0, 70)}...`
              : post.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
