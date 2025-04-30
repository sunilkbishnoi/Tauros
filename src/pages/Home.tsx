
import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useMarketStore } from "@/stores/marketStore";
import { PricingSection } from "@/components/home/PricingSection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MarketCoverageSection } from "@/components/home/MarketCoverageSection";
import { TeamSection } from "@/components/home/TeamSection";
import { CTASection } from "@/components/home/CTASection";
import { createBackgroundElements } from "@/components/home/BackgroundElements";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const { setCurrency } = useMarketStore();
  const [animateIcons, setAnimateIcons] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      // Update scroll button visibility
      setShowScrollButton(lastScrollY > 300);
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(lastScrollY * 0.5);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const timeout = setTimeout(() => {
      setAnimateIcons(true);
    }, 600);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onCurrencyChange={(newCurrency) => setCurrency(newCurrency)} />
      
      <main className="flex-grow">
        <HeroSection scrollY={scrollY} animateIcons={animateIcons} />
        
        <FeaturesSection animateIcons={animateIcons} />
        
        <MarketCoverageSection animateIcons={animateIcons} />
        
        <CTASection animateIcons={animateIcons} />
        
        <div className="relative overflow-hidden">
          {animateIcons && createBackgroundElements(25, "pricing")}
          <div className="relative z-10">
            <PricingSection />
          </div>
        </div>
        
        <TeamSection animateIcons={animateIcons} />
      </main>
      
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg z-50 bg-primary/80 backdrop-blur-sm hover:bg-primary"
          aria-label="Scroll to top"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;
