// src/components/PropertyCardSkeleton.jsx
export default function PropertyCardSkeleton() {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-white">
      <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
}