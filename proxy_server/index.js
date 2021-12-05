const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const HOST_PROTOCOL = 'http';
const ABS_HOST = 'localhost';
const ABS_PORT = `:${PORT}`;
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
    hostRewrite: `${ABS_HOST}${ABS_PORT}/${routeAlias}`,
    protocolRewrite: HOST_PROTOCOL,
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
          /samesite=.+;?/,
          'samesite=None;'
        );
      });
      // Rewrite redirection
      if(proxyRes.headers['location']) {
        proxyRes.headers['location'] = proxyRes.headers['location'].replace(
          `https://personalschedule.librus.pl/`,
          `${HOST_PROTOCOL}://${ABS_HOST}${ABS_PORT}/personalschedule-api/`
        );
      }
    },
    onProxyReq(proxyReq, req, res) {
      if (routeAlias === 'portal-api' && req.headers.cookie) {
        let cookie = req.headers.cookie;
        let matching = cookie.match(/XSRF-TOKEN=(.*)/);
        if (!matching) return;
        const xsrfToken = matching[1];
        console.log("XSRF-TOKEN=" + xsrfToken);
        req.headers['X-XSRF-TOKEN'] = xsrfToken;
      }
    }
  }
}

// Proxy routes
app.use('/portal-api', createProxyMiddleware(getProxyOptions(
  'portal-api',
  'portal.librus.pl',
  'https'
)));
app.use('/personalschedule-api', createProxyMiddleware(getProxyOptions(
  'personalschedule-api',
  'personalschedule.librus.pl',
  'https'
)));
app.use('/main-api', createProxyMiddleware(getProxyOptions(
  'main-api',
  'api.librus.pl',
  'https'
)));

app.get('/logout', cors({ origin: APP_HOST, credentials: true }), function (req, res, next) {
  if (req.headers.cookie) {
    const cookieNameRegEx = /(^|; )([^= ;]+)=/g;
    let match;
    while (match = cookieNameRegEx.exec(req.headers.cookie)) {
      console.log('DELETING COOKIE: ' + match[2]);
      res.cookie(match[2], '', { sameSite: 'none', secure: true, expires: new Date(0) });
    }
  }
  res.json({message: 'Author is being fucked by Librus'});
})

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
