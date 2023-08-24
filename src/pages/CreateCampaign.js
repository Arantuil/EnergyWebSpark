import { useNavigate } from "react-router-dom";
import { money } from "../assets";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { etherToWei } from '../utils/index';

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

    function convertToUnixTimestamp(dateString) {
        const date = new Date(dateString.replace("T", " ") + ":00:00 UTC");
        const unixTimestampInSeconds = Math.floor(date.getTime() / 1000);
        return unixTimestampInSeconds;
    }

    const canvasStyles = {
        position: 'absolute',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: '0%',
        left: '0%'
    }

    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.1, {
            spread: 35,
            startVelocity: 25,
            decay: 0.94,
            scalar: 1.0
        });
        makeShot(0.13, {
            spread: 45,
            startVelocity: 45,
            decay: 0.93,
            scalar: 1.0
        });
        makeShot(0.15, {
            spread: 55,
            startVelocity: 35,
            decay: 0.95,
            scalar: 1.0
        });
    }, [makeShot]);

    const [creatingCampaign, setCreatingCampaign] = useState(false);
    const [errorHappend, setErrorhappend] = useState(false)
    const createCampaign = (e) => {
        if (form.name !== '' && 
            form.title !== '' &&
            form.description !== '' &&
            form.target !== '' && 
            form.deadline !== 'T0'
        ) {
        e.preventDefault();
        setCreatingCampaign(true);
        
        blockchain.smartContract.methods
            .createCampaign(
                blockchain.account,
                form.name,
                form.title,
                form.description,
                etherToWei(form.target),
                convertToUnixTimestamp(form.deadline),
                form.image
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                fire()
                setTimeout(function () {
                    navigate("/")
                }, 5000);
                setCreatingCampaign(false);
            })
            .catch((error) => {
                console.error(error);
                setCreatingCampaign(false);
            });
        } else {
            setErrorhappend(true);
            setTimeout(function () {
                setErrorhappend(false);
            }, 10000);
        }
    };

    console.log(form)

    const [datePart, setDatePart] = useState('');
    const [timePart, setTimePart] = useState('0');

    const handleDateChange = (e) => { setDatePart(e.target.value); };
    const handleTimeChange = (e) => { setTimePart(e.target.value); };

    useEffect(() => {
        setForm({ ...form, deadline: `${datePart}T${timePart}` });
    }, [datePart, timePart]);

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            {blockchain.account !== "" && blockchain.account !== null ? (
                <div>
                    <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
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
                            placeholder="Write your campaign's description, please write as many details of your idea or initiative: what your goals are and how you are going to accomplish those"
                            isTextArea
                            value={form.description}
                            handleChange={(e) => handleFormFieldChange("description", e)}
                            styles={'text-white'}
                        />

                        <div className="w-full flex justify-center items-center p-4 bg-[rgb(140,109,253)] h-[100px] rounded-[10px]">
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
                                labelName="End Hour *"
                                placeholder="0"
                                inputType="text"
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
                        
                        <p className='text-center text-white text-[16px]'>{errorHappend === true ? 'Error: Please complete the campaign creation form' : ''}</p>

                        {creatingCampaign === false ? (
                        <div className="flex justify-center items-center mt-[30px]">
                            <CustomButton
                                btnType="submit"
                                title={creatingCampaign ? "Campaign being created..." : "Start new campaign"}
                                styles={`bg-[#1dc071] h-[50px] ${creatingCampaign ? "grayscale" : ""}`}
                                handleClick={createCampaign}
                            />
                        </div>
                        ) : (
                        <div className="flex justify-center items-center mt-[30px]">
                            <CustomButton
                                btnType="submit"
                                disabled
                                title={creatingCampaign ? "Campaign being created..." : "Start new campaign"}
                                styles={`bg-[#1dc071] h-[50px] ${creatingCampaign ? "grayscale" : ""}`}
                                handleClick={createCampaign}
                            />
                        </div>
                        )}
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
                    {blockchain.errorMsg !== "" ? (
                        <div className="mt-6 sm:mt-8">
                            <p className="text-center font-semibold text-[16px] sm:text-[18px] leading-[38px] text-white">
                                {blockchain.errorMsg}
                            </p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CreateCampaign;
