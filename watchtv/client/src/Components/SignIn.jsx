import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { background, watchtv, errorIcon, eyeIcon, eyeSlashIcon } from '../assets/Pictures';
import '../Styles/SignIn.css';

function SignIn() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [isEditing, setIsEditing] = useState({ phone: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const clearErrorAfterTimeout = (field) => {
    setTimeout(() => {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }, 9000);
  };

  const validateForm = (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = { phone: '', password: '' };

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

    if (formIsValid) {
      console.log('Form is valid. Submitting...');
      navigate('/dashboard');
    }
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
    <div className="signin-fullscreen-container">
      <img src={background} alt="Background" className="signin-fullscreen-image" />
      <div className="signin-text-overlay">
        <img src={watchtv} alt="tvicon" className="signin-tv-icon" />
        <h1>WatchTV</h1>
      </div>
      <div className="signin-form-wrapper">
        <h2>Sign In</h2>
        <form onSubmit={validateForm}>
          <div className="signin-form-control">
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
              required
              className={errors.phone ? 'signin-input-error' : ''}
            />
            <label htmlFor="phone">Phone number</label>
            {errors.phone && !isEditing.phone && (
              <div className="signin-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signin-error-message">{errors.phone}</span>
              </div>
            )}
          </div>

          <div className="signin-form-control">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
              className={errors.password ? 'signin-input-error' : ''}
            />
            <label htmlFor="password">Password</label>
            <div className="signin-password-icon" onClick={toggleShowPassword}>
              <img src={showPassword ? eyeSlashIcon : eyeIcon} alt="toggle password visibility" />
            </div>
          </div>

          <button type="submit">
            <span>Sign In</span>
          </button>
          <div className="signin-form-help">
            <p className="signin-create">
              Create a new account? <Link to='/signup'>Sign Up Now</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;