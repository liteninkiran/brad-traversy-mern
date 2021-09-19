import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (

        <Fragment>

            {/* Heading */}
            <h1 className="large text-primary">Sign Up</h1>

            {/* Sub heading */}
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

            {/* Input Form */}
            <form className="form" action="create-profile.html">

                {/* Name */}
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" required />
                </div>

                {/* Email */}
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>

                {/* Password */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                    />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                    />
                </div>

                {/* Submit Button */}
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>

            {/* Link to Login Page */}
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>

        </Fragment>

    );
}

export default Register;
