import React, { useState } from 'react'
import "./VotingPopup.css"
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const VotingPopup = (props) => {
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [loading, setLoading] = useState(false);
    const [contractAddress, setContractAddress] = useState(props.contractAddress);
    let provider;

    function callToastMessage(message) {
        toast.success(message, {
            position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
        });
    }

    const proposalVoteFunc = async (voteStatus) => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const contractABI = process.env.REACT_APP_CONTRACT_ABI;

        setLoading(true);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            console.log("ProposalId: " + props.proposalId);
            const tx = await contract.vote(props.proposalId - 1, voteStatus);
            const receipt = await tx.wait();
            // Retrieve the transaction hash
            const transactionHash = receipt.transactionHash;
            console.log('New Proposal Created Successfully' + transactionHash);
            callToastMessage('Proposal Votted Successfully')
            setLoading(false);
        } catch (error) {
            console.error('Error creating proposal:', error);
            callToastMessage('Error Votting proposal');
            setLoading(false);
        }
    };

    return (
        <div className='voting-popup'>
            {
                loading ?
                    // If the data is being fetched show loader
                    (<div className="loader-container">
                        <div className="spinner"></div>
                    </div>)
                    // Else show the UI
                    : (
                        <div>
                            <h3>Vote For Proposal</h3>
                            <h6 style={{ margin: 0 }}>Title</h6>
                            <p>{title}</p>
                            <h6 style={{ margin: 0 }}>Description</h6>
                            <p style={{ marginBottom: 30 }}>{description}</p>
                            {/* Accept Icon */}
                            <div className='vote-bottom'>
                                <span className="p-3 shadow-2 inline-block"
                                    style={{ borderRadius: "10px" }} onClick={() => {
                                        proposalVoteFunc(true);
                                    }}>
                                    <i className="pi pi-check text-2xl text-green-500 cursor-pointer">Yes</i>
                                </span>

                                {/* Reject Icon */}
                                <span className="p-3 shadow-2 inline-block ml-6"
                                    style={{ borderRadius: "5px" }} onClick={() => {
                                        proposalVoteFunc(false);
                                    }}>
                                    <i className="pi pi-times text-2xl text-red-500 cursor-pointer">No</i>
                                </span>
                            </div>
                        </div>)}
            <ToastContainer />
        </div>
    )
}

export default VotingPopup