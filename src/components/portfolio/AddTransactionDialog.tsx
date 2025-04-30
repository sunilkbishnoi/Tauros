
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { PortfolioHolding } from "@/types/portfolio";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: string;
  holding: PortfolioHolding;
}

export function AddTransactionDialog({ 
  open, 
  onOpenChange, 
  portfolioId,
  holding
}: AddTransactionDialogProps) {
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(holding.currentPrice.toString());
  const [date, setDate] = useState<Date>(new Date());
  const [fee, setFee] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addTransaction } = usePortfolioStore();
  const { toast } = useToast();
  
  // Calculate potential profit/loss
  const potentialReturn = () => {
    if (!quantity || !price) return null;
    
    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    
    if (type === 'buy') {
      const potentialProfit = (holding.currentPrice - priceNum) * qtyNum;
      const potentialProfitPercent = ((holding.currentPrice / priceNum) - 1) * 100;
      
      return {
        amount: potentialProfit,
        percentage: potentialProfitPercent
      };
    } else {
      const potentialProfit = (priceNum - holding.averageBuyPrice) * qtyNum;
      const potentialProfitPercent = ((priceNum / holding.averageBuyPrice) - 1) * 100;
      
      return {
        amount: potentialProfit,
        percentage: potentialProfitPercent
      };
    }
  };
  
  const getProfitInsight = () => {
    if (type === 'buy') {
      // For buy transactions, consider:
      // 1. If market price is significantly lower than average: good time to buy
      // 2. If market price is significantly higher than average: may want to wait
      const priceDiffPercent = ((holding.currentPrice / parseFloat(price)) - 1) * 100;
      
      if (priceDiffPercent <= -5) {
        return "Good time to buy! The current price is lower than the market average.";
      } else if (priceDiffPercent >= 5) {
        return "Consider waiting. The current price is higher than the market average.";
      }
    } else {
      // For sell transactions, consider:
      // 1. If selling at a profit: good
      // 2. If selling at a loss: may want to reconsider
      const potentialProfit = potentialReturn();
      
      if (potentialProfit && potentialProfit.percentage >= 10) {
        return "Good time to sell! You're locking in a healthy profit.";
      } else if (potentialProfit && potentialProfit.percentage <= -5) {
        return "Consider holding. You're currently at a loss.";
      }
    }
    
    return "The market is relatively stable for this asset.";
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addTransaction(portfolioId, holding.id, {
        date: date.toISOString(),
        type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        fee: fee ? parseFloat(fee) : undefined,
        notes
      });
      
      toast({
        description: `Transaction added successfully`,
      });
      
      // Reset form
      setType('buy');
      setQuantity('');
      setPrice(holding.currentPrice.toString());
      setDate(new Date());
      setFee('');
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const potentialProfit = potentialReturn();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a buy or sell transaction for {holding.asset.name} ({holding.asset.symbol.toUpperCase()})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup 
                value={type} 
                onValueChange={(value) => setType(value as 'buy' | 'sell')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fee">Fee (Optional)</Label>
              <Input
                id="fee"
                type="number"
                step="any"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about this transaction"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            {quantity && price && (
              <div className="space-y-3 pt-2">
                <div className="border p-4 rounded-md bg-muted/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Potential Return Insight</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {potentialProfit && (
                      <div className="flex justify-between text-sm">
                        <span>Estimated {type === 'buy' ? 'Future' : 'Current'} Return:</span>
                        <span className={cn(
                          "font-medium",
                          potentialProfit.amount >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {potentialProfit.amount >= 0 ? '+' : ''}
                          {potentialProfit.amount.toFixed(2)} ({potentialProfit.percentage.toFixed(2)}%)
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm flex items-start mt-2">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span>{getProfitInsight()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !quantity || !price}
              className="neo-brutal-button"
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
