export async function handlePostRefresh(url, currentBalance): Promise<any> {
    let finalResult = [];
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ StartingValue: 0 })
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("data",data);
        finalResult = data.payload;
    });
    console.log("final result", finalResult);
    return finalResult;
};