
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, IndianRupee, CreditCard, X } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "pro" | null>(null);
  const { toast } = useToast();
  
  const handleUpgradeClick = (plan: "premium" | "pro") => {
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };
  
  const handlePaymentComplete = (method: string) => {
    setPaymentDialogOpen(false);
    toast({
      title: "Payment initiated",
      description: `Your ${selectedPlan} plan payment via ${method} has been initiated.`,
    });
  };
  
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent animate-shine">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground">
            Get started with a free account or upgrade to premium features for advanced trading insights and portfolio management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="neo-brutal-card hover:scale-[1.01] transition-all duration-300 flex flex-col">
            <div className="p-6 border-b border-border/40 flex-grow-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="bg-muted/50 p-1 rounded-md">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">₹0 <span className="text-muted-foreground text-base font-normal">/month</span></div>
              <p className="text-muted-foreground">Perfect for beginners starting their investment journey</p>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>1 portfolio with up to 10 assets</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Basic portfolio analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Real-time market data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Daily market news</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <Check className="h-5 w-5 mr-2 shrink-0" />
                  <span>Basic price alerts</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full neo-brutal-button bg-background hover:bg-primary/10 hover:text-foreground">
                <Link to="/account">Get Started</Link>
              </Button>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="neo-brutal-card border-primary/40 bg-card/40 hover:border-primary hover:scale-[1.02] transition-all duration-300 shadow-[5px_5px_0px_rgb(0_0_0/0.3)] relative flex flex-col">
            <div className="absolute -right-2 top-4">
              <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                POPULAR
              </Badge>
            </div>
            <div className="p-6 border-b border-border/40 bg-primary/5 flex-grow-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="bg-primary/20 p-1 rounded-md">
                  <IndianRupee className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">₹499 <span className="text-muted-foreground text-base font-normal">/month</span></div>
              <p className="text-muted-foreground">For serious investors who want advanced tools</p>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Unlimited portfolios and assets</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Advanced portfolio analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Real-time market data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Personalized news feed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Advanced price alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Basic AI market predictions</span>
                </li>
              </ul>
              <Button 
                className="w-full neo-brutal-button shadow-[4px_4px_0px_rgb(0_0_0/0.3)]"
                onClick={() => handleUpgradeClick("premium")}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="neo-brutal-card hover:scale-[1.01] transition-all duration-300 flex flex-col">
            <div className="p-6 border-b border-border/40 flex-grow-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="bg-muted/50 p-1 rounded-md">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">₹999 <span className="text-muted-foreground text-base font-normal">/month</span></div>
              <p className="text-muted-foreground">For professional traders and fund managers</p>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Everything in Premium plan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Advanced AI market predictions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Portfolio optimization tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Tax optimization strategies</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>API access for integrations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full neo-brutal-button bg-background hover:bg-primary/10 hover:text-foreground"
                onClick={() => handleUpgradeClick("pro")}
              >
                Go Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select a payment method to upgrade to {selectedPlan && selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              className="flex justify-between items-center w-full p-4 h-auto" 
              variant="outline"
              onClick={() => {
                window.scrollTo(0, 0);
                handlePaymentComplete("UPI");
              }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">UPI Payment</div>
                  <div className="text-xs text-muted-foreground">Pay directly from your bank account</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button 
              className="flex justify-between items-center w-full p-4 h-auto" 
              variant="outline"
              onClick={() => {
                window.scrollTo(0, 0);
                handlePaymentComplete("Card");
              }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Card Payment</div>
                  <div className="text-xs text-muted-foreground">Pay with credit or debit card</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          
          <DialogClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}

import { ChevronRight } from "lucide-react";
