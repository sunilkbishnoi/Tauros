
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Lock, IndianRupee, CreditCard, ChevronRight, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export function AccountMembership() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "premium" | "pro">("premium");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "pro" | null>(null);
  const { toast } = useToast();
  
  const handleUpgrade = (plan: "premium" | "pro") => {
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };
  
  const handlePaymentComplete = (method: string) => {
    setPaymentDialogOpen(false);
    toast({
      title: "Payment initiated",
      description: `Your ${selectedPlan} plan payment via ${method} has been initiated.`,
    });
    
    // Simulate plan upgrade after payment
    if (selectedPlan) {
      setCurrentPlan(selectedPlan);
    }
  };
  
  const handleDowngrade = () => {
    toast({
      description: "You've been downgraded to FREE plan",
    });
    setCurrentPlan("free");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Membership Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your trading needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <Card className={`border-2 ${currentPlan === "free" ? "border-primary shadow-[4px_4px_0px_rgb(0_0_0/0.3)]" : "border-border"} transition-all duration-300 hover:shadow-md`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Free</CardTitle>
                    <div className="bg-muted/30 p-1 rounded-full">
                      <IndianRupee className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  {currentPlan === "free" && <Badge variant="outline" className="bg-primary/10 text-primary">Current</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="font-bold text-2xl mb-4">₹0 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">1 portfolio</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Up to 10 assets</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Lock className="h-4 w-4 mr-2 mt-1" />
                    <span className="text-sm">AI insights</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Lock className="h-4 w-4 mr-2 mt-1" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan !== "free" ? (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handleDowngrade}
                  >
                    Downgrade
                  </Button>
                ) : (
                  <Button disabled className="w-full">Current Plan</Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className={`border-2 ${currentPlan === "premium" ? "border-primary shadow-[4px_4px_0px_rgb(0_0_0/0.3)]" : "border-border"} transition-all duration-300 hover:shadow-md`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Premium</CardTitle>
                    <div className="bg-primary/20 p-1 rounded-full">
                      <IndianRupee className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  {currentPlan === "premium" && <Badge variant="outline" className="bg-primary/10 text-primary">Current</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="font-bold text-2xl mb-4">₹499 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Unlimited portfolios</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Unlimited assets</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Basic AI insights</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Lock className="h-4 w-4 mr-2 mt-1" />
                    <span className="text-sm">Advanced AI predictions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "free" ? (
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgrade("premium")}
                  >
                    Upgrade
                  </Button>
                ) : currentPlan === "premium" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUpgrade("premium")}
                  >
                    Downgrade to Premium
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Pro Plan */}
            <Card className={`border-2 ${currentPlan === "pro" ? "border-primary shadow-[4px_4px_0px_rgb(0_0_0/0.3)]" : "border-border"} transition-all duration-300 hover:shadow-md`}>
              <CardHeader className="pb-2 relative overflow-hidden">
                <div className="absolute -right-12 -top-4 bg-primary text-primary-foreground px-8 py-1 rotate-45">
                  <span className="text-xs font-semibold">BEST VALUE</span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Pro</CardTitle>
                    <div className="bg-primary/20 p-1 rounded-full">
                      <IndianRupee className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  {currentPlan === "pro" && <Badge variant="outline" className="bg-primary/10 text-primary">Current</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="font-bold text-2xl mb-4">₹999 <span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Everything in Premium</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Advanced AI predictions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Tax optimization tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Portfolio rebalancing tools</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === "pro" ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgrade("pro")}
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your payment details and billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Premium Plan</p>
                  <p className="text-sm text-muted-foreground">Next billing date: June 15, 2024</p>
                </div>
                <Button variant="outline" size="sm">Update Payment</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Billing History</h3>
              <div className="border rounded-md divide-y">
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">May 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹499</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">April 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹499</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">March 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹499</p>
                    <p className="text-sm text-green-500">Paid</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
              onClick={() => handlePaymentComplete("UPI")}
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
              onClick={() => handlePaymentComplete("Card")}
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
    </div>
  );
}
