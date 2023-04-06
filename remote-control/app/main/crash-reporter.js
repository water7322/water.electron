const { crashReporter, app } = require('electron');

function init() {
    crashReporter.start({
        productName: app.getName(),
        companyName: 'water',
        submitURL: 'http://127.0.0.1:33855/crash'
    });
}

module.exports = { init };