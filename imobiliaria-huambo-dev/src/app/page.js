// src/app/page.js
import { cache } from "react";
import AuthButton from "@/components/AuthButton";
import prisma from "@/lib/prisma";
import PropertyList from "@/components/PropertyList"; // <-- Importar o novo componente

// A nossa função de busca de dados com cache (como tínhamos antes)
export const getImoveis = cache(async () => {
  console.log("A IR À BASE DE DADOS BUSCAR IMÓVEIS...");
  const imoveis = await prisma.imovel.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bairro: {
        include: {
          municipio: true,
        },
      },
    },
  });
  return imoveis;
});

// A página agora é um Componente de Servidor (removemos o 'use client')
export default async function HomePage() {
  const imoveis = await getImoveis();

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

        {imoveis.length === 0 ? (
          <p className="text-center text-gray-500">
            De momento, não há imóveis publicados.
          </p>
        ) : (
          // Passamos os dados já carregados para o componente de cliente
          <PropertyList imoveis={imoveis} />
        )}
      </main>
    </div>
  );
}
