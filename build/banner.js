const year = new Date().getFullYear(),
    pkg = require('./../package.json');

module.exports = () => {
    return `/*!
* Scrollmotion v${pkg.version}
* Copyright ${year} ${pkg.author}
* Licensed under ${pkg.license}
*/`
};