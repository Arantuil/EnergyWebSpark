import { calculateBarPercentage, daysLeft } from "../utils";
import { profile } from '../assets'
import { useNavigate } from 'react-router-dom';

const CampaignCard = ({ id, styles, title, image, owner, description, target, amountCollected, deadline }) => {
    const navigate = useNavigate();

    return (
        <div
            className="max-w-[95%] w-full sm:w-[270px] m-2 sm:m-4 rounded-xl bg-[#1C1D30] cursor-pointer"
            onClick={() => {navigate('campaigns/'+String(id))} }
        >   
        { daysLeft(deadline) > 0 ? (
            <div className='absolute ml-2 mt-2 rounded-full w-3 h-3 bg-green-500'></div>
        ) : (
            <div className='absolute ml-2 mt-2 rounded-full w-3 h-3 bg-red-500'></div>
        )}
            <img
                src={image}
                alt="fund"
                className="w-full h-[160px] object-cover rounded-xl"
            
            />
            <div className='translate-y-[-4px] relative rounded h-[4px] w-full bg-[#3a3a43]'>
                <div style={{
                    width: `${calculateBarPercentage(
                        target,
                        amountCollected
                    )}%`,
                    maxWidth: "100%",
                }} 
                className='absolute h-full rounded bg-[#1DC071]'></div>
            </div>

            <div className="flex flex-col p-4">
                <div className="block">
                    <h3 className="font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                        {title}
                    </h3>
                    <p className="mt-[5px] font-normal text-[#808191] text-left leading-[20px] truncate">
                        {description}
                    </p>
                </div>

                <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                            {Math.round(amountCollected * 100) / 100} EWT
                        </h4>
                        <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                            Raised out of {target} EWT
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                            {daysLeft(deadline)}
                        </h4>
                        <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                            Days Left
                        </p>
                    </div>
                </div>
                <div className="flex items-center mt-[20px] gap-2 ">
                    <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a}">
                        <img
                            src={profile}
                            alt="user"
                            className="w-1/2 h-1/2 object-contain"
                        />
                    </div>
                    <p className="flex-1 font-normal text-[12px] text-[#808191] truncate">
                        By <span className="text-[#b2b3bd]">{owner}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
