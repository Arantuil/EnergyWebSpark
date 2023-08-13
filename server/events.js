const config = require('./config');
const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("./ewccrowdfunding-firebase-adminsdk-2b1q4-51eaa460a4.json");
const app = express();
const port = 8082;
const ethers = require("ethers");

const contractAddress = config.contractAddress;
const contractAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"username","type":"string"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"target","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"string","name":"image","type":"string"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"CampaignCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"username","type":"string"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"target","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"string","name":"image","type":"string"}],"name":"CampaignEdited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"CampaignStatusChanged","type":"event"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"contributeToCampaign","outputs":[],"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountContributed","type":"uint256"}],"name":"ContributionMade","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"string","name":"_username","type":"string"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"string","name":"_image","type":"string"}],"name":"createCampaign","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"string","name":"_image","type":"string"}],"name":"editCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"editCampaignStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePoints","type":"uint256"}],"name":"setFeePoints","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"takeBackContribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address payable","name":"_campaignOwnerAddress","type":"address"}],"name":"withdrawContributions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountCollected","type":"uint256"},{"internalType":"string","name":"image","type":"string"},{"internalType":"bool","name":"status","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feePoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCampaigns","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountCollected","type":"uint256"},{"internalType":"string","name":"image","type":"string"},{"internalType":"address[]","name":"funders","type":"address[]"},{"internalType":"uint256[]","name":"contributions","type":"uint256[]"},{"internalType":"bool","name":"status","type":"bool"}],"internalType":"struct Test.Campaign[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getContributors","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfCampaigns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const provider = new ethers.providers.JsonRpcProvider(config.rpc);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ewccrowdfunding-default-rtdb.firebaseio.com"
});
const db = admin.database();

contract.on("CampaignCreated", (
    _campaignId, _owner, _username, _title, _description, _target, _deadline, _image, _status) => {
    try {
        console.log(`Campaign created with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignId: parseInt(_campaignId),
            owner: _owner.toString(),
            username: _username.toString(),
            title: _title.toString(),
            description: _description.toString(),
            target: Number(_target),
            deadline: parseInt(_deadline),
            image: _image.toString(),
            status: _status
        });
    } catch (error) {
        console.error("Error in CampaignCreated event:", error);
    }
});

contract.on("CampaignEdited", (
    _campaignId, _owner, _username, _title, _description, _target, _deadline, _image) => {
    try {
        console.log(`Campaign edited with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignId: parseInt(_campaignId),
            owner: _owner.toString(),
            username: _username.toString(),
            title: _title.toString(),
            description: _description.toString(),
            target: Number(_target),
            deadline: parseInt(_deadline),
            image: _image.toString()
        });
    } catch (error) {
        console.error("Error in CampaignEdited event:", error);
    }
});

contract.on("ContributionMade", async (
    _campaignId, _contributor, _amountContributed) => {
    try {
        console.log(`Contribution made to campaign with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}/contributions`);
        const ref2 = db.ref(`/${parseInt(_campaignId.toString())}/amountContributed`);
        const rootref = db.ref(`/${parseInt(_campaignId.toString())}/`);
        let currentDonatedAmount = (await ref2.get()).val()
        ref.push({
            contributor: _contributor.toString(),
            contribution: Number(_amountContributed)
        });
        rootref.update({
            amountContributed: Number(_amountContributed) + currentDonatedAmount
        });
    } catch (error) {
        console.error("Error in ContributionMade event:", error);
    }
});

contract.on("CampaignStatusChanged", (
    _campaignId, _owner, _status) => {
    try {
        console.log(`Campaign status changed with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            status: _status
        });
    } catch (error) {
        console.error("Error in CampaignStatusChanged event:", error);
    }
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});