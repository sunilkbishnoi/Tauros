
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Brain, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBackgroundElements } from "./BackgroundElements";

interface HeroSectionProps {
  scrollY: number;
  animateIcons: boolean;
}

export function HeroSection({ scrollY, animateIcons }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const getRotation = () => {
    if (!heroRef.current) return { x: 0, y: 0 };
    const maxRotation = 2.5;
    const rotationFactor = 0.008;
    return {
      x: Math.min(maxRotation, scrollY * rotationFactor),
      y: Math.min(maxRotation, scrollY * rotationFactor * 0.5),
    };
  };

  const rotation = getRotation();

  const featureBadges = [
    { name: "AI Analysis", icon: Brain, color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
    { name: "Real-time Data", icon: BarChart2, color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    { name: "Technical Charts", icon: LineChart, color: "bg-green-500/10 text-green-500 border-green-500/30" },
  ];

  return (
    <div 
      ref={heroRef}
      className="relative h-[90vh] w-full overflow-hidden bg-gradient-to-br from-background via-background/90 to-primary/10"
    >
      <motion.div
        className="absolute top-0 inset-x-0 flex items-center justify-center z-30 h-[30vh] mt-8 sm:mt-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            TAUROS
          </span>
        </h1>
      </motion.div>
      
      {animateIcons && createBackgroundElements(20, "hero")}
      
      <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          style={{
            perspective: 1000,
            transform: `rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: "transform 0.4s ease-out"
          }}
          className="max-w-3xl mx-auto mt-16 sm:mt-12 text-center"
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-4 sm:mb-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Track cryptocurrencies and stocks with AI-powered insights
          </motion.h1>
          
          <motion.p
            className="text-sm sm:text-md md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Tauros combines powerful AI algorithms with real-time market data to help you make informed trading decisions. Get comprehensive analytics, AI-generated reports, and technical indicators for any asset.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {featureBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full border ${badge.color}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                <badge.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">{badge.name}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg">
              <Link to="/markets">
                Explore Markets <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base sm:text-lg">
              <Link to="/news">
                Latest News
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
