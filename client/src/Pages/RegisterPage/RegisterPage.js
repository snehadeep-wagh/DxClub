import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './RegisterPage.css'

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [isemailUnique, setisEmailUnique] = useState(true);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    let toastMessage = "Verification mail send successfully!";

    const collectData = async () => {
        console.log("Collect data called");
        let result = await fetch(BASE_URL + "auth/register/", {
            method: "post",
            body: JSON.stringify({ name, email, password }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (result.status === 200) {

            // convert the result to json
            result = await result.json();

            // Toast message
            toast.success(toastMessage, {
                position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
            });

            // reset all fields
            setEmail("");
            setName("");
            setPassword("");
        } else {

            // email already exists!
            setisEmailUnique(false);

        }
    };

    return (
        <div className="text-center m-5-auto">
            <h2>Register Now</h2>
            <h5>Create your personal account</h5>
            <form onSubmit={(event) => event.preventDefault()}>
                <p>
                    <label>Name</label><br />
                    <input type="text" name="first_name" value={name} onChange={(e) => { setName(e.target.value); }} required />
                </p>
                <p>
                    <label>Email address</label><br />
                    <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setisEmailUnique(true); }} required />
                    {(isemailUnique || email === "")? "" : <p style={{ color: "red" }}>User already exists</p>}
                </p>
                <p>
                    <label>Password</label><br />
                    <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit" onClick={collectData}>Register</button>
                </p>
            </form>
            <footer>
                <p>Already have an account? <Link to="/login">Login</Link>.</p>
            </footer>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )

}
