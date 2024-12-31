import React, { useState } from 'react';
import { background, watchtv, errorIcon } from '../assets/Pictures';
import '../Styles/SignUp.css';
import axios from "axios";

function SignUp() {

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', phone: '', password: '' });
  const [isEditing, setIsEditing] = useState({ username: false, phone: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false); // Added state to track submission

  const clearErrorAfterTimeout = (field) => {
    setTimeout(() => {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }, 9000);
  };

  const validateForm = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = { username: '', phone: '', password: '' };

    // Validate fields
    if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      formIsValid = false;
      clearErrorAfterTimeout('username');
    }

    if (!/^\+?\d{10,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number (up to 15 digits).';
      formIsValid = false;
      clearErrorAfterTimeout('phone');
    }
    

    if (password.length <= 6) {
      newErrors.password = 'Password must be more than 6 characters.';
      formIsValid = false;
      clearErrorAfterTimeout('password');
    }

    setErrors(newErrors);

    if (formIsValid) {
      await submitForm(); // Submit form if valid
    }
  };

  // Api call to register user
    const submitForm = async () => {
    setIsSubmitting(true);
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
            username,
            phone_number: phone,
            password,
        });
        alert('User created successfully!');
        // Clear form fields after successful submission
        setUsername('');
        setPhone('');
        setPassword('');
    } catch (err) {
        console.error('Error details:', err.response?.data || err.message);

        // Check if the error is due to validation from the backend
        if (err.response && err.response.data && err.response.data.message) {
            const errorMessage = err.response.data.message.toLowerCase();

            if (errorMessage.includes('username')) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Username already exists.',
                }));
            } else if (errorMessage.includes('phone')) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    phone: 'Phone number already exists.',
                }));
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } else {
            alert('An unexpected error occurred. Please try again.');
        }
    } finally {
        setIsSubmitting(false);
    }
  };


  const handleFocus = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleBlur = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="signup-fullscreen-container">
      <img src={background} alt="Background" className="signup-fullscreen-image" />
      <div className="signup-text-overlay">
        <img src={watchtv} alt="tvicon" className="signup-tv-icon" />
        <h1>WatchTV</h1>
      </div>

      <div className="signup-form-wrapper">
        <h2>Sign Up</h2>
        <form onSubmit={validateForm}>
          <div className="signup-form-control">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFocus('username')}
              onBlur={() => handleBlur('username')}
              required
              className={errors.username ? 'signup-input-error' : ''}
            />
            <label htmlFor="username">Username</label>
            {errors.username && !isEditing.username && (
              <div className="signup-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signup-error-message">{errors.username}</span>
              </div>
            )}
          </div>

          <div className="signup-form-control">
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
              required
              className={errors.phone ? 'signup-input-error' : ''}
            />
            <label htmlFor="phone">Phone Number</label>
            {errors.phone && !isEditing.phone && (
              <div className="signup-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signup-error-message">{errors.phone}</span>
              </div>
            )}
          </div>

          <div className="signup-form-control">
          <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
              className={errors.password ? 'signup-input-error' : ''}
            />

            <label htmlFor="password">Password</label>
            {errors.password && !isEditing.password && (
              <div className="signup-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signup-error-message">{errors.password}</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
          <div className="signup-form-help">
            <p className="signup-already">
              Already have an account? <a href="/signin">Sign in now</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
