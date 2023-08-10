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

    const handleSubmit = async (e) => {
        e.preventDefault();

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setIsloading(true);
                //await createCampaign({
                //    ...form,
                //target: ethers.utils.parseUnits(form.target, 18),
                //});
                setIsloading(false);
                navigate("/");
            } else {
                alert("Provide valid image URL");
                setForm({ ...form, image: "" });
            }
        });

        console.log(form);
    };

    function dateToUnixTimestamp(dateString) {
        const dateObject = new Date(dateString);
        const unixTimestamp = dateObject.getTime();
        return unixTimestamp;
    }

    const [creatingCampaign, setCreatingCampaign] = useState(false);
    const createCampaign = () => {
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

    const createCampaignTest0 = () => {
        setCreatingCampaign(true);
        blockchain.smartContract.methods
            .createCampaign(
                            blockchain.account, 
                            'Arantuil', 
                            'Upgrade back-end server', 
                            'Upgrade back-end server for certain project',
                            100,
                            dateToUnixTimestamp('2023-08-20'),
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
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
    };

    const createCampaignTest1 = () => {
        setCreatingCampaign(true);
        blockchain.smartContract.methods
            .createCampaign(
                            blockchain.account, 
                            'Arantuil', 
                            'Turtle reservoir', 
                            'Fund to build a turtle reservoir, #savetheturtles',
                            250,
                            dateToUnixTimestamp('2023-08-27'),
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

    const createCampaignTest2 = () => {
        setCreatingCampaign(true);
        blockchain.smartContract.methods
            .createCampaign(
                            blockchain.account, 
                            'Arantuil', 
                            'New lambo for queen frog', 
                            'Fund to give queen frog a new lambo after we all voted to crash her lambo into the woods',
                            70,
                            dateToUnixTimestamp('2023-08-20'),
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

    return (
        blockchain.account === "" || blockchain.account === null ? (
            <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
                <div className='flex flex-col'>
                    <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-[#13131a] rounded-[10px]">
                        <h1 className="font-semibold text-[18px] sm:text-[22px] leading-[38px] text-white">
                            To start a crowdfunding campaign you first have to connect
                        </h1>
                    </div>
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
        ) : (
            <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
                {isloading && <Loader />}
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#1dc071] rounded-[10px]">
                    <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                        Start a crowdfunding campaign
                    </h1>
                </div>
                <form
                    onSubmit={handleSubmit}
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
                        />
                        <FormField
                            disabled={false}
                            labelName="Campaign Title *"
                            placeholder="Write a title"
                            inputType="text"
                            value={form.title}
                            handleChange={(e) => handleFormFieldChange("title", e)}
                        />
                    </div>
                    <FormField
                        disabled={false}
                        labelName="Description *"
                        placeholder="Write your campaign's description"
                        isTextArea
                        value={form.description}
                        handleChange={(e) => handleFormFieldChange("description", e)}
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
                        />
                        <FormField
                            disabled={false}
                            labelName="End Date *"
                            placeholder="End Date"
                            inputType="date"
                            value={form.deadline}
                            handleChange={(e) => handleFormFieldChange("deadline", e)}
                        />
                    </div>
                    <FormField
                        disabled={false}
                        labelName="Campaign image *"
                        placeholder="Place image URL of your campaign"
                        inputType="url"
                        value={form.image}
                        handleChange={(e) => handleFormFieldChange("image", e)}
                    />
                    <p className='text-[#808191] text-[12px]'>For best image compatibility: use a horizontal rectangle image where the main content is mostly in the middle of the image, also make sure the image url is a direct url to the image.</p>
                    <div className="flex justify-center items-center mt-[30px]">
                        <CustomButton
                            btnType="submit"
                            title={creatingCampaign ? "Campaign being created..." : "Start new campaign"}
                            styles="bg-[#1dc071] h-[50px]"
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
        )
    );
};

export default CreateCampaign;
