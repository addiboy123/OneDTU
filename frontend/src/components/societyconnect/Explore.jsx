import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/interceptor";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { ShoppingCart } from "lucide-react";

function Explore() {
  const [selectedSociety, setSelectedSociety] = useState(null);

  const { data: societies = [], isLoading, isError } = useQuery({
    queryKey: ["societies"],
    queryFn: async () => {
      const res = await api.get('/societyconnect/societies');
      return res?.data?.societies ?? res?.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const navigate = useNavigate();

  const openSociety = (s) => {
    const safeName = encodeURIComponent(s.name);
    navigate(`/societyconnect/${safeName}`, { state: { id: s._id } });
  };

  return (
    <ScrollArea className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="sticky top-0 z-10 bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explore Societies</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading societies…</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">Failed to fetch societies</div>
        ) : societies.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-md mt-6 border border-gray-200">
            <ShoppingCart className="h-16 w-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-800">No societies found</h3>
            <p className="text-gray-500">There are no societies to show right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {societies.map((s) => (
              <div
                key={s._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => openSociety(s)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={(s.images && s.images[0]) || '/placeholder.svg'}
                    alt={s.name}
                    className="w-full h-44 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{s.description || 'No description'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default Explore;
