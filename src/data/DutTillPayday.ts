export async function handlePostRefresh(url: string, _currentBalance: any, _accountId: number): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // include response body when available to aid debugging
            const text = await response.text();
            throw new Error(`Request failed ${response.status} ${response.statusText}: ${text}`);
        }

        // await the JSON parsing (response.json() returns a Promise)
        const finalResult = await response.json();

        // prefer returning payload if present, otherwise the full result
        return finalResult?.payload ?? finalResult;
    } catch (err) {
        console.error('handlePostRefresh error', err);
        throw err;
    }
}
