import Feed from "./Feed";
import Explore from "./Explore";
import Sidebar from "./Sidebar";

function MainContent() {
	return (
		<div className="flex gap-6 p-6 bg-[#0f0f0f] text-gray-100 min-h-screen">
			{/* Sidebar */}
			<div className="bg-[#181818] p-4 rounded-2xl shadow-md border border-[#2a2a2a] w-64">
				<Sidebar />
			</div>

			{/* Feed Section */}
			<div className="flex-1 bg-[#181818] p-4 rounded-2xl shadow-md border border-[#2a2a2a] overflow-y-auto">
				<Feed />
			</div>

			{/* Explore Section */}
			<div className="w-96 bg-[#181818] p-4 rounded-2xl shadow-md border border-[#2a2a2a]">
				<h2 className="text-xl font-semibold mb-4 text-gray-200 border-b border-[#2a2a2a] pb-2">
					Explore Societies
				</h2>
				<Explore />
			</div>
		</div>
	);
}

export default MainContent;
