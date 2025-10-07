// src/components/findmyspace/PostDetail.jsx

import { useState, useEffect } from "react";
import PgRoomDetail from "./PgRoomDetail";
import { useAuth } from "../../context/AuthContext";

// ✅ FIXED: Added `initialRoom` and `onViewedInitialRoom` to the props list
function PostDetail({ post, onBack, onOpenPgPostModal, initialRoom, onViewedInitialRoom }) {
  const { user, token } = useAuth();
  const currentUserId = user?._id;
  const [selectedRoom, setSelectedRoom] = useState(null);

  // This effect handles opening a specific room when directed from the parent component
  useEffect(() => {
    if (initialRoom && post.posts) {
      const roomToOpen = post.posts.find(r => r._id === initialRoom._id);
      if (roomToOpen) {
        setSelectedRoom(roomToOpen);
        onViewedInitialRoom(); // Let the parent know we've handled it
      }
    }
  }, [initialRoom, post, onViewedInitialRoom]);


  if (selectedRoom) {
    return <PgRoomDetail room={selectedRoom} onBackToPgDetail={() => setSelectedRoom(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300"
      >
        &larr; Back to Listings
      </button>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Image Section */}
        <div className="p-2 bg-gray-100">
          {post.images && post.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {post.images.map((imgUrl, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                  <img src={imgUrl} alt={`${post.title} - image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          ) : post.posts ? (
             <div className="w-full h-64 md:h-96 bg-gray-300">
                {post.posts[0]?.roomImage ? (
                    <img src={post.posts[0].roomImage[0]} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}
             </div>
          ) : null}
        </div>
        
        {/* Details Section */}
        <div className="p-6 bg-gray-800 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h2>
            <p className="text-gray-300 mb-6">{post.description}</p>
            
            {/* Flat Details Section */}
            {post.images && (
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-xl font-semibold mb-4">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
                  <div><p className="font-bold text-white">Address</p><p>{post.address}</p></div>
                  <div><p className="font-bold text-white">Price per Person</p><p>₹{post.pricePerPerson} / month</p></div>
                  <div><p className="font-bold text-white">Distance from DTU</p><p>{post.distanceFromDtu} km</p></div>
                  <div><p className="font-bold text-white">Electricity Rate</p><p>₹{post.electricityRate} / unit</p></div>
                  <div className="md:col-span-2"><p className="font-bold text-white">Location</p><a href={post.googleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View on Google Maps</a></div>
                </div>
              </div>
            )}
            
            {/* PG Details and Room Listings Section */}
            {post.posts && (
                <div>
                    <div className="border-t border-gray-600 pt-6">
                      <h3 className="text-xl font-semibold mb-4">PG Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
                        <div><p className="font-bold text-white">Address</p><p>{post.address}</p></div>
                        {/* You can add other parent PG details here */}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-600 pt-4 mt-6 mb-4">
                        <h3 className="text-xl font-semibold">Available Rooms</h3>
                    </div>
                    <div className="space-y-3">
                        {post.posts.map(room => {
                          const isRoomOwner = room.createdBy === currentUserId;
                          return (
                              <div key={room._id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                                  <button onClick={() => setSelectedRoom(room)} className="text-left flex-grow hover:text-blue-300">{room.title}</button>
                                  {isRoomOwner && (
                                      <div className="flex gap-2">
                                          <button onClick={() => onOpenPgPostModal(room, post._id)} className="p-1 text-xs" title="Edit Room">✏️</button>
                                      </div>
                                  )}
                              </div>
                          );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Floating Action Button to add a new PG Room */}
      {token && post.posts && (
        <button
          onClick={() => onOpenPgPostModal(null, post._id)}
          className="fixed bottom-8 right-8 z-20 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
          title="Add New Room to this PG"
        >
          +
        </button>
      )}
    </div>
  );
}

export default PostDetail;