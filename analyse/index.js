const minidump = require('minidump');
const fs = require('fs');
minidump.addSymbolPath('./symbols/');
minidump.walkStack('./xxxxxxxxxxxx', (err, res) => {
    fs.writeFileSync('./res.txt', res);
});