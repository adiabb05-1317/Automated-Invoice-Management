import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateData } from '../features/invoiceSlice';
import './PageStyles.css';
import { toast } from 'react-toastify';

const ProductPage: React.FC = () => {
  const products = useAppSelector((state) => state.invoices.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const invalidProducts = products.filter(
      (product) =>
        !product.productName ||
        !product.quantity ||
        !product.unitPrice ||
        !product.tax ||
        !product.priceWithTax
    );

    if (invalidProducts.length > 0) {
      toast.warn(`${invalidProducts.length} product(s) have missing fields.`);
    }
  }, [products]);

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
      <h2>Products</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Tax</th>
              <th>Price with Tax</th>
              <th>Discount</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={`${product.id}-${index}`}
                className={
                  !product.productName ||
                  !product.quantity ||
                  !product.unitPrice ||
                  !product.tax ||
                  !product.priceWithTax
                    ? 'missing-field-row'
                    : ''
                }
              >
                <td>
                  <input
                    type="text"
                    value={product.productName || ''}
                    onChange={(e) =>
                      handleChange(product.id, 'productName', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={product.quantity || ''}
                    onChange={(e) =>
                      handleChange(product.id, 'quantity', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={product.unitPrice || ''}
                    onChange={(e) =>
                      handleChange(product.id, 'unitPrice', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={product.tax || ''}
                    onChange={(e) =>
                      handleChange(product.id, 'tax', Number(e.target.value))
                    }
                  />
                </td>
                <td>{product.priceWithTax || 'Missing'}</td>
                <td>
                  <input
                    type="number"
                    value={product.discount ?? ''}
                    onChange={(e) =>
                      handleChange(product.id, 'discount', Number(e.target.value))
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

export default ProductPage;
