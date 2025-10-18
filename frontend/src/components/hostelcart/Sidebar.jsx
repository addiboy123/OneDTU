import { PlusCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

// ✅ RESPONSIVE: Accept `isOpen` and `onClose` props
export function Sidebar({
  items,
  onSelectItem,
  selectedItemId,
  onAddItem,
  isOpen,
  onClose,
}) {
  return (
    // ✅ RESPONSIVE: Use <aside> with classes for responsive positioning and transitions
    <aside
      className={`
        fixed top-0 left-0 h-full bg-gray-50 border-r z-30
        w-80 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}
    >
      {/* ✅ RESPONSIVE: Header with title and close button for mobile view */}
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <h2 className="text-lg font-semibold text-gray-900">My Items</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      {/* ✅ RESPONSIVE: Use flex-1 to make the scroll area fill the remaining space */}
      <ScrollArea className="flex-1">
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
              const imageUrl =
                item.itemPictures?.[0] || "/placeholder.svg";

              return (
                <div
                  key={item._id}
                  className={`cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all ${
                    selectedItemId === item._id
                      ? "bg-white border-gray-400 shadow-md"
                      : "hover:bg-white hover:shadow-md"
                  }`}
                  onClick={() => onSelectItem(item)}
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={item.itemName}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.itemName}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default Sidebar;