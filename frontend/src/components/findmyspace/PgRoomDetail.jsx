// src/components/findmyspace/PgRoomDetail.jsx

function PgRoomDetail({ room, onBackToPgDetail }) {
  if (!room) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <button onClick={onBackToPgDetail} className="mb-6 ...">&larr; Back to PG Overview</button>
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gray-700 text-white p-4">
          <h2 className="text-xl font-bold">{room.title}</h2>
        </div>
        <div className="w-full h-64 bg-gray-300">
          {room.roomImage?.[0] ? (
            <img src={room.roomImage[0]} alt={room.title} className="w-full h-full object-cover" />
          ) : (
            <span className="... text-2xl font-semibold">Room Image</span>
          )}
        </div>
        <div className="p-6 bg-gray-800 text-white">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Details</h3>
          <p className="text-gray-300 mb-4">{room.description}</p>
          <div className="text-gray-300">
            <p className="font-bold text-white">Roommates Required:</p>
            <p>{room.roommates_required}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PgRoomDetail;