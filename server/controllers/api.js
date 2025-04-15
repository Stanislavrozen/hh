class ApiController
{
    baseUrl = 'https://api.hh.ru'
    baseHeaders = {
        'User-Agent': 'stanslav@rozen.pro',
        'Content-Type': 'application/json; charset=utf-8'
    }
    _getHeaders = (req) =>
    {
        const headers = { ...this.baseHeaders }
        if (req.session?.auth?.access_token)
        {
            headers['Authorization'] = 'Bearer ' + req.session.auth.access_token;
        }
        return headers
    }

    me = async (req, res) =>
    {
        const methodPath = '/me'
        try
        {
            const headers = this._getHeaders(req);
            const resp = await fetch(this.baseUrl + methodPath, { headers })
            console.log(resp)
            const json = await resp.json()

            res.json(json)

        } catch (error)
        {
            res.status(500).json({ url: `${this.baseUrl}${methodPath}`, error: 'Internal Server Error' });
        }
    }
    negotiations = async (req, res) =>
    {
        const baseUrl = this.baseUrl
        const methodPath = '/negotiations'
        const queryParams = '?' + new URLSearchParams({ per_page: 100 }).toString()
        try
        {
            const headers = this._getHeaders(req);
            const resp = await fetch(baseUrl + methodPath + queryParams, { headers })
            console.log(resp)
            const json = await resp.json()
            res.json(json);
        }
        catch (error)
        {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getAllVacancies = async (req, res) =>
    {
        const text = req.query['text']
        console.log(text)
        if (!text)
        {
            throw new Error('А чо искать то ебеныть?')
        }

        const baseUrl = this.baseUrl
        const methodPath = '/vacancies'
        const queryParams = '?' + new URLSearchParams({ clusters: true, per_page: 100, text }).toString()
        try
        {
            const headers = this._getHeaders(req);
            const result = await fetch(baseUrl + methodPath + queryParams, { headers })
            const json = await result.json()

            res.json(json);
        } catch (error)
        {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ApiController