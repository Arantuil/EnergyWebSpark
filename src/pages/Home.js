import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';
import { CiCalendarDate } from 'react-icons/ci';
import { BiUpArrowAlt } from 'react-icons/bi';
import { BiDownArrowAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { GoListOrdered } from 'react-icons/go';
import { TbLetterA } from 'react-icons/tb';
import { TbLetterZ } from 'react-icons/tb';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const Home = () => {
    /* global BigInt */
    const [sortedCampaigns, setSortedCampaigns] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            setSortedCampaigns(data)
        });
    }, []);

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const bcdata = useSelector((state) => state.data);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        CONTRACT_ADDRESS_SHL: "",
        CONTRACT_ADDRESS_CLP: "", 
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        GAS_LIMIT: 0,
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

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    window.addEventListener('load', function () {
        startApp();
    })
    async function startApp() {
        window.ethereum.sendAsync({
            method: "eth_accounts",
            params: [],
            jsonrpc: "2.0",
            id: new Date().getTime()
        }, function (error, result) {
            if (result["result"] !== "") dispatch(connect());
        });
    }
    // -----------------------------------------

    function sortDeadlineUp() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => a.deadline - b.deadline);
        setSortedCampaigns(sorted);
    };

    function sortDeadlineDown() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => b.deadline - a.deadline);
        setSortedCampaigns(sorted);
    };

    function sortDeadlineReset() {
        setSortedCampaigns(sortedCampaigns);
    }

    function sortTitleAtoZ() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        setSortedCampaigns(sorted);
    };

    function sortTitleZtoA() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        setSortedCampaigns(sorted);
    };

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)]'>
            <div className='mx-auto md:w-3/4 lg:w-1/2 xl:w-1/4 
            mb-4 p-4 bg-[#13131a] rounded-[10px]'>
                <p className='font-medium text-[#808191] text-center mb-[10px]'>Filters</p>
                <div className='flex flex-row'>
                    <div className='flex flex-col mx-auto'>
                        <p className='mx-[4px]'><abbr title="Sort by campaign deadline"><CiCalendarDate color="#8C6DFD" size={40} /></abbr></p>
                        <button onClick={sortDeadlineReset} className='ml-[8px] hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg absolute translate-x-[34px]'><RxCross2 color='#8C6DFD' /></button>
                        <div className='flex flex-row w-full'>
                            <button onClick={sortDeadlineUp} className='hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg mx-[1px] flex justify-center w-1/2'><BiUpArrowAlt color="#8C6DFD" size={20} /></button>
                            <button onClick={sortDeadlineDown} className='hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg mx-[1px] flex justify-center w-1/2'><BiDownArrowAlt color="#8C6DFD" size={20} /></button>
                        </div>
                    </div>
                    <div className='flex flex-col mx-auto'>
                        <p className='mx-[4px]'><abbr title="Sort alfabetically by title"><GoListOrdered color="#8C6DFD" size={40} /></abbr></p>
                        <button onClick={sortDeadlineReset} className='ml-[8px] hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg absolute translate-x-[34px]'><RxCross2 color='#8C6DFD' /></button>
                        <div className='flex flex-row w-full'>
                            <button onClick={sortTitleAtoZ} className='hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg mx-[1px] flex justify-center w-1/2'><TbLetterA color="#8C6DFD" size={20} /></button>
                            <button onClick={sortTitleZtoA} className='hover:brightness-110 border-[2px] border-solid border-[#808191] rounded-lg mx-[1px] flex justify-center w-1/2'><TbLetterZ color="#8C6DFD" size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center content-start flex-row flex-wrap'>
                {sortedCampaigns.map((cardInfo) => (
                    <CampaignCard 
                        id={cardInfo.campaignId}
                        title={cardInfo.title} 
                        image={cardInfo.image}
                        owner={cardInfo.owner}
                        username={cardInfo.username}
                        description={cardInfo.description}
                        target={cardInfo.target}
                        amountCollected={cardInfo.amountCollected}
                        deadline={cardInfo.deadline}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;