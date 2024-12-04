import axios from 'axios';
import { setData } from '../features/invoiceSlice';
import { AppDispatch } from '../store/store';
import { toast } from 'react-toastify';

export const uploadFilesToServer = async (files: File[], dispatch: AppDispatch) => {
  const formData = new FormData();

  files.forEach((file) => formData.append('files[]', file));

  try {
    const response = await axios.post('http://localhost:8000/invoice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;

    // Validate data for missing fields
    const missingFields = data.filter((item: any) => {
      return !item.customerName || !item.productName || !item.totalAmount || !item.date;
    });

    if (missingFields.length > 0) {
      toast.warn(`${missingFields.length} item(s) have missing fields.`);
    } else {
      toast.success('All data is complete and valid!');
    }

    dispatch(setData(data));

    return response;
  } catch (error) {
    console.error('Error uploading files:', error);
    toast.error('Failed to upload files.');
    throw error;
  }
};
