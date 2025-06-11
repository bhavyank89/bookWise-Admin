import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, BookOpen, Upload, X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (formData.confirmPassword) {
            setPasswordMatch(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) return toast.error("Passwords do not match");

        const { name, email, password } = formData;

        if (!name || !email || !password) {
            return toast.error("Please fill all fields");
        }

        try {
            setIsLoading(true);
            const form = new FormData();
            form.append('name', name);
            form.append('email', email);
            form.append('password', password);
            form.append('role', "Admin");
            if (avatar) form.append('avatar', avatar);

            console.log("form : ",form);

            const res = await fetch(`http://localhost:4000/auth/createUser`, {
                method: 'POST',
                body: form
            });

            const data = await res.json();

            console.log("data : ",data);

            if (res.ok) {
                toast.success("Account created successfully");
                navigate('/login');
            } else {
                toast.error(data?.message || "Signup failed");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const LoadingSkeleton = () => (
        <motion.div className="w-full max-w-md mx-auto space-y-6" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
            ))}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {showSkeleton ? (
                        <LoadingSkeleton />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <h1 className="text-3xl text-[#25388C] font-bold flex items-center gap-2">
                                    <BookOpen size={28} /> BookWise
                                </h1>
                                <p className="text-gray-600">Create your Admin account</p>
                            </div>

                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {/* Avatar Selection */}
                                <div className="flex flex-col items-center space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 text-center">AVATAR</label>
                                    <div className="relative">
                                        {avatarPreview ? (
                                            <div className="relative">
                                                <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#25388C] hover:bg-blue-50"
                                            >
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">Upload</span>
                                            </div>
                                        )}
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    </div>
                                </div>

                                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    placeholder="Full Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25388C]" required />

                                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25388C]" required />

                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                                        placeholder="Password" className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25388C]" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#25388C] ${!passwordMatch && formData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                        required />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {!passwordMatch && formData.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !passwordMatch}
                                    className="w-full bg-[#25388C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1f2f6d] disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creating Account...</span>
                                        </div>
                                    ) : (
                                        'Create Admin Account'
                                    )}
                                </motion.button>
                            </motion.form>

                            <div className="text-center">
                                <span className="text-gray-600">Already have an account? </span>
                                <p onClick={() => navigate('/login')} className="text-[#25388C] font-medium hover:underline cursor-pointer">
                                    Login
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 to-orange-50">
                <DotLottieReact
                    src="https://lottie.host/984808ba-7157-450f-9a91-a850275bba45/8X1CbsSr31.lottie"
                    loop autoplay
                />
            </div>
        </div>
    );
};

export default AdminSignup;
