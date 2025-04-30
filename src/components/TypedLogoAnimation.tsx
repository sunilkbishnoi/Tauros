
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface TypedLogoAnimationProps {
  onComplete: () => void;
}

export const TypedLogoAnimation: React.FC<TypedLogoAnimationProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const { theme } = useTheme();
  const logoText = 'Tauros';
  const typingSpeed = 150; // ms per character
  const displayDuration = 1800; // ms to show the completed logo
  
  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    
    // Start typing animation
    typingInterval = setInterval(() => {
      if (currentIndex < logoText.length) {
        setText(logoText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Add a delay after typing completes before fading out
        setTimeout(() => {
          setIsComplete(true);
          
          // Signal completion after fade out animation time
          setTimeout(onComplete, 800);
        }, displayDuration);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-[#0c0c0e]' : 'bg-background'} z-50`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div 
            className="text-5xl sm:text-6xl md:text-9xl font-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`${theme === 'dark' ? 'text-white' : 'bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'}`}>
              {text}
              <span className={`inline-block w-1 h-8 sm:h-12 md:h-20 ${theme === 'dark' ? 'bg-white' : 'bg-primary'} animate-pulse ml-1`}></span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
