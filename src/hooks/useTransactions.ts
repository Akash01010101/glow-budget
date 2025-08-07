import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'shared-expense';
  category_id: string | null;
  category?: {
    name: string;
    icon: string;
    color: string;
  };
  participants?: string[]; // For shared expenses
  user_share?: number; // For shared expenses
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(name, icon, color)
        `)
        .eq('user_id', user.id);

      if (transactionsError) throw transactionsError;

      const { data: sharedExpensesData, error: sharedExpensesError } = await supabase
        .from('shared_expenses')
        .select(`
          *,
          category:categories(name, icon, color)
        `)
        .or(`user_id.eq.${user.id},participants.cs.["${user.email}"]`);

      if (sharedExpensesError) throw sharedExpensesError;

      const combinedTransactions: Transaction[] = [
        ...(transactionsData || []).map(t => ({
          ...t,
          type: t.type as 'income' | 'expense'
        })),
        ...(sharedExpensesData || []).map(t => ({
          ...t,
          type: 'shared-expense' as 'shared-expense'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

      setTransactions(combinedTransactions);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching transactions",
        description: error.message,
      });
    }
  };

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('name');

      if (error) throw error;
      setCategories((data || []).map(c => ({
        ...c,
        type: c.type as 'income' | 'expense'
      })));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching categories",
        description: error.message,
      });
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      let data, error;
      if (transaction.type === 'shared-expense') {
        ({ data, error } = await supabase
          .from('shared_expenses')
          .insert({
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            category_id: transaction.category_id,
            user_id: user.id,
            participants: transaction.participants,
            user_share: transaction.user_share,
          })
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from('transactions')
          .insert({
            ...transaction,
            user_id: user.id,
          })
          .select()
          .single());
      }

      if (error) throw error;

      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully recorded.",
      });

      await Promise.all([fetchTransactions(), fetchCategories()]);
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding transaction",
        description: error.message,
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string, type: 'income' | 'expense' | 'shared-expense') => {
    try {
      let error;
      if (type === 'shared-expense') {
        ({ error } = await supabase
          .from('shared_expenses')
          .delete()
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id));
      }

      if (error) throw error;

      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed.",
      });

      await fetchTransactions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting transaction",
        description: error.message,
      });
    }
  };

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const workbook = XLSX.utils.book_new();
      
      // Export transactions
      const transactionData = transactions
        .filter(t => t.type !== 'shared-expense')
        .map(t => ({
          Date: new Date(t.date).toLocaleDateString(),
          Description: t.description,
          Type: t.type,
          Category: t.category?.name || 'Uncategorized',
          Amount: t.amount,
        }));
      
      const sharedExpenseData = transactions
        .filter(t => t.type === 'shared-expense')
        .map(t => ({
          Date: new Date(t.date).toLocaleDateString(),
          Description: t.description,
          TotalAmount: t.amount,
          YourShare: t.user_share,
          Participants: t.participants?.join(', '),
          Category: t.category?.name || 'Uncategorized',
        }));
      
      const transactionWS = XLSX.utils.json_to_sheet(transactionData);
      XLSX.utils.book_append_sheet(workbook, transactionWS, 'Transactions');

      if (sharedExpenseData.length > 0) {
        const sharedExpenseWS = XLSX.utils.json_to_sheet(sharedExpenseData);
        XLSX.utils.book_append_sheet(workbook, sharedExpenseWS, 'Shared Expenses');
      }
      
      // Export summary
      const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const summaryData = [
        { Metric: 'Total Income', Amount: incomeTotal },
        { Metric: 'Total Expenses', Amount: expenseTotal },
        { Metric: 'Net Balance', Amount: incomeTotal - expenseTotal },
      ];
      
      const summaryWS = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');
      
      // Download file
      const fileName = `financial-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: "Export successful",
        description: "Your financial data has been exported to Excel.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([fetchTransactions(), fetchCategories()]);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    deleteTransaction,
    exportToExcel,
    refreshTransactions: fetchTransactions,
  };
};