import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../assets";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { checkIfImage } from "../utils";

import { connect } from '../redux/blockchain/blockchainActions';
import { useSelector, useDispatch } from 'react-redux';

const CreateCampaign = () => {
    const blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    //const { createCampaign } = useStateContext();
    const [isloading, setIsloading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    });

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    function datetimeToUnixTimestamp(datetimeString) {
        const unixTimestamp = Date.parse(datetimeString);
        return unixTimestamp;
    }

    function unixTimestampToDatetime(unixTimestamp) {
        const date = new Date(unixTimestamp);
        const datetimeString = date.toISOString();
        return datetimeString;
    }

    const [creatingCampaign, setCreatingCampaign] = useState(false);
    const createCampaign = (e) => {
        e.preventDefault();
        setCreatingCampaign(true);
        
        blockchain.smartContract.methods
            .createCampaign(blockchain.account)
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)

                setTimeout(function () {
                    //fire()
                }, 5000);
                setCreatingCampaign(false);
                //dispatch(fetchData(blockchain.account));
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
    };

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    function addMinutesToDateTime(dateTimeString, minutesToAdd) {
        const dateTime = new Date(dateTimeString);
        dateTime.setTime(dateTime.getTime() + minutesToAdd * 60 * 1000);
        
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');
        const milliseconds = String(dateTime.getMilliseconds()).padStart(3, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    const createCampaignTest0 = (e) => {
        e.preventDefault();
        setCreatingCampaign(true);

        blockchain.smartContract.methods
            .createCampaign(
                blockchain.account,
                'Arantuil',
                'Upgrade back-end server',
                'Upgrade back-end server for certain project',
                100,
                datetimeToUnixTimestamp(addMinutesToDateTime(getCurrentDateTime(), 2)),
                'https://reparatie-computer-tiel.nl/wp-content/uploads/2019/12/windows-server-768x466.jpg'
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setCreatingCampaign(false);

                try {
                    blockchain.smartContract.events.CampaignCreated({}, (error, event) => {
                        if (!error) {
                            const campaignId = event.returnValues.numberOfCampaigns;
                            console.log("Campaign ID:", campaignId);
                        }
                    });
                } catch {console.log('error')}
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
    };

    const createCampaignTest1 = (e) => {
        e.preventDefault();
        setCreatingCampaign(true);

        blockchain.smartContract.methods
            .createCampaign(
                blockchain.account,
                'Arantuil',
                'Turtle reservoir',
                'Fund to build a turtle reservoir, #savetheturtles',
                250,
                datetimeToUnixTimestamp("2023-08-24T06:36:56.594"),
                'https://tubbyturtles.com/static/media/mintbg.4b198bfbee7f4e86a288.png'
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setCreatingCampaign(false);
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
    };

    const createCampaignTest2 = (e) => {
        e.preventDefault();
        setCreatingCampaign(true);

        blockchain.smartContract.methods
            .createCampaign(
                blockchain.account,
                'Arantuil',
                'New lambo for queen frog',
                'Fund to give queen frog a new lambo after we all voted to crash her lambo into the woods',
                70,
                datetimeToUnixTimestamp("2023-08-24T06:36:56.594"),
                'https://i.imgur.com/grkYBZn.jpg'
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setCreatingCampaign(false);
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
    };

    const [datePart, setDatePart] = useState('');
    const [timePart, setTimePart] = useState('');

    const handleDateChange = (e) => {
        setDatePart(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTimePart(e.target.value);
    };

    useEffect(() => {
        setForm({ ...form, deadline: `${datePart}T${timePart}` });
    }, [datePart, timePart])

    console.log(form);

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            {blockchain.account !== "" && blockchain.account !== null ? (
                <div>
                    {isloading && <Loader />}
                    <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#1dc071] rounded-[10px]">
                        <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                            Start a crowdfunding campaign
                        </h1>
                    </div>
                    <form
                        className="w-full mt-[65px] flex flex-col gap-[30px]"
                    >
                        <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                disabled={false}
                                labelName="Your Name *"
                                placeholder="Username"
                                inputType="text"
                                value={form.name}
                                handleChange={(e) => handleFormFieldChange("name", e)}
                                styles={'text-white'}
                            />
                            <FormField
                                disabled={false}
                                labelName="Campaign Title *"
                                placeholder="Write a title"
                                inputType="text"
                                value={form.title}
                                handleChange={(e) => handleFormFieldChange("title", e)}
                                styles={'text-white'}
                            />
                        </div>
                        <FormField
                            disabled={false}
                            labelName="Description *"
                            placeholder="Write your campaign's description"
                            isTextArea
                            value={form.description}
                            handleChange={(e) => handleFormFieldChange("description", e)}
                            styles={'text-white'}
                        />

                        <div className="w-full flex justify-center items-center p-4 bg-[#8C6DFD] h-[100px] rounded-[10px]">
                            <img
                                src={money}
                                alt="money"
                                className="w-[40px] h-[40px] object-contain"
                            />
                            <h4 className="font-bold text-[18px] sm:text-[22px] text-white ml-[20px]">
                                You will get 95% of the final raised amount
                            </h4>
                        </div>
                        <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                disabled={false}
                                labelName="Goal (in EWT) *"
                                placeholder="100"
                                inputType="text"
                                value={form.target}
                                handleChange={(e) => handleFormFieldChange("target", e)}
                                styles={'text-white'}
                            />
                        </div>
                        <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                disabled={false}
                                labelName="End Date *"
                                placeholder="End Date"
                                inputType="date"
                                value={datePart}
                                handleChange={handleDateChange}
                                styles={'text-white'}
                            />
                            <FormField
                                disabled={false}
                                labelName="End Time *"
                                placeholder="End Time"
                                inputType="time"
                                value={timePart}
                                handleChange={handleTimeChange}
                                styles={'text-white'}
                            />
                        </div>
                        <FormField
                            disabled={false}
                            labelName="Campaign image *"
                            placeholder="Place image URL of your campaign"
                            inputType="url"
                            value={form.image}
                            handleChange={(e) => handleFormFieldChange("image", e)}
                            styles={'text-white'}
                        />
                        <p className='text-[#808191] text-[12px]'>For best image compatibility: use a horizontal rectangle image where the main content is mostly in the middle of the image, also make sure the image url is a direct url to the image.</p>
                        <div className="flex justify-center items-center mt-[30px]">
                            <CustomButton
                                btnType="submit"
                                title={creatingCampaign ? "Campaign being created..." : "Start new campaign"}
                                styles={`bg-[#1dc071] h-[50px] ${creatingCampaign ? "grayscale" : ""}`}
                                handleClick={createCampaign}
                            />
                        </div>

                        <div className='bg-blue-950 rounded-2xl flex justify-around flex-row p-4'>
                            <div className="flex justify-center items-center">
                                <CustomButton
                                    btnType="submit"
                                    title={'Add Campaign #0'}
                                    styles="bg-yellow-500 h-[50px]"
                                    handleClick={createCampaignTest0}
                                />
                            </div>
                            <div className="flex justify-center items-center">
                                <CustomButton
                                    btnType="submit"
                                    title={'Add Campaign #1'}
                                    styles="bg-yellow-500 h-[50px]"
                                    handleClick={createCampaignTest1}
                                />
                            </div>
                            <div className="flex justify-center items-center">
                                <CustomButton
                                    btnType="submit"
                                    title={'Add Campaign #2'}
                                    styles="bg-yellow-500 h-[50px]"
                                    handleClick={createCampaignTest2}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-[#13131a] rounded-[10px]">
                        <h1 className="font-semibold text-[18px] sm:text-[22px] leading-[38px] text-white">
                            To start a crowdfunding campaign you first have to connect
                        </h1>
                    </div>
                    <div className='flex flex-col'>
                        <CustomButton
                            btnType="button"
                            title="Connect"
                            styles="text-lg sm:text-xl md:text-2xl flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px] animate-pulseSlow active:brightness-105 bg-[#8c6dfd] mx-auto"
                            handleClick={() => {
                                dispatch(connect());
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCampaign;
