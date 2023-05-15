import abi from "./contract/vendor.json"
import {useState,useEffect} from 'react';
import {ethers} from "ethers";
import Buy from "./components/Buy"
import Memos from "./components/Memos";
import photo from "./photo.png";
import './App.css';

function App() {
  
  const [state,setState] = useState({
    provider:null, 
    signer:null,
    contract:null
  });

  const [account, setAccount] = useState("None");
  useEffect(()=> {
    const connectWallet = async () => {
      const contractAddress ="0x654c3bB6CE2BD788B83B01B83BF794f32f6B309C";
      const contractABI = abi.abi;
      
      try{
        const {ethereum} = window;

        if(ethereum)
        {
          const account = await ethereum.request({method : "eth_requestAccounts",});

          window.ethereum.on("chainChanged", () => {window.location.reload();});
          window.ethereum.on("accountsChanged", () => {window.location.reload()}); 

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress,contractABI,signer);
          
          setAccount(account);
          setState({provider,signer,contract});
        }
        else {
          alert("Please install metamask");
        }
      }catch(error)
      {
        console.log(error);
      }
    };
    connectWallet();
  },[]);
  // console.log(state);

  //linear-gradient(-45deg, #3F4C91, #5F8AA7, #6083AA, #263071)
  return (
    <div style={{ background: "linear-gradient(-45deg, #ffd2e1, #ffa59c,#DDA0DD)", height: "100%" }}>
      <img src={photo} className="img-fluid" alt="Ether-pay banner" width="100%" />
      <p
        class="text-muted lead "
        style={{ marginTop: "10px", marginLeft: "5px"}}
      >
        <small style={{fontWeight: "600"}} >Connected Account - {account}</small>
      </p>
      <div className="container">
        <Buy state = {state}></Buy>
        <Memos state = {state}></Memos>
      </div>
    </div>
  );
}

export default App;
