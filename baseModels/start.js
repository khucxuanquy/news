module.exports.startApp = async callback => {
    const { dbSql } = require('../config');
    dbSql.connect(err => {
        if (err) return callback(err)
        require('./baseModel');
        callback(null);
        setInterval(() => dbSql.query('SELECT 1 + 1 AS ping'), 20000);
    });
}