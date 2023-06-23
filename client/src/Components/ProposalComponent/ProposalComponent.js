import React, { useState } from 'react'
import './ProposalComponent.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import VotingPopup from '../VotingPopup/VotingPopup';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProposalComponent = (props) => {
    let totalVotes = parseInt(props.yesCnt, 10) + parseInt(props.noCnt, 10);
    // console.log("yes: " + props.yesCnt + "No: " + props.noCnt + "Total: " + totalVotes);
    let yesPerc = (props.yesCnt / totalVotes) * 100;
    let noPerc = (props.noCnt / totalVotes) * 100;
    const ethAmount = ethers.utils.formatEther(props.amount);
    const [loading, setLoading] = useState(false);
    let provider;

    function callToastMessage(message) {
        toast.success(message, {
            position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
            pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
        });
    }

    const executeProposal = async () => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const contractABI = process.env.REACT_APP_CONTRACT_ABI;

        setLoading(true);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(props.contractAddress, contractABI, signer);

        try {
            const tx = await contract.executeProposal(props.proposalId - 1);
            const receipt = await tx.wait();
            // Retrieve the transaction hash
            const transactionHash = receipt.transactionHash;
            console.log('Proposal Executed Successfully!' + transactionHash);
            callToastMessage('Proposal Executed Successfully!')
            setLoading(false);
        } catch (error) {
            console.error('Error creating proposal:', error);
            callToastMessage('Error Executing proposal');
            setLoading(false);
        }
    };

    return (
        <div >
            <Popup trigger={
                <div className='proposal-component'>
                    <div className='proposal-component-top'>
                        <p style={{ color: "gray", fontSize: "4px" }}>{props.creator}</p>
                        <p className="status-pending">{props.note}</p>
                        <p className={`status-style ${props.status === true ? "status-active" : props.status === false ? "status-closed" : "status-pending"}`}>{props.status ? "Active" : "Closed"}</p>
                    </div>
                    <h5 style={{ marginBottom: "0", fontWeight: "bolder" }}>{props.title}</h5>
                    <p style={{ color: "gray", marginTop: "0.3rem" }}>{props.description}</p>
                    {
                        props.amount != 0 ? (
                            <div>
                                <p style={{ margin: 0 }}>{`Amount: ${ethAmount} ETH`}</p>
                                <p>{`Recipient Address: ${props.recipientAddress}`}</p>
                            </div>
                        ) : (<></>)
                    }
                    {
                        props.note !== "" ? (
                            <div>
                                <p className='perc-back'>{`Yes - ${yesPerc}%`}</p>
                                <p className='perc-back'>{`No - ${noPerc}%`}</p>
                            </div>
                        ) : (<></>)
                    }
                    {props.note == "" ? (<button className='connect-button' onClick={executeProposal}>Execute Proposal</button>) : (<></>)}
                </div>
            } modal nested>
                {
                    close => (
                        <VotingPopup title={props.title} description={props.description}
                            contractAddress={props.contractAddress} proposalId={props.proposalId} />
                    )
                }
            </Popup>
        </div>
    )
}

export default ProposalComponent