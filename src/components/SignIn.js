"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdPeopleAlt } from "react-icons/md";

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/library');
  };

  return (
    <div className="signin-container">
      <MdPeopleAlt size={36} />

      <h1 className="title">Sign In</h1>
      <p className="subtitle">Welcome back! Let's get started with AI</p>
      <div className="signin-card">
        <input type="email" placeholder="Enter your email" className="input-field" />
        <input type="password" placeholder="Create a password" className="input-field" />
        <button onClick={handleSignIn} className="signin-button">Sign In</button>
        <div className="divider">OR</div>
        <button onClick={handleSignIn} className="social-button google-button">
          <img src="Icons/google.png" alt="Google Logo" className="social-logo" />
          Sign up with Google
        </button>
        <button onClick={handleSignIn}className="social-button linkedin-button">
          <img src="Icons/linkedin.png" alt="LinkedIn Logo" className="social-logo" />
          Sign up with LinkedIn
        </button>
      </div>
      <p className="footer">Don't have an account? <a className="footer-link" onClick={handleSignIn}>Sign up</a></p>
    </div>
  );
}