import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createBackgroundElements } from "./BackgroundElements";
import { ArrowRight, Brain, LineChart, DollarSign } from "lucide-react";
interface CTASectionProps {
  animateIcons: boolean;
}
export function CTASection({
  animateIcons
}: CTASectionProps) {
  return <section className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center px-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            Ready to Transform Your Trading?
          </motion.h2>
          
          <motion.p className="text-sm sm:text-md md:text-lg text-muted-foreground mb-8 sm:mb-10 text-center px-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            Join thousands of traders using our platform to track markets, analyze trends, and make informed decisions with AI-powered insights.
          </motion.p>
          
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-lg border bg-card/50 backdrop-blur-sm text-center">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Deep insights for any stock or crypto with our advanced AI models</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-lg border bg-card/50 backdrop-blur-sm text-center">
              <LineChart className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Technical Charts</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Advanced charting with real-time market data and indicators</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-lg border bg-card/50 backdrop-blur-sm text-center">
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Portfolio Tracking</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Monitor your investments and analyze performance effortlessly</p>
            </div>
          </motion.div>
          
          <motion.div className="flex flex-col items-center px-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 mb-4">
              <Link to="/markets">
                Start Using Tauros Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            
          </motion.div>
        </div>
      </div>
      
      {animateIcons && createBackgroundElements(10, "cta")}
    </section>;
}