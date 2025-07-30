import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import '../css/AdminUsersPage.css'; 

const AdminUsers = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [savingProductIds, setSavingProductIds] = useState([]); // Kaydetme durumları için

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/users?query=${query}`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  // Seçilen kullanıcı değiştiğinde, eğer satıcıysa ürünleri getir
  useEffect(() => {
    if (selectedUser?.isSeller) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/users/${selectedUser._id}/products`, { headers })
        .then(res => setProducts(res.data))
        .catch(err => console.error('Ürünler alınamadı:', err));
    } else {
      setProducts([]); // Satıcı değilse ürünleri temizle
    }
  }, [selectedUser]);

  const grouped = {
    sellers: users.filter(u => u.isSeller),
    customers: users.filter(u => u.isCustomer),
  };

  const getUserRole = (user) => {
    if (user.isSeller) return 'Satıcı';
    if (user.isCustomer) return 'Müşteri';
    if (user.isAdmin) return 'Yönetici';
    return 'Tanımsız';
  };

  // Ürünlerde input değişikliklerini yönet
  const handleProductChange = (index, field, value) => {
    setProducts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Ürünü kaydet (PATCH isteği)
  const handleProductSave = async (index) => {
    const product = products[index];
    try {
      setSavingProductIds(ids => [...ids, product._id]);
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/admin/products/${product._id}`, product, { headers });
      alert('Ürün kaydedildi.');
    } catch (err) {
      console.error('Ürün kaydedilemedi:', err);
      alert('Ürün kaydedilirken hata oluştu.');
    } finally {
      setSavingProductIds(ids => ids.filter(id => id !== product._id));
    }
  };

  return (
    <>
      <AdminSidebar />
      <div style={{ width: '80%', float: 'right' }}>
        <h2>Kullanıcı Yönetimi</h2>
        <input
          type="text"
          placeholder="İsim veya e-posta ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            <section>
              <h3>Satıcılar</h3>
              {grouped.sellers.map(user => (
                <div key={user._id} onClick={() => setSelectedUser(user)} className="user-card" style={{ cursor: 'pointer' }}>
                  {user.name} ({user.email})
                </div>
              ))}
            </section>

            <section style={{ marginTop: '2rem' }}>
              <h3>Müşteriler</h3>
              {grouped.customers.map(user => (
                <div key={user._id} onClick={() => setSelectedUser(user)} className="user-card" style={{ cursor: 'pointer' }}>
                  {user.name} ({user.email})
                </div>
              ))}
            </section>
          </>
        )}

        {selectedUser && (
          <div className="modal">
            <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <h3>{selectedUser.name}</h3>
              <p>E-posta: {selectedUser.email}</p>
              <p>Rol: {getUserRole(selectedUser)}</p>

              {selectedUser.isSeller && (
                <>
                  <h4>Ürünleri</h4>
                  {products.length === 0 && <p>Bu satıcının ürünü yok.</p>}
                  {products.map((product, i) => (
                    <div key={product._id} className="product-edit-card" style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '1rem' }}>
                      <label>İsim: </label>
                      <input
                        value={product.name}
                        onChange={e => handleProductChange(i, 'name', e.target.value)}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      />

                      <label>Slug: </label>
                      <input
                        value={product.slug}
                        onChange={e => handleProductChange(i, 'slug', e.target.value)}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      />

                      <label>Fiyat: </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={e => handleProductChange(i, 'price', parseFloat(e.target.value))}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      />

                      <label>Para Birimi: </label>
                      <select
                        value={product.priceCurrency}
                        onChange={e => handleProductChange(i, 'priceCurrency', e.target.value)}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      >
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>

                      <label>Stok: </label>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={e => handleProductChange(i, 'stock', parseInt(e.target.value))}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      />

                      <label>Stok Birimi: </label>
                      <select
                        value={product.stockUnit}
                        onChange={e => handleProductChange(i, 'stockUnit', e.target.value)}
                        style={{ width: '100%', marginBottom: '0.3rem' }}
                      >
                        <option value="adet">adet</option>
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>

                      <button
                        onClick={() => handleProductSave(i)}
                        disabled={savingProductIds.includes(product._id)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        {savingProductIds.includes(product._id) ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                    </div>
                  ))}
                </>
              )}

              <button onClick={() => setSelectedUser(null)} style={{ marginTop: '1rem' }}>Kapat</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
