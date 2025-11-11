// src/components/findmyspace/PgRoomDetail.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PgRoomDetail({ room, onBackToPgDetail }) {
  if (!room) return null;

  const images = Array.isArray(room.roomImage)
    ? room.roomImage.filter(Boolean)
    : room.roomImage
    ? [room.roomImage]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <button
        onClick={onBackToPgDetail}
        className="mb-6 text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition-all font-semibold"
      >
        &larr; Back to PG Overview
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-2xl mx-auto transition-all duration-300">
        {/* Header */}
        <div className="bg-gray-800 dark:bg-gray-700 text-white p-4">
          <h2 className="text-xl font-bold">{room.title}</h2>
        </div>

        {/* Image Slider */}
        <div className="relative w-full h-64 bg-gray-300 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`${room.title} - ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
              />

              {images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                          i === currentIndex ? "bg-white" : "bg-white/50"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-lg font-medium">
              No Room Image Available
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="p-6 bg-gray-800 dark:bg-gray-900 text-white">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
            Details
          </h3>
          <p className="text-gray-300 mb-4 leading-relaxed">{room.description}</p>

          <div className="text-gray-300 space-y-1">
            <p className="font-bold text-white">Roommates Required:</p>
            <p>{room.roommates_required}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgRoomDetail;