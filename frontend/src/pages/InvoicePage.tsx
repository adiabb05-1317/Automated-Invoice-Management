import React from 'react';
import { useAppSelector } from '../store/hooks';
import './PageStyles.css';
import { toast } from 'react-toastify';

const InvoicePage: React.FC = () => {
  const invoices = useAppSelector((state) => state.invoices.data);

  React.useEffect(() => {
    const invalidInvoices = invoices.filter(
      (invoice) =>
        !invoice.customerName ||
        !invoice.productName ||
        !invoice.totalAmount ||
        !invoice.date
    );

    if (invalidInvoices.length > 0) {
      toast.warn(`${invalidInvoices.length} invoice(s) have missing fields.`);
    }
  }, [invoices]);

  return (
    <div className="page-container">
      <h2>Invoices</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Tax</th>
              <th>Total Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr
                key={`${invoice.id}-${index}`}
                className={
                  !invoice.customerName || !invoice.productName || !invoice.totalAmount || !invoice.date
                    ? 'missing-field-row'
                    : ''
                }
              >
                <td>{invoice.serialNumber || invoice.id}</td>
                <td>{invoice.customerName || <span className="missing-field">Missing</span>}</td>
                <td>{invoice.productName || <span className="missing-field">Missing</span>}</td>
                <td>{invoice.quantity || <span className="missing-field">Missing</span>}</td>
                <td>{invoice.tax || <span className="missing-field">Missing</span>}</td>
                <td>{invoice.totalAmount || <span className="missing-field">Missing</span>}</td>
                <td>{invoice.date || <span className="missing-field">Missing</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicePage;
