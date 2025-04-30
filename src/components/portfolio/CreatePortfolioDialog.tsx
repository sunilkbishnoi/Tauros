
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, AlertCircle } from "lucide-react";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePortfolioDialog({ open, onOpenChange }: CreatePortfolioDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');
  
  const { createPortfolio, portfolios } = usePortfolioStore();
  const { toast } = useToast();
  
  const validateName = (value: string) => {
    // Reset error first
    setNameError('');
    
    if (!value.trim()) {
      setNameError('Portfolio name is required');
      return false;
    }
    
    // Check for duplicate names
    const isDuplicate = portfolios.some(
      portfolio => portfolio.name.toLowerCase() === value.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setNameError('A portfolio with this name already exists');
      return false;
    }
    
    return true;
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value) validateName(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateName(name)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      createPortfolio(name, currency, description);
      
      toast({
        description: "Portfolio created successfully",
      });
      
      // Reset form
      setName('');
      setDescription('');
      setCurrency('INR');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center mb-2">
            <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
            <DialogTitle>Create new portfolio</DialogTitle>
          </div>
          <DialogDescription>
            Fill in the details to create a new investment portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Portfolio Name</Label>
              <Input
                id="name"
                placeholder="My Investment Portfolio"
                value={name}
                onChange={handleNameChange}
                required
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && (
                <div className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {nameError}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your portfolio"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !!nameError}
              className="neo-brutal-button"
            >
              {isSubmitting ? 'Creating...' : 'Create Portfolio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
