import React, { useState, useEffect } from 'react';
import axios from 'axios'; // We'll use axios directly here for simplicity

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', state: '', city: '', zipcode: '',
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('userToken'));
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/users/profile', config);
                setFormData(res.data.data);
            } catch (err) {
                setError('Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');
        try {
            const token = JSON.parse(localStorage.getItem('userToken'));
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put('http://localhost:5000/api/users/profile', formData, config);
            setSuccess(res.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Profile...</div>;
    if (error && !loading) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={onChange} />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={onChange} />
                    </div>
                    <InputField label="Email Address" name="email" value={formData.email} onChange={onChange} disabled />
                    <InputField label="Phone Number" name="phone" value={formData.phone} onChange={onChange} />
                    <InputField label="Address" name="address" value={formData.address} onChange={onChange} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="City" name="city" value={formData.city} onChange={onChange} />
                        <InputField label="State" name="state" value={formData.state} onChange={onChange} />
                        <InputField label="Zipcode" name="zipcode" value={formData.zipcode} onChange={onChange} />
                    </div>

                    {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-center">{success}</div>}
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}

                    <button type="submit" disabled={updating} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Reusable Input Field Helper
const InputField = ({ label, name, value, onChange, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
    </div>
);

export default ProfilePage;