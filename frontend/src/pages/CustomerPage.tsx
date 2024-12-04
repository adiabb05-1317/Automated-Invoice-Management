import React, { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import './PageStyles.css';
import { toast } from 'react-toastify';

const CustomerPage: React.FC = () => {
  const customers = useAppSelector((state) => state.invoices.data);

  useEffect(() => {
    const invalidCustomers = customers.filter(
      (customer) => !customer.customerName || !customer.phone || !customer.totalPurchases
    );

    if (invalidCustomers.length > 0) {
      toast.warn(`${invalidCustomers.length} customer(s) have missing fields.`);
    }
  }, [customers]);

  return (
    <div className="page-container">
      <h2>Customers</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Total Purchase Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={`${customer.id}-${index}`}
                className={
                  !customer.customerName || !customer.phone || !customer.totalPurchases
                    ? 'missing-field-row'
                    : ''
                }
              >
                <td>{customer.customerName || <span className="missing-field">Missing</span>}</td>
                <td>{customer.phone || <span className="missing-field">Missing</span>}</td>
                <td>{customer.totalPurchases || <span className="missing-field">Missing</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
