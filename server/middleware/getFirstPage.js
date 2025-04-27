const { begSource } = require('../services/begSource');
const querystring = require('querystring');

module.exports = async function getFirstPage(req, res, next)
{
    try
    {
        const { text } = req.query;
        const qs = querystring.stringify({ text, page: 0, per_page: 100, clusters: true });
        const url = `https://api.hh.ru/vacancies?${qs}`;

        req.vacancies = await begSource(url);
        next();
    } catch (err)
    {
        next(err);
    }
};