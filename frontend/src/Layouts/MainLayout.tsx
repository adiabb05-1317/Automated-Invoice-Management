import React from 'react';
import TabLayout from './TabLayout';
import './MainLayout.css';
import InvoicePage from '../pages/InvoicePage';
import ProductPage from '../pages/ProductPage';
import CustomerPage from '../pages/CustomerPage';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { uploadFilesToServer } from '../utils/saver';
import { useAppDispatch } from '../store/hooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const tabs = [
    { label: 'Invoices', content: <InvoicePage /> },
    { label: 'Products', content: <ProductPage /> },
    { label: 'Customers', content: <CustomerPage /> },
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    toast.success(`${droppedFiles.length} file(s) added successfully.`);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf, .csv, .xlsx, .png, .jpg, .jpeg';
    input.multiple = true;

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const selectedFiles = Array.from(target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        toast.success(`${selectedFiles.length} file(s) added successfully.`);
      }
      input.value = '';
    };

    input.click();
  };

  const handleFileDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast.info('File removed successfully.');
  };

  const handleGetInvoiceSummary = async () => {
    if (files.length === 0) {
      toast.error('No files uploaded!');
      return;
    }

    setLoading(true);
    try {
         await uploadFilesToServer(files, dispatch);
      toast.success('Invoice summary generated successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="navbar">
        <div className="logo">Invoice Manager</div>
      </header>
      <div
        className="upload-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleFileUpload}
      >
        <FaUpload className="upload-icon" />
        <p>Drag and drop files here, or click to upload</p>
      </div>
      {files.length > 0 && (
        <div className="file-list">
          <h3>Uploaded Files:</h3>
          {files.map((file, index) => (
            <div key={index} className="file-info">
              <div>
                <strong>{file.name}</strong>
              </div>
              <div>
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleFileDelete(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="get-summary-btn"
        onClick={handleGetInvoiceSummary}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Get Invoice Summary'}
      </button>

      <div className="tabs-container">
        <TabLayout tabs={tabs} />
      </div>
    </div>
  );
};

export default MainLayout;
