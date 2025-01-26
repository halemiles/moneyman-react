import React from 'react';
import { Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { handlePostRefresh } from '../data/DutTillPayday.ts';

export default function Controls(props) {
    const refreshDataOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherCurrentOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/current?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const gatherFullOnClick = async () => {
        console.log("Getting data");
        const data = await handlePostRefresh(`${process.env.REACT_APP_MONEYMAN_SERVER_URL}/dtp/full?startingvalue=1`, props.currentBalance);

        if(data) {
            props.sendDataToParent(data.planDates);
        }
    };

    const handleDropdown = async(e) => {
        const data = await handlePostRefresh("http://localhost:5000/dtp/current", props.currentBalance, e.target.value);
        if(data) {
            props.sendDataToParent(data.planDates);
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="success" onClick={refreshDataOnClick} style={{ marginRight: '10px' }}>
                    Refresh
                </Button>
                <Button variant="contained" color="secondary" onClick={gatherFullOnClick} style={{ marginRight: '10px' }}>
                    Full
                </Button>
                <Button variant="contained" color="secondary" onClick={gatherCurrentOnClick} style={{ marginRight: '10px' }}>
                    From today
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel id="account-select-label">Account</InputLabel>
                    <Select
                        labelId="account-select-label"
                        id="accountId"
                        onChange={handleDropdown}
                        defaultValue="0"
                    >
                        <MenuItem value="0">All</MenuItem>
                        <MenuItem value="1">Natwest</MenuItem>
                        <MenuItem value="2">Starling</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

