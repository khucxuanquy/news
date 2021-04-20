module.exports.startApp = async callback => {
    const { dbSql } = require('../config');
    dbSql.connect(err => {
        if (err) return callback(err)
        require('./baseModel');
        callback(null);
    });
}
