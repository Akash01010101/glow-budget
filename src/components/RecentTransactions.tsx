import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Car, 
  Coffee, 
  Zap, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const transactions = [
  {
    id: 1,
    type: 'expense',
    category: 'Food & Dining',
    description: 'Starbucks Coffee',
    amount: 15.50,
    date: '2024-01-15',
    icon: Coffee,
  },
  {
    id: 2,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    amount: 4200.00,
    date: '2024-01-15',
    icon: DollarSign,
  },
  {
    id: 3,
    type: 'expense',
    category: 'Transportation',
    description: 'Uber Ride',
    amount: 28.75,
    date: '2024-01-14',
    icon: Car,
  },
  {
    id: 4,
    type: 'expense',
    category: 'Shopping',
    description: 'Amazon Purchase',
    amount: 156.99,
    date: '2024-01-14',
    icon: ShoppingCart,
  },
  {
    id: 5,
    type: 'expense',
    category: 'Bills & Utilities',
    description: 'Electricity Bill',
    amount: 89.30,
    date: '2024-01-13',
    icon: Zap,
  },
];

export const RecentTransactions = () => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const Icon = transaction.icon;
        const isIncome = transaction.type === 'income';
        
        return (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card-accent/50 hover:bg-card-accent transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`${isIncome ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                  <Icon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isIncome ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`font-medium ${isIncome ? 'text-success' : 'text-destructive'}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};