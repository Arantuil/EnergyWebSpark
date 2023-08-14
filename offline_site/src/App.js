function App() {
  return (
    <div className="App">
      <header className="App-header p-2 sm:p-5">
        
        <div className='w-[150px] sm:w-[250px] aspect-square rounded-xl'>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 105.833 105.833"
    >
      <g display="inline">
        <rect rx='15' ry='15' width="105.833" height="105.833" x="0" y="0" fill="#282945" fillOpacity="1" stroke="none" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="0.265" paintOrder="fill markers stroke"
        ></rect>
        <g fill="#8c6dfd">
          <g
            fill="#8c6dfd"
            display="inline"
            opacity="1"
            transform="translate(-3.716 -2.313) scale(1.04234)"
          >
            <path
              id="lightningBolt"
              fill="#8c6dfd"
              stroke="url(#linearGradient7805)"
              d="M65.713 5.535L26.41 60.181l23.66-.1-6.731 40.094 38.806-54.646-23.66.1z"
              className="animate-pulse"
            ></path>
          </g>
        </g>
      </g>
    </svg>
        </div>
        
        <div className='mt-[20px]'>
          <p>
            The website is temporarily offline, you can always interact with the dapp directly on the block explorer: <a 
            className='contractLink'
            target="_blank"
            rel="noreferrer"
            href='https://explorer.energyweb.org/token/0x5A547Ad0cE7140110aE945F00b7D8dF6f58257d7/token-transfers'>EnergyWebSpark contract</a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
