import { Link } from 'react-router-dom';
import { useState } from 'react';

import { logo, dashboard, createCampaign, withdraw, profile } from "../assets";

const Sidebar = () => {
  const navlinks = [
    {
        name: "dashboard",
        imgUrl: dashboard,
        link: "/",
    },
    {
        name: "campaign",
        imgUrl: createCampaign,
        link: "/create-campaign",
    },
    {
        name: "withdraw",
        imgUrl: withdraw,
        link: "/withdraw",
    },
    {
        name: "profile",
        imgUrl: profile,
        link: "/profile",
    }
  ];

  const [activePage, setActivePage] = useState('dashboard')

  function setNewActivePage(newCurrentPage) {
    setActivePage(newCurrentPage)
  }

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className='w-[58px] h-[58px] bg-[#282945] rounded-xl flex justify-center'>
          <img src={logo} className='w-[80%]' />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#282945] rounded-[20px] w-[80px] py-4 mt-12">
        <div className="flex flex-col w-[70%] justify-center items-center gap-5">
        {navlinks.map((link) => (
          <Link onClick={() => setNewActivePage(link.name)} to={link.link} className={`flex justify-center w-full rounded-xl aspect-square
          ${link.name === activePage ? 'bg-[#1f203a]' : 'bg-[#303150]'}`}>
            <img className='w-[32px]' src={link.imgUrl} alt="" />
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
