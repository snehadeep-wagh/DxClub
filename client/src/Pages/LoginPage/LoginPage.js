import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './LoginPage.css'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    let toastMessage = "";
    const navigate = useNavigate();

    function callToastMessage(message) {
        toast.success(message, {
            position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
        });
    }

    const onSubmitClicked = async () => {
        if (!email.includes("@")) return;
        let result = await fetch(BASE_URL + "auth/login/", {
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (result.status === 200) {
            // convert the result to json
            result = await result.json();
            console.warn(result);

            // save the token in local storage
            const token = result['token'];
            localStorage.setItem("token", token);
            // localStorage.setItem("username", result["username"]);

            // Toast message
            toastMessage = "Logged in successfully!";
            callToastMessage(toastMessage);

            // navigate to dashboard
            navigate("/dashboard");
            
        } else {
            // Toast message
            toastMessage = "Check your email or password!";
            callToastMessage(toastMessage);
        }
    };

    return (
        <div className="text-center m-5-auto">
            <h2>Sign In</h2>
            <form onSubmit={(event) => event.preventDefault()}>
                <p>
                    <label>Email</label><br />
                    <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                </p>
                <p>
                    <label>Password</label>
                    <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>
                    <br />
                    <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                </p>
                <p>
                    <button id="sub_btn" type="submit" onClick={onSubmitClicked}>Login</button>
                </p>
            </form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
            </footer>
            <ToastContainer />
        </div>
    )
}

export default LoginPage