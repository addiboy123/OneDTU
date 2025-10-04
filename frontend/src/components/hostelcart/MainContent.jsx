import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { ShoppingCart, Search } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import api from "../../api/interceptor";

export function MainContent({ 
  userItems = [], 
  allItems = [], 
  onSelectItem, 
  isAuthenticated = false // <-- added prop
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryIds, setCategoryIds] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/category");
      setCategories(response.data.data || []);
      setCategoryIds(response.data.categoryIds || []);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategoryName ||
      (() => {
        const index = categories.indexOf(selectedCategoryName);
        const correspondingCategoryId = categoryIds[index];
        return item.itemCategory === correspondingCategoryId;
      })();

    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollArea className="flex-1 p-6 max-h-[80vh] overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Search & Header Section */}
        <div className="sticky top-0 z-10 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Explore Items</h2>

          <div className="mt-4 flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none w-full"
              />
            </div>

            <div className="w-full md:w-40">
              <select
                value={selectedCategoryName}
                onChange={(e) => setSelectedCategoryName(e.target.value)}
                className="w-full py-2 px-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((categoryName, index) => (
                  <option key={categoryIds[index]} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* No Items State */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-md mt-6 border border-gray-200">
            <ShoppingCart className="h-16 w-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-800">
              {searchQuery ? "No results found" : "No items available yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try searching for something else."
                : "Items will appear here once listed."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredItems.map((buyItem) => (
              <div
                key={buyItem._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectItem(buyItem)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={
                      buyItem.itemPictures?.[0]
                        ? buyItem.itemPictures[0]
                        : "/placeholder.svg"
                    }
                    alt={buyItem.itemName}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                    ₹{buyItem.itemPrice?.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {buyItem.itemName}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {buyItem.itemDescription}
                  </p>

                  {/* Show college if not authenticated */}
                  {!isAuthenticated && buyItem.college && (
                    <p className="text-xs mt-2 text-blue-600 font-medium">
                      {buyItem.college}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default MainContent;
