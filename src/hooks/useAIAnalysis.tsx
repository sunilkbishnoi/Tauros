
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { queryStackAI } from "@/services/stackAiService";

export function useAIAnalysis() {
  const [activeAnalysis, setActiveAnalysis] = useState<{
    type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock' | null;
    symbol: string;
  }>({ type: null, symbol: '' });
  const [showSymbolInput, setShowSymbolInput] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSymbolSubmit = async (
    symbol: string, 
    type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock' = 'technical'
  ) => {
    if (symbol) {
      setShowSymbolInput(false);
      setActiveAnalysis({ type, symbol: symbol.toUpperCase() });
      try {
        setLoading(true);
        
        let prompt = '';
        switch (type) {
          case 'technical':
            prompt = `give technical analysis of ${symbol} stock`;
            break;
          case 'sentiment':
            prompt = `analyze market sentiment for ${symbol}`;
            break;
          case 'prediction':
            prompt = `predict future price movement for ${symbol} based on current data`;
            break;
          case 'crypto':
            prompt = `analyze ${symbol} cryptocurrency performance and outlook`;
            break;
          case 'stock':
            prompt = `provide complete stock analysis for ${symbol} including fundamentals`;
            break;
          default:
            prompt = `give analysis of ${symbol} stock`;
        }
        
        const result = await queryStackAI(prompt);
        setAnalysisResult(result);
        return { type, symbol: symbol.toUpperCase() };
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch analysis. Please try again.",
          variant: "destructive",
        });
        setAnalysisResult("No analysis available");
        return null;
      } finally {
        setLoading(false);
      }
    }
    return null;
  };

  const handleVoiceInput = async (transcription: string) => {
    // Extract potential symbol and analysis type from voice input
    const words = transcription.toUpperCase().split(' ');
    let potentialSymbol = words[words.length - 1]; // Default to the last word
    
    // Play a subtle sound effect to indicate successful voice recognition
    const audioFeedback = new Audio();
    audioFeedback.volume = 0.2;
    audioFeedback.play().catch(e => console.log('Audio feedback not supported'));
    
    // Determine analysis type from voice command
    let analysisType: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock' = 'technical';
    
    if (transcription.toLowerCase().includes('sentiment')) {
      analysisType = 'sentiment';
    } else if (transcription.toLowerCase().includes('predict') || 
               transcription.toLowerCase().includes('prediction') || 
               transcription.toLowerCase().includes('future')) {
      analysisType = 'prediction';
    } else if (transcription.toLowerCase().includes('crypto') || 
               transcription.toLowerCase().includes('bitcoin') || 
               transcription.toLowerCase().includes('ethereum')) {
      analysisType = 'crypto';
    } else if (transcription.toLowerCase().includes('stock') || 
               transcription.toLowerCase().includes('share')) {
      analysisType = 'stock';
    }
    
    // Common phrases to identify a stock symbol in voice input
    const triggerPhrases = ['ANALYZE', 'ANALYSIS', 'STOCK', 'CRYPTO', 'SYMBOL', 'FOR', 'OF'];
    
    // Check if any trigger words are in the transcription
    for (let i = 0; i < words.length - 1; i++) {
      if (triggerPhrases.includes(words[i])) {
        potentialSymbol = words[i + 1];
        break;
      }
    }

    // Filter out common words that might be misinterpreted as symbols
    const commonWords = ['THE', 'A', 'AN', 'FOR', 'OF', 'PLEASE', 'SHOW', 'ME', 'GET', 'ABOUT', 'GIVE'];
    if (commonWords.includes(potentialSymbol)) {
      // If the potential symbol is a common word, try to find another word
      const filteredWords = words.filter(word => !commonWords.includes(word) && word.length >= 2);
      if (filteredWords.length > 0) {
        potentialSymbol = filteredWords[0];
      }
    }

    // Remove any non-alphanumeric characters
    potentialSymbol = potentialSymbol.replace(/[^A-Z0-9]/g, '');

    // Check if it's a common crypto symbol
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'SHIB'];
    if (cryptoSymbols.includes(potentialSymbol)) {
      analysisType = 'crypto';
    }

    if (potentialSymbol && potentialSymbol.length >= 1 && potentialSymbol.length <= 5) {
      toast({
        title: "Voice detected",
        description: `Analyzing symbol: ${potentialSymbol}`,
      });
      return await handleSymbolSubmit(potentialSymbol, analysisType);
    } else {
      toast({
        title: "Voice Input Error",
        description: "Could not identify a valid stock symbol in your voice input.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleBack = () => {
    setActiveAnalysis({ type: null, symbol: '' });
    setShowSymbolInput(true);
    setAnalysisResult('');
  };

  return {
    activeAnalysis,
    showSymbolInput,
    analysisResult,
    loading,
    handleSymbolSubmit,
    handleVoiceInput,
    handleBack,
  };
}
