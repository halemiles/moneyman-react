export async function handlePostRefresh(url, currentBalance, accountId: number): Promise<any> {
    let finalResult = [];
    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("data",data);
        finalResult = data.payload;
    });
    console.log("final result", finalResult);
    return finalResult;
};