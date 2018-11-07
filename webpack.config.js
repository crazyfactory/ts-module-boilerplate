module.exports = {
    /** Build from built js file */
    entry: {
        typestyle: './lib/index.js',
    },
    target: "node",
    output: {
        filename: './umd/index.js',
        libraryTarget: 'umd',
        library: 'myModule'
    }
};
