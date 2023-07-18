import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';

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

    const testCampaingCards = [
        {
            campaignId: 0,
            title: 'Campaign 1',
            image: 'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg',
            owner: 'Arantuil',
            description: 'Test campaign description',
            target: 100,
            amountCollected: 40,
            deadline: 1690511920000
        },
        {
            campaignId: 1,
            title: 'Campaign 2',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBfTV_7ElXGffcH9EGg6hNFj2dLI8d2-6vyggsrqSx&s',
            owner: 'Arantuil',
            description: 'Test campaign description',
            target: 100,
            amountCollected: 40,
            deadline: 1690511920000
        },
        {
            campaignId: 2,
            title: 'Campaign 3',
            image: 'https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg',
            owner: 'Arantuil',
            description: 'Test campaign description',
            target: 100,
            amountCollected: 20,
            deadline: 1690511920000
        },
        {
            campaignId: 3,
            title: 'Campaign 4',
            image: 'https://images.saymedia-content.com/.image/t_share/MTk2NzY3MjA5ODc0MjY5ODI2/top-10-cutest-cat-photos-of-all-time.jpg',
            owner: 'Arantuil',
            description: 'Test campaign description',
            target: 100,
            amountCollected: 410,
            deadline: 1660511920000
        }
    ];

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