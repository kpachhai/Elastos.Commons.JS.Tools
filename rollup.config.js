import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import eslint from '@rollup/plugin-eslint';
import alias from "@rollup/plugin-alias";
import globals from 'rollup-plugin-node-globals';
import { visualizer } from 'rollup-plugin-visualizer';

//import { writeFileSync } from "fs";


const production = !process.env.ROLLUP_WATCH;

export function emitModulePackageFile() {
	return {
		name: 'emit-module-package-file',
		generateBundle() {
			this.emitFile({ type: 'asset', fileName: 'package.json', source: `{"type":"module"}` });
		}
	};
}

const prodBuild = process.env.prodbuild || false;
console.log("Prod build: ", prodBuild);

const now = new Date(
    process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).toUTCString();

const onwarn = warning => {
    // eslint-disable-next-line no-console
    if (warning.code && warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.indexOf('node_modules') < 0 && warning.importer.indexOf("internals.ts") >= 0)
        return; // TMP: don't get flooded by our "internals" circular dependencies for now

    if (warning.code && warning.code === "THIS_IS_UNDEFINED")
        return; // TMP: don't get flooded by this for now

    if (warning.code && warning.code === "EVAL")
        return; // TMP: don't get flooded by this for now

    console.warn("Rollup build warning:", warning);
};

const treeshake = {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
};

const nodePlugins = [
    nodeResolve({
        preferBuiltins: true
    }),
    json({}),
    replace({
        delimiters: ['', ''],
        preventAssignment: true,
        exclude: [
            '/node_modules/rollup-plugin-node-polyfills/**/*.js',
            '/node_modules/rollup-plugin-polyfill-node/**/*.js',
        ],
        values: {
            // Replace readable-stream with stream (polyfilled) because it uses dynamic requires and this doesn't work well at runtime
            // even if trying to add "readable-stream" to "dynamicRequireTargets" in commonJs().
            // https://github.com/rollup/rollup/issues/1507#issuecomment-340550539
            'require(\'readable-stream\')': 'require(\'stream\')',
            'require("readable-stream")': 'require("stream")',
            'require(\'readable-stream/writable\')': 'require(\'stream\').Writable',
            'require("readable-stream/writable")': 'require("stream").Writable',
            'require(\'readable-stream/readable\')': 'require(\'stream\').Readable',
            'require("readable-stream/readable")': 'require("stream").Readable',
            'LegacyTransportStream = require(\'./legacy\')': 'LegacyTransportStream = null',
            'LegacyTransportStream = require(\'winston-transport/legacy\')': 'LegacyTransportStream = null'
        }
    }),
    commonjs({}),
    typescript({
        sourceMap: !prodBuild,
        exclude: "*.browser.ts"
    })
];

export default command => {
    //const { collectLicenses, writeLicense } = getLicenseHandler();
    const commonJSBuild = {
        input: {
            'commons.js.tools.js': 'src/index.ts'
        },
        onwarn,
        plugins: [
            ...nodePlugins,
            eslint()
        ],
        treeshake,
        strictDeprecations: true,
        output: {
            //banner,
            chunkFileNames: 'shared/[name].js',
            dir: 'dist',
            entryFileNames: '[name]',
            externalLiveBindings: false,
            format: 'cjs',
            freeze: false,
            sourcemap: !prodBuild
        }
    };

    if (command.configTest) {
        return commonJSBuild;
    }

    const esmBuild = {
        ...commonJSBuild,
        input: { 'commons.js.tools.js': 'src/index.ts' },
        plugins: [
            ...nodePlugins,
            emitModulePackageFile(),
            //collectLicenses()
        ],
        output: {
            ...commonJSBuild.output,
            dir: 'dist/es',
            format: 'es',
            sourcemap: !prodBuild,
            minifyInternalExports: false
        }
    };

    const browserBuilds = {
        input: 'src/index.ts',
        onwarn,
        plugins: [
            // IMPORTANT: DON'T CHANGE THE ORDER OF THINGS BELOW TOO MUCH! OTHERWISE YOU'LL GET
            // GOOD HEADACHES WITH RESOLVE ERROR, UNEXPORTED CLASSES AND SO ON...
            json(),
            // Circular dependencies tips: https://github.com/rollup/rollup/issues/3816
            replace({
                delimiters: ['', ''],
                preventAssignment: true,
                values: {
                    // Replace readable-stream with stream (polyfilled) because it uses dynamic requires and this doesn't work well at runtime
                    // even if trying to add "readable-stream" to "dynamicRequireTargets" in commonJs().
                    // https://github.com/rollup/rollup/issues/1507#issuecomment-340550539
                    'require(\'readable-stream\')': 'require(\'stream\')',
                    'require("readable-stream")': 'require("stream")',
                    'require(\'readable-stream/writable\')': 'require(\'stream\').Writable',
                    'require("readable-stream/writable")': 'require("stream").Writable',
                    'require(\'readable-stream/readable\')': 'require(\'stream\').Readable',
                    'require("readable-stream/readable")': 'require("stream").Readable',
                    'LegacyTransportStream = require(\'./legacy\')': 'LegacyTransportStream = null',
                    'LegacyTransportStream = require(\'winston-transport/legacy\')': 'LegacyTransportStream = null'
                }
            }),
            alias({
                "entries": [
                    { "find": "buffer", "replacement": "buffer-es6" },
                ]
            }),
            nodeResolve({
                mainFields: ['browser', 'module', 'jsnext:main', 'main'],
                browser: true,
                preferBuiltins: true,
                dedupe: ['bn.js', 'browserfs', 'buffer-es6', 'process-es6', 'crypto-browserify', 'assert', 'events', 'browserify-sign']
            }),
            // Polyfills needed to replace readable-stream with stream (circular dep)
            commonjs({
                esmExternals: true,
                //requireReturnsDefault: "true", // "true" will generate build error: TypeError: Cannot read property 'deoptimizePath' of undefined
                //requireReturnsDefault: "auto", // namespace, true, false, auto, preferred
                transformMixedEsModules: true, // TMP trying to solve commonjs "circular dependency" errors at runtime
                dynamicRequireTargets: [],
            }),
            globals(), // Defines process, Buffer, etc
            typescript({
                exclude: "*.node.ts"
            }),
            visualizer({
                filename: "./browser-bundle-stats.html"
            }) // To visualize bundle dependencies sizes on a UI.
            // LATER terser({ module: true, output: { comments: 'some' } })
        ],
        treeshake,
        strictDeprecations: true,
        output: [
            {
                file: 'dist/es/commons.js.tools.browser.js',
                format: 'es',
                sourcemap: !prodBuild,
            },
        ]
    };

    

    return [ commonJSBuild, esmBuild, browserBuilds];
};