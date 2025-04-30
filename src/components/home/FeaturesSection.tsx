import React from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, DollarSign, Brain, Download, Globe, Mic } from "lucide-react";
import { createBackgroundElements } from "./BackgroundElements";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FeaturesSectionProps {
  animateIcons: boolean;
}

export function FeaturesSection({ animateIcons }: FeaturesSectionProps) {
  const features = [
    {
      title: "Real-time Analytics",
      desc: "Stay updated with real-time price movements, trends, and market fluctuations for informed trading. Our platform updates data every second to ensure you never miss an opportunity.",
      icon: BarChart2,
      color: "text-blue-500",
      gradientClass: "from-blue-500/20 to-blue-600/10",
      link: "/markets"
    },
    {
      title: "AI Analysis",
      desc: "Get comprehensive AI-powered analysis of any stock or crypto asset. Our AI analyzes market trends, sentiment, and technical indicators to provide you with actionable insights.",
      icon: Brain,
      color: "text-purple-500",
      gradientClass: "from-purple-500/20 to-purple-600/10",
      link: "/markets"
    },
    {
      title: "Portfolio Management",
      desc: "Track your favorite assets, create watchlists, and monitor your portfolio performance in one place. Get personalized insights and recommendations based on your investment goals.",
      icon: DollarSign,
      color: "text-yellow-500",
      gradientClass: "from-yellow-500/20 to-yellow-600/10",
      link: "/portfolio"
    },
    {
      title: "PDF Reports",
      desc: "Download detailed PDF reports of any AI analysis to review offline or share with others. Save your research and track market insights over time.",
      icon: Download,
      color: "text-green-500",
      gradientClass: "from-green-500/20 to-green-600/10",
      link: "/markets"
    },
    {
      title: "Market News",
      desc: "Access the latest financial news affecting stocks and cryptocurrencies. Stay informed about market trends, company announcements, and economic events.",
      icon: Globe,
      color: "text-teal-500",
      gradientClass: "from-teal-500/20 to-teal-600/10",
      link: "/news"
    },
    {
      title: "Voice Search",
      desc: "Simply speak the ticker symbol to instantly search and analyze any asset.",
      icon: Mic,
      color: "text-orange-500",
      gradientClass: "from-orange-500/20 to-orange-600/10",
      link: "/markets"
    }
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          Powerful Features at Your Fingertips
        </motion.h2>
        
        <motion.p
          className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our platform combines AI-powered analysis, real-time market data, and intuitive tools to help you make smarter investment decisions.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="relative p-6 h-full border border-border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradientClass} opacity-50`} />
              <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary/10 rounded-full blur-xl" />
              <div className="relative z-10 h-full flex flex-col">
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {feature.desc}
                </p>
                <Button asChild variant="outline" className="w-full mt-auto group">
                  <Link to={feature.link}>
                    Try {feature.title}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
              </div>
              
              <motion.div 
                className={`absolute bottom-4 right-4 ${feature.color}`}
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                <feature.icon size={20} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {animateIcons && createBackgroundElements(12, "feature")}
    </section>
  );
}
