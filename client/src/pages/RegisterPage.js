import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import locationService from '../services/locationService'; // Import the new service

// --- Reusable and Fixed FormInput Component ---
// This standalone component fixes the "one character" input bug and adds validation display.
const FormInput = ({ name, label, value, onChange, error, type = "text", ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-blue-700">{label}</label>
        <div className="mt-1 relative">
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
            />
            {props.toggleVisibility && (
                <button type="button" onClick={props.toggleVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center">
                    {/* Simplified Eye Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
            )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


const RegisterPage = () => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        password: '', confirmPassword: '',
        address: '', state: '', city: '', zipcode: '',
    });
    const [errors, setErrors] = useState({});
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Location states
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [locationLoading, setLocationLoading] = useState({ states: false, cities: false });

    // UI states
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- Data Fetching Effects ---
    useEffect(() => {
        const fetchStates = async () => {
            setLocationLoading(prev => ({ ...prev, states: true }));
            try {
                const fetchedStates = await locationService.getStates();
                setStates(fetchedStates);
            } catch (error) {
                console.error("Failed to fetch states", error);
                setErrors(prev => ({...prev, state: "Could not load states."}));
            } finally {
                setLocationLoading(prev => ({ ...prev, states: false }));
            }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        if (formData.state) {
            const fetchCities = async () => {
                setLocationLoading(prev => ({ ...prev, cities: true }));
                setCities([]); // Clear previous cities
                setFormData(prev => ({ ...prev, city: '' })); // Reset city selection
                try {
                    const fetchedCities = await locationService.getCities(formData.state);
                    setCities(fetchedCities);
                } catch (error) {
                    console.error("Failed to fetch cities", error);
                    setErrors(prev => ({...prev, city: "Could not load cities."}));
                } finally {
                    setLocationLoading(prev => ({ ...prev, cities: false }));
                }
            };
            fetchCities();
        }
    }, [formData.state]);


    // --- Validation Logic ---
    const validateField = (name, value) => {
        let errorMsg = '';
        if (!value) {
            errorMsg = "This field is required.";
        } else {
            switch(name) {
                case 'email':
                    if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Email is not valid.";
                    break;
                case 'password':
                    if (value.length < 8) errorMsg = "Password must be at least 8 characters.";
                    break;
                case 'confirmPassword':
                    if (value !== formData.password) errorMsg = "Passwords do not match.";
                    break;
                case 'phone':
                    if (!/^\d{10,11}$/.test(value)) errorMsg = "Phone number must be 10 or 11 digits.";
                    break;
                default:
                    break;
            }
        }
        return errorMsg;
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        for (const key in formData) {
            const error = validateField(key, formData[key]);
            if(error) {
                newErrors[key] = error;
                isValid = false;
            }
        }
        if (!agreeTerms) {
            newErrors.terms = "You must agree to the terms.";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // --- Form Submission ---
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const { confirmPassword, ...userData } = formData;
            await authService.register(userData);
            alert('Registration successful! Please proceed to login.');
            navigate('/login');
        } catch (err) {
            setErrors(prev => ({ ...prev, form: err.msg || 'Registration failed.' }));
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <h2 className="text-3xl font-extrabold text-blue-900">Sign up</h2>
                <p className="mt-2 text-sm text-gray-600">No Account? Register to control your order.</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <FormInput name="firstName" label="First name" placeholder="first name" value={formData.firstName} onChange={onChange} error={errors.firstName} required />
                            <FormInput name="lastName" label="Last name" placeholder="last name" value={formData.lastName} onChange={onChange} error={errors.lastName} required />
                            <FormInput name="email" label="Email address" type="email" placeholder="you@example.com" value={formData.email} onChange={onChange} error={errors.email} required />
                            <FormInput name="phone" label="Phone number" type="tel" placeholder="1234567890" value={formData.phone} onChange={onChange} error={errors.phone} required />
                            <FormInput name="password" label="Password" type={passwordVisible ? "text" : "password"} placeholder="Minimum 8 characters" value={formData.password} onChange={onChange} error={errors.password} required toggleVisibility={() => setPasswordVisible(!passwordVisible)} />
                            <FormInput name="confirmPassword" label="Confirm password" type={confirmPasswordVisible ? "text" : "password"} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={onChange} error={errors.confirmPassword} required toggleVisibility={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />
                            <FormInput name="address" label="Address" placeholder="address" value={formData.address} onChange={onChange} error={errors.address} required />

                            <div>
                                <label className="block text-sm font-medium text-blue-700">State</label>
                                <select name="state" value={formData.state} onChange={onChange} required disabled={locationLoading.states} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">{locationLoading.states ? 'Loading States...' : 'Select a state'}</option>
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700">City</label>
                                <select name="city" value={formData.city} onChange={onChange} required disabled={!formData.state || locationLoading.cities} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">{locationLoading.cities ? 'Loading Cities...' : 'Select a city'}</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                            </div>

                            <FormInput name="zipcode" label="Zipcode" placeholder="zipcode" value={formData.zipcode} onChange={onChange} error={errors.zipcode} required />
                        </div>

                        <div className="flex items-start">
                            <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">I agree to the <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms and Conditions</a></label>
                            {errors.terms && <p className="ml-4 text-xs text-red-600 self-center">{errors.terms}</p>}
                        </div>

                        {errors.form && <div className="text-center p-2 bg-red-100 text-red-700 rounded-md">{errors.form}</div>}

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;