import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';
import { testCampaingCards } from '../utils/testData';

const Home = () => {
    /* global BigInt */
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

    return (
        <div className='bg-[#282945] rounded-xl mt-20 w-full flex justify-center content-start flex-row flex-wrap'>
            {testCampaingCards.map((cardInfo) => (
                <CampaignCard 
                    id={cardInfo.campaignId}
                    title={cardInfo.title} 
                    image={cardInfo.image}
                    owner={cardInfo.owner}
                    description={cardInfo.description}
                    target={cardInfo.target}
                    amountCollected={cardInfo.amountCollected}
                    deadline={cardInfo.deadline}
                />
            ))}
        </div>
    );
}

export default Home;