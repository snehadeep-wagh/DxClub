import React, { useState, useEffect } from "react";
import Proposals from "../../Components/Proposals/Proposals";
import ClubAbout from "../../Components/ClubAbout/ClubAbout";
import { Avatar } from "@mui/material/";
import { useNavigate, useParams } from "react-router-dom";
import "./ClubPage.css";
import { ethers } from "ethers";

const ClubPage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { clubId } = useParams();
  const [addressFetched, setAddressFetched] = useState(false);
  const [clubName, setClubName] = useState("-----");
  const [contractAddress, setContractAddress] = useState("");
  const [avatarImg, setAvatarImg] = useState(
    "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
  );
  const [rightContainerIndex, setRightContainerIndex] = useState(1);
  const navigate = useNavigate();
  let walletAddress = "";
  let provider;

  useEffect(() => {
    getClub();
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
      console.log("walletAddress: " + walletAddress);

      provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
      });

      console.log("Connected", provider);
    } catch (error) {
      console.log(error);
    }
  };

  const getClub = async () => {
    let result = await fetch(BASE_URL + `club/${clubId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });

    if (result.status === 200) {
      result = await result.json();
      setClubName(result?.result.clubName);
      setContractAddress(result?.result.contractAddress);
      setAddressFetched(true);
      console.log(result);
    } else {
      console.log("Something went wrong!");
    }
  };

  const onNewProposalClicked = () => {
    navigate(`/new-proposal/${contractAddress}`);
  };

  const onProposalClicked = () => {
    setRightContainerIndex(1);
  };

  const onClubAboutClicked = () => {
    setRightContainerIndex(3);
  };

  if (rightContainerIndex === 1) {
    var righContainer = (addressFetched === true) && <Proposals contractAddress={contractAddress} />;
  } else if (rightContainerIndex === 3) righContainer = <ClubAbout />;

  return (
    <div className="club-container">
      <div className="club-c-left">
        <div className="club-c-left-top">
          <Avatar
            className="club-avatar"
            sx={{ width: 84, height: 84 }}
            src={avatarImg}
          />
          <h4>{clubName}</h4>
          <button className="join-btn" onClick={() => {
            const youtubeUrl = `https://mumbai.polygonscan.com/address/${contractAddress}`; // Replace with the desired YouTube URL
            window.open(youtubeUrl, '_blank');
          }}>View Block</button>
        </div>

        <div className="club-c-left-bottom">
          <ul className="club-c-left-bottom-ul">
            <li
              className={`${rightContainerIndex === 1 ? "shadow-class" : ""}`}
              onClick={onProposalClicked}
            >
              Proposals
            </li>
            <li onClick={onNewProposalClicked}>New Proposal</li>
            <li
              className={`${rightContainerIndex === 3 ? "shadow-class" : ""}`}
              onClick={onClubAboutClicked}
            >
              About
            </li>
          </ul>
        </div>
      </div>
      <div className="club-c-right">{righContainer}</div>
    </div>
  );
};

export default ClubPage;
