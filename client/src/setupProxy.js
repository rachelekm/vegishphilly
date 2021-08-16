const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://django:8033',
            changeOrigin: true,
        })
    );
};
