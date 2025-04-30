
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(onResult?: (transcript: string) => void): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak now...",
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      
      if (onResult) {
        onResult(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      toast({
        title: "Speech Recognition Error",
        description: event.error,
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onResult]);

  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);
  const resetTranscript = () => setTranscript('');

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  };
}
