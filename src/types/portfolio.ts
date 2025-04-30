
export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  currency: string;
  createdAt: string;
  lastUpdated: string;
  holdings: PortfolioHolding[];
  performance: {
    allTime: number;
    today: number;
    week: number;
    month: number;
    year: number;
  };
}

export interface PortfolioHolding {
  id: string;
  asset: {
    id: string;
    symbol: string;
    name: string;
    type: 'crypto' | 'stock';
  };
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  value: number;
  allocation: number;
  return: {
    amount: number;
    percentage: number;
  };
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  fee?: number;
  notes?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  returnPercentage: number;
  distribution: {
    crypto: number;
    stocks: number;
  };
}
