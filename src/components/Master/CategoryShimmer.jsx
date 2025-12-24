const CategoryShimmer = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-300 animate-pulse" />
          </div>

          <div className="flex gap-3">
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default CategoryShimmer
