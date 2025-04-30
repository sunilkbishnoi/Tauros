
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic, Brain, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createBackgroundElements, tradingIcons } from "./BackgroundElements";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface MarketCoverageSectionProps {
  animateIcons: boolean;
}

export function MarketCoverageSection({
  animateIcons
}: MarketCoverageSectionProps) {
  const [isListening, setIsListening] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      toast({
        title: "Voice detected",
        description: `Searching for: ${transcript}`
      });

      setTimeout(() => {
        navigate(`/markets?search=${encodeURIComponent(transcript.trim())}`);
      }, 1000);
    }
  };

  const {
    startListening,
    stopListening
  } = useSpeechRecognition(handleVoiceResult);

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);

      setTimeout(() => {
        if (isListening) {
          stopListening();
          setIsListening(false);
        }
      }, 5000);
    }
  };

  const keyFeatures = [
    {
      title: "AI-Powered Analysis",
      description: "Get in-depth analysis of any stock or crypto asset with our advanced AI model.",
      icon: Brain,
      color: "text-purple-500"
    }, 
    {
      title: "PDF Report Generation",
      description: "Download comprehensive analysis reports as PDF documents for offline reference.",
      icon: Download,
      color: "text-green-500"
    }, 
    {
      title: "Voice Search", 
      description: "Simply speak the ticker symbol to instantly search and analyze any asset.",
      icon: Mic,
      color: "text-orange-500"
    }
  ];

  const stockData = [{
    date: 'Jan',
    price: 1000
  }, {
    date: 'Feb',
    price: 1200
  }, {
    date: 'Mar',
    price: 900
  }, {
    date: 'Apr',
    price: 1500
  }, {
    date: 'May',
    price: 1800
  }, {
    date: 'Jun',
    price: 1600
  }, {
    date: 'Jul',
    price: 2000
  }, {
    date: 'Aug',
    price: 2200
  }];

  return <section id="market-coverage" className="py-20 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 className="text-4xl font-bold text-center mb-8" initial={{
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
          Advanced Market Intelligence
        </motion.h2>
        
        <motion.p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12" initial={{
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
          From cryptocurrencies to traditional stocks, Tauros provides comprehensive coverage of global markets with detailed analytics and insights.
        </motion.p>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div className="flex-1" initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl font-bold mb-6">AI Analysis Platform</h2>
            <div className="space-y-6 mb-8">
              {keyFeatures.map((feature, index) => <motion.div key={feature.title} className="flex gap-4" initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: 0.1 * index
            }}>
                  <div className={`p-3 rounded-full ${feature.color} bg-background border border-border`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>)}
            </div>
            
            
            
            
          </motion.div>
          
          <motion.div className="flex-1 relative" initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }}>
            <div className="relative w-full aspect-[16/9] border border-border rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl overflow-hidden p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={40} tickFormatter={value => `$${value}`} />
                    <Tooltip formatter={value => [`$${value}`, 'Price']} contentStyle={{
                    backgroundColor: 'rgba(25, 27, 30, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    color: '#fff'
                  }} />
                    <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{
                    r: 6,
                    fill: '#10b981'
                  }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {tradingIcons.slice(0, 5).map((item, i) => <motion.div key={`platform-icon-${i}`} className={`absolute ${item.color}`} style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }} animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8
            }}>
                  <item.icon size={30} />
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </div>
      
      {animateIcons && createBackgroundElements(12, "market")}
    </section>;
}
