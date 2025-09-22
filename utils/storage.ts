import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReimbursementItem {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  type: string;
  detail: string;
  createdAt: string;
}

const STORAGE_KEY = '@reimbursement_data';

// Default reimbursement data
const defaultReimbursementData: ReimbursementItem[] = [
  {
    id: '1',
    title: 'Transportasi Meeting Client',
    amount: 'Rp 150.000',
    date: '15 Jan 2024',
    status: 'approved',
    type: 'Transportasi',
    detail: 'Biaya transportasi untuk meeting dengan client di Jakarta',
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Makan Siang Tim',
    amount: 'Rp 300.000',
    date: '14 Jan 2024',
    status: 'pending',
    type: 'Makan',
    detail: 'Makan siang bersama tim untuk diskusi project',
    createdAt: '2024-01-14T12:00:00.000Z'
  },
  {
    id: '3',
    title: 'Hotel Business Trip',
    amount: 'Rp 800.000',
    date: '12 Jan 2024',
    status: 'approved',
    type: 'Akomodasi',
    detail: 'Menginap di hotel untuk business trip ke Surabaya',
    createdAt: '2024-01-12T15:00:00.000Z'
  },
  {
    id: '4',
    title: 'Pulsa Internet',
    amount: 'Rp 50.000',
    date: '10 Jan 2024',
    status: 'rejected',
    type: 'Komunikasi',
    detail: 'Pembelian pulsa internet untuk keperluan kerja',
    createdAt: '2024-01-10T09:00:00.000Z'
  },
];

// Get all reimbursement data
export const getReimbursementData = async (): Promise<ReimbursementItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    } else {
      // If no data exists, initialize with default data
      await setReimbursementData(defaultReimbursementData);
      return defaultReimbursementData;
    }
  } catch (error) {
    console.error('Error getting reimbursement data:', error);
    return defaultReimbursementData;
  }
};

// Set all reimbursement data
export const setReimbursementData = async (data: ReimbursementItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error setting reimbursement data:', error);
    throw error;
  }
};

// Add new reimbursement item
export const addReimbursementItem = async (item: Omit<ReimbursementItem, 'id' | 'createdAt'>): Promise<ReimbursementItem> => {
  try {
    const existingData = await getReimbursementData();
    const newItem: ReimbursementItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending' // New items always start as pending
    };
    
    const updatedData = [newItem, ...existingData];
    await setReimbursementData(updatedData);
    return newItem;
  } catch (error) {
    console.error('Error adding reimbursement item:', error);
    throw error;
  }
};

// Update reimbursement item
export const updateReimbursementItem = async (id: string, updates: Partial<ReimbursementItem>): Promise<void> => {
  try {
    const existingData = await getReimbursementData();
    const updatedData = existingData.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    await setReimbursementData(updatedData);
  } catch (error) {
    console.error('Error updating reimbursement item:', error);
    throw error;
  }
};

// Delete reimbursement item
export const deleteReimbursementItem = async (id: string): Promise<void> => {
  try {
    const existingData = await getReimbursementData();
    const updatedData = existingData.filter(item => item.id !== id);
    await setReimbursementData(updatedData);
  } catch (error) {
    console.error('Error deleting reimbursement item:', error);
    throw error;
  }
};

// Clear all data (for testing purposes)
export const clearReimbursementData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing reimbursement data:', error);
    throw error;
  }
};

// Reset to default data
export const resetToDefaultData = async (): Promise<void> => {
  try {
    await setReimbursementData(defaultReimbursementData);
  } catch (error) {
    console.error('Error resetting to default data:', error);
    throw error;
  }
};