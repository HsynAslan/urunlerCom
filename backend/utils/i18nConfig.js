const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'tr',
    preload: ['tr', 'en'], // Premium'da daha fazlası
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json')
    }
  });

module.exports = { i18next, middleware };
