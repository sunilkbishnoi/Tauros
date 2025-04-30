import { FormEvent, useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceInput } from "./VoiceInput";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIAnalysisFormProps {
  onSubmit: (symbol: string, type?: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock') => void;
  onVoiceInput?: (transcription: string) => void;
}

export function AIAnalysisForm({ onSubmit, onVoiceInput }: AIAnalysisFormProps) {
  const [symbol, setSymbol] = useState('');
  const [analysisType, setAnalysisType] = useState<'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock'>('technical');
  const [inputFocused, setInputFocused] = useState(false);
  const { toast } = useToast();
  
  const exampleSymbols = ["AAPL", "MSFT", "TSLA", "BTC", "ETH"];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      window.scrollTo(0, 0);
      onSubmit(symbol.trim(), analysisType);
      toast({
        description: `Generating ${analysisType} analysis for ${symbol.trim()}...`,
      });
    } else {
      toast({
        title: "Input required",
        description: "Please enter a symbol to analyze",
        variant: "destructive",
      });
    }
  };

  const handleVoiceInput = (transcription: string) => {
    window.scrollTo(0, 0);
    toast({
      description: `Voice input received: ${transcription}`,
    });
    
    if (onVoiceInput) {
      onVoiceInput(transcription);
    } else {
      const words = transcription.toUpperCase().split(' ');
      const potentialSymbol = words[words.length - 1]; // Take the last word as the symbol
      setSymbol(potentialSymbol);
      
      if (transcription.toLowerCase().includes('sentiment')) {
        setAnalysisType('sentiment');
      } else if (transcription.toLowerCase().includes('predict') || 
                 transcription.toLowerCase().includes('prediction')) {
        setAnalysisType('prediction');
      } else if (transcription.toLowerCase().includes('crypto')) {
        setAnalysisType('crypto');
      } else if (transcription.toLowerCase().includes('stock')) {
        setAnalysisType('stock');
      }
    }
  };

  const handleExampleClick = (example: string) => {
    setSymbol(example);
    if (['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'].includes(example)) {
      setAnalysisType('crypto');
    } else {
      setAnalysisType('technical');
    }
    toast({
      description: `Selected ${example} for analysis`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
      <div className="flex flex-col space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter Crypto or Stock to Analyze"
              className="flex-1 py-6"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            {inputFocused && symbol.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-background border rounded-md shadow-sm z-10">
                <p className="text-xs text-muted-foreground mb-1">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleSymbols.map((example) => (
                    <Button
                      key={example}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <VoiceInput onAnalyze={handleVoiceInput} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Analysis Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                <SelectItem value="prediction">Price Prediction</SelectItem>
                <SelectItem value="crypto">Crypto Analysis</SelectItem>
                <SelectItem value="stock">Stock Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit" 
                  className="flex-1 gap-2 bg-background text-foreground border py-2 px-4 neo-brutal-shadow hover:bg-primary/10 hover:border-primary/50 transition-colors duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate AI Analysis
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get AI-powered insights about this asset</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
          <Info className="h-3 w-3" />
          <span>Enter a stock symbol (like AAPL) or crypto (like BTC) for detailed analysis</span>
        </div>
      </div>
    </form>
  );
}
