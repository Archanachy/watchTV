import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { background, watchtv, errorIcon, eyeIcon, eyeSlashIcon } from '../assets/Pictures';
import '../Styles/SignUp.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', phone: '', password: '' });
  const [isEditing, setIsEditing] = useState({ phone: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const clearErrorAfterTimeout = (field) => {
    setTimeout(() => {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }, 9000);
  };

  const validateForm = (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = { username: '', phone: '', password: '' };

    if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      formIsValid = false;
      clearErrorAfterTimeout('username');
    }

    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 digits).';
      formIsValid = false;
      clearErrorAfterTimeout('phone');
    }

    if (password.length <= 6) {
      newErrors.password = 'Password must be more than 6 characters.';
      formIsValid = false;
      clearErrorAfterTimeout('password');
      window.alert(newErrors.password); // Show window alert for password error
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleFocus = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleBlur = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
              type={showPassword ? 'text' : 'password'}
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
            <div className="signup-password-icon" onClick={toggleShowPassword}>
              <img src={showPassword ? eyeSlashIcon : eyeIcon} alt="toggle password visibility" />
            </div>
          </div>

          <button type="submit">
            <span>Sign Up</span>
          </button>
          <div className="signup-form-help">
            <p className="signup-already">
              Already have an account? <Link to='/signin'>Sign In Now</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;