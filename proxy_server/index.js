const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = 'localhost';

app.use(morgan('dev'));

// portal.librus.pl

app.use('/portal-api', createProxyMiddleware({
  target: 'https://portal.librus.pl/',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
      [`^/portal-api`]: '',
  },
  hostRewrite: `${HOST}:${PORT}/portal-api`,
  protocolRewrite: 'http',
  headers: {
    'Host': 'portal.librus.pl',
    'Origin': 'https://portal.librus.pl',
    'Referer': 'https://portal.librus.pl/rodzina/login'
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'x-xsrf-token, x-csrf-token, x-requested-with, content-type, accept';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

    if(proxyRes.headers['location']) {
      proxyRes.headers['location'] = proxyRes.headers['location'].replace('https://personalschedule.librus.pl/', 'http://localhost:3000/personalschedule-api/')
    }
  }
}));

// personalschedule.librus.pl

app.use('/personalschedule-api', createProxyMiddleware({
  target: 'https://personalschedule.librus.pl/',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
      [`^/personalschedule-api`]: '',
  },
  hostRewrite: `${HOST}:${PORT}/personalschedule-api`,
  protocolRewrite: 'http',
  headers: {
    'Host': 'personalschedule.librus.pl',
    'Origin': 'https://portal.librus.pl',
    'Referer': 'https://portal.librus.pl/'
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'x-xsrf-token, x-csrf-token, x-requested-with, content-type, accept';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie']?.map(cookie => {
      return cookie.replace(
        'domain=personalschedule.librus.pl',
        'domain=localhost'
      );
     });
  }
}));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
