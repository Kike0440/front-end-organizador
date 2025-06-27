export interface Local {
    id: string;
    name: string;
    address: string;
    price: number;
    status: 'available' | 'rented' | 'maintenance';
    description?: string;
    imageUrl?: string;
    sizeSqMeters?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'employee';
    password?: string;
}

export interface Contract {
    id: string;
    localId: string;
    userId: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    paymentFrequency: 'monthly' | 'quarterly' | 'yearly';
    depositAmount?: number;
    contractUrl?: string;
    lastPaymentDate?: string;
}

export interface RentedLocalInfo extends Local {
    contractId: string;
    contractStartDate: string;
    contractEndDate: string;
    rentAmountContract: number;
    paymentFrequency: 'monthly' | 'quarterly' | 'yearly';
    nextPaymentDate: string;
    paymentStatus: 'paid' | 'pending' | 'dueSoon' | 'overdue';
    contractUrl?: string;
}