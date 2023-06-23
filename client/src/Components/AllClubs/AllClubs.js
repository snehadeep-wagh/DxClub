import React, { useEffect, useState } from "react";
import ClubComponent from "../ClubComponent/ClubComponent";
import "./AllClubs.css";
import { ethers } from 'ethers'
import ClubPopup from "../ClubPopup/ClubPopup";

const AllClubs = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [listOfClubs, setLisOfClubs] = useState([]);
  const [userID, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  let provider;
  const contractABI = process.env.REACT_APP_CONTRACT_ABI;
  const contractBytecode = process.env.REACT_APP_CONTRACT_BYTECODE;
  var walletAddress = "";
  var listClubs;

  useEffect(() => {
    getAllClubs();
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      provider = new ethers.providers.Web3Provider(window.ethereum);
      let accounts = await provider.send('eth_requestAccounts', []);
      let account = accounts[0];
      const signer = provider.getSigner();
      walletAddress = await signer.getAddress();
      console.log("Wallet Address: " + walletAddress);

      provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
      });

      console.log("Connected", provider);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllClubs = async () => {
    let result = await fetch(BASE_URL + "club/getAllClubs/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });

    if (result.status === 200) {
      result = await result.json();
      console.log(result.result);
      setLisOfClubs(result.result);
      setUserId(result.userId);
      setUserName(result.userName);
      // listOfClubs = result.result;
    } else {
      console.log("Something went wrong!");
    }
  };

  listClubs = listOfClubs.map(
    (component) =>
      component.clubAdminId !== userID && (
        <div key={component._id}>
          <ClubComponent
            userId={userID}
            userName={userName}
            clubId={component._id}
            clubName={component.clubName}
            clubAdminId={component.clubAdminId}
            clubImg={component.clubImg}
            clubDescription={component.description}
            collegeName={component.collegeName}
            contractAddress={component.contractAddress}
          />
        </div>
      )
  );


  return (
    <div>
      <h2>All Clubs</h2>
      <div className="all-clubs">{listClubs}</div>
    </div>
  );
};

export default AllClubs;
