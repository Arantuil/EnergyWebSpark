import React from 'react';
import Jazzicon from 'react-jazzicon';

const MetamaskAccountIcon = ({ address }) => {
    const addressNumber = parseInt(address.slice(2, 10), 16);

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='block md:hidden h-[30px] w-[30px]'>
                <Jazzicon diameter={30} seed={addressNumber} />
            </div>
            <div className='hidden md:block h-[40px] w-[40px]'>
                <Jazzicon diameter={40} seed={addressNumber} />
            </div>
        </div>
    );
};

export default MetamaskAccountIcon;
