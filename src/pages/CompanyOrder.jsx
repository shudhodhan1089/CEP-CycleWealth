import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SharedNavbar from "../components/SharedNavbar";
import Footer from "../components/Footer";
import "./CompanyOrder.css";

function CompanyOrder() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orderItems, setOrderItems] = useState([
        { id: 1, material: '', quantity: '', unit: 'kg', grade: '', preferredPrice: '' }
    ]);
    const [deliveryDetails, setDeliveryDetails] = useState({
        address: '',
        city: '',
        pincode: '',
        preferredDate: '',
        contactName: '',
        contactPhone: ''
    });

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            try {
                setUser(JSON.parse(sessionUser));
            } catch (e) {
                console.error('Error parsing user from session:', e);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
        
        // Check if enterprise registration is complete
        const enterpriseRegistered = sessionStorage.getItem('enterpriseRegistered');
        if (enterpriseRegistered !== 'true') {
            alert('Please complete enterprise registration first!');
            navigate('/enterprise');
        }
    }, [navigate]);

    const handleAddItem = () => {
        setOrderItems([
            ...orderItems,
            { id: orderItems.length + 1, material: '', quantity: '', unit: 'kg', grade: '', preferredPrice: '' }
        ]);
    };

    const handleRemoveItem = (id) => {
        if (orderItems.length > 1) {
            setOrderItems(orderItems.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id, field, value) => {
        setOrderItems(orderItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDeliveryChange = (e) => {
        setDeliveryDetails({
            ...deliveryDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order submitted:', { orderItems, deliveryDetails });
        alert('Your scrap order has been submitted! Dealers will contact you shortly.');
        
        // Reset form
        setOrderItems([{ id: 1, material: '', quantity: '', unit: 'kg', grade: '', preferredPrice: '' }]);
        setDeliveryDetails({
            address: '',
            city: '',
            pincode: '',
            preferredDate: '',
            contactName: '',
            contactPhone: ''
        });
    };

    return (
        <>
            <SharedNavbar user={user} activeLink="companyorder" />
            
            {/* Hero Section */}
            <div className="company-order-hero">
                <div className="company-order-hero-content">
                    <h1>Place Your Scrap Order</h1>
                    <p>Order quality scrap materials from verified dealers at competitive prices</p>
                </div>
            </div>

            {/* Order Form Section */}
            <div className="company-order-section">
                <div className="order-container">
                    <h2>Create New Order</h2>
                    <p className="order-subtitle">Fill in the details for your scrap material requirements</p>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Order Items */}
                        <div className="order-items-section">
                            <h3>Scrap Materials Required</h3>
                            
                            {orderItems.map((item, index) => (
                                <div key={item.id} className="order-item-card">
                                    <div className="item-header">
                                        <span className="item-number">Item #{index + 1}</span>
                                        {orderItems.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="remove-item-btn"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="item-row">
                                        <div className="form-group">
                                            <label>Material Type*</label>
                                            <select 
                                                value={item.material} 
                                                onChange={(e) => handleItemChange(item.id, 'material', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Material</option>
                                                <option value="metal-ferrous">Metal - Ferrous (Iron, Steel)</option>
                                                <option value="metal-nonferrous">Metal - Non-Ferrous (Aluminum, Copper, Brass)</option>
                                                <option value="plastic">Plastic (All Types)</option>
                                                <option value="paper">Paper & Cardboard</option>
                                                <option value="glass">Glass</option>
                                                <option value="ewaste">E-Waste (Electronics)</option>
                                                <option value="rubber">Rubber & Tires</option>
                                                <option value="wood">Wood & Timber</option>
                                                <option value="textile">Textile & Fabric</option>
                                                <option value="battery">Batteries</option>
                                                <option value="cable">Cables & Wires</option>
                                                <option value="mixed">Mixed Scrap</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group quantity-group">
                                            <label>Quantity*</label>
                                            <div className="quantity-input">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                    placeholder="Amount"
                                                    required
                                                />
                                                <select 
                                                    value={item.unit}
                                                    onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="tons">tons</option>
                                                    <option value="pieces">pieces</option>
                                                    <option value="bales">bales</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="item-row">
                                        <div className="form-group">
                                            <label>Quality Grade</label>
                                            <select 
                                                value={item.grade} 
                                                onChange={(e) => handleItemChange(item.id, 'grade', e.target.value)}
                                            >
                                                <option value="">Select Grade (Optional)</option>
                                                <option value="premium">Premium Grade</option>
                                                <option value="standard">Standard Grade</option>
                                                <option value="mixed">Mixed Grade</option>
                                                <option value="any">Any Grade Acceptable</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Preferred Price (₹/{item.unit})</label>
                                            <input
                                                type="number"
                                                value={item.preferredPrice}
                                                onChange={(e) => handleItemChange(item.id, 'preferredPrice', e.target.value)}
                                                placeholder="Enter price per unit"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <button type="button" className="add-item-btn" onClick={handleAddItem}>
                                + Add Another Item
                            </button>
                        </div>

                        {/* Delivery Details */}
                        <div className="delivery-section">
                            <h3>Delivery Details</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Delivery Address*</label>
                                    <textarea
                                        name="address"
                                        value={deliveryDetails.address}
                                        onChange={handleDeliveryChange}
                                        placeholder="Enter full delivery address"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={deliveryDetails.city}
                                        onChange={handleDeliveryChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>PIN Code*</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={deliveryDetails.pincode}
                                        onChange={handleDeliveryChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preferred Delivery Date*</label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={deliveryDetails.preferredDate}
                                        onChange={handleDeliveryChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person Name*</label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={deliveryDetails.contactName}
                                        onChange={handleDeliveryChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Phone*</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={deliveryDetails.contactPhone}
                                        onChange={handleDeliveryChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    {/* Empty placeholder */}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="order-submit-section">
                            <button type="submit" className="submit-order-btn">
                                Submit Order Request
                            </button>
                            <p className="submit-note">
                                By submitting, you agree to our terms. Verified dealers will contact you with quotes.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Quick Info Section */}
            <div className="quick-info-section">
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon">🚚</div>
                        <h3>Fast Delivery</h3>
                        <p>Get scrap materials delivered to your facility within 3-5 business days</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">💯</div>
                        <h3>Quality Assured</h3>
                        <p>All materials are inspected and graded before delivery</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">💰</div>
                        <h3>Best Prices</h3>
                        <p>Competitive pricing with bulk order discounts available</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">📞</div>
                        <h3>24/7 Support</h3>
                        <p>Our team is available round the clock for assistance</p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default CompanyOrder;
