const { SearchLog } = require('../models');

module.exports = function logSearch(req, res, next)
{
    const { text } = req.query;
    const { found } = req.vacancies || {};

    SearchLog.create({ text, found }).then(record =>
    {
        req.searchLogId = record.id;
    })
    .catch(err => console.error('Error logging metadata:', err));

    next();
};