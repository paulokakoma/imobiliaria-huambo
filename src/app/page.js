"use client"; // Precisamos de tornar a página um componente de cliente para a orquestração

import { useState, useEffect } from "react";
import AuthButton from "@/components/AuthButton";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion"; // <-- 1. IMPORTAR

export default function HomePage() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImoveis = async () => {
      // Como a página agora é 'use client', buscamos os dados desta forma
      const response = await fetch("/api/imoveis/listar"); // (Precisamos de criar esta API)
      const data = await response.json();
      setImoveis(data);
      setLoading(false);
    };
    fetchImoveis();
  }, []);

  // --- CONFIGURAÇÃO DA ANIMAÇÃO DA GRELHA ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Atraso entre a animação de cada cartão
      },
    },
  };
  // -----------------------------------------

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

        {loading ? (
          <p>A carregar imóveis...</p>
        ) : imoveis.length === 0 ? (
          <p className="text-center text-gray-500">
            De momento, não há imóveis publicados.
          </p>
        ) : (
          // 2. ENVOLVER A GRELHA COM O ORQUESTRADOR
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {imoveis.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
