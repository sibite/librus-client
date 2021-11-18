const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { stringify } = require('querystring');
const { createStringLiteralFromNode } = require('typescript');

// Create Express Server
const app = express();

// Configuration
const HOST = 'localhost';
const PORT = 3000;
const APP_HOST = 'http://localhost:4200';

app.use(morgan('dev'));

// Proxy options
function getProxyOptions(routeAlias, host, protocol = 'https') {
  return {
    target: `${protocol}://${host}/`, // https://host.com/
    changeOrigin: true,
    secure: true,
    pathRewrite: {
        [`^/${routeAlias}`]: '',
    },
    hostRewrite: `${HOST}:${PORT}/${routeAlias}`,
    protocolRewrite: 'http',
    headers: {
      'Host': host, // host.com
      'Origin': 'https://portal.librus.pl',
      'Referer': 'https://portal.librus.pl/'
    },
    onProxyRes: function(proxyRes, req, res) {
      const allowedHeaders = [
        'x-xsrf-token',
        'x-csrf-token',
        'x-requested-with',
        'content-type',
        'accept',
        'authorization'
      ]
      proxyRes.headers['Access-Control-Allow-Origin'] = APP_HOST;
      proxyRes.headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      // Rewrite cookies domain
      proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie']?.map(cookie => {
        return cookie.replace(
          `domain=${host}`,
          'domain=localhost'
        );
      });
      // Rewrite redirection
      if(proxyRes.headers['location']) {
        proxyRes.headers['location'] = proxyRes.headers['location'].replace(
          `https://personalschedule.librus.pl/`,
          `http://${HOST}:${PORT}/personalschedule-api/`
        );
      }
    }
  }
}

// Proxy routes
app.use('/portal-api', createProxyMiddleware(getProxyOptions(
  'portal-api',
  'portal.librus.pl',
  'https'
)))
app.use('/personalschedule-api', createProxyMiddleware(getProxyOptions(
  'personalschedule-api',
  'personalschedule.librus.pl',
  'https'
)))
app.use('/main-api', createProxyMiddleware(getProxyOptions(
  'main-api',
  'api.librus.pl',
  'https'
)))

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
