import { useEffect, useState } from "react";

const serverUrl = process.env.REACT_APP_MONEYMAN_SERVER_URL;

/**
 * Custom hook to fetch transactions with specific flags.
 * @param {Object} options - Options for fetching transactions.
 * @param {boolean} options.anticipated - Whether to fetch anticipated transactions.
 * @param {boolean} options.active - Whether to fetch active transactions.
 * @returns {Array} - The fetched transactions.
 */
export function useTransactionFetcher({ anticipated = false, active = false }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const queryParams = new URLSearchParams();
        if (anticipated) queryParams.append("anticipated", "true");
        if (active) queryParams.append("active", "true");

        fetch(`${serverUrl}/transaction?${queryParams.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            })
            .catch((err) => {
                console.error("Failed to load transactions", err);
            });
    }, [anticipated, active]);

    return { transactions, setTransactions };
}