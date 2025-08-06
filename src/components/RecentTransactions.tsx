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
import { useTransactions } from "@/hooks/useTransactions";

const iconMap: Record<string, any> = {
  Coffee,
  Car,
  ShoppingCart,
  Zap,
  DollarSign,
};

export const RecentTransactions = () => {
  const { transactions, loading } = useTransactions();

  if (loading) {
    return <div className="text-muted-foreground text-center py-4">Loading transactions...</div>;
  }

  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return <div className="text-muted-foreground text-center py-4">No transactions yet.</div>;
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => {
        const Icon = transaction.category?.icon ? iconMap[transaction.category.icon] || DollarSign : DollarSign;
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
                  {transaction.category && (
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category.name}
                    </Badge>
                  )}
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