'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Array de slides com imagens da internet
const slides = [
  {
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
    text: 'O seu próximo lar no Huambo está à sua espera.',
  },
  {
    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
    text: 'Anuncie a sua propriedade com facilidade e segurança.',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    text: 'Encontre o espaço perfeito para a sua família crescer.',
  },
];

const slideVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function WelcomeScreen({ onContinue }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slides[currentIndex].url}')` }}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Container principal para o conteúdo */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-8 md:p-12">
        
        <div className="flex-grow"></div>

        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={slides[currentIndex].text}
              // A classe text-white foi adicionada aqui
              className="text-2xl md:text-4xl max-w-3xl mx-auto drop-shadow-md font-light text-white"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {slides[currentIndex].text}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex-grow flex items-end justify-center pb-16">
          <motion.button
            onClick={onContinue}
            // A classe text-white foi adicionada aqui
            className="flex items-center gap-3 px-10 py-4 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-full text-lg font-semibold cursor-pointer text-white"
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 0 15px rgba(255, 255, 255, 0.2)",
                "0 0 25px rgba(255, 255, 255, 0.4)",
                "0 0 15px rgba(255, 255, 255, 0.2)"
              ]
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar
            <ArrowRight size={22} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}