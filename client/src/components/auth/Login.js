import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';


const Login = () => {
    return (

        <Fragment>

            {/* Alert */}
            <div className="alert alert-danger">
                Invalid credentials
            </div>

            {/* Heading */}
            <h1 className="large text-primary">Sign In</h1>

            {/* Sub Heading */}
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>

            {/* Input Form */}
            <form className="form" action="dashboard.html">

                {/* Email Address */}
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        required
                    />
                </div>

                {/* Password */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                    />
                </div>

                {/* Submit Button */}
                <input type="submit" className="btn btn-primary" value="Login" />

            </form>

            {/* Link to Registration Form */}
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>

        </Fragment>

    );
}

export default Login;
