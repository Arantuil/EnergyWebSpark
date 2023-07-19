import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton  from "./CustomButton";
import { connect } from '../redux/blockchain/blockchainActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';

import { createCampaign, dashboard, withdraw, logo, menu, search, profile, profileGray } from "../assets";

const Navbar = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [])

    console.log(blockchain)

    const navigate = useNavigate();

    return (
        <div className="absolute gap-1 sm:gap-2 md:gap-3 flex flex-row ml-24 sm:ml-[6.5rem] w-[calc(100%-7em-0.5em)] sm:w-[calc(100%-7em-4em)]">
            <div className="flex relative ml-0 mr-auto h-[56px] bg-[#282945] rounded-xl">
                <input
                    type="text"
                    placeholder="search for campaigns"
                    className="flex text-center w-full font-epilogue font-normal text-[12px] sm:text-[14px] placeholder:text-[#75787e] text-white bg-transparent outline-none"
                />
                <div className="active:brightness-105 w-[72px] h-full rounded-xl bg-[#8C6DFD] flex justify-center items-center cursor-pointer">
                    <img
                        src={search}
                        alt="search"
                        className="w-[18px] h-[18px] object-contain"
                    />
                </div>
            </div>
            <div className="flex gap-1 sm:gap-2 md:gap-3 relative ml-auto mr-0">
                <CustomButton
                    btnType="button"
                    title={blockchain.account ? "Create a campaign" : "Connect"}
                    styles={blockchain.account ? "active:brightness-105 bg-[#8C6DFD]" : "active:brightness-105 bg-[#8c6dfd]"}
                    handleClick={() => {
                        if (blockchain.account) navigate("create-campaign");
                        else { 
                            dispatch(connect());
                            getData();
                        }
                    }}
                />
                {blockchain.account === "" || blockchain.account === null ? (
                    <Link className='flex items-center active:brightness-105' to="/profile">
                        <div className="w-[52px] h-[52px] rounded-full bg-[#282945] flex justify-center items-center cursor-pointer">
                            <img
                                src={profileGray}
                                alt="user"
                                className="w-[60%] h-[60%] object-contain"
                            />
                        </div>
                    </Link>
                ) : (
                <Link className='flex items-center active:brightness-105' to="/profile">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#282945] flex justify-center items-center cursor-pointer">
                        <img
                            src={profile}
                            alt="user"
                            className="w-[60%] h-[60%] object-contain"
                        />
                    </div>
                </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
