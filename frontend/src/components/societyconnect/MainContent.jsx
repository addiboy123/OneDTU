import Feed from "./Feed";
import Explore from "./Explore";
import Sidebar from "./Sidebar";

function MainContent() {
	return (
		<div className="flex gap-6 p-6">
			<Sidebar />

			<div className="flex-1">
				<Feed />
			</div>

			<div className="w-96">
				<h2 className="text-xl font-semibold mb-4">Explore Societies</h2>
				<Explore />
			</div>
		</div>
	);
}

export default MainContent;
