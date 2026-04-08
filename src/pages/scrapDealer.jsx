import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './scrapDealer.css';
import supabaseClient from '../supabase-config';

function ScrapDealer() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        totalCollected: 0,
        sentToRecycling: 0,
        remaining: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Get logged in user from sessionStorage
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(sessionUser);
        
        // Verify user is a scrap dealer
        if (user.role !== 'ScrapDealer') {
            navigate('/dashboard');
            return;
        }

        fetchDealerData(user.user_id);
    }, [navigate]);

    const fetchDealerData = async (userId) => {
        try {
            setLoading(true);

            const { data: profileData, error: profileError } = await supabaseClient
                .from('users')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (profileError) throw profileError;

            setProfile({
                businessName: profileData["First name"] + " " + profileData["Last_Name"] + " Scrap Collection",
                ownerName: profileData["First name"] + " " + profileData["Last_Name"],
                firstName: profileData["First name"],
                lastName: profileData["Last_Name"],
                email: profileData.email_address,
                role: profileData.role,
                latitude: profileData.latitude,
                longitude: profileData.longitude,
                joinedDate: new Date(profileData.created_at).toLocaleDateString()
            });

            const { data: transactionsData, error: transactionsError } = await supabaseClient
                .from('transactions')
                .select('*')
                .eq('dealer_id', userId)
                .order('created_at', { ascending: false });

            if (transactionsError && transactionsError.code !== 'PGRST116') {
                console.log('Transactions table not found, using calculated stats');
            }

            if (transactionsData) {
                setTransactions(transactionsData);
                calculateStats(transactionsData);
            } else {
                // Fallback: Calculate stats from mock transactions or set to 0
                setStats({
                    totalCollected: 0,
                    sentToRecycling: 0,
                    remaining: 0
                });
            }

        } catch (error) {
            setError("Failed to load dealer data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (transactionsData) => {
        const totalCollected = transactionsData.reduce((sum, t) => sum + (t.weight_kg || 0), 0);
        const sentToRecycling = transactionsData
            .filter(t => t.status === 'sent_to_recycling')
            .reduce((sum, t) => sum + (t.weight_kg || 0), 0);
        const remaining = totalCollected - sentToRecycling;

        setStats({
            totalCollected,
            sentToRecycling,
            remaining
        });
    };

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="scrap-dealer-page">
                <div className="scrap-dealer-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="scrap-dealer-page">
                <div className="scrap-dealer-main" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button onClick={() => navigate('/login')} className="login">Go to Login</button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="scrap-dealer-page">
                <div className="scrap-dealer-main" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>No profile data found. Please log in again.</p>
                    <button onClick={() => navigate('/login')} className="login">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="scrap-dealer-page">
            {/* Navigation Bar */}
            <div className="navbar">
                <h2 className="logo">♻️ CycleWealth</h2>
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="#">Transactions</a>
                    <a href="#">Connections</a>
                </div>
                <div className="auth-buttons">
                    <button className="login">View Profile</button>
                    <button className="sign-up" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="scrap-dealer-main">
                {/* Profile Section */}
                <div className="dealer-profile-card">
                    <div className="dealer-header">
                        <div className="dealer-avatar">
                            {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                        </div>
                        <div className="dealer-title">
                            <h2>{profile.businessName}</h2>
                            <p>{profile.role}</p>
                        </div>
                    </div>

                    <div className="dealer-info-grid">
                        <div className="profile-info-item">
                            <span>First Name</span>
                            <p>{profile.firstName}</p>
                        </div>

                        <div className="profile-info-item">
                            <span>Last Name</span>
                            <p>{profile.lastName}</p>
                        </div>

                        <div className="profile-info-item">
                            <span>Email</span>
                            <p>{profile.email}</p>
                        </div>

                        <div className="profile-info-item">
                            <span>Role</span>
                            <p>{profile.role}</p>
                        </div>


                        <div className="profile-info-item">
                            <span>Member Since</span>
                            <p>{profile.joinedDate}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="dealer-stats-section">
                    <h2>📊 Scrap Collection Statistics</h2>

                    <div className="stats-grid">
                        {/* Total Collected */}
                        <div className="stat-card collected">
                            <div className="stat-value">{stats.totalCollected.toLocaleString()}</div>
                            <div className="stat-label">kg Total Collected</div>
                        </div>

                        {/* Sent to Recycling */}
                        <div className="stat-card recycling">
                            <div className="stat-value">{stats.sentToRecycling.toLocaleString()}</div>
                            <div className="stat-label">kg Sent to Recycling</div>
                        </div>

                        {/* Remaining */}
                        <div className="stat-card remaining">
                            <div className="stat-value">{stats.remaining.toLocaleString()}</div>
                            <div className="stat-label">kg Remaining</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <p className="progress-label">
                            Recycling Progress: {stats.totalCollected > 0 
                                ? Math.round((stats.sentToRecycling / stats.totalCollected) * 100) 
                                : 0}%
                        </p>
                        <div className="progress-bar-bg">
                            <div 
                                className="progress-bar-fill"
                                style={{ width: `${stats.totalCollected > 0 
                                    ? (stats.sentToRecycling / stats.totalCollected) * 100 
                                    : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    {transactions.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ color: 'green', marginBottom: '15px' }}>Recent Transactions</h3>
                            <div style={{ 
                                maxHeight: '200px', 
                                overflowY: 'auto',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px'
                            }}>
                                {transactions.slice(0, 5).map((transaction, index) => (
                                    <div key={index} style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #e0e0e0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>{transaction.material_type || 'Unknown Material'}</span>
                                        <span style={{ 
                                            fontWeight: 'bold',
                                            color: transaction.status === 'sent_to_recycling' ? '#2196F3' : '#FF9800'
                                        }}>
                                            {transaction.weight_kg} kg
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ScrapDealer;