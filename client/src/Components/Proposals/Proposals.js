import React, { useEffect, useState } from 'react'
import ProposalComponent from '../ProposalComponent/ProposalComponent';
import './Proposals.css'
import { ethers } from 'ethers';

const Proposals = (props) => {

  const [listOfProposals, setListOfProposals] = useState([]);
  let provider;
  const [contractAddress, setContractAddress] = useState(props.contractAddress);


  // Fetch this from backend.
  // let listOfProposals =
  // [
  //   { "_id": "a", "title": "Proposal1", "description": "This is the description for 1st proposal.", status: "active" },
  //   { "_id": "b", "title": "Proposal2", "description": "This is the description for 2nd proposal.", status: "closed" },
  //   { "_id": "c", "title": "Proposal3", "description": "This is the description for 3rd proposal.", status: "pending" },
  //   { "_id": "d", "title": "Proposal1", "description": "This is the description for 1st proposal.", status: "active" },
  //   { "_id": "e", "title": "Proposal2", "description": "This is the description for 2nd proposal.", status: "closed" },
  //   { "_id": "f", "title": "Proposal3", "description": "This is the description for 3rd proposal.", status: "pending" },
  // ];

  useEffect(() => {
    getAllProposals();
  }, []);

  const getAllProposals = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const contractABI = process.env.REACT_APP_CONTRACT_ABI;

    // setLoading(true);
    const signer = provider.getSigner();
    console.log(contractAddress + "\n");
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      console.log("Before 1st line");
      const tx = await contract.getAllProposals();
      console.log("get All proposals called!: ", tx);
      setListOfProposals(tx)

      // callToastMessage('New Proposal Created Successfully')
      // setLoading(false);
    } catch (error) {
      console.error('Error creating proposal:', error);
      // callToastMessage('Error creating proposal');
      // setLoading(false);
    }
  }


  const listProposals = listOfProposals.map((component) => (
    <div key={component._id}>
      <ProposalComponent title={component.heading} description={component.description} status={component.open} creator={component.creator} 
      yesCnt={component.yes} noCnt={component.no} contractAddress={props.contractAddress} amount={component.amount} recipientAddress={component.recipient}
      proposalId={component.id} note={component.note}
      />
    </div>
  ));

  return (
    <div>
      {/* {contractAddress} */}
      <h2 className='proposals'>Proposals</h2>
      <div className=''>
        {listProposals}
      </div>
    </div>
  )
}

export default Proposals;