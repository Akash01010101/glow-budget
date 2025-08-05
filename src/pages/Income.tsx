import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Search
} from "lucide-react";

// Mock data
const incomeData = [
  { id: 1, source: 'Salary', amount: 4200, date: '2024-01-15', type: 'Monthly' },
  { id: 2, source: 'Freelance Project', amount: 850, date: '2024-01-12', type: 'One-time' },
  { id: 3, source: 'Investment Returns', amount: 320, date: '2024-01-10', type: 'Quarterly' },
  { id: 4, source: 'Side Business', amount: 150, date: '2024-01-08', type: 'Weekly' },
];

const Income = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const thisMonthIncome = incomeData
    .filter(income => new Date(income.date).getMonth() === new Date().getMonth())
    .reduce((sum, income) => sum + income.amount, 0);

  const filteredIncome = incomeData.filter(income =>
    income.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {incomeData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active income streams
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Income Source</Label>
                <Input 
                  id="source" 
                  placeholder="e.g., Salary, Freelance, Investment" 
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
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input 
                  id="type" 
                  placeholder="e.g., Monthly, One-time, Weekly" 
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
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
            {filteredIncome.map((income) => (
              <div 
                key={income.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card-accent/50 hover:bg-card-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">{income.source}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {income.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(income.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">
                    +${income.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Income;