const baseUrl = 'https://api.hh.ru'

async function getUserInfo(token)
{
    const headers = getHeaders(token)
    const response = await fetch(`${baseUrl}/me`, {
        headers
    });

    if (!response.ok)
    {
        throw new Error(`OAuth provider responded with status ${response.status}`);
    }

    return await response.json();
}

function getHeaders(token)
{
    const headers = {
        'UserAgent': 'stanislav@rozen.pro'
    }

    if (token) headers['Authorization'] = `Bearer ${accessToken}`

    return headers
}

module.exports = {
    getUserInfo
}