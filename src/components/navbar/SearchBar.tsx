
import { Search, X, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";

export function SearchBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition((text) => {
    setSearchQuery(text);
    if (text.trim()) {
      // Small delay to show the recognized text before submitting
      setTimeout(() => {
        handleSearchSubmit();
      }, 500);
    }
  });

  // Close search when route changes
  useEffect(() => {
    setShowSearch(false);
    stopListening();
  }, [location.pathname]);

  // Focus input when search is shown
  useEffect(() => {
    if (showSearch && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  // Update search query when transcript changes
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  // Handle input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle form submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      
      // Scroll to top before navigation
      window.scrollTo(0, 0);
      
      navigate(`/markets?search=${encodeURIComponent(searchQuery.trim())}`);
      
      // Add a small delay for UI feedback before hiding search
      setTimeout(() => {
        setIsSearching(false);
        setShowSearch(false);
      }, 300);
    }
  };

  // Handle escape key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
      stopListening();
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      stopListening();
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Voice Search Not Supported",
          description: "Your browser does not support voice recognition.",
          variant: "destructive"
        });
        return;
      }
      startListening();
    }
  };

  return (
    <>
      {/* Search Form - Conditionally shown */}
      {showSearch && (
        <form 
          onSubmit={handleSearchSubmit}
          className={cn(
            "animate-fade-in transition-all duration-300",
            isMobile ? 'fixed inset-x-0 top-16 p-2 bg-background/95 backdrop-blur z-50 shadow-md' : 'relative bg-transparent z-auto'
          )}
          onKeyDown={handleKeyDown}
        >
          <div className={cn(
            "relative flex w-full",
            isMobile ? 'max-w-md mx-auto' : 'mx-0'
          )}>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search markets, coins, stocks..."
                className={cn(
                  "w-full pl-9 pr-3 border transition-all duration-300 search-input-animated",
                  "focus:ring-2 focus:ring-primary/30",
                  isSearching ? "border-primary" : "border-border/40",
                  isListening ? "border-orange-500 ring-2 ring-orange-500/30" : ""
                )}
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search markets"
              />
            </div>
            
            {/* Voice Search Button */}
            <Button
              type="button"
              variant={isListening ? "default" : "ghost"}
              size="icon"
              className={cn(
                "ml-2 h-9 w-9 border transition-all duration-200",
                isListening ? "border-orange-500 bg-orange-500/90 animate-pulse" : "border-border/40"
              )}
              onClick={toggleVoiceRecognition}
              aria-label={isListening ? "Stop voice search" : "Start voice search"}
              title={isListening ? "Stop voice search" : "Voice search"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-white" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              type="submit"
              variant="default"
              size="sm"
              className={cn(
                "ml-2 transition-all duration-200 group search-button-pulse",
                isSearching ? "opacity-80" : ""
              )}
              onClick={() => handleSearchSubmit()}
              disabled={isSearching || !searchQuery.trim()}
              aria-label="Submit search"
            >
              <Search className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            {isMobile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-1 border border-border/40 h-9 w-9"
                onClick={() => {
                  setShowSearch(false);
                  stopListening();
                }}
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      )}
      
      {/* Search button */}
      {!showSearch && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSearch}
          className="h-9 w-9 rounded-md border border-border/40 transition-colors hover:bg-accent/50 hover:border-border/70 hover:scale-105"
          aria-label="Open search"
          title="Search"
        >
          <Search className="h-4 w-4 transition-transform hover:scale-110" />
        </Button>
      )}
    </>
  );
}
