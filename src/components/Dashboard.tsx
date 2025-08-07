import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  PieChart,
  BarChart3,
  LineChart
} from "lucide-react";
import { ExpenseChart } from "./charts/ExpenseChart";
import { IncomeVsExpenseChart } from "./charts/IncomeVsExpenseChart";
import { TrendChart } from "./charts/TrendChart";
import { RecentTransactions } from "./RecentTransactions";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, loading, exportToExcel } = useTransactions();

  if (!user) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading your financial data...</p>
      </div>
    );
  }

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense' || t.type === 'shared-expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const thisMonth = new Date().getMonth();
  const thisMonthIncome = incomeTransactions
    .filter(t => new Date(t.date).getMonth() === thisMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  const thisMonthExpenses = expenseTransactions
    .filter(t => new Date(t.date).getMonth() === thisMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  const expenseChartData = expenseTransactions
    .filter(t => new Date(t.date).getMonth() === thisMonth)
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Uncategorized';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ 
          name: categoryName, 
          value: t.amount, 
          color: t.category?.color || 'hsl(var(--muted-foreground))' 
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  const incomeVsExpenseChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleString('default', { month: 'short' });
    const monthIncome = incomeTransactions
      .filter(t => new Date(t.date).getMonth() === d.getMonth())
      .reduce((sum, t) => sum + t.amount, 0);
    const monthExpenses = expenseTransactions
      .filter(t => new Date(t.date).getMonth() === d.getMonth() && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthSharedExpenses = expenseTransactions
      .filter(t => new Date(t.date).getMonth() === d.getMonth() && t.type === 'shared-expense')
      .reduce((sum, t) => sum + (t.user_share || 0), 0);
    return { month, income: monthIncome, expenses: monthExpenses, sharedExpenses: monthSharedExpenses };
  }).reverse();

  const trendChartData = Array.from({ length: new Date(new Date().getFullYear(), thisMonth + 1, 0).getDate() }).map((_, i) => {
    const day = (i + 1).toString();
    const dayExpenses = expenseTransactions
      .filter(t => new Date(t.date).getMonth() === thisMonth && new Date(t.date).getDate() === (i + 1) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const daySharedExpenses = expenseTransactions
      .filter(t => new Date(t.date).getMonth() === thisMonth && new Date(t.date).getDate() === (i + 1) && t.type === 'shared-expense')
      .reduce((sum, t) => sum + (t.user_share || 0), 0);
    return { day, amount: dayExpenses + daySharedExpenses };
  });

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your income, expenses, and financial goals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={exportToExcel}>
            <PieChart className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month: ${thisMonthIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month: ${thisMonthExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-secondary">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {totalIncome > 0 ? 'Based on total income' : 'No income recorded'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Expense Categories
            </CardTitle>
            <CardDescription>
              Your spending breakdown for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseChartData} />
          </CardContent>
        </Card>

        {/* Income vs Expenses */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary" />
              Income vs Expenses
            </CardTitle>
            <CardDescription>
              Monthly comparison over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeVsExpenseChart data={incomeVsExpenseChartData} />
          </CardContent>
        </Card>

        {/* Spending Trend */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-accent" />
              Spending Trend
            </CardTitle>
            <CardDescription>
              Your daily spending pattern this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendChartData} />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;