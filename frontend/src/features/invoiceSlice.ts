import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvoiceData {
  id?: string; 
  serialNumber?: string; 
  customerName?: string; 
  phone?: string; 
  totalPurchases?: number;
  productName?: string; 
  quantity?: number;
  unitPrice?: number; 
  priceWithTax?: number; 
  discount?: number;
  tax?: number; 
  totalAmount?: number; 
  date?: string; 
}

interface InvoiceState {
  data: InvoiceData[];
}

const initialState: InvoiceState = {
  data: [],
};


const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<InvoiceData[]>) {
      state.data = action.payload;
    },
    addData(state, action: PayloadAction<InvoiceData>) {
      state.data.push(action.payload);
    },
    updateData(state, action: PayloadAction<InvoiceData>) {
      const index = state.data.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
    deleteData(state, action: PayloadAction<string>) {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setData, addData, updateData, deleteData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
