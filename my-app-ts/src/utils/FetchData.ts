export const fetchData = async (url: string, queryParameter: string) =>  {
    try {
        const res = await fetch(
            `${url+queryParameter}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!res.ok) {
            throw Error(`Failed to fetch users: ${res.status}`);
        }

        console.log("response is ...", res);
        return res.json()
    } catch (err) {
        console.error(err);
    }
};

