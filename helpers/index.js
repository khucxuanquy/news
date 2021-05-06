const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const md5 = require('md5')
const { l } = require('../config')

const { ACCESS_TOKEN_SECRET } = process.env
const SLASH = '/'
const EMAIL = 'smartnewsqtd@gmail.com',
  PASSWORD = 'A123h456C',
  FIFTEEN_MINUTES = 15 * 60 * 1000,
  ONE_HOUR = FIFTEEN_MINUTES * 4,
  ONE_DAY = 24 * ONE_HOUR,
  ONE_WEEK = 7 * ONE_DAY,
  ONE_MONTH = 4 * ONE_WEEK,
  ONE_YEAR = 12 * ONE_MONTH;

module.exports = {
  isImage: /gif|jpg|jpeg|png|tiff|webp|psd|svg+/gi,
  FIFTEEN_MINUTES,
  ONE_HOUR,
  ONE_DAY,
  ONE_WEEK,
  ONE_MONTH,
  ONE_YEAR,
  verifyToken(req, res, next) {
    const { authorization } = req.headers
    if (!authorization || authorization === 'null' || authorization === 'undefined') return res.send({ ok: false, message: 'Tài khoản chưa đăng nhập' })
    jwt.verify(authorization, ACCESS_TOKEN_SECRET, (err, dataToken) => {
      // if (err) return res.sendStatus(403) //Forbidden Error
      if (err) return res.send({ ok: false, message: 'Token invalid' })
      req.token = dataToken
      next()
    })
  },
  /**
   * 
   * @param {*} dataInput 
   * @returns 
   * encode token then response to client
   */
  signToken(dataInput) {
    return jwt.sign(dataInput, ACCESS_TOKEN_SECRET)
  },
  resSuccess(dataResponse) {
    return { ok: true, ...dataResponse }
  },
  resFail(dataResponse) {
    return { ok: false, ...dataResponse }
  },
  randomId() {
    return Math.random().toString(36).slice(2) + Math.random().toString(16).slice(2)
  },
  rangeWeek: function (timestamp) {
    if (!timestamp) timestamp = +new Date()
    let dt = new Date(Number(timestamp))
    dt = new Date(new Date().setHours(0, 0, 0, 0))
    dt = new Date(dt.getTime() - (dt.getDay() > 0 ? (dt.getDay() - 1) * ONE_DAY : 6 * ONE_DAY));
    return { start: dt, end: new Date(dt.getTime() + ONE_DAY * 7 - 1) };
  },
  rangeMonth: function (timestamp) {
    if (!timestamp) timestamp = new Date()
    let d = new Date(Number(timestamp))
    let start = new Date(d.getFullYear(), d.getMonth(), 1);
    let end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { start, end }
  },
  /**
  * @param {String} type 0, 1, 2, 3, 4
  * @param {String} date 
  * @example 0: +new Date() -> yyyy/mm/dd (1608301361443 -> '2020/12/18')
  *          1: ddmmyyy -> yyyy/mm/dd ('18122020' -> '2020/12/18')
  *          2: yyyymmdd -> dd/mm/yyyy ('20201218' -> '18122020')
  *          3: 1619985600000 -> '3/5'
  *          4: 1619985600000 -> '15h'
  * ---------------
  */
  convertDate: function (type, date) {
    let DATE, MONTH, YEAR;
    switch (type) {
      case 0: {
        let d = new Date(date)
        DATE = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        MONTH = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        YEAR = d.getFullYear();
        return YEAR + SLASH + MONTH + SLASH + DATE;
      }
      case 1: {
        DATE = date.slice(0, 2)
        MONTH = date.slice(2, 4)
        YEAR = date.slice(4, date.length)
        return YEAR + SLASH + MONTH + SLASH + DATE;
      }
      case 2: {
        YEAR = date.slice(0, 4)
        MONTH = date.slice(4, 6)
        DATE = date.slice(6, date.length)
        return DATE + MONTH + YEAR;
      }
      case 3: {
        date = new Date(date)
        let _date = date.getDate();
        let _month = date.getMonth() + 1;
        return _date + '/' + _month;
      }
      case 4: {
        date = new Date(date)
        let _hours = date.getHours();
        return _hours + 'h';
      }
      default: return false;
    }
  },
  accentedLetters: function (str) {
    str = str.toLowerCase().trim()
    // str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    // str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    // str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    // str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    // str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    // str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    // str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\s|\\|\/|\#|\?|\&|\=/g, "_");
    str = str.replace(/\'|\"|\`/g, "");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  },
  decodeToken(token) {
    if (!token) return;
    let resolve;
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, dataToken) => resolve = dataToken)
    return resolve;
  },
  async sendToEmailToVerifyAccount({ email, token }) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // default
      port: 587, // default
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    })
    return await transporter.sendMail({
      from: EMAIL,
      to: email,
      subject: "Xác thực tài khoản | Smart News", // title
      html: `<a href='http://localhost:3000/API/users/verify?token=${token}'> bấm vào đây để xác thực tài khoản </a>`, // content = html
    })
  },
  hashPassword(password) {
    return md5(password)
  }
}