import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { CustomButton } from "../components/CustomButton";
import { Loader } from "../components/Loader";
import { calculateBarPercentage, daysLeft } from "../utils";
import { profile } from "../assets";
import { testCampaingCards } from '../utils/testData';

const CampaignDetails = () => {
    const currentPageID = (window.location.pathname).slice(11)
    console.log(currentPageID)

    const [amount, setAmount] = useState(0);
    console.log(amount)

    return (
        <div className="rounded-xl justify-start w-full mt-20 bg-[#282945] flex items-center flex-col sm:p-10 p-4">
            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                <div className="flex-1 flex-col">
                    <img
                        src={testCampaingCards[currentPageID].image}
                        alt="campaign"
                        className="w-full h-[410px] object-cover rounded-xl"
                    />
                    <div className="rounded relative w-full h-[7px] bg-[#3a3a43] mt-2">
                        <div
                            className="rounded absolute h-full bg-[#4acd8d]"
                            style={{
                                width: `${calculateBarPercentage(
                                    testCampaingCards[currentPageID].target,
                                    testCampaingCards[currentPageID].amountCollected
                                )}%`,
                                maxWidth: "100%",
                            }}
                        ></div>
                    </div>
                </div>

                {/*<div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
                    <CountBox title="Days Left" value={remainingDays} />
                    <CountBox
                        title={`Raised of ${testCampaingCards[currentPageID].target}`}
                        value={testCampaingCards[currentPageID].amountCollected}
                    />
                </div>*/}
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Creator
                        </h4>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img
                                    src={profile}
                                    alt="user"
                                    className="w-[60%] h-[60%] object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                                    {testCampaingCards[currentPageID].owner}
                                </h4>
                                {/*<p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                                    10 Campaigns
                                </p>*/}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Description
                        </h4>

                        <div className="mt-[20px] ">
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {testCampaingCards[currentPageID].description}
                            </p>
                        </div>
                    </div>

                    {/*<div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Donators
                        </h4>

                        <div className="mt-[20px] flex flex-col gap-4">
                            {donators.length > 0 ? (
                                donators.map((donator, index) => (
                                    <div
                                        key={`${donator.donator}-${index}`}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                            {index + 1}. {donator.donator}
                                        </p>
                                        <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                                            {donator.donations} ETH
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                    No donators yet. Be the first one
                                </p>
                            )}

                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {state.description}
                            </p>
                        </div>
                    </div>*/}
                </div>
                <div className="flex-1">
                    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                        Fund
                    </h4>

                    <div className="mt-[20px] flex flex-col p-4 bg-[#282945] rounded-[10px]">
                        <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                            Fund the campaign
                        </p>
                        <div className="mt-[30px] ">
                            <input
                                type="number"
                                placeholder="1 EWT"
                                step="0.1"
                                className="w-full py-[10px] sm:px-[20px] px-[15] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                                    Back it just because you believe in it.
                                </h4>
                                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                                    Support the project for no reward, unless the campaign specifically says there will be a reward for all the funders if the target gets reached.
                                </p>
                            </div>
                            {/*<CustomButton
                                btnType="button"
                                title="Fund Campaign"
                                styles="w-full bg-[#8c6dfd]"
                                handleClick={handleDonate}
                            />
                            */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
