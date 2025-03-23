import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative flex items-center mt-5">
      <div className="absolute left-3 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="search-bar w-full py-3 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}