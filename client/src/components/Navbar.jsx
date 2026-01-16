import React from 'react';
import '../css/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
    <nav className="navbar">
      <div className="left-nav">
        <Link to="/" className="med">Scribbly</Link>
      </div>

      <div className="right-nav">
        <Link to="/create">Create |</Link>
        {!user && <Link to="/login">Login |</Link>}
        {!user && <Link to="/signup">Signup |</Link>}
        
<Link to="/posts">Posts</Link> |{' '} 
<Link to="/saved">Saved</Link> |{' '}

        {user && (
          <>
            <Link to="/profile">👤 </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
    <hr></hr>
    </>
  );
};

export default Navbar;
