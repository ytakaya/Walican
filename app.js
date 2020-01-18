const express = require('express');
const path = require('path');
const PORT = 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engin', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/g/', (req, res) => res.json({method: "こんにちは、getさん"}))
  .post('/p/', (req, res) => res.json({method: "こんにちは、postさん"}))
  .post('/hook/', (req, res) => res.json({test: "hook"}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));