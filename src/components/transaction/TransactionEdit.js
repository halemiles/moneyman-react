import {useEffect} from "react";
import {useParams} from "react-router-dom/cjs/react-router-dom.min";
import {useState} from "react";
import {Button} from "react-bootstrap";
const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit()
{
    let id = useParams().id;
    const [transaction, setTransaction] = useState({});//[{}, function(){}

    //fetch transaction by id
    //populate form with transaction data
    //submit form to update transaction

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTransaction(data);
            }
        );
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data);
        fetch(serverUrl + "/transaction/" + id, {
            method: 'PUT',
            body: data,
        });
    }

    return (
        <div>
            <h1>Transaction Edit {id}</h1>
            
             <form onSubmit={handleSubmit}>
                 <label htmlFor="name">Name</label>
                 <input id="name" name="name" type="text" defaultValue={transaction.name} />
            
                 <label htmlFor="amount">Amount</label>
                 <input id="amount" name="amount" type="text" defaultValue={transaction.amount} />
            
                 <label htmlFor="date">Date</label>
                 <input id="date" name="date" type="text" defaultValue={transaction.date} />
            
                 <button>Submit</button>
             </form>
            

        </div>
    );
}

export default TransactionEdit;