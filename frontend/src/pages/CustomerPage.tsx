import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateData } from '../features/invoiceSlice';
import './PageStyles.css';
import { toast } from 'react-toastify';

const CustomerPage: React.FC = () => {
  const customers = useAppSelector((state) => state.invoices.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const invalidCustomers = customers.filter(
      (customer) => !customer.customerName || !customer.phone || !customer.totalPurchases
    );

    if (invalidCustomers.length > 0) {
      toast.warn(`${invalidCustomers.length} customer(s) have missing fields.`);
    }
  }, [customers]);

  const handleChange = (
    id: string | undefined,
    field: string,
    value: string | number | null
  ) => {
    dispatch(
      updateData({
        id,
        [field]: value,
      })
    );
  };

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
                <td>
                  <input
                    type="text"
                    value={customer.customerName || ''}
                    onChange={(e) =>
                      handleChange(customer.id, 'customerName', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={customer.phone || ''}
                    onChange={(e) =>
                      handleChange(customer.id, 'phone', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={customer.totalPurchases || ''}
                    onChange={(e) =>
                      handleChange(customer.id, 'totalPurchases', Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
