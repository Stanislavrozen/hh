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
            const json = await resp.json()
            res.json(json)
        }
        catch (error)
        {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    getAllVacancies = async (req, res) =>
    {
        const text = req.query['text']
        let vacanciesData;

        if (!text)
        {
            return res.status(400).json({ message: 'Пустой запрос' });
        }

        const headers = this._getHeaders(req);
        const methodUrl = this.baseUrl + '/vacancies?'
        const firstPageSearchParams = new URLSearchParams({ clusters: true, page: 0, per_page: 100, text }).toString()

        try
        {
            vacanciesData = await getVacanciesPage(methodUrl + firstPageSearchParams, headers)

            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.setHeader('Transfer-Encoding', 'chunked')
            res.write(JSON.stringify(vacanciesData) + '\n')

            const pageCount = vacanciesData.pages

            if (pageCount > 1)
            {
                const searchParams = new URLSearchParams({ clusters: false, per_page: 100, text }).toString()
                const urls = new Array(pageCount - 1).fill(methodUrl + searchParams).map((url, idx) => `${url}&page=${idx + 1}`)

                for (let i = 0; i < urls.length; i++)
                {
                    const { items } = await getVacanciesPage(urls[i], headers)
                    // vacanciesData.items.push(...items)
                    res.write(JSON.stringify(items) + '\n')
                }
            }

            res.end();

        } catch (error)
        {
            res.json({ message: error.message });
        }
    }
}
async function getVacanciesPage(url, headers)
{
    const result = await fetch(url, { headers })

    if (!result.ok)
    {
        throw new Error(`Ответ от HH ${result.status}: ${result.statusText}`)
    }

    return result.json()
}

module.exports = new ApiController