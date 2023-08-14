import logo from './logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          The website is temporarily offline, you can always interact with the dapp directly on the block explorer: <a 
          className='contractLink'
          target="_blank"
          rel="noreferrer"
          href='https://explorer.energyweb.org/token/0x5A547Ad0cE7140110aE945F00b7D8dF6f58257d7/token-transfers'>EnergyWebSpark contract</a>
        </p>
      </header>
    </div>
  );
}

export default App;
