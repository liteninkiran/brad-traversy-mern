import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== password2 ) {
            alert('Passwords do not match');
        } else {
            const newUser = {
                name,
                email,
                password,
            };

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);
                console.log(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        }
    }

    return (

        <Fragment>

            {/* Heading */}
            <h1 className="large text-primary">Sign Up</h1>

            {/* Sub heading */}
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

            {/* Input Form */}
            <form className="form" onSubmit={formSubmitHandler}>

                {/* Name */}
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" required value={name} onChange={onChangeHandler} />
                </div>

                {/* Email */}
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChangeHandler} />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>

                {/* Password */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={onChangeHandler}
                    />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={onChangeHandler}
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
