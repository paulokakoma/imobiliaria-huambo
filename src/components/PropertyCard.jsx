'use client' // Animações acontecem no cliente, por isso esta linha é necessária

import Image from 'next/image';
import { motion } from 'framer-motion'; // <-- 1. IMPORTAR

// A função formatPrice continua igual
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function PropertyCard({ imovel }) {
  const imageUrl = imovel.image_urls && imovel.image_urls.length > 0
    ? imovel.image_urls[0]
    : '/placeholder-image.png';

  // --- CONFIGURAÇÃO DA ANIMAÇÃO ---
  const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // Estado inicial: invisível e 20px para baixo
    visible: { opacity: 1, y: 0 },   // Estado final: visível e na posição original
  };
  // ---------------------------------

  return (
    // 2. TRANSFORMAR A DIV NUM MOTION.DIV E ADICIONAR AS PROPRIEDADES DE ANIMAÇÃO
    <motion.div
      className="border rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
      variants={cardVariants}
    >
      <div className="relative w-full h-56">
        <Image
          src={imageUrl}
          alt={`Foto de ${imovel.titulo}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 truncate">{imovel.titulo}</h3>
        <p className="text-sm text-gray-500 mt-1">{imovel.bairro?.nome || 'Localização'}{imovel.bairro?.municipio ? `, ${imovel.bairro.municipio.nome}` : ''}</p>
        <p className="text-2xl font-light text-indigo-600 mt-4">
          {formatPrice(imovel.preco)}
        </p>
      </div>
    </motion.div>
  );
}