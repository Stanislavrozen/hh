async function retryingFetch(url, retries, pause, onSuccess)
{
    while (true)
    {
        try
        {
            const resp = await fetch(url);
            
            return await onSuccess(resp);
        } catch (err)
        {
            if (retries-- <= 0) throw err;
            await new Promise(r => setTimeout(r, pause));
            pause += 1000;
        }
    }
}

export function begSource(url, retries = 20, pause = 5000)
{
    return retryingFetch(url, retries, pause, async (resp) =>
    {
        const json = await resp.json();

        if (json.errors?.length) 
        {
            throw new Error(JSON.stringify(json.errors));
        }
        return json;
    });
}

export function begStream(url, retries = 20, pause = 5000)
{
    return retryingFetch(url, retries, pause, async (resp) => resp);
}