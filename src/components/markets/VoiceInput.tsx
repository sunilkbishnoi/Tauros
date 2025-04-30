import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceInputProps {
  onAnalyze: (transcription: string) => void;
}

export function VoiceInput({ onAnalyze }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const { toast } = useToast();
  const isRecognitionSupportedRef = useRef<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Audio visualization ref
  const audioVisualizationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      isRecognitionSupportedRef.current = true;
      const SpeechRecognitionImpl = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognitionImpl();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          description: "Listening... Say a stock or crypto symbol like 'AAPL' or 'BTC'",
        });
        
        // Start audio visualization animation
        if (audioVisualizationRef.current) {
          audioVisualizationRef.current.classList.add('active');
        }
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const currentTranscript = event.results[current][0].transcript;
        
        // Update interim results
        if (!event.results[current].isFinal) {
          setTranscript(currentTranscript);
        } else {
          // Final result - scroll to top before processing
          window.scrollTo(0, 0);
          
          setTranscript(currentTranscript);
          onAnalyze(currentTranscript);
          setIsListening(false);
          
          // Stop audio visualization
          if (audioVisualizationRef.current) {
            audioVisualizationRef.current.classList.remove('active');
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Failed to process voice input. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
        
        // Stop audio visualization
        if (audioVisualizationRef.current) {
          audioVisualizationRef.current.classList.remove('active');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          // If we have a transcript but it wasn't processed as final
          onAnalyze(transcript);
          setTranscript('');
        }
        
        // Stop audio visualization
        if (audioVisualizationRef.current) {
          audioVisualizationRef.current.classList.remove('active');
        }
      };

      recognitionRef.current = recognitionInstance;
    } else {
      isRecognitionSupportedRef.current = false;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        if (isListening) {
          recognitionRef.current.stop();
        }
      }
    };
  }, [toast, onAnalyze]);

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      // If already listening, stop the recognition
      recognitionRef.current.stop();
      setTranscript('');
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const startListening = async () => {
    if (!isRecognitionSupportedRef.current) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListening ? "destructive" : "default"}
              size="icon"
              className={`rounded-full relative py-6 aspect-square ${isListening ? 'voice-active' : 'voice-inactive'}`}
              onClick={toggleListening}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              title={isListening ? "Click to stop" : "Click to speak"}
            >
              <div className="relative">
                <Volume2 className={`h-4 w-4 ${isListening ? 'text-white' : ''} z-10 relative`} />
                
                {/* Voice visualization */}
                <div
                  ref={audioVisualizationRef}
                  className="voice-visualization"
                >
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                </div>
              </div>
              
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isListening ? "Click to stop listening" : "Click to use voice input (say a symbol like 'AAPL')"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isListening && transcript && (
        <div className="absolute top-full right-0 mt-2 bg-background/90 backdrop-blur-sm p-3 rounded-md shadow-md min-w-60 border border-border/50 z-10">
          <p className="text-xs text-muted-foreground mb-1">Listening:</p>
          <p className="text-sm font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
}
