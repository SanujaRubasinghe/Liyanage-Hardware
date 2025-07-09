import { useState, useEffect } from 'react';
import API from '../api';
import styles from './UserProfile.module.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate()

  // Check if user is a loyalty member (mock logic)
  const isLoyaltyMember = user?.membershipLevel === 'gold';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userResponse = await API.get('auth/profile', { withCredentials: true });
        setUser(userResponse.data);
        setFormData({
          name: userResponse.data.username,
          email: userResponse.data.email,
          phone: userResponse.data.phone || '',
          address: userResponse.data.address || ''
        });

        // Fetch orders
        const ordersResponse = await API.get('/user/orders', { withCredentials: true });
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/api/user/profile', formData, { withCredentials: true });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await API.put('/api/user/password', passwordData, { withCredentials: true });
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout', {}, {
            withCredentials: true
            });
            // Clear local state
            setUser(null);
            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase()}
        </div>
        <h1>{user?.name}</h1>
        <p className={styles.email}>{user?.email}</p>
        {isLoyaltyMember ? (
            <div className={styles.loyaltyBadge}>
            <span className={styles.loyaltyIcon}>★</span> Gold Member
            </div>
        ) : (
            <a href="/loyalty" className={styles.joinLoyalty}>Become a Loyalty Customer</a>
        )}
        {/* Add Logout Button Here */}
        <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
        >
            Log Out
        </button>
        </div>

      <div className={styles.profileTabs}>
        <button
          className={activeTab === 'profile' ? styles.active : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'orders' ? styles.active : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'security' ? styles.active : ''}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            {!isEditing ? (
              <>
                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{user?.username}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user?.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Address:</span>
                    <span className={styles.value}>{user?.address || 'Not provided'}</span>
                  </div>
                  {isLoyaltyMember && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Loyalty Points:</span>
                      <span className={styles.value}>{user?.loyaltyPoints || 0}</span>
                    </div>
                  )}
                </div>
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
              </>
            ) : (
              <form className={styles.editForm} onSubmit={handleUpdateProfile}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
            <div className={styles.ordersSection}>
                {orders.length === 0 ? (
                <p className={styles.noOrders}>You haven't placed any orders yet.</p>
                ) : (
                <div className={styles.ordersList}>
                    {orders.map(order => (
                    <div key={order.order_id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                        <div className={styles.orderMeta}>
                            <span className={styles.orderId}>Order #{order.order_id}</span>
                            <span className={styles.orderDate}>{formatDate(order.order_date)}</span>
                        </div>
                        <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                        </span>
                        </div>

                        <div className={styles.orderSummary}>
                        <div className={styles.customerInfo}>
                            <p><strong>Customer:</strong> {order.first_name} {order.last_name}</p>
                            <p><strong>Contact:</strong> {order.phone} | {order.email}</p>
                        </div>
                        
                        <div className={styles.orderItems}>
                            {order.items.slice(0, 2).map(item => (
                            <div key={item.order_item_id} className={styles.orderItem}>
                                <img 
                                src={`${process.env.REACT_APP_API_BASE_URL}/${item.image_url}`} 
                                alt={item.product_name} 
                                className={styles.itemImage} 
                                />
                                <div className={styles.itemDetails}>
                                <span className={styles.itemName}>{item.product_name}</span>
                                <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                                <span className={styles.itemPrice}>Rs.{Number(item.unit_price).toFixed(2)}</span>
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className={styles.orderTotals}>
                            <div className={styles.totalRow}>
                            <span>Subtotal:</span>
                            <span>Rs.{order.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toFixed(2)}</span>
                            </div>
                            <div className={styles.totalRow}>
                            <span>Shipping:</span>
                            <span>Rs.{Number(order.shipping_cost).toFixed(2)}</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>Total:</span>
                            <span>Rs.{Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                        </div>

                        {/* Expanded details (initially hidden) */}
                        {order.showDetails && (
                        <div className={styles.orderDetails}>
                            <div className={styles.detailsSection}>
                            <h4>Shipping Address</h4>
                            <p>{order.shipping_address}</p>
                            </div>

                            <div className={styles.detailsSection}>
                            <h4>Billing Address</h4>
                            <p>{order.billing_address}</p>
                            </div>

                            <div className={styles.detailsSection}>
                            <h4>Payment Method</h4>
                            <p>{order.payment_method === 'payhere' ? 'PayHere' : order.payment_method}</p>
                            <p>Status: {order.payment_status}</p>
                            </div>

                            <div className={styles.allItems}>
                            <h4>All Items ({order.items.length})</h4>
                            {order.items.map(item => (
                                <div key={item.order_item_id} className={styles.detailItem}>
                                <img 
                                    src={`${process.env.REACT_APP_API_BASE_URL}/${item.image_url}`} 
                                    alt={item.product_name} 
                                    className={styles.itemImage} 
                                />
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.product_name}</span>
                                    <div className={styles.itemMeta}>
                                    <span>Qty: {item.quantity}</span>
                                    <span>Rs.{Number(item.unit_price).toFixed(2)} each</span>
                                    <span>Rs.{(item.unit_price * item.quantity).toFixed(2)} total</span>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}

                        <div className={styles.orderActions}>
                        <button 
                            className={styles.viewOrderBtn}
                            onClick={() => {
                            const updatedOrders = orders.map(o => 
                                o.order_id === order.order_id 
                                ? {...o, showDetails: !o.showDetails} 
                                : o
                            );
                            setOrders(updatedOrders);
                            }}
                        >
                            {order.showDetails ? 'Hide Details' : 'View Order Details'}
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            )}

        {activeTab === 'security' && (
          <div className={styles.securitySection}>
              <button className={styles.changePasswordBtn} onClick={() => {
                navigate('/reset-password-link')
              }}>
                Change Password
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;