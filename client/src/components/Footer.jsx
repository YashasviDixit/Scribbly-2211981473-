import React from "react";
import "./footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <h2 className="footer-logo">Scribbly</h2>
      <p className="footer-tagline">Write • Read • Inspire</p>

      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/posts">Posts</a>
        <a href="/create">Write</a>
        <a href="/login">Login</a>
        <a href="/signup">Signup</a>
      </div>

      

      <p className="copyright">
        © {new Date().getFullYear()} Scribbly — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
