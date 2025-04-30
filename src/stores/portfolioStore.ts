
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Portfolio, PortfolioHolding, Transaction } from '@/types/portfolio';
import { v4 as uuidv4 } from 'uuid';

interface PortfolioStore {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  // Core actions
  createPortfolio: (name: string, currency: string, description?: string) => string;
  updatePortfolio: (id: string, data: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string | null) => void;
  // Holdings management
  addHolding: (portfolioId: string, holding: Omit<PortfolioHolding, 'id' | 'allocation' | 'transactions' | 'return'>) => void;
  updateHolding: (portfolioId: string, holdingId: string, data: Partial<PortfolioHolding>) => void;
  removeHolding: (portfolioId: string, holdingId: string) => void;
  // Transactions
  addTransaction: (portfolioId: string, holdingId: string, transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (portfolioId: string, holdingId: string, transactionId: string, data: Partial<Transaction>) => void;
  removeTransaction: (portfolioId: string, holdingId: string, transactionId: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      portfolios: [],
      activePortfolioId: null,
      
      createPortfolio: (name, currency, description) => {
        const newId = uuidv4();
        const now = new Date().toISOString();
        
        const newPortfolio: Portfolio = {
          id: newId,
          name,
          description,
          currency,
          totalValue: 0,
          createdAt: now,
          lastUpdated: now,
          holdings: [],
          performance: {
            allTime: 0,
            today: 0,
            week: 0,
            month: 0,
            year: 0
          }
        };
        
        set(state => ({
          portfolios: [...state.portfolios, newPortfolio],
          activePortfolioId: newId
        }));
        
        return newId;
      },
      
      updatePortfolio: (id, data) => {
        set(state => ({
          portfolios: state.portfolios.map(portfolio => 
            portfolio.id === id 
              ? { 
                  ...portfolio, 
                  ...data, 
                  lastUpdated: new Date().toISOString() 
                } 
              : portfolio
          )
        }));
      },
      
      deletePortfolio: (id) => {
        set(state => ({
          portfolios: state.portfolios.filter(portfolio => portfolio.id !== id),
          activePortfolioId: state.activePortfolioId === id ? null : state.activePortfolioId
        }));
      },
      
      setActivePortfolio: (id) => {
        set({ activePortfolioId: id });
      },
      
      addHolding: (portfolioId, holdingData) => {
        const newHolding: PortfolioHolding = {
          id: uuidv4(),
          ...holdingData,
          value: holdingData.quantity * holdingData.currentPrice,
          allocation: 0, // Will be calculated
          return: {
            amount: (holdingData.currentPrice - holdingData.averageBuyPrice) * holdingData.quantity,
            percentage: ((holdingData.currentPrice / holdingData.averageBuyPrice) - 1) * 100
          },
          transactions: []
        };
        
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            const updatedHoldings = [...portfolio.holdings, newHolding];
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations for all holdings
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: (h.value / totalValue) * 100
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
      
      updateHolding: (portfolioId, holdingId, data) => {
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            const updatedHoldings = portfolio.holdings.map(holding => {
              if (holding.id !== holdingId) return holding;
              
              const updatedHolding = { ...holding, ...data };
              
              // Recalculate value and return if necessary
              if (data.quantity !== undefined || data.currentPrice !== undefined || data.averageBuyPrice !== undefined) {
                const quantity = data.quantity ?? holding.quantity;
                const currentPrice = data.currentPrice ?? holding.currentPrice;
                const avgBuyPrice = data.averageBuyPrice ?? holding.averageBuyPrice;
                
                updatedHolding.value = quantity * currentPrice;
                updatedHolding.return = {
                  amount: (currentPrice - avgBuyPrice) * quantity,
                  percentage: ((currentPrice / avgBuyPrice) - 1) * 100
                };
              }
              
              return updatedHolding;
            });
            
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: (h.value / totalValue) * 100
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
      
      removeHolding: (portfolioId, holdingId) => {
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            const updatedHoldings = portfolio.holdings.filter(h => h.id !== holdingId);
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: totalValue > 0 ? (h.value / totalValue) * 100 : 0
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
      
      addTransaction: (portfolioId, holdingId, transaction) => {
        const newTransaction: Transaction = {
          id: uuidv4(),
          ...transaction
        };
        
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            const updatedHoldings = portfolio.holdings.map(holding => {
              if (holding.id !== holdingId) return holding;
              
              // Add transaction to holding
              const updatedTransactions = [...holding.transactions, newTransaction];
              
              // Recalculate average buy price based on all buy transactions
              const buyTransactions = updatedTransactions.filter(t => t.type === 'buy');
              const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
              const totalSpent = buyTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);
              
              const sellTransactions = updatedTransactions.filter(t => t.type === 'sell');
              const totalSold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);
              
              const newQuantity = totalBought - totalSold;
              const newAvgBuyPrice = totalBought > 0 ? totalSpent / totalBought : holding.averageBuyPrice;
              
              const updatedHolding = {
                ...holding,
                quantity: newQuantity,
                averageBuyPrice: newAvgBuyPrice,
                transactions: updatedTransactions,
                value: newQuantity * holding.currentPrice,
                return: {
                  amount: (holding.currentPrice - newAvgBuyPrice) * newQuantity,
                  percentage: ((holding.currentPrice / newAvgBuyPrice) - 1) * 100
                }
              };
              
              return updatedHolding;
            });
            
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: (h.value / totalValue) * 100
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
      
      updateTransaction: (portfolioId, holdingId, transactionId, data) => {
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            let updatedHolding: PortfolioHolding | null = null;
            
            const updatedHoldings = portfolio.holdings.map(holding => {
              if (holding.id !== holdingId) return holding;
              
              // Update specific transaction
              const updatedTransactions = holding.transactions.map(t => 
                t.id === transactionId ? { ...t, ...data } : t
              );
              
              // Recalculate average buy price and quantity
              const buyTransactions = updatedTransactions.filter(t => t.type === 'buy');
              const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
              const totalSpent = buyTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);
              
              const sellTransactions = updatedTransactions.filter(t => t.type === 'sell');
              const totalSold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);
              
              const newQuantity = totalBought - totalSold;
              const newAvgBuyPrice = totalBought > 0 ? totalSpent / totalBought : holding.averageBuyPrice;
              
              updatedHolding = {
                ...holding,
                quantity: newQuantity,
                averageBuyPrice: newAvgBuyPrice,
                transactions: updatedTransactions,
                value: newQuantity * holding.currentPrice,
                return: {
                  amount: (holding.currentPrice - newAvgBuyPrice) * newQuantity,
                  percentage: ((holding.currentPrice / newAvgBuyPrice) - 1) * 100
                }
              };
              
              return updatedHolding;
            });
            
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: (h.value / totalValue) * 100
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
      
      removeTransaction: (portfolioId, holdingId, transactionId) => {
        set(state => {
          const updatedPortfolios = state.portfolios.map(portfolio => {
            if (portfolio.id !== portfolioId) return portfolio;
            
            const updatedHoldings = portfolio.holdings.map(holding => {
              if (holding.id !== holdingId) return holding;
              
              // Remove transaction
              const updatedTransactions = holding.transactions.filter(t => t.id !== transactionId);
              
              // Recalculate average buy price and quantity
              const buyTransactions = updatedTransactions.filter(t => t.type === 'buy');
              const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
              const totalSpent = buyTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);
              
              const sellTransactions = updatedTransactions.filter(t => t.type === 'sell');
              const totalSold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);
              
              const newQuantity = totalBought - totalSold;
              const newAvgBuyPrice = totalBought > 0 ? totalSpent / totalBought : holding.averageBuyPrice;
              
              const updatedHolding = {
                ...holding,
                quantity: newQuantity,
                averageBuyPrice: newAvgBuyPrice,
                transactions: updatedTransactions,
                value: newQuantity * holding.currentPrice,
                return: {
                  amount: (holding.currentPrice - newAvgBuyPrice) * newQuantity,
                  percentage: ((holding.currentPrice / newAvgBuyPrice) - 1) * 100
                }
              };
              
              return updatedHolding;
            });
            
            const totalValue = updatedHoldings.reduce((sum, h) => sum + h.value, 0);
            
            // Recalculate allocations
            const holdingsWithAllocations = updatedHoldings.map(h => ({
              ...h,
              allocation: (h.value / totalValue) * 100
            }));
            
            return {
              ...portfolio,
              holdings: holdingsWithAllocations,
              totalValue,
              lastUpdated: new Date().toISOString()
            };
          });
          
          return { portfolios: updatedPortfolios };
        });
      },
    }),
    {
      name: 'portfolio-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
