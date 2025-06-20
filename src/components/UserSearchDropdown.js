import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const UserSearchDropdown = ({ onSelectUser, selectedUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('Fetching users from API...');
            const response = await fetch(`${SERVER_URL}/user/fetchall`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Users API response:', result);

            if (result.success) {
                const usersData = result.users || [];
                console.log('Users fetched:', usersData.length);
                setUsers(usersData);
            } else {
                throw new Error(result.message || 'Server error');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && users.length === 0) {
            fetchUsers();
        }
    }, [isOpen]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uniId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelection = (user) => {
        console.log('User selected in dropdown:', user);
        console.log('User object details:', JSON.stringify(user, null, 2));

        // Call the parent callback
        if (onSelectUser) {
            onSelectUser(user);
        }

        // Close dropdown and clear search
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleAllUsersSelection = () => {
        console.log('All users selected in dropdown');

        // Call the parent callback with null
        if (onSelectUser) {
            onSelectUser(null);
        }

        // Close dropdown and clear search
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-between w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition text-sm min-w-[200px]"
            >
                <div className="flex items-center gap-2">
                    <Search size={16} />
                    <span className="truncate">
                        {selectedUser ? (
                            <span>
                                {selectedUser.name}
                                {selectedUser.uniId && (
                                    <span className="text-xs text-gray-500 ml-1">({selectedUser.uniId})</span>
                                )}
                            </span>
                        ) : (
                            'Search Users'
                        )}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Search by name, email, or uni ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading users...</div>
                        ) : filteredUsers.length > 0 ? (
                            <>
                                <button
                                    onClick={handleAllUsersSelection}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 text-sm border-b flex justify-between items-center ${!selectedUser ? 'bg-blue-50 font-semibold text-blue-700' : ''
                                        }`}
                                >
                                    <span>All Users</span>
                                    {!selectedUser && <Check size={14} className="text-blue-600" />}
                                </button>
                                {filteredUsers.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserSelection(user)}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition text-sm flex justify-between items-center ${selectedUser?._id === user._id ? 'bg-blue-50 font-semibold text-blue-700' : ''
                                            }`}
                                    >
                                        <div>
                                            <div className="text-gray-800 font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {user.email}
                                                {user.uniId && <span className="ml-2">• {user.uniId}</span>}
                                            </div>
                                        </div>
                                        {selectedUser?._id === user._id && (
                                            <Check size={14} className="text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </>
                        ) : searchTerm ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No users found matching "{searchTerm}"
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                {users.length === 0 ? 'No users available' : 'Start typing to search users'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSearchDropdown;