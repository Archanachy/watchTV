import React, { useState} from 'react';
import { background, watchtv, errorIcon } from '../assets/Pictures';
import '../Styles/SignIn.css';

function SignIn() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handlePhoneFocus = () => {
    setIsEditingPhone(true);
    setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
  };

  const handlePasswordFocus = () => {
    setIsEditingPassword(true);
    setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
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
              onFocus={handlePhoneFocus}
              onBlur={() => setIsEditingPhone(false)}
              required
              className={errors.phone ? 'signin-input-error' : ''}
            />
            <label htmlFor="phone">Phone number</label>
            {errors.phone && !isEditingPhone && (
              <div className="signin-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signin-error-message">{errors.phone}</span>
              </div>
            )}
          </div>

          <div className="signin-form-control">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={() => setIsEditingPassword(false)}
              required
              className={errors.password ? 'signin-input-error' : ''}
            />
            <label htmlFor="password">Password</label>
            {errors.password && !isEditingPassword && (
              <div className="signin-error-icon">
                <img src={errorIcon} alt="error icon" />
                <span className="signin-error-message">{errors.password}</span>
              </div>
            )}
          </div>

          <button type="submit">
            <span>Sign In</span>
          </button>
          <div className="signin-form-help">
            <p className="signin-create">
              Create a new account? <a href="/signup">Sign up now</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
