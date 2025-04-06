import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    specialization: "",
    phoneNumber: "",
    licenseNumber: ""
  });
  const Select = ({ children, ...props }) => (
    <select
      className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      {...props}
    >
      {children}
    </select>
  );
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Role is required";
    if(formData.role === 'doctor'){
      if (!formData.specialization) newErrors.specialization = "Specialization is required";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = formData.role === "doctor" ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          specialization: formData.specialization,
          phoneNumber: formData.phoneNumber,
          licenseNumber: formData.licenseNumber,
          role: formData.role,
        } : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          setErrors({ ...errors, submit: errorData.error || "Signup failed" });
        }
      } catch (error) {
        setErrors({ ...errors, submit: 'An error occurred. Please try again.' });
      }
    }
  };

  const getHeaderTitle = () => {
    if (formData.role) {
      return `Sign Up as a ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`;
    }
    return "Sign Up";
  };

  const getHeaderSubtitle = () => {
    if (formData.role) {
      return `Create your ${formData.role} account`;
    }
    return "Create your account to access health services";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-semibold text-center text-white">{getHeaderTitle()}</h2>
          <p className="mt-2 text-center text-blue-100">{getHeaderSubtitle()}</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="John"
                  required
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Doe"
                  required
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="example@mail.com"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white focus:ring-blue-400 focus:border-blue-400"
                required
              >
                <option value="" disabled>Select a role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
            </div>
            {formData.role === "doctor" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="specialization"  className="block text-sm font-medium text-gray-700">Specialization</label>
                  <Select id="specialty"name="specialization" value={formData.specialization} onChange={handleChange} required>
                <option value="">Choose a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="oncology">Oncology</option>
                <option value="orthopedics">Orthopedics</option>
              </Select>
                  {/* <input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="e.g., Cardiology"
                    required
                  /> */}
                  {errors.specialization && <p className="mt-1 text-xs text-red-600">{errors.specialization}</p>}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="1234567890"
                    required
                  />
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Enter your license number"
                    required
                  />
                  {errors.licenseNumber && <p className="mt-1 text-xs text-red-600">{errors.licenseNumber}</p>}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
            >
              Create Account
            </button>
          </form>
          {errors.submit && <p className="mt-4 text-center text-sm text-red-600">{errors.submit}</p>}
          <p className="mt-4 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
