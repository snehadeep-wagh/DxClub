import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './RequestComponent.css'
import { Avatar } from '@mui/material/';
import { ethers } from 'ethers';


const RequestComponent = (props) => {

    const [avatarImg, setAvatarImg] = useState("https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg");
    const [status, setStatus] = useState(null);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [loading, setLoading] = useState(false);
    let provider;


    const addMemberToClub = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const contractABI = process.env.REACT_APP_CONTRACT_ABI;
            const contractAddress = props.contractAddress;
            const senderAddress = props.senderAddress;

            setLoading(true);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            try {
                const tx = await contract.enrollMembers(senderAddress);
                await tx.wait();
                console.log('Member added successfully');
                setLoading(false);
            } catch (error) {
                console.error('Error adding member:', error);
                setLoading(false);
            }
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const requestAccept = async () => {
        await addMemberToClub();
        updateRequest(true);
        window.location.reload(true);
    };

    const requestReject = () => {
        updateRequest(false);
    };

    const updateRequest = async (status) => {
        let result = await fetch(BASE_URL + "clubRequests/updateRequest", {
            method: "put",
            body: JSON.stringify({ clubId: props.clubId, userId: props.userId, status: status }),
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem("token"),
            }
        });

        if (result.status === 200) {
            result = await result.json();
            console.warn(result);
        }
    };

    return (
        <div className='request-component'>
            {
                loading ?
                    // If the data is being fetched show loader
                    (<div className="loader-container1">
                        <div className="spinner"></div>
                    </div>)
                    // Else show the UI
                    : (<div className=''>
                        {/* <Avatar className='club-avatar' sx={{ width: 84, height: 84 }} src={avatarImg} /> */}
                        <h4 className='request-h5'>{props.userName}</h4>
                        <p>{props.clubName}</p>
                        {/* Accept Icon */}
                        <span className="p-3 shadow-2 mb-3 inline-block"
                            style={{ borderRadius: "10px" }} onClick={() => {
                                requestAccept();
                            }}>
                            <i className="pi pi-check text-2xl text-green-500 cursor-pointer"></i>
                        </span>

                        {/* Reject Icon */}
                        <span className="p-3 shadow-2 mb-3 inline-block ml-3"
                            style={{ borderRadius: "5px" }} onClick={() => {
                                requestReject();
                            }}>
                            <i className="pi pi-times text-2xl text-red-500 cursor-pointer"></i>
                        </span>
                    </div>)}
            <ToastContainer />
        </div>
    )
}

export default RequestComponent