const Footer = () => {

    return (
        <footer className="flex relative xs:h-10 h-12 sm:h-14 md:h-16 w-full bg-[#1C1D30]
        xs:px-2 px-3 sm:px-6 md:px-8
        xs:pb-2 pb-3 sm:pb-6 md:pb-8">
            <div className='rounded-xl py-1 px-2 md:px-3 h-full bg-[#282945] flex items-center'>
                <a className='h-full w-full flex items-center' href='https://twitter.com/Arantuil' target='_blank'>
                    <svg fill="#8C6DFD" height={'100%'} xmlns="http://www.w3.org/2000/svg" x="0" y="0" enableBackground="new 0 0 1668.56 1221.19" version="1.1" viewBox="0 0 1668.56 1221.19" xmlSpace="preserve" >
                        <g transform="translate(52.39 -25.059)">
                            <path d="M283.94 167.31l386.39 516.64L281.5 1104h87.51l340.42-367.76L984.48 1104h297.8L874.15 558.3l361.92-390.99h-87.51l-313.51 338.7-253.31-338.7h-297.8zm128.69 64.46h136.81l604.13 807.76h-136.81L412.63 231.77z"></path>
                        </g>
                    </svg>
                </a>
            </div>
            <div className='rounded-xl py-1 px-2 md:px-3 h-full bg-[#282945] flex items-center ml-auto mr-0'>
                <p className='text-[#808191] text-[13px] s:text-[12px] xs:text-[11px] 2xs:text-[10px]'>Unofficial project, not affiliated with EWF/EnergyWeb.org</p>
            </div>
        </footer>
    );
}

export default Footer;