// src/app/loading.js
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import AuthButton from "@/components/AuthButton";

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          Imobiliária Huambo
        </h1>
        <AuthButton />
      </header>
      <main className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Imóveis Disponíveis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Mostra 8 skeletons enquanto os dados carregam */}
          {[...Array(8)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
