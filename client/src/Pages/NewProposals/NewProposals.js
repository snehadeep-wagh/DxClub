import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './NewProposals.css';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ethers } from 'ethers';

const NewProposals = (props) => {

  const { contractAddress } = useParams();
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [debatePeriod, setDebatePeriod] = useState(1);
  const [receiverAddress, setReceiverAddress] = useState("");
  let provider;

  useEffect(() => {
    connectWallet();
  }, []);

  function callToastMessage(message) {
    toast.success(message, {
      position: "top-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
      pauseOnHover: true, draggable: true, progress: undefined, theme: "dark",
    });
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const createProposalFunc = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const contractABI = process.env.REACT_APP_CONTRACT_ABI;

    setLoading(true);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.newProposalSimple(title, description);
      const receipt = await tx.wait();
      // Retrieve the transaction hash
      const transactionHash = receipt.transactionHash;
      console.log('New Proposal Created Successfully' + transactionHash);
      callToastMessage('New Proposal Created Successfully')
      setAmount("");
      setTitle("");
      setDescription("");
      setReceiverAddress("");
      setLoading(false);
    } catch (error) {
      console.error('Error creating proposal:', error);
      callToastMessage('Error creating proposal');
      setAmount("");
      setTitle("");
      setDescription("");
      setReceiverAddress("");
      setLoading(false);
    }
  }


  const createProposalWithAmountFunc = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const contractABI = process.env.REACT_APP_CONTRACT_ABI;

    setLoading(true);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const weiAmt = ethers.utils.parseEther(amount);
      const tx = await contract.newProposal(receiverAddress, weiAmt, title, description, { value: weiAmt });
      const receipt = await tx.wait();
      // Retrieve the transaction hash
      const transactionHash = receipt.transactionHash;
      console.log('New Proposal Created Successfully' + transactionHash);
      callToastMessage('New Proposal Created Successfully')
      setLoading(false);
    } catch (error) {
      console.error('Error creating proposal:', error);
      callToastMessage('Error creating proposal');
      setLoading(false);
    }
  }


  return (
    <div className='new-proposal'>
      {loading ?
        // If the data is being fetched show loader
        (<div className="loader-container">
          <div className="spinner"></div>
        </div>)
        // Else show the UI
        : (<div>
          <div style={{ display: 'block', fontWeight: 'bold' }}><h4>Create new proposal.</h4></div>
          <div className='new-proposal-bottom'>
            <div className='new-proposal-b-l'>

              <div className='info'>
                <div>
                  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="float-left mr-1 text-sm"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"></path></svg>
                  <div>
                    <span>You need to have a minimum of x ether in order to submit a proposal.</span>
                  </div>
                </div>
              </div>

              <div>
                <form style={{ width: "100%" }}>
                  <div>
                    <p>
                      <lable style={{ display: 'block' }}>Title</lable>
                      <input className='ip-style' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                    </p>
                    <p>
                      <label>Amount (optional)</label><br />
                      <input className='ip-style' type="text" name="amount" value={amount} onChange={(e) => { setAmount(e.target.value) }} />
                    </p>
                    <p>
                      <label>Receiver Address (optional)</label><br />
                      <input className='ip-style' type="text" name="receiver" value={receiverAddress} onChange={(e) => { setReceiverAddress(e.target.value) }} />
                    </p>
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <lable>Description</lable>
                    <textarea className='ip-style' type="text" rows={10} value={description} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                  </div>
                </form>
                <button className='connect-button' style={{ marginBottom: "5rem", marginLeft: "2rem", width: "50%" }} onClick={() => {
                  if (amount === "" && receiverAddress === "") {
                    createProposalFunc();
                  }
                  else {
                    createProposalWithAmountFunc();
                  }
                }}>Create Proposal</button>
              </div>
            </div>
            <div className='new-proposal-b-r'>
              <div className='wallet-container1'>
                <div><p style={{ fontWeight: "500" }}>Connect to the wallet</p></div>
                <div><button className='connect-button' onClick={connectWallet}>Connect</button></div>
              </div>
            </div>
          </div>
        </div>
        )}
      <ToastContainer />
    </div>
  )
}

export default NewProposals