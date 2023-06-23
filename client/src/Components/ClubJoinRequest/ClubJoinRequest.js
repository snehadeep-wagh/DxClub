import React, { useState, useEffect } from 'react'
import RequestComponent from '../../Components/RequestComponent/RequestComponent';
import { ethers } from 'ethers';


const ClubJoinRequest = () => {

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [listOfRequests, setListOfRequests] = useState([]);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [clubId, setClubId] = useState("");
    const [clubName, setClubName] = useState("");
    let provider;

    useEffect(() => {
        connectWallet();
        getAllRequests();
    }, []);

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

            console.log("Connected", provider);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllRequests = async () => {
        let result = await fetch(BASE_URL + "clubRequests/getAllRequests/", {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem("token"),
            }
        });

        if (result.status === 200) {
            result = await result.json();
            console.log(result.result);
            setListOfRequests(result.result);
            setUserId(result.userId);
            // listOfClubs = result.result;
        }
        else {
            console.log("Something went wrong!");
        }
    }

    const listRequests = listOfRequests.map((component) => (
        <div key={component._id}>
            <RequestComponent userId={component.userId} clubName={component.clubName} userName={component.userName} clubId={component.clubId} clubImg={component.clubImg} senderAddress={component.senderAddress} contractAddress={component.contractAddress} />
        </div>
    ));

    return (
        <div>
            <h2>All Requests</h2>
            <div className='all-clubs'>
                {listRequests}
            </div>
        </div>
    )
}

export default ClubJoinRequest