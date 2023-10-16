var express = require('express');
var router = express.Router();
var fs = require('fs')

router.get('/', (req, res) => {
  const db = fs.readFileSync('../db.json', 'utf-8')
  const data = JSON.parse(db)
  console.log(data);
  data.star += 1
  fs.writeFileSync('../db.json', JSON.stringify(data))
  console.log( JSON.stringify(data));
  res.json({code:1})
});

module.exports = router;
