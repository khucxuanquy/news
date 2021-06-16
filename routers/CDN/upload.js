const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const { verifyToken, convertDate } = require('../../helpers/index')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { mimetype } = file
    const date = convertDate(0, +new Date())
    const typeFile = (mimetype.includes('image') ? 'images' : mimetype.includes('video') ? 'videos' : 'files')
    const pathUpload = path.join(__dirname, `../../static/${typeFile}/${date}/`)
    if (!fs.existsSync(pathUpload)) mkdirp.sync(pathUpload);
    callback(null, pathUpload);
  },
  filename: (req, file, callback) => {
    let { originalname } = file
    const extname = path.extname(originalname).toLowerCase();
    callback(null, Math.random().toString(36).slice(2) + extname)
  }
});
const fileFilter = (req, file, cb) => cb(null, true)

const upload = multer({ storage, fileFilter }).array('file');
// const upload = multer({ storage, fileFilter }).array('images[]');

router.post('/', verifyToken, (req, res) => {
  upload(req, res, async error => {
    if (error) return res.send(error);
    const url = req.files.map(i => {
      const { mimetype, destination, filename } = i
      const date = convertDate(2, destination.replace(/\\|\//g, "").slice(-8))
      const typeFile = (mimetype.includes('image') ? 'images' : mimetype.includes('video') ? 'videos' : 'files') + '/'
      return 'https://doan.khucblog.com/static/' + typeFile + convertDate(1, date) + '/' + filename;
    });
    return res.send({ location: url[0] });
  });
});

// router.get('/:type/:date/:nameFile', (req, res) => {
//   let { type, date, nameFile } = req.params
//   date = convertDate(1, date)
//   let pathOrigin = path.join(__dirname, `../../public/${type}/origin/${date}/`) + nameFile;
//   // check exist origin file
//   if (!fs.existsSync(pathOrigin)) return res.send('Not found origin file');

//   fs.utimes(pathOrigin, new Date(), new Date(), () => { })
//   return res.sendFile(pathOrigin)
// })

module.exports = router