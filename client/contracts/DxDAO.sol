// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DxClubDAO {
    uint256 constant minProposalDebatePeriod = 2 minutes;

    uint256 public constant executeProposalPeriod = 1 days;

    uint256 public debatingPeriod = 4 minutes;

    Proposal[] public proposals;

    uint256 public lastTimeMinQuorumMet;

    uint256 public quorumPercentage;

    address public daoadmin;

    string public daoname;

    string public daodescription;

    mapping(address => bool) public allowedRecipients;

    mapping(address => uint256) public blocked;

    mapping(address => uint256[]) public votingRegister;

    mapping(address => bool) public voterslist;

    mapping(address => bool) proposalcreators;

    mapping(address => bool) admins;

    uint public voterscount;

    uint256 public proposalDeposit;

    uint256 public sumOfProposalDeposits;

    struct Proposal {
        uint256 id;
        address recipient;
        uint256 amount;
        string heading;
        string description;
        uint256 votingDeadline;
        bool open;
        bool proposalPassed;
        uint256 proposalDeposit;
        bool newadmin;
        uint256 yes;
        uint256 no;
        address creator;
        string note;
    }

    event ProposalAdded(
        uint256 indexed proposalID,
        address recipient,
        uint256 amount,
        string description
    );

    event Voted(
        uint256 indexed proposalID,
        bool position,
        address indexed voter
    );
    event ProposalTallied(
        uint256 indexed proposalID,
        bool result,
        uint256 quorum
    );
    event AllowedRecipientChanged(address indexed _recipient, bool _allowed);

    modifier onlyDAOAdmin() {
        require(admins[msg.sender], "Not a DAO admin");
        _;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    constructor(
        address _creater,
        string memory _name,
        string memory _description
    ) {
        daoadmin = _creater;
        lastTimeMinQuorumMet = block.timestamp;
        daoname = _name;
        daodescription = _description;
        allowedRecipients[address(this)] = true;
        allowedRecipients[daoadmin] = true;
        admins[daoadmin] = true;
        proposalcreators[daoadmin] = true;
        voterscount++;
        voterslist[daoadmin] = true;
        quorumPercentage = 50;
    }

    function whitelistrecipients(address _recipient) public onlyDAOAdmin {
        require(!allowedRecipients[_recipient], "Already whitelisted");
        allowedRecipients[_recipient] = true;
    }

    function checkVoter(address _voter) public view returns (bool) {
        if (voterslist[_voter] == true) return true;
        else return false;
    }

    function enrollMembers(
        address _voter
    ) public onlyDAOAdmin returns (bool _success) {
        if (voterslist[_voter]) return false;
        else {
            voterslist[_voter] = true;
            voterscount++;
            return true;
        }
    }

    modifier onlyVoter() {
        require(voterslist[msg.sender], "You are not a valid voter");
        _;
    }

    function vote(
        uint256 _proposalID,
        bool _supportsProposal
    ) public onlyVoter {
        Proposal storage p = proposals[_proposalID];

        if (_supportsProposal) {
            p.yes += 1;
        } else {
            p.no += 1;
        }

        votingRegister[msg.sender].push(_proposalID);
        emit Voted(_proposalID, _supportsProposal, msg.sender);
    }

    modifier onlyProposalCreator() {
        require(
            proposalcreators[msg.sender],
            "You are not authorized to create proposals. Contact Admin"
        );
        _;
    }

    function newProposal(
        address _recipient,
        uint256 _amount,
        string memory _heading,
        string memory _description
    ) public payable onlyProposalCreator returns (uint256 _proposalID) {
        uint256 _debatingPeriod = 3 minutes;
        require(
            allowedRecipients[_recipient] ||
                _debatingPeriod >= minProposalDebatePeriod ||
                _debatingPeriod <= 30 minutes ||
                msg.value >= proposalDeposit ||
                msg.sender != address(this), //to prevent a 51% attacker to convert the ether into deposit
            "Invalid parameters / user for new proposal creation"
        );

        if (proposals.length == 0) lastTimeMinQuorumMet = block.timestamp;

        _proposalID = proposals.length + 1;
        Proposal storage p = proposals.push();
        p.id = _proposalID;
        p.heading = _heading;
        p.description = _description;
        p.votingDeadline = block.timestamp + debatingPeriod;
        p.open = true;
        p.creator = msg.sender;
        p.recipient = _recipient;
        p.amount = _amount;
        p.proposalDeposit = msg.value;
        sumOfProposalDeposits += msg.value;

        emit ProposalAdded(_proposalID, _recipient, _amount, _description);
    }

    event ProposalAddedSimple(uint256 indexed proposalID, string description);

    function newProposalSimple(
        string memory _heading,
        string memory _description
    ) public onlyProposalCreator returns (uint256 _proposalID) {
        uint256 _debatingPeriod = 3 minutes;
        require(
            _debatingPeriod >= minProposalDebatePeriod ||
                _debatingPeriod <= 30 minutes ||
                msg.sender != address(this), //to prevent a 51% attacker to convert the ether into deposit
            "Invalid parameters / user for new proposal creation"
        );
        _proposalID = proposals.length + 1;
        Proposal storage p = proposals.push();
        p.id = _proposalID;
        p.heading = _heading;
        p.description = _description;
        p.votingDeadline = block.timestamp + debatingPeriod;
        p.open = true;
        p.creator = msg.sender;

        emit ProposalAddedSimple(_proposalID, _description);
    }

    function executeProposal(uint256 _proposalID) public {
        Proposal storage p = proposals[_proposalID];

        require(p.open, "Proposal already closed");
        require(
            p.votingDeadline <= block.timestamp,
            "Voting period has not ended"
        );

        require(
            (p.votingDeadline + executeProposalPeriod) >= block.timestamp,
            "Execution period has expired"
        );
        uint256 quorum = ((p.yes + p.no) * 100);
        if (quorum >= (voterscount * quorumPercentage)) {
            if (p.yes >= p.no) {
                if (p.amount > 0) {
                    require(
                        address(this).balance >= p.amount,
                        "Insufficient contract balance"
                    );
                    (bool success, ) = p.recipient.call{value: p.amount}("");
                    require(success, "Transfer failed");
                    closeProposal(_proposalID);
                    p.proposalPassed = true;
                    p.open = false;
                    p.note = "ACCEPTED";
                    closeProposal(_proposalID);
                } else if (p.amount == 0) {
                    p.proposalPassed = true;
                    p.open = false;
                    p.note = "ACCEPTED";
                }
            } else {
                if (p.amount > 0) {
                    require(
                        address(this).balance >= p.amount,
                        "Insufficient contract balance"
                    );
                    (bool success, ) = p.creator.call{value: p.amount}("");
                    require(success, "Transfer failed");
                    closeProposal(_proposalID);
                    p.proposalPassed = false;
                    p.note = "REJECTED";
                } else if (p.amount == 0) {
                    p.proposalPassed = false;

                    p.note = "REJECTED";
                    p.open = false;
                }
            }
        } else {
            p.proposalPassed = false;
            p.open = false;

            p.note = "QUORUM NOT REACHED(R)";
        }

        emit ProposalTallied(_proposalID, p.proposalPassed, quorum);
    }

    // function executeProposal1(uint256 _proposalID)
    //     public
    //     returns (bool _success)
    // {
    //     Proposal storage p = proposals[_proposalID];

    //     if (
    //         p.open && block.timestamp > p.votingDeadline + executeProposalPeriod
    //     ) {
    //         closeProposal(_proposalID);
    //         return false;
    //     }

    //     require(
    //         block.timestamp > p.votingDeadline || // has the voting deadline arrived?
    //             p.open ||
    //             !p.proposalPassed  // anyone trying to call us recursively?

    //     );

    //     if (!allowedRecipients[p.recipient]) {
    //         closeProposal(_proposalID);
    //         payable(p.creator).transfer(p.proposalDeposit);
    //         return false;
    //     }

    //     bool proposalCheck = true;

    //     if (p.amount > actualBalance())
    //         proposalCheck = false;

    //     uint256 quorum = p.yes;

    //     if (quorum >= minQuorum(p.amount)) {
    //         payable(p.creator).transfer(p.proposalDeposit);

    //         // /*
    //         // if (!p.creator.send(p.proposalDeposit))
    //         //     throw;
    //         //   */

    //         lastTimeMinQuorumMet = block.timestamp;
    //     //    if (quorum > token.totalSupply() / 7) minQuorumDivisor = 7;
    //     }

    //     if (quorum >= minQuorum(p.amount) && p.yes > p.no && proposalCheck) {
    //         p.proposalPassed = true;

    //       //*********  payable(p.recipient).transfer(p.amount);

    //         /* if (!p.recipient.call.value(p.amount)(_transactionData))
    //             throw;
    //         */
    //         _success = true;

    //     }

    //     closeProposal(_proposalID);

    //     emit ProposalTallied(_proposalID, _success, quorum);
    // }

    function closeProposal(uint256 _proposalID) internal {
        Proposal storage p = proposals[_proposalID];
        if (p.open) sumOfProposalDeposits -= p.proposalDeposit;
        p.open = false;
    }

    function changeAllowedRecipients(
        address _recipient,
        bool _allowed
    ) external returns (bool _success) {
        require(msg.sender == daoadmin);

        allowedRecipients[_recipient] = _allowed;
        emit AllowedRecipientChanged(_recipient, _allowed);
        return true;
    }

    function actualBalance() public view returns (uint256 _actualBalance) {
        return address(this).balance - sumOfProposalDeposits;
    }

    function changeProposalDeposit(uint256 _proposalDeposit) external {
        require(
            msg.sender == address(this) || _proposalDeposit < (actualBalance()),
            "Only contract can call / Check balance"
        );

        /*
        if (msg.sender != address(this) || _proposalDeposit > (actualBalance())
            / maxDepositDivisor) {
            throw;
        }*/

        proposalDeposit = _proposalDeposit;
    }

    function numberOfProposals()
        public
        view
        returns (uint256 _numberOfProposals)
    {
        if (proposals.length == 0) {
            return 0;
        } else {
            return proposals.length;
        }
    }

    function getOrModifyBlocked(address _account) internal returns (bool) {
        if (blocked[_account] == 0) return false;
        Proposal storage p = proposals[blocked[_account]];
        if (!p.open) {
            blocked[_account] = 0;
            return false;
        } else {
            return true;
        }
    }

    function unblockMe() public returns (bool) {
        return getOrModifyBlocked(msg.sender);
    }
}
