import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Search,
  Trash2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  description: string;
  amount: string;
  date: string;
  category_id: string;
}

const Income = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { transactions, categories, loading, addTransaction, deleteTransaction, exportToExcel } = useTransactions();
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>();

  if (!user) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your income data.</p>
      </div>
    );
  }

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const totalIncome = incomeTransactions.reduce((sum, income) => sum + income.amount, 0);
  const thisMonthIncome = incomeTransactions
    .filter(income => new Date(income.date).getMonth() === new Date().getMonth())
    .reduce((sum, income) => sum + income.amount, 0);

  const filteredIncome = incomeTransactions.filter(income =>
    income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    income.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: FormData) => {
    try {
      await addTransaction({
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date,
        type: 'income',
        category_id: data.category_id || null,
      });
      reset();
      setShowAddForm(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading your income data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-secondary mb-2">
            Income Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your income sources
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={exportToExcel}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4" />
            Add Income
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-secondary">
              ${thisMonthIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sources</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {incomeTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Income entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Income Form */}
      {showAddForm && (
        <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Income</CardTitle>
            <CardDescription>Record a new income entry</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g., Salary, Freelance, Investment" 
                    className="bg-input border-border"
                    {...register("description", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
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
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="bg-input border-border"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    {...register("date", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select onValueChange={(value) => setValue("category_id", value)}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Income
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Income List */}
      <Card className="shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Income History</CardTitle>
              <CardDescription>Your recent income entries</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search income..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredIncome.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchTerm ? 'No income entries match your search.' : 'No income entries yet. Add your first income entry above.'}
              </p>
            ) : (
              filteredIncome.map((income) => (
                <div 
                  key={income.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card-accent/50 hover:bg-card-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {income.category && (
                          <Badge variant="secondary" className="text-xs">
                            {income.category.name}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(income.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        +${income.amount.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTransaction(income.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Income;