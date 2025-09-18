import { useEffect, useState } from "react";
import axios from "axios";
import '../assets/home.css';

function Home() {
    const apiUrl = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Add/Edit form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    minStock: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${apiUrl}/products`, {
          withCredentials: true,
        });
        const userRes = await axios.get(`${apiUrl}/me`, {
          withCredentials: true,
        });

        setProducts(productRes.data.data || []);
        setUser(userRes.data.data || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Add/Edit form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${apiUrl}/products/${editingId}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${apiUrl}/products`, formData, {
          withCredentials: true,
        });
      }

      // Refresh products
      const res = await axios.get(`${apiUrl}/products`, {
        withCredentials: true,
      });
      setProducts(res.data.data || []);

      // Reset form
      setFormData({ name: "", description: "", price: "", quantity: "", minStock: "" });
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${apiUrl}/products/${id}`, {
        withCredentials: true,
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  // Handle Edit click
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      minStock: product.minStock,  
    });
    setIsEditing(true);
    setEditingId(product._id);
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Products</h1>
        {user && (
          <div className="user-info">
            <span className="user-role">{user.role}</span>
          </div>
        )}
      </div>

      {/* Admin: Add/Edit form */}
      {user?.role === "admin" && (
        <form onSubmit={handleSubmit} className="product-form">
          <h2 className="form-title">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
          <textarea
            placeholder="Product Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input form-textarea"
            required
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="form-input"
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="form-input"
            required
            min="0"
          />
          <input
            type="number"
            placeholder="Minimum Stock Level"
            value={formData.minStock}
            onChange={(e) =>
              setFormData({ ...formData, minStock: e.target.value })
            }
            className="form-input"
            required
            min="0"
          />

          <div>
            <button type="submit" className="form-button submit-button">
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: "", description: "", price: "", quantity: "", minStock: "" });
                }}
                className="form-button cancel-button"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Product list */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-content">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price}</p>
              <div className="product-stock">
                <span className="stock-info">Quantity: {product.quantity}</span>
                <span className={`stock-info ${product.quantity <= product.minStock ? 'low-stock' : ''}`}>
                  Min Stock: {product.minStock}
                </span>
              </div>
            </div>

            {/* If admin, show edit/delete options */}
            {user?.role === "admin" && (
              <div className="product-actions">
                <button
                  onClick={() => handleEdit(product)}
                  className="action-button edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="action-button delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;