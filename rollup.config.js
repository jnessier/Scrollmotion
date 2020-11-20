const isProduction = (process.env.NODE_ENV === 'production'),
    banner = require('./build/banner');

const rollupConfig = {
    input: './src/index.ts',
    plugins: [
        require('@rollup/plugin-node-resolve').default({
            extensions: '.ts'
        }),
        require('@rollup/plugin-commonjs')({
            extensions: '.ts'
        }),
        require('@rbnlffl/rollup-plugin-eslint')(),
        require('@rollup/plugin-typescript')(),
        require('@rollup/plugin-babel').default({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        require('@rollup/plugin-strip')()
    ],
    output: [{
        banner: banner,
        format: 'iife',
        name: 'Scrollmotion',
        sourcemap: true,
        file: './dist/scrollmotion.js',
    }]
}

if (isProduction) {
    rollupConfig.output.push({
        banner: banner,
        format: 'iife',
        name: 'Scrollmotion',
        sourcemap: true,
        plugins: [
            require('rollup-plugin-terser').terser()
        ],
        file: './dist/scrollmotion.min.js',
    })

    rollupConfig.output.push({
        banner: banner,
        format: 'esm',
        name: 'Scrollmotion',
        sourcemap: true,
        file: './dist/scrollmotion.esm.js',
    });
}

export default (args) => {
    if (args.serve) {
        rollupConfig.output[0].plugins = [
            require('rollup-plugin-browsersync')({
                watch: true,
                server: {
                    baseDir: [
                        './build/serve',
                        './dist',
                        //    './'
                    ],
                    routes: {
                        '/src': './src'
                    }
                },
            })
        ];
    }

    return rollupConfig
};