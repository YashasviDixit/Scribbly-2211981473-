import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import homeImage from '../images/1.jpg';
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("❌ Error parsing user:", err);
    user = null;
  }

  const firstName =
    user?.name?.split(" ")[0] ||
    user?.username?.split(" ")[0] ||
    null;

  const handleStartReading = () => {
    if (user) {
      navigate("/posts");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="home-top">
        <div className="home-text">
          <h1>Human<br />stories & ideas</h1>
          <h3>A place to read, write, and deepen your understanding</h3>

          <button onClick={handleStartReading} className="home-button">
            {firstName ? `Continue Reading, ${firstName}` : "Start Reading"}
          </button>
        </div>

        <div className="home-image">
          <img src={homeImage} alt="Banner" />
        </div>
      </div>

      <hr />
      <Footer />

    </div>
  );
};
export default Home;
