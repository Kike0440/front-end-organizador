export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: 'maintenance' | 'utility' | 'administrative' | 'salary' | 'marketing' | 'other';
    localId?: string;
}