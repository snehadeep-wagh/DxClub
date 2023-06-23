import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './NewClubPage.css'
import { ethers } from 'ethers'
import { Divider } from 'primereact/divider';

export default function NewClubPage() {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [isclubNameUnique, setisClubNameUnique] = useState(true);
    const [collegeName, setCollegeName] = useState("");


    let contractAddress = "";
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    let provider;
    let toastMessage = "New Club Created Successfully!";
    let token = localStorage.getItem('token');
    const contractABI = process.env.REACT_APP_CONTRACT_ABI;
    const contractBytecode = process.env.REACT_APP_CONTRACT_BYTECODE;
    let walletAddress = "";
    let signer;

    const navigate = useNavigate();

    useEffect(() => {
        connectWallet();
    }, []);

    const collectData = async () => {

        let clubAlreadyExits = await fetch(BASE_URL + "club/checkIfClubExists?clubName=" + name, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            }
        });

        if (clubAlreadyExits.status === 200) {
            // Club already exists!
            setisClubNameUnique(false);
            toast.error("Something went wrong!", {
                position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
            });
        }
        else {
            // call deploy Contract!
            deployContract();
        }
    };

    const addClubToDB = async (contractAddress) => {
        console.log("Collect data called");
        let result = await fetch(BASE_URL + "club/createClub", {
            method: "post",
            body: JSON.stringify({ clubName: name, description: description, collegeName: collegeName, contractAddress: contractAddress }),
            headers: {
                'Content-Type': 'application/json',
                'token': token,
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
            setCollegeName("");
            setName("");
            setDescription("");
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            provider = new ethers.providers.Web3Provider(window.ethereum);
            let accounts = await provider.send('eth_requestAccounts', []);
            signer = provider.getSigner();
            walletAddress = await signer.getAddress();
            console.log("walletAddress: " + walletAddress);
            console.log("Connected", provider);
        } catch (error) {
            console.log(error);
        }
    };

    const deployContract = async () => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log("Provide: " + provider);
        const signer = provider.getSigner();
        const providerAddress = signer.getAddress();
        console.log("providerAddress: " + providerAddress);

        const constructorArgs = [providerAddress, name, description];

        // console.log("Signer: " + signer);
        // console.log("Base: " + process.env.ABCD);
        // console.log("Contract Byte Code: " + contractBytecode);
        // console.log("Contract ABI: " + contractABI);
        setLoading(true);
        const contractFactory = new ethers.ContractFactory(contractABI, contractBytecode, signer);
        const deployedContract = await contractFactory.deploy(...constructorArgs);
        // .then(() => {
        //     console.log("loading false1");
        //     setLoading(false);
        //     setisClubNameUnique(true);
        // }, () => {
        //     console.log("loading false3");
        //     setLoading(false);
        //     setisClubNameUnique(true);
        // });

        await deployedContract.deployed();
        contractAddress = deployedContract.address;
        console.log('Contract deployed at:', contractAddress);
        setLoading(false);
        setisClubNameUnique(true);
        console.log("loading false2");
        addClubToDB(contractAddress);
    };

    return (
        <div className="container">
            {
                loading ?
                    // If the data is being fetched show loader
                    (<div className="loader-container">
                        <div className="spinner"></div>
                    </div>)
                    // Else show the UI
                    : (<div className="text-center m-5-auto new-club-container">
                        <div>
                            <h2>Create New Club</h2>
                            <h5>The club that help you take the decisions.</h5>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <p>
                                    <label>Name</label><br />
                                    <input type="text" name="first_name" value={name} onChange={(e) => { setName(e.target.value); }} required />
                                    {(isclubNameUnique || name === "") ? "" : <p style={{ color: "red" }}>Club already exists</p>}
                                </p>
                                <p>
                                    <label>College name</label><br />
                                    <input type="text" name="college" value={collegeName} onChange={(e) => { setCollegeName(e.target.value) }} required />
                                </p>
                                <p>
                                    <label>Description</label><br />
                                    <input type="text" name="description" value={description} onChange={(e) => { setDescription(e.target.value) }} required />
                                </p>
                                <p>
                                    <button id="sub_btn" type="submit" onClick={collectData}>Create Club</button>
                                </p>
                            </form>
                        </div>
                        <Divider layout="vertical" />
                        <div className='wallet-container'>
                            <div><p style={{ fontWeight: "500" }}>Connect to the wallet</p></div>
                            <div><button className='connect-button' onClick={connectWallet}>Connect</button></div>
                        </div>
                        <footer>
                            {/* <p>Already have an account? <Link to="/login">Login</Link>.</p> */}
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
                    </div>)}
        </div>
    )

}
