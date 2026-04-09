import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SharedNavbar from "../components/SharedNavbar";
import Footer from "../components/Footer";
import "./Enterprise.css";

function Enterprise() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        companySize: '',
        industryType: '',
        budgetRange: ''
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
            // Redirect to login if not authenticated
            navigate('/login');
        }
        
        // Check if user has already registered as enterprise
        const enterpriseRegistered = sessionStorage.getItem('enterpriseRegistered');
        if (enterpriseRegistered === 'true') {
            setIsRegistered(true);
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Enterprise form submitted:', formData);
        
        // Set registration flag
        sessionStorage.setItem('enterpriseRegistered', 'true');
        setIsRegistered(true);
        
        alert('Registration successful! You can now place scrap orders.');
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            companySize: '',
            industryType: '',
            budgetRange: ''
        });
    };

    return (
        <>
            <SharedNavbar user={user} activeLink="enterprise" />
            
            {/* Hero Section */}
            <div className="enterprise-hero">
                <div className="enterprise-hero-content">
                    <h1>Enterprise Scrap Solutions</h1>
                    <p>Connect with verified scrap dealers for sustainable business growth</p>
                    <div className="enterprise-hero-buttons">
                        {isRegistered ? (
                            <button className="primary" onClick={() => navigate('/companyorder')}>Place Order</button>
                        ) : (
                            <button className="primary" onClick={() => document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' })}>
                                Register Now
                            </button>
                        )}
                        <button className="secondary">Learn More</button>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="enterprise-benefits">
                <h2>Why Partner with Our Scrap Dealers?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">💰</div>
                        <h3>Cost-Effective Sourcing</h3>
                        <p>Get competitive pricing on bulk scrap materials, reducing your operational costs by up to 40%</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🤝</div>
                        <h3>Verified Partners</h3>
                        <p>All our dealers are background-checked and verified for quality and reliability</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">🌍</div>
                        <h3>Sustainable Impact</h3>
                        <p>Contribute to circular economy while meeting your ESG goals</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">📊</div>
                        <h3>Analytics Dashboard</h3>
                        <p>Track your scrap procurement, savings, and environmental impact in real-time</p>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="enterprise-process">
                <h2>Simple 4-Step Process</h2>
                <div className="process-steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Register Your Business</h3>
                        <p>Create your enterprise account and verify your business details</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Post Requirements</h3>
                        <p>Specify your scrap material needs, quantity, and budget</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Connect with Dealers</h3>
                        <p>Get matched with verified dealers in your area</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h3>Finalize Deals</h3>
                        <p>Negotiate terms and complete transactions securely</p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="enterprise-stats">
                <div className="stats-container">
                    <div className="stat">
                        <h3>500+</h3>
                        <p>Verified Dealers</p>
                    </div>
                    <div className="stat">
                        <h3>50,000+</h3>
                        <p>Tons of Scrap Processed</p>
                    </div>
                    <div className="stat">
                        <h3>200+</h3>
                        <p>Enterprise Partners</p>
                    </div>
                    <div className="stat">
                        <h3>₹10Cr+</h3>
                        <p>Monthly Transactions</p>
                    </div>
                </div>
            </div>

            {/* CTA Form Section */}
            <div id="registration-form" className="enterprise-cta">
                {!isRegistered ? (
                    <>
                        <h2>Start Your Sustainable Journey</h2>
                        <p>Fill in your details and our enterprise team will reach out within 24 hours</p>
                        
                        <form className="enterprise-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company Name*</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person*</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email Address*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number*</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company Size*</label>
                                    <select name="companySize" value={formData.companySize} onChange={handleInputChange} required>
                                        <option value="">Select Size</option>
                                        <option value="startup">Startup (1-50 employees)</option>
                                        <option value="small">Small (51-200 employees)</option>
                                        <option value="medium">Medium (201-1000 employees)</option>
                                        <option value="large">Large (1000+ employees)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Industry Type*</label>
                                    <select name="industryType" value={formData.industryType} onChange={handleInputChange} required>
                                        <option value="">Select Industry</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="construction">Construction</option>
                                        <option value="automotive">Automotive</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="textile">Textile</option>
                                        <option value="packaging">Packaging</option>
                                        <option value="renewable-energy">Renewable Energy</option>
                                        <option value="waste-management">Waste Management</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Budget Range (Monthly)*</label>
                                    <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} required>
                                        <option value="">Select Budget</option>
                                        <option value="50k-1lakh">₹50,000 - ₹1,00,000</option>
                                        <option value="1lakh-5lakh">₹1,00,000 - ₹5,00,000</option>
                                        <option value="5lakh-10lakh">₹5,00,000 - ₹10,00,000</option>
                                        <option value="10lakh+">₹10,00,000+</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    {/* Empty placeholder for alignment */}
                                </div>
                            </div>
                            
                            <button type="submit" className="submit-btn">Submit Request</button>
                        </form>
                    </>
                ) : (
                    <div className="registration-success">
                        <div className="success-icon">✓</div>
                        <h2>Registration Complete!</h2>
                        <p>You are now a registered enterprise partner. Start ordering scrap materials from verified dealers.</p>
                        <button className="go-to-order-btn" onClick={() => navigate('/companyorder')}>
                            Place Your First Order
                        </button>
                    </div>
                )}
            </div>

            {/* Testimonials */}
            <div className="enterprise-testimonials">
                <h2>What Our Partners Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial">
                        <p>"CycleWealth helped us reduce our raw material costs by 35% while meeting our sustainability goals. The dealer network is reliable and professional."</p>
                        <div className="testimonial-author">
                            <h4>Rahul Sharma</h4>
                            <p>CEO, GreenTech Manufacturing</p>
                        </div>
                    </div>
                    <div className="testimonial">
                        <p>"The platform is intuitive and the support team is amazing. We found quality scrap suppliers within days of signing up."</p>
                        <div className="testimonial-author">
                            <h4>Priya Patel</h4>
                            <p>Operations Head, EcoCraft Industries</p>
                        </div>
                    </div>
                    <div className="testimonial">
                        <p>"As a startup, cost efficiency was crucial. CycleWealth connected us with dealers who offered great prices and consistent supply."</p>
                        <div className="testimonial-author">
                            <h4>Amit Kumar</h4>
                            <p>Founder, ReNew Solutions</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Enterprise;
