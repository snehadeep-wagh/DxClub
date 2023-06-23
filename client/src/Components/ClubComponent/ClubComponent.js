import React, { useId, useState } from 'react'
import { Avatar } from '@mui/material/';
import './ClubComponent.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ClubPopup from '../ClubPopup/ClubPopup';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ethers } from 'ethers';

const ClubComponent = (props) => {

    const [avatarImg, setAvatarImg] = useState("https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg");
    const [isRequestActive, setIsRequestActive] = useState(false);
    const [clubButtonCss, setClubButtonCss] = useState("closed-request");
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    function callToastMessage(message) {
        toast.success(message, {
            position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
        });
    }

    const checkIfRequestActive = async (clubId, userId) => {
        // check if the request is already created

        let result = await fetch(BASE_URL + `clubRequests/checkClubRequest?clubId=${clubId}&userId=${userId}`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem("token"),
            }
        });

        if (result.status === 200) {
            result = await result.json();
            // console.log("clubId: " + clubId + "\nuserId: " + userId + "\nstatus: " + result.status);

            setIsRequestActive(result.status);

            if (result.status) {
                setClubButtonCss("active-request")
            }
            else {
                setClubButtonCss("closed-request");
            }
        }
    };

    checkIfRequestActive(props.clubId, props.userId);

    const SendRequest = async (clubId, clubName, clubAdminId, userName, userId, contractAddress, senderAddress) => {

        //check if request active then do not send request.
        if (isRequestActive) {
            callToastMessage("Request already Sent!");
            return;
        }

        let result = await fetch(BASE_URL + "clubRequests/sendClubRequest/", {
            method: "put",
            body: JSON.stringify({ clubId, clubName, clubAdminId, userName, userId, contractAddress, senderAddress }),
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem("token"),
            }
        });

        if (result.status === 200) {
            result = await result.json();
            setClubButtonCss("active-request");
            callToastMessage("Request Sent Successfully!");
        }
        else {
            console.log("Something went wrong!");
            callToastMessage("Request already Sent!");
        }
    };

    return (
        <div className='club-component'>
            <Popup trigger={
                <div className='club-c-left-top' onClick={() => { }}>
                    <Avatar className='club-avatar' sx={{ width: 84, height: 84 }} src={avatarImg} />
                    <h6>{props.clubName}</h6>
                    <button className={"request-button " + clubButtonCss} onClick={async () => {
                        let provider = new ethers.providers.Web3Provider(window.ethereum);
                        let accounts = await provider.send('eth_requestAccounts', []);
                        let account = accounts[0];
                        const signer = provider.getSigner();
                        let walletAddress = await signer.getAddress();
                        console.log("Wallet Address: " + walletAddress);
                        SendRequest(props.clubId, props.clubName, props.clubAdminId, props.userName, props.userId, props.contractAddress, walletAddress);
                    }}>Join</button>
                </div>
            }
                modal nested>
                {
                    close => (
                        <ClubPopup clubName={props.clubName} clubCollege={props.collegeName} clubDescription={props.clubDescription} />
                    )
                }
            </Popup>


            <ToastContainer />
        </div>

    )
}

export default ClubComponent