'use client';
import { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export default function CreatorDashboard() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [creatorId, setCreatorId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage('You are not logged in.');
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      setCreatorId(userId);

      // Fetch products
      const { data: productList, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', userId);
      if (productError) {
        setMessage('Failed to load products');
        setLoading(false);
        return;
      }
      setProducts(productList);

      // Fetch purchases
      const { data: purchaseList, error: purchaseError } = await supabase
        .from('purchases')
        .select('*')
        .eq('creator_id', userId);
      if (purchaseError) {
        setMessage('Failed to load purchases');
        setLoading(false);
        return;
      }
      setPurchases(purchaseList);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('products')
      .update({
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        image: editingProduct.image,
      })
      .eq('id', editingProduct.id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setEditingProduct(null);
    }
  };

  const totalSales = purchases.length;
  const totalRevenue = purchases.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Creator Dashboard</h2>
      {message && <p>{message}</p>}

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0f8ff',
          borderRadius: '8px',
          border: '1px solid #d1eaff',
        }}
      >
        <h3>💰 Sales Summary</h3>
        <p>🛒 Total Sales: <strong>{totalSales}</strong></p>
        <p>💵 Total Revenue: <strong>₦{totalRevenue.toLocaleString()}</strong></p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <ul style={{ marginTop: '2rem' }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                padding: '1rem',
                border: '1px solid #ccc',
                marginBottom: '1rem',
                borderRadius: '8px',
              }}
            >
              {editingProduct?.id === product.id ? (
                <div>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    placeholder="Image URL"
                  />
                  <button onClick={handleSave} style={{ marginTop: '0.5rem' }}>
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <strong>{product.title}</strong>
                  <p>{product.description}</p>
                  <p>💰 ₦{product.price}</p>
                  <img
                    src={product.image}
                    alt="product"
                    style={{ width: '100%', maxWidth: '200px', marginTop: '0.5rem' }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{ marginRight: '1rem' }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
        }
