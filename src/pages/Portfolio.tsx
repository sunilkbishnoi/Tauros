
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { PortfolioList } from "@/components/portfolio/PortfolioList";
import { HoldingsList } from "@/components/portfolio/HoldingsList";
import { CreatePortfolioDialog } from "@/components/portfolio/CreatePortfolioDialog";
import { TransactionsTable } from "@/components/portfolio/TransactionsTable";
import { PortfolioPerformance } from "@/components/portfolio/PortfolioPerformance";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Portfolio() {
  const { portfolios, activePortfolioId, setActivePortfolio } = usePortfolioStore();
  const [isCreatePortfolioOpen, setIsCreatePortfolioOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
  const hasPortfolios = portfolios.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <PortfolioHeader />
        
        {!hasPortfolios ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fadeIn">
            <div className="text-center max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-muted">
                  <AlertCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3">No portfolios yet</h2>
              <p className="text-muted-foreground mb-6">
                Start tracking your investments by creating your first portfolio. Track all your crypto
                assets and stocks in one place.
              </p>
              <Button 
                onClick={() => setIsCreatePortfolioOpen(true)}
                className="neo-brutal-button"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Portfolio
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <PortfolioList
                portfolios={portfolios}
                activePortfolioId={activePortfolioId}
                onSelectPortfolio={setActivePortfolio}
              />
              
              <Button 
                onClick={() => setIsCreatePortfolioOpen(true)}
                variant="outline"
                className="neo-brutal-button shadow-[2px_2px_0px_rgb(0_0_0/0.3)]"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Portfolio
              </Button>
            </div>
            
            {activePortfolio ? (
              <>
                <PortfolioSummary portfolio={activePortfolio} />
                
                <div className="flex justify-end mb-2">
                  <Button asChild variant="outline">
                    <Link to={`/portfolio/${activePortfolio.id}`}>
                      View Full Portfolio Details
                    </Link>
                  </Button>
                </div>
                
                <Tabs 
                  defaultValue="overview" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="overview" className="tabs-button">Overview</TabsTrigger>
                    <TabsTrigger value="holdings" className="tabs-button">Holdings</TabsTrigger>
                    <TabsTrigger value="transactions" className="tabs-button">Transactions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 animate-fadeIn">
                    <PortfolioPerformance portfolio={activePortfolio} />
                  </TabsContent>
                  
                  <TabsContent value="holdings" className="space-y-4 animate-fadeIn">
                    <HoldingsList portfolio={activePortfolio} />
                  </TabsContent>
                  
                  <TabsContent value="transactions" className="space-y-4 animate-fadeIn">
                    {activePortfolio.holdings.some(h => h.transactions.length > 0) ? (
                      <TransactionsTable portfolio={activePortfolio} />
                    ) : (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                          <p className="text-muted-foreground max-w-md">
                            Add holdings and transactions to keep track of your investment activities.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a portfolio</h3>
                  <p className="text-muted-foreground">
                    Please select a portfolio from the dropdown above.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        <CreatePortfolioDialog 
          open={isCreatePortfolioOpen} 
          onOpenChange={setIsCreatePortfolioOpen}
        />
      </main>
      <Footer />
    </div>
  );
}
