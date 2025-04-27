const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const fillcard = require('./modules/fillcard');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataobj = JSON.parse(data);
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/cards.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    const card_data = dataobj.map((product) => fillcard(card, product)).join('');
    const output = overview.replace(/{%CARDS%}/g, card_data);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(output);
  }

  if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const dataquery = dataobj[query.id];
    const output = fillcard(product, dataquery);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
