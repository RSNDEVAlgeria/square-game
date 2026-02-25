import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicLaunchScreenProps {
  onComplete: () => void;
}

export function CinematicLaunchScreen({ onComplete }: CinematicLaunchScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 1500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D1B1A 0%, #1B3D2F 50%, #2D1810 100%)'
          }}
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{ 
                  y: [null, Math.random() * -500],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  background: i % 3 === 0 ? '#D4A574' : i % 3 === 1 ? '#F5DEB3' : '#8B7355',
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </div>

          {/* Coffee Steam Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`steam-${i}`}
                initial={{ 
                  x: 0, 
                  y: 200, 
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  y: [200, -200],
                  x: [0, (i - 2) * 30],
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute w-16 h-32 rounded-full blur-xl"
                style={{
                  background: 'radial-gradient(ellipse, rgba(212,165,116,0.4) 0%, transparent 70%)'
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center pt-16">
            
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="mb-6"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(212,165,116,0.3)',
                    '0 0 60px rgba(212,165,116,0.6)',
                    '0 0 20px rgba(212,165,116,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl"
              >
                <img 
                  src="/logo.png" 
                  alt="Square Coffee" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Title Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 1, type: "spring" }}
              className="text-6xl font-bold text-center mb-4"
              style={{
                fontFamily: "'Pacifico', cursive",
                background: 'linear-gradient(135deg, #D4A574 0%, #F5DEB3 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            >
              Square Games
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-xl text-[#D2B48C] text-center mb-12"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Where Every Move Tastes Better
            </motion.p>

            {/* Loading Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.5, duration: 2.5, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-[#D4A574] via-[#F5DEB3] to-[#D4A574] rounded-full"
              style={{ 
                maxWidth: '300px',
                boxShadow: '0 0 20px rgba(212,165,116,0.5)'
              }}
            />

            {/* Square Coffee & RSN Watermark - Centered under golden line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="absolute left-0 right-0 flex flex-col items-center gap-4 z-20"
              style={{ top: '60%' }}
            >
              <a
                href="https://rsndev.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity no-underline group"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <span className="text-[#D4A574] font-bold text-sm">RSN</span>
                </motion.div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-[#8B7355] uppercase tracking-wider">Made by</span>
                  <span className="text-lg font-bold text-[#D4A574] group-hover:text-[#F5DEB3] transition-colors">
                    RSN-dev
                  </span>
                </div>
              </a>

              {/* Square Coffee Mention */}
              <a
                href="https://squarecoffee.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#D4A574] transition-colors no-underline"
              >
                <span className="text-sm">Powered by</span>
                <span 
                  className="text-lg font-semibold"
                  style={{ fontFamily: "'Pacifico', cursive" }}
                >
                  Square Coffee
                </span>
              </a>
            </motion.div>

            {/* Cinematic Letter Box Bar (bottom only) */}
            <motion.div
              initial={{ height: "10%" }}
              animate={{ height: "10%" }}
              transition={{ duration: 2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent"
            />

            {/* Corner Decorations */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-16 left-8 w-16 h-16 border-l-2 border-t-2 border-[#D4A574]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute top-16 right-8 w-16 h-16 border-r-2 border-t-2 border-[#D4A574]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#D4A574]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#D4A574]"
            />

            {/* Skip Text */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 3 }}
              onClick={() => {
                setIsExiting(true);
                setTimeout(onComplete, 1500);
              }}
              className="absolute bottom-8 right-8 text-[#8B7355] text-xs hover:text-[#D4A574] transition-colors bg-transparent border-none cursor-pointer"
            >
              Skip →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
