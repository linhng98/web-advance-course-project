var express = require('express');
const url = require('url');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

var router = express.Router();
const adapter = new FileSync('./data/fr_en.json');
const db = lowdb(adapter);

/* GET users listing. */
router.get('/', function (req, res, next) {
  const queryString = url.parse(req.url, true).query;
  if (queryString.word) {
    const obj =
      db.get('words')
        .find({ "fr": queryString.word })
        .value()

    if (obj) {
      res.send(obj);
      return;
    }
  }

  res.sendStatus(204);
});

module.exports = router;
