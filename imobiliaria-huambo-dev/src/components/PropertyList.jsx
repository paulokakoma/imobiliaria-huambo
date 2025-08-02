// src/components/PropertyList.jsx
'use client'

import PropertyCard from "@/components/PropertyCard";
import { motion } from 'framer-motion';

export default function PropertyList({ imoveis }) {
  // Configuração da animação da grelha
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Atraso entre a animação de cada cartão
      },
    },
  };

  return (
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
  );
}