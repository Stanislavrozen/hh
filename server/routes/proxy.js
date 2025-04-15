const express = require('express')
const router = express.Router()

const baseUrl = 'https://api.hh.ru'

router.use(async (req, res) =>
{
    const headers = {
        'User-Agent': 'stanslav@rozen.pro',
        'Content-Type': 'application/json; charset=utf-8'
    }

    if (req.session?.auth?.access_token)
    {
        headers['Authorization'] = 'Bearer ' + req.session.auth.access_token;
    }

    const url = `${baseUrl}${req.originalUrl.replace(/^\/proxy/, '')}`

    const response = await fetch(url,
        {
            method: req.method,
            headers,
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
        }
    )

    const json = await response.json()

    res.json(json)
})

module.exports = router