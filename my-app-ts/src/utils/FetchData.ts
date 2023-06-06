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
        const response = await res.json()
        return response
    } catch (err) {
        console.error(err);
    }
};

