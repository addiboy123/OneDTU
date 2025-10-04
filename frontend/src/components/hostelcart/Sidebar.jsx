import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export function Sidebar({ items, onSelectItem, selectedItemId, onAddItem }) {
  return (
    <div className="w-80 border-r bg-gray-50">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-6 space-y-6">
          {/* Add Item Button */}
          <Button
            onClick={onAddItem}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all"
          >
            <PlusCircle className="h-5 w-5" /> Add New Item
          </Button>

          {/* Items List */}
          <div className="space-y-4">
            {[...(items || [])].reverse().map((item) => {
              // console.log(item.itemPictures);
              const imageUrl =
                (item.itemPictures || []).length > 0
                  ? item.itemPictures[0]
                  : "/placeholder.svg"; // Default image

              return (
                <div
                  key={item._id}
                  className={`cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all ${
                    selectedItemId === item._id
                      ? "bg-gray-100 border-gray-400"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onSelectItem(item)}
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={item.itemName}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.itemName}</h3>
                    {/* <p className="text-sm text-gray-600 line-clamp-2">{item.itemDescription}</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
