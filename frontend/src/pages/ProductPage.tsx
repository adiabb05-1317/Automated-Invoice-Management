import React, { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import './PageStyles.css';
import { toast } from 'react-toastify';

const ProductPage: React.FC = () => {
  const products = useAppSelector((state) => state.invoices.data);

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
                <td>{product.productName || <span className="missing-field">Missing</span>}</td>
                <td>{product.quantity || <span className="missing-field">Missing</span>}</td>
                <td>{product.unitPrice || <span className="missing-field">Missing</span>}</td>
                <td>{product.tax || <span className="missing-field">Missing</span>}</td>
                <td>{product.priceWithTax || <span className="missing-field">Missing</span>}</td>
                <td>{product.discount ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPage;
