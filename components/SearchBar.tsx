export default function SearchBar() {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}
