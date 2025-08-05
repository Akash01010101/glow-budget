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

// Mock data for demonstration
const dashboardData = {
  totalIncome: 5420.00,
  totalExpenses: 3240.50,
  balance: 2179.50,
  monthlyChange: 12.5
};

const Dashboard = () => {
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
          <Button variant="secondary" size="sm">
            <PieChart className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="accent" size="sm">
            <DollarSign className="w-4 h-4" />
            Add Transaction
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
              ${dashboardData.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
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
              ${dashboardData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              ${dashboardData.balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
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
              40.2%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
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
            <ExpenseChart />
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
            <IncomeVsExpenseChart />
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
            <TrendChart />
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