export async function handlePostRefresh(url : string, currentBalance: any, accountId: number): Promise<any> {
    let finalResult: any = [];
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