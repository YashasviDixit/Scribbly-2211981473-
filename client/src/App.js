// MAIN ENTRY POINT //
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetails from './pages/PostDetails';
import Posts from './pages/Posts'; 
import Navbar from './components/Navbar';
import Saved from './pages/Saved';

const App = () => {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </>
  );
};

export default App;
