import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton  from "./CustomButton";
import { connect } from '../redux/blockchain/blockchainActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';

import { createCampaign, dashboard, withdraw, logo, menu, search, profile } from "../assets";

const Navbar = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const getData = () => {
        console.log('test')
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const navigate = useNavigate();

    return (
        <div className="absolute flex flex-row ml-[7em] w-[calc(100%-7em-2em)] sm:w-[calc(100%-7em-4em)]">
            <div className="flex relative ml-0 mr-auto h-[52px] bg-[#282945] rounded-[100px]">
                <input
                    type="text"
                    placeholder="search for campaigns"
                    className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#75787e] text-white bg-transparent outline-none"
                />
                <div className="w-[72px] h-full rounded-[20px] bg-[#1DC071] flex justify-center items-center cursor-pointer">
                    <img
                        src={search}
                        alt="search"
                        className="w-[18px] h-[18px] object-contain"
                    />
                </div>
            </div>
            <div className="flex relative ml-auto mr-0">
                <CustomButton
                    btnType="button"
                    title={blockchain.account ? "Create a campaign" : "Connect"}
                    styles={blockchain.account ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                    handleClick={() => {
                        if (blockchain.account) navigate("create-campaign");
                        else { 
                            dispatch(connect());
                            getData();
                        }
                    }}
                />
                <Link to="/profile">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#1C1D30] flex justify-center items-center cursor-pointer">
                        <img
                            src={profile}
                            alt="user"
                            className="w-[60%] h-[60%] object-contain"
                        />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
