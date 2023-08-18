import { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import { connect } from '../redux/blockchain/blockchainActions';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../components/CustomButton';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const Profile = () => {
    const dispatch = useDispatch();

    const blockchain = useSelector((state) => state.blockchain);

    const [filteredCampaigns, setFilteredCampaigns] = useState([])
    useEffect(() => {
        if (blockchain.account !== "" && blockchain.account !== null) {
            onValue(ref(db), snapshot => {
                const data = snapshot.val();
                if (data) {
                    const campaignsArray = Object.values(data);
                    const filteredCampaigns = campaignsArray.filter(campaign => (campaign.owner).toLowerCase() === (blockchain.account).toLowerCase());
                    setFilteredCampaigns(filteredCampaigns);
                }
            });
        }
    }, [blockchain.account]);

    useEffect(() => {
        if (blockchain.account !== "" && blockchain.account !== null && filteredCampaigns.length !== 0) {
            setFilteredCampaigns(filteredCampaigns.filter(campaign => (campaign.owner).toLowerCase() === (blockchain.account).toLowerCase()));
        }
    }, [blockchain])

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)]'>
            {blockchain.acount !== "" && blockchain.account !== null ? (
                <div>
                    <div className="flex w-fit mx-auto justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px]">
                        <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                            Your profile page
                        </h1>
                    </div>
                    {filteredCampaigns.length > 0 ? (
                    <div className='mt-[20px] flex justify-center content-start flex-row flex-wrap'>
                        {filteredCampaigns.map((cardInfo) => (
                            <CampaignCard
                                id={cardInfo.campaignId}
                                title={cardInfo.title}
                                image={cardInfo.image}
                                owner={cardInfo.owner}
                                username={cardInfo.username}
                                description={cardInfo.description}
                                target={cardInfo.target}
                                amountContributed={cardInfo.amountContributed}
                                deadline={cardInfo.deadline}
                                isProfilePage={true}
                                status={cardInfo.status}
                                campaignAmountWithdrawn={cardInfo.campaignAmountWithdrawn}
                            />
                        ))}
                    </div>
                    ) : (
                        <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-[#13131a] rounded-[10px]">
                            <h1 className="text-center font-semibold text-[18px] sm:text-[22px] leading-[38px] text-white">
                                You have not created any campaigns yet
                            </h1>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-[#13131a] rounded-[10px]">
                        <h1 className="text-center font-semibold text-[18px] sm:text-[22px] leading-[38px] text-white">
                            To view your campaigns you first have to connect
                        </h1>
                    </div>
                    <div className='mt-[20px]'>
                        <div className='flex justify-center'>
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

export default Profile;
