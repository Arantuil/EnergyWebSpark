import { useState, useEffect } from "react";
import FormField from "../components/FormField";
import Loader from "../components/Loader";

const Profile = () => {
    return (
        <div className="rounded-xl justify-start w-full mt-20 bg-[#282945] flex items-center flex-col sm:p-10 p-4">
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px]">
                <h1 className="font-epilogue font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                    Your profile page
                </h1>
            </div>
        </div>
    );
};

export default Profile;
