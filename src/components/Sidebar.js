import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';

import { logo, dashboard, createCampaign, profile } from "../assets";

const Sidebar = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  const getData = () => {
      if (blockchain.account !== "" && blockchain.smartContract !== null) {
          dispatch(fetchData(blockchain.account));
      }
  };

  useEffect(() => {
      getData();
  }, [])

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
    <div className="3xs:w-[50px] 2xs:w-[60px] xs:w-[70px] w-[80px] flex justify-between items-center flex-col sticky">
      <Link className='active:brightness-110' to="/">
        <div className='3xs:w-[40px] 2xs:w-[45px] xs:w-[50px] w-[60px] aspect-square bg-[#282945] rounded-xl flex justify-center'>
          <img src={logo} className='w-[80%]' />
        </div>
      </Link>

      <div className="3xs:mt-[8px] 2xs:mt-[11px] mt-[16px] py-4 flex-1 flex flex-col justify-between items-center bg-[#282945] rounded-xl w-full">
        <div className="flex flex-col w-[70%] justify-center items-center gap-6">
        {navlinks.map((link) => (
          link.name === 'profile' ? (
            <Link onClick={() => setNewActivePage(link.name)} to={link.link} className={`active:brightness-110 flex justify-center w-full 2xs:rounded-lg rounded-xl aspect-square
            ${link.name === activePage ? 'bg-[#1f203a]' : 'bg-[#303150]'}`}>
              <img className='w-[32px] xs:w-[28px] 2xs:w-[24px] 3xs:w-[22px]' src={link.imgUrl} alt="" />
            </Link>
          ) : (
            <Link onClick={() => setNewActivePage(link.name)} to={link.link} className={`active:brightness-110 flex justify-center w-full 2xs:rounded-lg rounded-xl aspect-square
            ${link.name === activePage ? 'bg-[#1f203a]' : 'bg-[#303150]'}`}>
              <img className='w-[32px] xs:w-[28px] 2xs:w-[24px] 3xs:w-[22px]' src={link.imgUrl} alt="" />
            </Link>
          )
        ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
