import { useState, useEffect, useMemo } from "react";

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false); // Define showTransactions state
  const [conversionRate, setConversionRate] = useState(null); // Define conversionRate state
  const [inputValue, setInputValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("rupee");
  const [convertedValue, setConvertedValue] = useState("");

  const { contract } = state;

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr"
        );
        const data = await response.json();
        const ethRate = data.ethereum;

        setConversionRate(ethRate);
      } catch (error) {
        console.log("Error fetching conversion rate:", error);
      }
    };
    

    const fetchMemos = async () => {
      const memos = await contract.getMemos();
      setMemos(memos);
    };

    contract && fetchMemos();
    fetchConversionRate();
  }, [contract]);

  const handleArrowClick = () => {
    setShowTransactions(!showTransactions); // Toggle showTransactions state
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    convertAmount(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
    convertAmount(inputValue);
  };

  
  const convertAmount = (amount) => {
    if (conversionRate && !isNaN(amount)) {
      let rate = null;
      if (selectedCurrency === "rupee") {
        rate = conversionRate.inr;
      } else if (selectedCurrency === "dollar") {
        rate = conversionRate.usd;
      }
  
      if (rate !== null) {
        const convertedAmount = amount * rate;
        setConvertedValue(convertedAmount.toFixed(2));
      } else {
        setConvertedValue("");
      }
    } else {
      setConvertedValue("");
    }
  };
  const convertedAmount = useMemo(() => {
    if (conversionRate && !isNaN(inputValue)) {
      let rate = null;
      if (selectedCurrency === "rupee") {
        rate = conversionRate.inr;
      } else if (selectedCurrency === "dollar") {
        rate = conversionRate.usd;
      }
  
      if (rate !== null) {
        const convertedAmount = inputValue * rate;
        return convertedAmount.toFixed(2);
      }
    }
  
    return "";
  }, [conversionRate, inputValue, selectedCurrency]);
  

  return (
    <>
    <div style={{ display: "flex", justifyContent: "center" ,marginTop:"30px"}}>
      <div style={{ margin: "0 auto",textAlign: "center", fontWeight: "bold", margin: "10px", marginBottom: "30px", backgroundColor: "#b0c4de" , padding:"5px",width: "50%",fontFamily: "Verdana, sans-serif",border:"1px solid black",borderRadius:"10px"}}>
        <div className="container-md" style={{  marginTop: "25px" }}>
          <label  htmlFor="amount">Ether Value: </label>
          <input 
              type="number" 
              step="0.0001"
              id="amount" 
              placeholder="0"
              value={inputValue} 
              onChange={handleInputChange} 
              style={{ width: "15%", marginLeft: "10px" , marginRight:"30px"}}
          />
        
          <label  htmlFor="currencySelect" style={{ width: "25%", marginRight: "5px", marginLeft: "30px" }}>Select Currency: </label>
          <select 
              id="currencySelect" 
              value={selectedCurrency} 
              onChange={handleCurrencyChange} 
              style={{ width: "20%" }}
            >
            <option value="rupee">Rupee</option>
            <option value="dollar">Dollar</option>
          </select>
        </div>
        <div style={{ margin: "25px"}}>
          <h4 style={{marginBottom:"50px",backgroundColor: "#ffe4e1",padding:"5px"}}>Converted Value: {convertedAmount} {selectedCurrency === "rupee" ? "Rs" : "$"}</h4>
        </div>
        
      </div>
      </div>
     
      <div onClick={handleArrowClick} style={{ textAlign: "center",cursor: "pointer",   fontWeight: "bold", marginTop: "20px", marginBottom: "30px"}}>
          {showTransactions ? "Hide Transactions ▲" : "Show Transactions ▼"}
      </div>

      {showTransactions &&
        memos.map((memo) => {
          let convertedAmount = memo.Amount / 1e18; // Initialize with default value in Ether

          if (selectedCurrency === "rupee") {
              convertedAmount *= conversionRate?.inr || 0; // Convert to Rupees
          } else if (selectedCurrency === "dollar") {
              convertedAmount *= conversionRate?.usd || 0; // Convert to Dollars
          }
          return (
            <div className="container-fluid" style={{ width: "100%" }} key={Math.random()}>
              <table style={{ marginBottom: "10px" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#ffe4e1",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "150px",
                      }}
                    >
                      {memo.name}
                    </td>

                    <td
                      style={{
                        backgroundColor: "#b0c4de",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "120px",
                      }}
                    >
                      {memo.Amount / 1e18} ETH
                      
                    </td>


                    <td
                      style={{
                        backgroundColor: "#ffe4e1",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "200px",
                      }}
                    >
                      {new Date(memo.timestamp * 1000).toLocaleString()}
                    </td>
                      

                    <td
                      style={{
                        backgroundColor: "#b0c4de",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "400px",
                      }}
                    >
                      {memo.message}
                    </td>


                    <td
                      style={{
                        backgroundColor: "#ffe4e1",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "400px",
                      }}
                    >
                      {memo.from}
                    </td>
                    <td
                        style={{
                        backgroundColor: "#b0c4de",
                        border: "2px solid white",
                        borderCollapse: "collapse",
                        padding: "7px",
                        width: "150px",
                        }}
                    >
                {convertedAmount.toFixed(2)} {selectedCurrency === "rupee" ? "Rs" : "$"}
              </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
    </>
  );
};

export default Memos;