import { calculateBarPercentage, hoursLeft, daysLeft } from "../utils";
import { profile } from '../assets'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SimpleSwitch from './SimpleSwitch';
import { useState, useEffect } from 'react';

const CampaignCard = ({ id, styles, title, image, owner, username, description, target, amountContributed, deadline, isProfilePage, status }) => {
    const navigate = useNavigate();
    const blockchain = useSelector((state) => state.blockchain);

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

    const currentTimestamp = Date.now();

    const [withdrawing, setWithdrawing] = useState(false)
    const withdrawFundsFromCampaign = () => {
        setWithdrawing(true);
        blockchain.smartContract.methods
            .withdrawContributions(
                id,
                blockchain.account
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setWithdrawing(false);
            })
            .catch((error) => {
                console.error(error);
                setWithdrawing(false);
            });
    };

    function editCampaign(idOfCampaign) {
        navigate('/edit-campaign/' + String(idOfCampaign))
    }

    console.log('ended:', currentTimestamp>deadline)
    console.log(deadline-currentTimestamp)

    return (
        isProfilePage === true ? (
            <div className="max-w-[95%] w-full sm:w-[270px] m-2 sm:m-4 rounded-xl bg-[#1C1D30]">
                {deadline > currentTimestamp && status === true ? (
                    <div>
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-green-400'>
                        </div>
                    </div>
                ) : (
                    status === false ? (
                        <div>
                            <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-yellow-400'>
                            </div>
                        </div>
                    ) : (
                    <div>
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-red-400'>
                        </div>
                    </div>
                    )
                )}
                <img
                    src={image}
                    alt="fund"
                    className="cursor-pointer w-full h-[160px] object-cover rounded-xl"
                    onClick={() => { navigate('/campaigns/' + String(id)) }}

                />
                <div className='translate-y-[-4px] relative rounded h-[4px] w-full bg-[#3a3a43]'>
                    <div style={{
                        width: `${calculateBarPercentage(
                            target,
                            amountContributed/1e18
                        )}%`,
                        maxWidth: "100%",
                    }}
                        className='absolute h-full rounded bg-[#1DC071]'></div>
                </div>

                <div className="flex flex-col p-4">
                    <div className="block">
                        <h3 className="font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                            {title}
                        </h3>
                        <p className="mt-[5px] font-normal text-[#808191] text-left leading-[20px] truncate">
                            {description}
                        </p>
                    </div>

                    <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                        <div className="flex flex-col">
                            {amountContributed > 0 ? (
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {Math.round(amountContributed/1e18 * 1000) / 1000} EWT
                                </h4>
                            ) : (
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    0 EWT
                                </h4>
                            )}
                            <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                Raised out of {target} EWT
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col mr-2">
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Days
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Hours
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#262846] rounded-lg p-[3px] sm:p-[6px] flex items-center mt-[20px] gap-2 ">
                        <div className="w-full flex flex-col">
                            <h4 className="text-center font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                Options
                            </h4>
                            <div className="my-[5px] flex flex-row w-full">
                                {deadline > currentTimestamp ? (
                                    <button disabled={true} className="cursor-default grayscale bg-[#8C6DFD] p-1 sm:p-2 rounded-md mx-auto w-[85px] mt-[3px] font-normal text-[12px] leading-[20px] text-white">
                                        Withdraw
                                    </button>
                                ) : (
                                    withdrawing === true ? (
                                        <button className="cursor-default grayscale bg-[#8C6DFD] p-1 sm:p-2 rounded-md mx-auto w-[85px] mt-[3px] font-normal text-[12px] leading-[20px] text-white">
                                            Withdrawing
                                        </button>
                                    ) : (
                                        <button onClick={withdrawFundsFromCampaign} className="hover:brightness-110 bg-[#8C6DFD] p-[2px] sm:p-1 rounded-md mx-auto w-[85px] mt-[3px] font-normal text-[12px] leading-[20px] text-white">
                                            Withdraw
                                        </button>
                                    )
                                )}
                                {deadline > currentTimestamp ? (
                                    <button
                                        onClick={() => { editCampaign(id) }}
                                        className="hover:brightness-110 bg-[#44BDD0] p-1 sm:p-2 rounded-md mx-auto w-[85px] mt-[3px] font-normal text-[12px] leading-[20px] text-white">
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { withdrawFundsFromCampaign(id) }}
                                        className="bg-[#44BDD0] cursor-default grayscale p-1 sm:p-2 rounded-md mx-auto w-[85px] mt-[3px] font-normal text-[12px] leading-[20px] text-white">
                                        Ended
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-[20px] gap-2">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a}">
                            <img
                                src={profile}
                                alt="user"
                                className="w-1/2 h-1/2 object-contain"
                            />
                        </div>
                        <p className="flex-1 font-normal text-[12px] text-[#808191] truncate">
                            By <span className="text-[#b2b3bd]">{username}</span>
                        </p>
                        <SimpleSwitch status={status} campaignId={id} deadline={deadline} />
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="hover:brightness-110 max-w-[95%] w-full sm:w-[270px] m-2 sm:m-4 rounded-xl bg-[#1C1D30] cursor-pointer"
                onClick={() => { navigate('campaigns/' + String(id)) }}
            >
                {deadline > currentTimestamp && status === true ? (
                    <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-green-500'></div>
                ) : (
                    status === false ? (
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-yellow-400'></div>
                    ) : (
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 bg-red-500'></div>
                    )
                )}
                <img
                    src={image}
                    alt="fund"
                    className="w-full h-[160px] object-cover rounded-xl"

                />
                <div className='translate-y-[-4px] relative rounded h-[4px] w-full bg-[#3a3a43]'>
                    <div style={{
                        width: `${calculateBarPercentage(
                            target,
                            amountContributed/1e18
                        )}%`,
                        maxWidth: "100%",
                    }}
                        className='absolute h-full rounded bg-[#1DC071]'></div>
                </div>

                <div className="flex flex-col p-4">
                    <div className="block">
                        <h3 className="font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                            {title}
                        </h3>
                        <p className="mt-[5px] font-normal text-[#808191] text-left leading-[20px] truncate">
                            {description}
                        </p>
                    </div>

                    <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                        <div className="flex flex-col">
                            {amountContributed > 0 ? (
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {Math.round(amountContributed/1e18 * 100) / 100} EWT
                                </h4>
                            ) : (
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    0 EWT
                                </h4>
                            )}
                            <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                Raised out of {target} EWT
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col mr-2">
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Days
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Hours
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-[20px] gap-2">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a}">
                            <img
                                src={profile}
                                alt="user"
                                className="w-1/2 h-1/2 object-contain"
                            />
                        </div>
                        <p className="flex-1 font-normal text-[12px] text-[#808191] truncate">
                            By <span className="text-[#b2b3bd]">{username}</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    );
};

export default CampaignCard;
