const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = 'localhost';
const API_SERVICE_URL = 'https://portal.librus.pl/';
const API_SERVICE_HOST = 'portal.librus.pl';

app.use(morgan('dev'));

app.use('/portal-api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  secure: true,
  pathRewrite: {
      [`^/portal-api`]: '',
  },
  headers: {
    'Host': 'portal.librus.pl',
    'Origin': 'https://portal.librus.pl',
    'Referer': 'https://portal.librus.pl/rodzina/login'
  },
  onProxyReq: function(proxyReq, req, res) {
    //console.log(req.headers);
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'x-xsrf-token, x-csrf-token, x-requested-with, content-type, accept';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie']?.map(cookie => cookie.replace('secure; ', ''));
  }
}));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
