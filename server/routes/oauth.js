const express = require('express')
const router = express.Router()
const crypto = require('crypto')

const auth_uri = process.env.AUTH_URI
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

router.get('/start', (req, res) =>
{
    const state = crypto.randomBytes(16).toString('hex');
    req.session['state'] = state
    res.redirect(302, auth_uri + `?response_type=code&client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`)
})

router.get('/callback', (req, res) =>
{
    if (req.query['state'] != req.session['state']) return res.status(403).send('Invalid state parameter');

    getToken(req.query['code']).then(auth =>
    {
        req.session['auth'] = auth
        res.redirect(302, '/oauth/finish')
    })
})

router.get('/finish', (req, res) =>
{
    res.render('finish', { auth: !!req.session.auth.access_token })
})

router.get('/check', (req, res) =>
{
    if (req.session?.auth?.access_token)
    {
        res.send(true);
    } else
    {
        res.send(false);
    }
})

function getToken(code)
{
    const data = new URLSearchParams({
        client_id,
        client_secret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri
    })

    const response = fetch('https://api.hh.ru/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString()
    })
    const json = response.then(data => data.json())
    return json
}

module.exports = router