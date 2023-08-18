import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { connect } from '../redux/blockchain/blockchainActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';
import { createCampaign, dashboard, withdraw, logo, menu, search, profile, profileGray } from "../assets";
import { debounce } from 'lodash';
import MetamaskAccountIcon from './MetamaskAccountIcon';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [allCampaigns, setAllCampaigns] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            if (data !== undefined && data !== null) {
                setAllCampaigns(Object.values(data))
            }
        });
    }, []);

    const doSearch = (term) => {
        const results = allCampaigns.filter((item) =>
            item.title.toLowerCase().includes(term.toLowerCase()) || item.username.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };

    const debouncedSearch = debounce(doSearch, 200);

    const handleInputChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    function removeSearchTerm() {
        setSearchTerm('')
    }
    // ------------------------------------------------

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const bcdata = useSelector((state) => state.data);

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [blockchain])

    //console.log(blockchain)
    console.log(bcdata)


    return (
        <div className="3xs:ml-[60px] 2xs:ml-[70px] xs:ml-[80px] ml-[96px] sm:ml-[100px] 3xs:w-[calc(100%-60px-16px)] 2xs:w-[calc(100%-70px-16px)] xs:w-[calc(100%-80px-16px)] w-[calc(100%-96px-24px)] sm:w-[calc(100%-96px-48px)] md:w-[calc(100%-96px-64px)] absolute 3xs:h-[40px] 2xs:h-[45px] xs:h-[50px] h-[60px] gap-1 flex flex-row">
            <div className="flex relative ml-0 mr-auto h-full bg-[#282945] rounded-xl">
                <input
                    type="text"
                    placeholder="search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex text-center w-full lg:w-[200px] xl:w-[250px] 2xl:w-[300px] font-normal text-[12px] placeholder:text-[#75787e] text-white bg-transparent outline-none"
                />
                {searchTerm !== '' ? (
                    <ul className='3xs:translate-y-[40px] 2xs:translate-y-[45px] xs:translate-y-[50px] translate-y-[60px]
                    border-2 border-[#8C6DFD] border-solid z-[100] p-[2px] md:p-[4px] lg:p-[6px] w-[162.94px] lg:w-[200px] xl:w-[250px] 2xl:w-[300px] rounded-bl-xl rounded-br-xl absolute text-white bg-[#1C1D30]'>
                        {searchResults.map((item) => (
                            <div className='my-[3px] sm:my-[4px] md:my-[6px] rounded-md p-[2px] sm:p-[4px] md:p-[6px] border-2 border-solid border-[#282945]'>
                                <Link className='flex flex-row' onClick={removeSearchTerm} key={item.campaignId} to={`/campaigns/${item.campaignId}`}>
                                    <img className='w-[35px] h-[20px] my-auto mr-2' src={item.image} />
                                    <li key={item.campaignId}>{item.title}</li>
                                </Link>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <></>
                )}
                <div className="active:brightness-105 w-[72px] h-full rounded-xl bg-[#8C6DFD] flex justify-center items-center cursor-pointer">
                    <img
                        src={search}
                        alt="search"
                        className="w-[18px] h-[18px] object-contain"
                    />
                </div>
            </div>
            <div className="flex gap-1 relative xs:ml-auto mr-0">
                <CustomButton
                    btnType="button"
                    title={blockchain.account ? "Create a campaign" : "Connect"}
                    styles={blockchain.account ? "2xs:text-[12px] 3xs:text-[10px] 2xs:px-2 active:brightness-105 bg-[#8C6DFD] 2xs:mr-0 xs:mr-1 mr-2 sm:mr-4" : "2xs:text-[12px] 3xs:text-[10px] 2xs:px-2 animate-pulseSlow active:brightness-105 bg-[#8c6dfd] 2xs:mr-0 xs:mr-1 mr-2 sm:mr-4"}
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
                        <div className="h-full aspect-square rounded-full bg-[#282945] flex justify-center items-center cursor-pointer">
                            <img
                                src={profileGray}
                                alt="user"
                                className="w-[60%] h-[60%] object-contain"
                            />
                        </div>
                    </Link>
                ) : (
                    <Link className='flex items-center active:brightness-105' to="/profile">
                        <div className="h-full aspect-square rounded-full bg-[#282945] flex justify-center items-center cursor-pointer">
                            <MetamaskAccountIcon address={blockchain.account} size={32} />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
