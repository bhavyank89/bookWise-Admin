import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App({ activeUser, setActiveUser, setIsLogin }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                console.warn("No admin token found");
                setLoading(false);
                navigate("/login");
                return;
            }

            const res = await fetch(`${SERVER_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });

            const json = await res.json();

            if (res.ok && json) {
                const userData = json.user || json;
                setActiveUser(userData);
                setIsLogin(true);
                navigate("/");
            } else {
                console.error("Failed to fetch user:", json?.error);
                // Clear invalid token
                localStorage.removeItem("adminToken");
                setActiveUser(null);
                setIsLogin(false);
                navigate("/login");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setActiveUser(null);
            setIsLogin(false);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If user is already authenticated, redirect to dashboard
        if (activeUser) {
            navigate("/");
            setLoading(false);
            return;
        }

        // Check for token and fetch user data
        const token = localStorage.getItem("adminToken");
        if (token) {
            fetchUser();
        } else {
            navigate("/login");
            setLoading(false);
        }
    }, [activeUser, navigate]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#F8F8FF'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div>Redirecting...</div>
        </div>
    );
}

export default App;