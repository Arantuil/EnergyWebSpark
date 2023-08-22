// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyWebSparkV1 is Ownable {
    struct Campaign {
        address owner;
        string username;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        bool campaignAmountWithdrawn;
        string image;
        address[] funders;
        uint256[] contributions;
        bool status;
    }

    mapping(uint256 => Campaign) public campaigns;

    event CampaignCreated( uint256 campaignId, address owner, string username, string title, string description, uint256 target, uint256 deadline, bool campaignAmountWithdrawn, string image, bool status );
    event CampaignEdited( uint256 campaignId, address owner, string username, string title, string description, uint256 target, uint256 deadline, string image );
    event CampaignStatusChanged(uint256 campaignId, address owner, bool status );
    event ContributionMade( uint256 campaignId, address contributor, uint256 amountContributed );
    event ContributionTakenBack( uint256 campaignId, address contributor, uint256 amountContributed );
    event AllContributionsWithdrawn( uint256 campaignId );
    event AllContributionsWithdrawnTargetNotReached( uint256 campaignId ) ;

    uint256 public numberOfCampaigns = 0;

    address payable feeAddress =
        payable(0xBc82Fdc61D8753dcB65b18eca2ea7540Aba2f122);
    uint256 public feePoints = 500;

    function setFeeAddress(address payable _feeAddress) public onlyOwner {
        feeAddress = _feeAddress;
    }

    function setFeePoints(uint256 _feePoints) public onlyOwner {
        feePoints = _feePoints;
    }

    function createCampaign(
        address _owner,
        string memory _username,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future"
        );

        campaign.owner = _owner;
        campaign.username = _username;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.campaignAmountWithdrawn = false;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.status = true;

        emit CampaignCreated(
            numberOfCampaigns,
            _owner,
            _username,
            _title,
            _description,
            _target,
            _deadline,
            false,
            _image,
            true
        );

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function editCampaign(
        uint256 _id,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(
            campaign.owner == msg.sender,
            "Only the campaign owner can edit the campaign"
        );

        require(
            _deadline > block.timestamp,
            "The campaign deadline has to be set to a later date"
        );

        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;

        emit CampaignEdited(
            _id,
            msg.sender,
            campaign.username,
            _title,
            _description,
            _target,
            _deadline,
            _image
        );
    }

    function editCampaignStatus(uint256 _id, bool _status) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(
            campaign.owner == msg.sender,
            "Only the campaign owner can change the status of the campaign"
        );

        require(
            campaign.deadline > block.timestamp,
            "The campaign deadline has to be set to a later date"
        );

        campaign.status = _status;

        emit CampaignStatusChanged(_id, msg.sender, _status);
    }

    function contributeToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        require(
            campaign.status == true,
            "The campaign has to be active to contribute"
        );

        campaign.funders.push(msg.sender);
        campaign.contributions.push(amount);

        require(msg.value > 0);

        campaign.amountCollected = campaign.amountCollected + amount;

        emit ContributionMade(_id, msg.sender, amount);
    }

    function getContributors(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (campaigns[_id].funders, campaigns[_id].contributions);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function withdrawContributions(uint256 _id) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(
            campaign.owner == msg.sender,
            "Only the campaign owner can withdraw contributions"
        );

        require(
            block.timestamp > campaign.deadline,
            "The campaign has not ended yet"
        );

        require(
            campaign.amountCollected >= campaign.target,
            "The campaign target has not been reached"
        );

        require(
            campaign.campaignAmountWithdrawn == false,
            "The campaign amount can only be claimed once"
        );

        uint256 totalAmount = campaign.amountCollected;

        require(totalAmount > 0, "No contributions to withdraw");

        uint256 feeAmount = (totalAmount * feePoints) / 10000;
        uint256 contributorAmount = totalAmount - feeAmount;

        require(payable(msg.sender).send(contributorAmount));
        require(payable(feeAddress).send(feeAmount));

        campaign.campaignAmountWithdrawn = true;

        emit AllContributionsWithdrawn(_id);
    }

    function takeBackContribution(uint256 _id) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(
            campaign.deadline > block.timestamp,
            "The campaign has already ended"
        );

        uint256 totalContributions = 0;
        uint256 indexCount = 0;

        for (uint256 i = 0; i < campaign.funders.length; i++) {
            if (campaign.funders[i] == msg.sender) {
                totalContributions += campaign.contributions[i];
                indexCount++;
            }
        }

        require(
            totalContributions > 0,
            "You haven't made any contributions to this campaign"
        );

        for (uint256 i = 0; i < indexCount; i++) {
            uint256 indexToRemove = getLatestContributionIndex(
                campaign,
                msg.sender
            );

            campaign.funders[indexToRemove] = campaign.funders[
                campaign.funders.length - 1
            ];
            campaign.contributions[indexToRemove] = campaign.contributions[
                campaign.contributions.length - 1
            ];

            campaign.funders.pop();
            campaign.contributions.pop();
        }

        require(payable(msg.sender).send(totalContributions));

        campaign.amountCollected -= totalContributions;

        emit ContributionTakenBack(_id, msg.sender, totalContributions);
    }

    function getLatestContributionIndex(
        Campaign storage campaign,
        address contributor
    ) internal view returns (uint256) {
        for (uint256 i = campaign.funders.length - 1; i >= 0; i--) {
            if (campaign.funders[i] == contributor) {
                return i;
            }
        }
        revert("Contributor not found");
    }

    function refundAllContributions(uint256 _id) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");

        Campaign storage campaign = campaigns[_id];

        require(
            block.timestamp > campaign.deadline,
            "The campaign has not ended yet"
        );

        require(
            campaign.amountCollected < campaign.target,
            "The campaign has reached it's target"
        );

        require(
            campaign.campaignAmountWithdrawn == false,
            "The campaign amount has already been withdrawn"
        );

        campaign.campaignAmountWithdrawn = true;

        for (uint256 i = 0; i < campaign.funders.length; i++) {
            address contributor = campaign.funders[i];
            uint256 contributionAmount = campaign.contributions[i];

            if (contributionAmount > 0) {
                require(payable(contributor).send(contributionAmount));
            }
        }

        emit AllContributionsWithdrawnTargetNotReached(_id);
    }
}
