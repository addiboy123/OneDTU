import { useState } from "react";

function Feed() {
  const [selectedPost, setSelectedPost] = useState(null);

  // Static sample posts
  const posts = [
    {
      _id: "p1",
      image: "https://picsum.photos/seed/post1/800/600",
      description: "Sunset photography walk organised by Photography Club.",
      comments: [
        { user: "Aisha", text: "Amazing shots!" },
        { user: "Ravi", text: "Wish I could join next time." },
      ],
    },
    {
      _id: "p2",
      image: "https://picsum.photos/seed/post2/800/600",
      description: "Our coding society placed 2nd in the inter-college hackathon.",
      comments: [{ user: "Priya", text: "Congrats team!" }],
    },
    {
      _id: "p3",
      image: "https://picsum.photos/seed/post3/800/600",
      description: "Highlights from the drama circle's latest play.",
      comments: [],
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="cursor-pointer relative group"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.image}
              alt="post"
              className="rounded-lg object-cover w-full h-60"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Load More
        </button>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] relative">
            <button
              className="absolute top-2 right-3 text-gray-500"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>
            <img
              src={selectedPost.image}
              alt="post"
              className="rounded-lg mb-4 w-full"
            />
            <p className="text-gray-700 mb-3">{selectedPost.description}</p>

            <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>
            {selectedPost.comments?.map((c, i) => (
              <p key={i} className="text-gray-600 mb-1">
                <b>{c.user}</b>: {c.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
