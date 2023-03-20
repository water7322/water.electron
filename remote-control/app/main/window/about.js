const openAboutWindow = require('about-window').default;
const path = require('path');

const create = () => openAboutWindow({
    icon_path: path.join(__dirname, 'icon.png'),
    package_json_dir: path.resolve(__dirname, './../../../'),
    copyright: 'Copyright (c) 2023 water768',
    homepage: 'https://github.com/water7322/xxxx'
});

module.exports = { create };