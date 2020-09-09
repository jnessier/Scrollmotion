module.exports = {
    sourceMaps: true,
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ],
    ignore: ['node_modules']
};