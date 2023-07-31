const FormField = ({
    labelName,
    placeholder,
    inputType,
    isTextArea,
    value,
    handleChange,
}) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-medium text-[14px] leading-[22px] text-[#808191] mb-2">
                    {labelName}
                </span>
            )}
            {isTextArea ? (
                <textarea
                    required
                    value={value}
                    onChange={handleChange}
                    rows={10}
                    placeholder={placeholder}
                    className="min-h-[55px] py-4 sm:px-6 px-4 outline-none border-[1px] border-[#3a3a43] bg-transparent text-white text-[14px] placeholder:text-[#75787e] rounded-lg sm:min-w-[300px]"
                />
            ) : (
                <input
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    className="py-4 sm:px-6 px-4 outline-none border-[1px] border-[#3a3a43] bg-transparent text-white text-[14px] placeholder:text-[#75787e] rounded-lg sm:min-w-[300px]"
                />
            )}
        </label>
    );
};

export default FormField;