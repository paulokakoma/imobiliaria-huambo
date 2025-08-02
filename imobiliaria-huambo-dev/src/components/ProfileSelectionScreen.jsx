// src/components/ProfileSelectionScreen.jsx
'use client'
import { motion } from 'framer-motion';
import { User, Building } from 'lucide-react';

export default function ProfileSelectionScreen({ onProfileSelect }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Como pretende usar a nossa plataforma?</h2>
        <p className="text-center text-gray-500 mb-12">Selecione o seu perfil para personalizarmos a sua experiência.</p>
      </motion.div>
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          onClick={() => onProfileSelect('cliente')}
          className="w-72 h-72 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <User size={64} className="text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">Sou Cliente</h3>
          <p className="text-gray-500 mt-2">Quero procurar imóveis para comprar ou arrendar.</p>
        </motion.div>
        <motion.div
          onClick={() => onProfileSelect('anunciante')}
          className="w-72 h-72 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Building size={64} className="text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">Sou Anunciante</h3>
          <p className="text-gray-500 mt-2">Quero publicar e gerir os meus próprios anúncios.</p>
        </motion.div>
      </div>
    </div>
  );
}