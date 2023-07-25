const Profile = () => {
    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px]">
                <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                    Your profile page
                </h1>
            </div>
        </div>
    );
};

export default Profile;
