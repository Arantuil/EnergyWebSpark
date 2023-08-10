import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

const SimpleSwitch = ({status, campaignId}) => {
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

    // -----------------------

    const [isChecked, setIsChecked] = useState(status);

    const [changingStatus, setChangingStatus] = useState(false)
    const changeCampaignStatus = () => {
        setChangingStatus(true);
        blockchain.smartContract.methods
            .editCampaignStatus(
                            campaignId,
                            !isChecked
                            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setChangingStatus(false);
                setIsChecked(!isChecked);
            })
            .catch((error) => {
                console.error(error);
                setChangingStatus(false);
            });
    };

    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative inline-block w-10 h-6 bg-[#262846] rounded-full">
                <input
                    type="checkbox"
                    className="absolute opacity-0 w-0 h-0"
                    checked={isChecked}
                    onChange={changeCampaignStatus}
                />
                <abbr title="Activate/Deactivate this campaign">
                    <div className={`absolute w-6 h-6 rounded-full shadow -left-1 transition-transform duration-300 transform ${isChecked ? 'bg-green-400' : 'translate-x-full bg-yellow-400'}`}></div>
                </abbr>
            </div>
        </label>
    );
}

export default SimpleSwitch;
