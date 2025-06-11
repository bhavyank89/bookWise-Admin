import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = ({ setIsLogin, setActiveUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // If your backend uses cookies (for JWT etc.)
                body: JSON.stringify({
                    email,
                    password,
                    role: "Admin", // 👈 include the role
                }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Invalid credentials");
            }

            const user = await fetch(`http://localhost:4000/fetchuser`, {
                method: 'POST',
                headers: {
                    'auth-token': data.token,
                }
            })

            const userJson = await user.json();
            console.log(userJson);

            localStorage.setItem("adminToken", data.token);
            toast.success("Login successful!");
            setIsLogin(true);
            setActiveUser(userJson);
            navigate("/");
        } catch (err) {
            toast.error(err.message || "Login failed");
        } finally {
            console.log("finnally navigated")
            setIsLoading(false);
        }
    };


    const LoadingSkeleton = () => (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
            <div className="space-y-4">
                <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-400 rounded-lg animate-pulse"></div>
            </div>
            <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-sm">
                    {showSkeleton ? (
                        <LoadingSkeleton />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-3xl text-[#25388C] font-bold flex items-center gap-2">
                                        <BookOpen size={28} /> BookWise
                                    </h1>
                                </div>
                            </motion.div>

                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25388C] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                        placeholder="admin@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25388C] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                                            placeholder="••••••••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Logging In...</span>
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </motion.button>
                            </motion.form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="text-center"
                            >
                                <span className="text-gray-600">New Sailor? </span>
                                <p onClick={() => navigate('/signup')} className="text-[#25388C] font-medium hover:underline cursor-pointer">
                                    Register
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 to-orange-50">
                <DotLottieReact
                    src="https://lottie.host/984808ba-7157-450f-9a91-a850275bba45/8X1CbsSr31.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default LoginPage;
