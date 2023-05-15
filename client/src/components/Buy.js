import {ethers} from "ethers"

const Buy = ({state})=>
{
    const buy = async(event)=>{
        event.preventDefault();
        const {contract} = state;
        const name = document.querySelector("#name").value;
        const message = document.querySelector("#message").value;
        console.log(name,message,contract);

        const money = document.querySelector("#amount").value;

        if(money > 0){
        const amount = {value: ethers.utils.parseEther(money)};
        const transaction = await contract.buy(name,message,amount);
        await transaction.wait();
        console.log("Transaction is done");
        }
        else {
            alert("Please Enter a Valid Amount");
        }
    };

    return(
        <>
        <div className="container-md" style={{ width: "50%", marginTop: "25px" ,fontWeight: "480"}}>
            <form onSubmit = {buy}> 
            <div className ="mb-3">
                <label className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter Your Name"
                />
            </div>

            <div className="mb-3">
            <label className="form-label">Message</label>
            <input
              type="text"
              className="form-control"
              id="message"
              placeholder="Enter Your Message"
            />
            </div>

            <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              step="0.0001"
              className="form-control"
              id="amount"
              placeholder="Enter Amount"
            />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={!state.contract}
            >
                Pay
            </button>
            
            </form>
        </div>    
        </>
    ); 
};
export default Buy;