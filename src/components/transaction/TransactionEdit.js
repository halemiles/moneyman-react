import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, TextField, Grid, Container, Typography} from "@mui/material";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

function TransactionEdit()
{
    let { id } = useParams();
    const [startDate, setStartDate] = useState(new Date());
    const [transaction, setTransaction] = useState({});
    const [isAnticipatedSwitch, setAnticipatedSwitch] = useState(false);

    useEffect(() => {
        fetch(serverUrl + "/transaction/" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTransaction(data);
                setStartDate(formatDateForPicker(data.date));
                setAnticipatedSwitch(data.isAnticipated ?? false);
            }
        );
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.date = formatDateForServer(data.date);
        console.log(isAnticipatedSwitch);
        data.isAnticipated = isAnticipatedSwitch;
        console.log(JSON.stringify(data));
        fetch(serverUrl + "/transaction/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function formatDateForPicker(dateString) {
        const inputDate = new Date(dateString);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateForServer(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}T00:00:00`;
    }

    function handleDelete() {
        const userConfirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (userConfirmed) {
            fetch(`${serverUrl}/transaction/${transaction.id}`, {
                method: 'DELETE',
            })
            .catch(error => {
                console.error("Error during delete operation:", error);
            });
        }
    }

    return (
        <Container>
            <Typography variant="h4">{transaction.name}</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            id="id"
                            name="Id"
                            label="Id"
                            type="text"
                            fullWidth
                            defaultValue={transaction.id}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            defaultValue={transaction.amount}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            required
                            id="date"
                            name="date"
                            label="Date"
                            type="date"
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default TransactionEdit;