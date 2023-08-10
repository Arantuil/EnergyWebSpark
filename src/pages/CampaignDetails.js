import { calculateBarPercentage } from "../utils";
import CustomButton from "../components/CustomButton";
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useParams } from 'react-router-dom';
import MetamaskAccountIcon from '../components/MetamaskAccountIcon';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const CampaignDetails = () => {
    const blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();

    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: null
            },
            GAS_LIMIT: null
    });

    const getConfig = async () => {
        const configResponse = await fetch('/config/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    // -----------------------

    const { id } = useParams();

    const [sortedCampaigns, setSortedCampaigns] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            if (data) {
                const campaignsArray = Object.values(data);
                const targetCampaign = campaignsArray.find(campaign => campaign.campaignId === parseInt(id));
                setSortedCampaigns(targetCampaign);
            }
        });
    }, [id]);

    console.log(sortedCampaigns)

    const [funderEntries, setFunderEntries] = useState([]);
    useEffect(() => {        
        if (sortedCampaigns.funders !== null && sortedCampaigns.funders !== undefined) {
            let sortedFunderEntries = Object.entries(sortedCampaigns.funders).sort((a, b) => b[1] - a[1]);
            setFunderEntries(sortedFunderEntries);  
        }
    }, [sortedCampaigns]);

    const [fundButtonOn, setFundButtonOn] = useState(false);
    const [amount, setAmount] = useState(0);
    function setNewAmount() {
        let newAmountToSet = document.getElementById('currentFundAmount').value
        setAmount(newAmountToSet);
    }

    useEffect(() => {
        if (amount > 0) {
            setFundButtonOn(true)
        }
    }, [amount])

    const canvasStyles = {
        position: 'absolute',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: '0%',
        left: '0%'
    }

    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.1, {
            spread: 30,
            startVelocity: 20,
            decay: 0.94,
            scalar: 1.0
        });
        makeShot(0.13, {
            spread: 40,
            startVelocity: 40,
            decay: 0.93,
            scalar: 1.0
        });
        makeShot(0.15, {
            spread: 50,
            startVelocity: 30,
            decay: 0.95,
            scalar: 1.0
        });
    }, [makeShot]);

    const truncateAddress = (address, charsToShow) => {
        if (!address) return '';
        const prefix = address.substring(0, charsToShow);
        const suffix = address.substring(address.length - charsToShow);
        return `${prefix}...${suffix}`;
    };

    const [showingAllEntries, setShowingAllEntries] = useState(false);

    const [contributionInProcess, setContributionInProcess] = useState(false);
    const handleDonate = () => {
        setContributionInProcess(true);
        blockchain.smartContract.methods
            .contributeToCampaign(
                            id
                            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 1e13,
            })
            .then((receipt) => {
                console.log(receipt)
                setContributionInProcess(false);
                fire()
            })
            .catch((error) => {
                console.error(error);
                setContributionInProcess(false);
            });
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            
            {sortedCampaigns !== [] && sortedCampaigns.length !== 0 ? (
            <div className='xl:px-auto xl:max-w-[900px]'>
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                <div className="flex-1 flex-col">
                    <img
                        src={sortedCampaigns.image}
                        alt="campaign"
                        className="4xs:h-[150px] 3xs:h-[200px] 2xs:h-[250px] xs:h-[300px] h-[350px] sm:h-[400px] w-full object-cover rounded-xl"
                    />
                    <div className="rounded relative w-full h-[7px] bg-[#3a3a43] mt-2">
                        <div
                            className="rounded absolute h-full bg-[#4acd8d]"
                            style={{
                                width: `${calculateBarPercentage(
                                    sortedCampaigns.target,
                                    sortedCampaigns.amountContributed/1e18
                                )}%`,
                                maxWidth: "100%",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-semibold text-[18px] text-white uppercase">
                            Creator
                        </h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32]">
                                <MetamaskAccountIcon size={32} address={sortedCampaigns.owner} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[14px] text-white break-all">
                                    {sortedCampaigns.username}<span className='text-[#808191]'> - {truncateAddress(sortedCampaigns.owner, 5)}</span>
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold text-[18px] text-white uppercase">
                            Title
                        </h2>
                        <div className="mt-[20px]">
                            <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {sortedCampaigns.title}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[18px] text-white uppercase">
                            Description
                        </h4>

                        <div className="mt-[20px] ">
                            <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {sortedCampaigns.description}
                            </p>
                        </div>
                    </div>

                    <div>
                        {showingAllEntries === false && funderEntries.length > 0 ? (
                        <h4 className="font-semibold text-[18px] text-white">
                            <span className='uppercase'>Funders </span><span className='font-normal text-[16px] text-[#808191]'>(only showing top 3 funders)</span>
                        </h4>
                        ) : (
                        <h4 className="font-semibold text-[18px] text-white uppercase">
                            Funders
                        </h4>
                        )}
                        <div className="mt-[20px] flex flex-col gap-4">
                        {funderEntries.length > 0 && funderEntries.length !== [] ? (
                            showingAllEntries === false ? (
                                funderEntries.slice(0, 3).map((funder) => (
                                    <div className="flex justify-between items-center gap-4">
                                        <MetamaskAccountIcon size={22} address={funder[0]} />
                                        <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hover:text-[#8C6DFD] font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                            {truncateAddress(funder[0],5)}
                                        </a>
                                        <p className="font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                                            {funder[1]} EWT
                                        </p>
                                    </div>
                                ))
                                ) : (
                                    funderEntries.map((funder) => (
                                        <div className="flex justify-between items-center gap-4">
                                            <MetamaskAccountIcon size={22} address={funder[0]} />
                                            <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hover:text-[#8C6DFD] font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                {truncateAddress(funder[0],5)}
                                            </a>
                                            <p className="font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                                                {funder[1]} EWT
                                            </p>
                                        </div>
                                    ))
                                )
                                ) : (
                                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                        No funders yet. Be the first one
                                    </p>    
                                )}

                                {showingAllEntries === false ? (
                                    <button
                                        className="text-[#8C6DFD] hover:text-white cursor-pointer font-normal text-[16px] leading-[26px]"
                                        onClick={() => setShowingAllEntries(true)}
                                    >
                                        Show all funders
                                    </button>
                                ): (<></>)}

                                {showingAllEntries === true ? (
                                    <button
                                        className="text-[#8C6DFD] hover:text-white cursor-pointer font-normal text-[16px] leading-[26px]"
                                        onClick={() => setShowingAllEntries(false)}
                                    >
                                        Show less funders
                                    </button>
                                ) : (<></>)}
                            </div>
                        </div>

                </div>
                <div className="flex-1">
                    <div className="flex flex-col p-4 bg-[#282945] rounded-[10px]">
                        <div className="w-[90%] mx-auto">
                            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
                            <div className="relative">
                                {sortedCampaigns.status === false ? (
                                        <div className="absolute rounded-xl top-[-7.5%] left-[-7.5%] w-[115%] h-[115%] z-1 bg-[rgba(250,204,21,0.15)]">
                                            <p className="font-medium absolute p-2 rounded-xl bg-[rgba(0,0,0,0.5)] text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Campaign paused</p>
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                }
                                <div>
                                    <p className='text-white mb-[10px] text-[14px] text-center'>{Math.round(sortedCampaigns.amountContributed/1e18 * 100) / 100} EWT <span className='font-normal text-[#808191]'>Out of</span> {sortedCampaigns.target} EWT <span className='font-normal text-[#808191]'>collected (</span>{(sortedCampaigns.amountContributed / 1e18 / sortedCampaigns.target * 100).toFixed(2)}%<span className='font-normal text-[#808191]'>)</span></p>
                                    <input
                                        id='currentFundAmount'
                                        type="number"
                                        placeholder="1 EWT"
                                        step="0.1"
                                        className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                        onChange={setNewAmount}
                                    />
                                    {fundButtonOn === true ? (
                                        blockchain.account !== null && blockchain.account !== "" ? (
                                        <CustomButton
                                            btnType="button"
                                            disabled={contributionInProcess}
                                            title={`${contributionInProcess ? "Funding Campaign..." : "Fund Campaign"}`}
                                            styles={`${contributionInProcess ? "bg-[rgba(74,205,141,0.5)]" : "bg-[#4ACD8D]"} w-full h-[60px] mt-[20px]`}
                                            handleClick={handleDonate}
                                        />
                                        ) : (
                                            <CustomButton
                                            btnType="button"
                                            title="Connect"
                                            styles="w-full bg-[#8C6DFD] h-[60px] mt-[20px]"
                                            handleClick={() => {
                                                dispatch(connect());
                                            }}
                                        />
                                        )
                                    ) : (
                                        <CustomButton
                                        disabled={true}
                                        btnType="button"
                                        title="Fund Campaign"
                                        styles="w-full bg-[#678191] h-[60px] mt-[20px]"
                                        handleClick={handleDonate}
                                        />
                                    )}
                                    </div>
                            </div>
                            <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                                <h4 className="font-semibold text-[14px] leading-[22px] text-white">
                                    Back it just because you believe in it.
                                </h4>
                                <p className="mt-[20px] font-normal leading-[22px] text-[#808191]">
                                    Support the project for no reward, unless the campaign specifically says there will be a reward for all the funders if the target gets reached.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            ) : (
                <></>
            )}

        </div>
    );
};

export default CampaignDetails;
