import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './index.css';

// ─── PERSONALIZATION CONFIGURATION ────────────────────────────────────────
const CONFIG = {
  recipientName: 'Aliza',
  senderName: 'Ali',
  apologyMessage: "I know I made a mistake… and I'm really sorry.",
  finalMessage: "I promise I'll try my best to make things right. You mean a lot to me. ❤️",
  noReactions: [
    {
      title: "Please don't say no 🥺",
      message: "This little bear is hoping with its whole heart.",
      mood: 'sad'
    },
    {
      title: "I'll be really sad… 😭",
      message: "I understand if you need time. I just wanted you to know I care.",
      mood: 'crying'
    },
    {
      title: "I promise I'll do better 🥺💔",
      message: "Teddy has been practicing the biggest, most sincere sorry.",
      mood: 'crying'
    },
    {
      title: "Please give me one more chance… 😭❤️",
      message: "No rush at all — a gentle apology will still be waiting here.",
      mood: 'hopeful'
    },
    {
      title: "Teddy is still here, with a tiny hope… 🥺",
      message: "I will keep trying to make things kinder and better.",
      mood: 'hopeful'
    },
    {
      title: "I really miss you… 💔",
      message: "Every moment without you feels incomplete.",
      mood: 'crying'
    },
    {
      title: "Please… I'm begging you 🥺💔",
      message: "I'll do anything to make this right.",
      mood: 'crying'
    }
  ],
  colors: {
    primary: '#ff6b8a',
    secondary: '#ffd6e0',
    accent: '#ff8fab',
    text: '#5c3a4a'
  }
};

// ─── SOUND EFFECTS ─────────────────────────────────────────────────────────
const playSound = (type) => {
  if (!window.AudioContext) return;
  
  const ctx = new AudioContext();
  const notes = type === 'yes' 
    ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (happy chord)
    : [330, 293.66, 261.63]; // E4, D4, C4 (sad notes)
  
  notes.forEach((note, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type === 'yes' ? 'triangle' : 'sine';
    osc.frequency.value = note;
    
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.35);
  });
};

