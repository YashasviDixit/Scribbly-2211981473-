// SIGNUP FORM //
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';
import homeImage from '../images/1.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', form);
      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-top">
        <div className="auth-box">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Signup</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="auth-image">
          <img src={homeImage} alt="Visual" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
