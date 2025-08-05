import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Search,
  ShoppingCart,
  Car,
  Coffee,
  Zap,
  Home
} from "lucide-react";
import { ExpenseChart } from "@/components/charts/ExpenseChart";

// Mock data
const expenseData = [
  { id: 1, category: 'Food & Dining', description: 'Starbucks Coffee', amount: 15.50, date: '2024-01-15' },
  { id: 2, category: 'Transportation', description: 'Uber Ride', amount: 28.75, date: '2024-01-14' },
  { id: 3, category: 'Shopping', description: 'Amazon Purchase', amount: 156.99, date: '2024-01-14' },
  { id: 4, category: 'Bills & Utilities', description: 'Electricity Bill', amount: 89.30, date: '2024-01-13' },
  { id: 5, category: 'Food & Dining', description: 'Grocery Shopping', amount: 67.20, date: '2024-01-12' },
];

const categories = [
  { name: 'Food & Dining', icon: Coffee, color: 'text-chart-1' },
  { name: 'Transportation', icon: Car, color: 'text-chart-2' },
  { name: 'Shopping', icon: ShoppingCart, color: 'text-chart-3' },
  { name: 'Bills & Utilities', icon: Zap, color: 'text-chart-4' },
  { name: 'Housing', icon: Home, color: 'text-chart-5' },
];

const Expenses = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenseData
    .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = expenseData.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : ShoppingCart;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'text-chart-1';
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-accent mb-2">
            Expense Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor and categorize your spending habits
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time spending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingDown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-accent">
              ${thisMonthExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {categories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Expense categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Record a new expense entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="e.g., Coffee, Gas, Groceries" 
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart and Expenses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Chart */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Your spending by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest spending activity</CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExpenses.map((expense) => {
                const IconComponent = getCategoryIcon(expense.category);
                const colorClass = getCategoryColor(expense.category);
                
                return (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card-accent/50 hover:bg-card-accent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${colorClass}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {expense.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">
                        -${expense.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;