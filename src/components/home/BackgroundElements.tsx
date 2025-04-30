
import { motion } from "framer-motion";
import React from "react";
import { TrendingUp, TrendingDown, BarChart2, DollarSign, CandlestickChart, LineChart, PieChart, BarChart, Activity } from "lucide-react";

export const tradingIcons = [
  { icon: TrendingUp, color: "text-green-500" },
  { icon: TrendingDown, color: "text-red-500" },
  { icon: BarChart2, color: "text-blue-500" },
  { icon: DollarSign, color: "text-yellow-500" },
  { icon: CandlestickChart, color: "text-purple-500" },
  { icon: LineChart, color: "text-cyan-500" },
  { icon: PieChart, color: "text-orange-500" },
  { icon: BarChart, color: "text-indigo-500" },
  { icon: Activity, color: "text-pink-500" }
];

export const createBackgroundElements = (count: number, keyPrefix: string) => {
  return Array.from({ length: count }).map((_, i) => {
    const IconComponent = tradingIcons[i % tradingIcons.length].icon;
    const colorClass = tradingIcons[i % tradingIcons.length].color;
    
    // Increase opacity for pricing section
    const opacityClass = keyPrefix === "pricing" ? "opacity-40" : "opacity-20";
    
    return (
      <motion.div
        key={`${keyPrefix}-${i}`}
        className={`absolute ${colorClass} ${opacityClass}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          zIndex: 1,
        }}
        initial={{ 
          opacity: 0,
          scale: 0.5
        }}
        animate={{ 
          x: [
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 40 - 20
          ],
          y: [
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 40 - 20
          ],
          opacity: keyPrefix === "pricing" ? [0.4, 0.5, 0.4] : [0.2, 0.3, 0.2],
          scale: [0.6, 1.2, 0.6],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: Math.random() * 10 + 5, // Faster animation
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: i * 0.1
        }}
      >
        <IconComponent size={keyPrefix === "pricing" ? Math.random() * 30 + 25 : Math.random() * 25 + 20} />
      </motion.div>
    );
  });
};