// ─── FLOATING HEARTS COMPONENT ───────────────────────────────────────────────
const FloatingHearts = ({ celebration = false }) => {
  const hearts = Array.from({ length: celebration ? 30 : 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: `${Math.random() * 20 + 10}px`,
    emoji: ['❤️', '💕', '💖', '💗', '✨', '💫'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute opacity-60"
          style={{
            left: heart.left,
            fontSize: heart.size
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
            rotate: [0, 360],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: celebration ? 3 + Math.random() * 2 : 8 + Math.random() * 4,
            delay: parseFloat(heart.delay),
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// ─── TEDDY BEAR COMPONENT ───────────────────────────────────────────────────
const Teddy = ({ mood = 'sad', happy = false }) => {
  const getTeddyExpression = () => {
    if (happy) {
      return {
        eyeShape: 'happy',
        mouthShape: 'big-smile',
        mouthOpen: true,
        tearVisible: false,
        headRotation: 0,
        headTilt: 0,
        bodyBounce: 'bounce-happy',
        armWave: true,
        earWiggle: true
      };
    }
    
    switch (mood) {
      case 'crying':
        return {
          eyeShape: 'sad-crying',
          mouthShape: 'cry',
          mouthOpen: false,
          tearVisible: true,
          headRotation: -8,
          headTilt: -10,
          bodyBounce: 'shake',
          armWave: false,
          earWiggle: false
        };
      case 'hopeful':
        return {
          eyeShape: 'hopeful',
          mouthShape: 'small-smile',
          mouthOpen: false,
          tearVisible: false,
          headRotation: 3,
          headTilt: 5,
          bodyBounce: 'bounce-soft',
          armWave: false,
          earWiggle: true
        };
      default: // sad
        return {
          eyeShape: 'sad',
          mouthShape: 'frown',
          mouthOpen: false,
          tearVisible: false,
          headRotation: -5,
          headTilt: -5,
          bodyBounce: 'breathing',
          armWave: false,
          earWiggle: false
        };
    }
  };

  const expression = getTeddyExpression();

  return (
    <motion.div
      className="relative w-72 h-72 mx-auto"
      animate={{
        y: happy ? [0, -15, 0] : [0, -8, 0],
        rotate: expression.headTilt
      }}
      transition={{
        duration: happy ? 1.5 : 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Teddy Bear SVG */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full drop-shadow-2xl"
        style={{
          transform: `rotate(${expression.headRotation}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Shadow */}
        <motion.ellipse
          cx="100"
          cy="205"
          rx="65"
          ry="12"
          fill="rgba(0,0,0,0.15)"
          animate={{
            scaleX: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Left Ear */}
        <motion.g
          animate={expression.earWiggle ? {
            rotate: [0, -8, 0, 8, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <circle cx="55" cy="60" r="22" fill="#C4956A" />
          <circle cx="55" cy="60" r="14" fill="#E8C9A0" />
        </motion.g>
        
        {/* Right Ear */}
        <motion.g
          animate={expression.earWiggle ? {
            rotate: [0, 8, 0, -8, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          <circle cx="145" cy="60" r="22" fill="#C4956A" />
          <circle cx="145" cy="60" r="14" fill="#E8C9A0" />
        </motion.g>
        
        {/* Body */}
        <ellipse cx="100" cy="155" rx="58" ry="50" fill="#C4956A" />
        <ellipse cx="100" cy="155" rx="42" ry="35" fill="#E8C9A0" />
        
        {/* Belly Heart */}
        <motion.text
          x="100"
          y="160"
          fontSize="24"
          textAnchor="middle"
          fill="#FF6B8A"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ❤️
        </motion.text>
        
        {/* Left Arm */}
        <motion.g
          animate={expression.armWave ? {
            rotate: [0, -25, 0]
          } : happy ? {
            rotate: [0, -10, 0]
          } : {}}
          transition={{
            duration: expression.armWave ? 0.8 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '50px 135px' }}
        >
          <ellipse cx="50" cy="135" rx="20" ry="28" fill="#C4956A" />
          <ellipse cx="50" cy="135" rx="14" ry="20" fill="#E8C9A0" />
        </motion.g>
        
        {/* Right Arm */}
        <motion.g
          animate={happy ? {
            rotate: [0, 15, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '150px 135px' }}
        >
          <ellipse cx="150" cy="135" rx="20" ry="28" fill="#C4956A" />
          <ellipse cx="150" cy="135" rx="14" ry="20" fill="#E8C9A0" />
        </motion.g>
        
        {/* Left Leg */}
        <ellipse cx="72" cy="188" rx="18" ry="22" fill="#C4956A" />
        <ellipse cx="72" cy="188" rx="12" ry="16" fill="#E8C9A0" />
        
        {/* Right Leg */}
        <ellipse cx="128" cy="188" rx="18" ry="22" fill="#C4956A" />
        <ellipse cx="128" cy="188" rx="12" ry="16" fill="#E8C9A0" />
        
        {/* Head - Round like the image */}
        <circle cx="100" cy="85" r="52" fill="#C4956A" />
        
        {/* Muzzle - Lighter oval */}
        <ellipse cx="100" cy="98" rx="32" ry="26" fill="#E8C9A0" />
        
        {/* Nose - Small black oval like image */}
        <ellipse cx="100" cy="90" rx="9" ry="7" fill="#2D2D2D" />
        <ellipse cx="97" cy="87" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
        
        {/* Mouth - Simple line like image */}
        {expression.mouthShape === 'big-smile' ? (
          <motion.path
            d="M 85 105 Q 100 120 115 105"
            stroke="#2D2D2D"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: ['M 85 105 Q 100 120 115 105', 'M 85 105 Q 100 125 115 105', 'M 85 105 Q 100 120 115 105']
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ) : expression.mouthShape === 'small-smile' ? (
          <path d="M 92 105 Q 100 110 108 105" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : expression.mouthShape === 'cry' ? (
          <motion.path
            d="M 90 108 Q 100 102 110 108"
            stroke="#2D2D2D"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: ['M 90 108 Q 100 102 110 108', 'M 90 110 Q 100 104 110 110', 'M 90 108 Q 100 102 110 108']
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ) : (
          <path d="M 90 108 Q 100 103 110 108" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        
        {/* Left Eye - Large black like image */}
        <motion.g
          animate={{
            scaleY: expression.eyeShape === 'happy' ? [1, 0.1, 1] : [1, 1, 0.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {expression.eyeShape === 'happy' ? (
            <path d="M 72 78 Q 80 70 88 78" stroke="#2D2D2D" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <circle cx="80" cy="78" r="12" fill="#2D2D2D" />
          )}
        </motion.g>
        
        {/* Right Eye - Large black like image */}
        <motion.g
          animate={{
            scaleY: expression.eyeShape === 'happy' ? [1, 0.1, 1] : [1, 1, 0.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1
          }}
        >
          {expression.eyeShape === 'happy' ? (
            <path d="M 112 78 Q 120 70 128 78" stroke="#2D2D2D" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <circle cx="120" cy="78" r="12" fill="#2D2D2D" />
          )}
        </motion.g>
        
        {/* Eye shine for realism */}
        {expression.eyeShape !== 'happy' && (
          <>
            <motion.circle
              cx="83"
              cy="75"
              r="4"
              fill="white"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="123"
              cy="75"
              r="4"
              fill="white"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1
              }}
            />
          </>
        )}
        
        {/* Blush - Cute pink circles */}
        <motion.ellipse
          cx="62"
          cy="92"
          rx="14"
          ry="10"
          fill="rgba(255,130,140,0.5)"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            rx: [14, 16, 14]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.ellipse
          cx="138"
          cy="92"
          rx="14"
          ry="10"
          fill="rgba(255,130,140,0.5)"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            rx: [14, 16, 14]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Tears - Animated falling */}
        {expression.tearVisible && (
          <>
            <motion.ellipse
              cx="72"
              cy="88"
              rx="4"
              ry="6"
              fill="#87CEEB"
              animate={{
                y: [88, 130],
                opacity: [1, 0],
                scaleY: [1, 1.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeIn"
              }}
            />
            <motion.ellipse
              cx="128"
              cy="88"
              rx="4"
              ry="6"
              fill="#87CEEB"
              animate={{
                y: [88, 130],
                opacity: [1, 0],
                scaleY: [1, 1.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.6,
                ease: "easeIn"
              }}
            />
          </>
        )}
        
        {/* Cute Bow */}
        <g>
          <ellipse cx="100" cy="50" rx="10" ry="7" fill="#FF6B8A" />
          <ellipse cx="85" cy="46" rx="14" ry="10" fill="#FF6B8A" />
          <ellipse cx="115" cy="46" rx="14" ry="10" fill="#FF6B8A" />
          <ellipse cx="100" cy="50" rx="5" ry="4" fill="#FF8FAB" />
        </g>
      </svg>
      
      {/* Floating Heart Animation */}
      {happy && (
        <>
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [-15, 15, -15],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity
            }}
          >
            ❤️
          </motion.div>
          <motion.div
            className="absolute top-0 left-10 text-3xl"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -30]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          >
            💕
          </motion.div>
          <motion.div
            className="absolute top-0 right-10 text-3xl"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -30]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1
            }}
          >
            💕
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

// ─── ACTION BUTTONS COMPONENT ───────────────────────────────────────────────
const ActionButtons = ({ onNo, onYes, noCount, onNoHover }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const isPlayful = noCount >= 3;

  const handleNoHover = () => {
    if (isPlayful && window.matchMedia('(pointer: fine)').matches) {
      const maxX = 30;
      const maxY = 15;
      setNoPosition({
        x: (Math.random() - 0.5) * maxX,
        y: (Math.random() - 0.5) * maxY
      });
      onNoHover?.();
    }
  };

  const handleNoClick = () => {
    if (isPlayful) {
      setNoPosition({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20
      });
    }
    onNo();
  };

  return (
    <div className="flex gap-4 justify-center items-center h-16">
      <motion.button
        className={`
          px-8 py-3 rounded-full font-bold text-lg
          transition-all duration-300
          ${isPlayful ? 'cursor-pointer' : ''}
          bg-gradient-to-r from-rose-300 to-rose-400
          hover:from-rose-400 hover:to-rose-500
          text-white shadow-lg
          hover:shadow-xl hover:scale-105
          active:scale-95
        `}
        onClick={handleNoClick}
        onMouseEnter={handleNoHover}
        animate={{
          x: noPosition.x,
          y: noPosition.y,
          scale: noCount > 5 ? 0.9 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        NO 😢
      </motion.button>
      
      <motion.button
        className="
          px-8 py-3 rounded-full font-bold text-lg
          bg-gradient-to-r from-pink-400 to-rose-400
          hover:from-pink-500 hover:to-rose-500
          text-white shadow-lg
          hover:shadow-xl hover:scale-105
          active:scale-95
          transition-all duration-300
        "
        onClick={onYes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        YES ❤️
      </motion.button>
    </div>
  );
};

// ─── APOLOGY SCREEN COMPONENT ───────────────────────────────────────────────
const ApologyScreen = ({ noCount, onNo, onYes, onNoHover }) => {
  const reaction = noCount > 0 
    ? CONFIG.noReactions[Math.min(noCount - 1, CONFIG.noReactions.length - 1)]
    : null;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="text-sm text-rose-400 uppercase tracking-widest mb-4 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        A message from {CONFIG.senderName}
      </motion.p>
      
      <Teddy mood={reaction?.mood || 'sad'} />
      
      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-4xl md:text-5xl font-pacifico text-rose-600 text-shadow-lg">
          {reaction?.title || "I'm Really Sorry 🥺❤️"}
        </h1>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          {reaction?.message || (
            <>
              {CONFIG.apologyMessage}
              <br />
              Can you forgive me? 🥺❤️
            </>
          )}
        </p>
        
        <p className="text-xl font-semibold text-gray-700 mt-6">
          Do you forgive me?
        </p>
      </motion.div>
      
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ActionButtons
          onNo={onNo}
          onYes={onYes}
          noCount={noCount}
          onNoHover={onNoHover}
        />
      </motion.div>
      
      <motion.p
        className="text-sm text-rose-300 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {noCount > 0 
          ? "Teddy will keep asking softly. ♡"
          : "Tap an answer whenever you're ready."
        }
      </motion.p>
    </motion.div>
  );
};

// ─── HAPPY SCREEN COMPONENT ────────────────────────────────────────────────
const HappyScreen = () => {
  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff6b8a', '#ffd6e0', '#ff8fab', '#ffb3c1']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b8a', '#ffd6e0', '#ff8fab', '#ffb3c1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.p
        className="text-sm text-pink-400 uppercase tracking-widest mb-4 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        A happy ending
      </motion.p>
      
      <Teddy happy />
      
      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-pacifico text-rose-500 text-shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          YAY!!! 🥹❤️
        </motion.h1>
        
        <h2 className="text-2xl font-semibold text-gray-700">
          Thank you for forgiving me, {CONFIG.recipientName} ❤️
        </h2>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          {CONFIG.finalMessage}
        </p>
      </motion.div>
      
      <motion.div
        className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-lg font-semibold text-rose-600">
          Sending you the biggest bear hug ♡
        </span>
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN APP COMPONENT ─────────────────────────────────────────────────────
const App = () => {
  const [noCount, setNoCount] = useState(0);
  const [forgiven, setForgiven] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    document.title = `I'm Really Sorry, ${CONFIG.recipientName} 🥺❤️`;
  }, []);

  const handleNo = () => {
    setNoCount(prev => prev + 1);
    if (soundEnabled) playSound('no');
  };

  const handleYes = () => {
    setForgiven(true);
    if (soundEnabled) playSound('yes');
  };

  const handleNoHover = () => {
    if (soundEnabled) playSound('no');
  };

  return (
    <main className={`min-h-screen flex items-center justify-center p-4 md:p-8 transition-all duration-1000 ${
      forgiven 
        ? 'bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100' 
        : 'bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50'
    }`}>
      <FloatingHearts celebration={forgiven} />
      
      <motion.button
        className="fixed top-4 right-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-rose-500 shadow-lg hover:shadow-xl transition-all z-10"
        onClick={() => setSoundEnabled(!soundEnabled)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {soundEnabled ? '♪ Sound On' : '♪ Sound Off'}
      </motion.button>
      
      <motion.div
        className="glass rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {forgiven ? (
            <HappyScreen key="happy" />
          ) : (
            <ApologyScreen
              key="apology"
              noCount={noCount}
              onNo={handleNo}
              onYes={handleYes}
              onNoHover={handleNoHover}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
};

// ─── RENDER ─────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(<App />);
