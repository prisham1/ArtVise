import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
        .then(result => {
            console.log(result);
            if(result.data === "Successful") {
                navigate('/home'); 
            } 
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div>
                <h1 className="text-center mb-4">Welcome to ArtVise</h1>
                <div className="card p-4 shadow" style={{ width: '400px' }}>
                    <h2 className="card-title text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" 
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Enter your password" 
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
                    </form>
                    <div className="text-center mt-2">Don't have an account?</div>
                    <Link to="/register" className="btn btn-secondary w-100">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
