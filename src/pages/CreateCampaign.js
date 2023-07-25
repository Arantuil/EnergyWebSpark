import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { money } from "../assets";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
    const navigate = useNavigate();

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

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-[#282945] rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            {isloading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px]">
                <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-white">
                    Start a crowdfund campaign
                </h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full mt-[65px] flex flex-col gap-[30px]"
            >
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Your Name *"
                        placeholder="Username"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange("name", e)}
                    />
                    <FormField
                        labelName="Campaign Title *"
                        placeholder="Write a title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => handleFormFieldChange("title", e)}
                    />
                </div>
                <FormField
                    labelName="Description *"
                    placeholder="write your campaign's description"
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
                        labelName="Goal (in EWT) *"
                        placeholder="100"
                        inputType="text"
                        value={form.target}
                        handleChange={(e) => handleFormFieldChange("target", e)}
                    />
                    <FormField
                        labelName="End Date *"
                        placeholder="End Date"
                        inputType="date"
                        value={form.deadline}
                        handleChange={(e) => handleFormFieldChange("deadline", e)}
                    />
                </div>
                <FormField
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
                        title="Submit new campaign"
                        styles="bg-[#1dc071] h-[50px]"
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateCampaign;
