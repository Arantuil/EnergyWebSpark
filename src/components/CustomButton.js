const CustomButton = ({ btnType, title, handleClick, styles }) => {
    return (
        <button
            type={btnType}
            className={`${styles} font-epilogue font-semibold text-[14px] sm:text-[16px] text-white min-h-[52px] px-4 rounded-xl`}
            onClick={handleClick}
        >
            {title}
        </button>
    );
};

export default CustomButton;
