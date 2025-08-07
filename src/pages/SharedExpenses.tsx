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
  Users as People,
  Trash2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { ExpenseChart } from "@/components/charts/ExpenseChart";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  description: string;
  amount: string;
  date: string;
  category_id: string;
  participants: string;
}

const SharedExpenses = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user } = useAuth();
  const { transactions, categories, loading, addTransaction, deleteTransaction, exportToExcel } = useTransactions();
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  if (!user) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your shared expense data.</p>
      </div>
    );
  }

  // Filter for shared expenses
  const sharedExpenseTransactions = transactions.filter(t => t.type === 'shared-expense');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const totalSharedExpenses = sharedExpenseTransactions.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthSharedExpenses = sharedExpenseTransactions
    .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = sharedExpenseTransactions.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || expense.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onSubmit = async (data: FormData) => {
    try {
      const amount = parseFloat(data.amount);
      const participants = data.participants.split(',').map(p => p.trim()).filter(p => p);
      const totalPeople = participants.length + 1; // Including the current user
      const sharedAmount = amount / totalPeople;

      await addTransaction({
        description: data.description,
        amount: amount, // Store the full amount
        date: data.date,
        type: 'shared-expense',
        category_id: data.category_id || null,
        // Add participants and individual share to metadata or a new field
        user_share: sharedAmount,
        participants: participants
      });
      reset();
      setShowAddForm(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const expenseChartData = sharedExpenseTransactions
    .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Uncategorized';
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += t.user_share || 0;
      } else {
        acc.push({ 
          name: categoryName, 
          value: t.user_share || 0, 
          color: t.category?.color || 'hsl(var(--muted-foreground))' 
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading your shared expense data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-gradient-accent mb-2">
            Shared Expenses
          </h1>
          <p className="text-muted-foreground">
            Track expenses shared with others
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="secondary" size="sm" onClick={exportToExcel} className="w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Shared Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shared Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalSharedExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Your share of all time spending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Share</CardTitle>
            <TrendingDown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-accent">
              ${thisMonthSharedExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Your share of spending this month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups & People</CardTitle>
            <People className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {/* You can add logic to count unique participants */}
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Active groups and people
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Shared Expense Form */}
      {showAddForm && (
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Shared Expense</CardTitle>
            <CardDescription>Record a new shared expense entry</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g., Dinner, Movie Tickets" 
                    className="bg-input border-border"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    className="bg-input border-border"
                    {...register("amount", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Shared With (comma-separated emails)</Label>
                  <Input 
                    id="participants" 
                    placeholder="e.g., friend1@example.com, friend2@example.com" 
                    className="bg-input border-border"
                    {...register("participants", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select onValueChange={(value) => setValue("category_id", value)}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
                    defaultValue={new Date().toISOString().split('T')[0]}
                    {...register("date", { required: true })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shared Expense
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Chart and Expenses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Chart */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Shared Expense Breakdown</CardTitle>
            <CardDescription>Your share of spending by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={expenseChartData} />
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Shared Expenses</CardTitle>
                <CardDescription>Your latest shared spending activity</CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search shared expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border w-full"
                />
              </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExpenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchTerm || selectedCategory !== "" ? 'No shared expense entries match your filters.' : 'No shared expense entries yet. Add your first shared expense above.'}
                </p>
              ) : (
                filteredExpenses.map((expense) => {
                  return (
                    <div 
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card-accent/50 hover:bg-card-accent transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                          <People className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{expense.description}</p>
                          <div className="flex flex-wrap items-center space-x-2 mt-1">
                            {expense.category && (
                              <Badge variant="secondary" className="text-xs">
                                {expense.category.name}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-bold text-destructive">
                            -${(expense.user_share || 0).toLocaleString()} (Your Share)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total: ${expense.amount.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(expense.id, 'shared-expense')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharedExpenses;