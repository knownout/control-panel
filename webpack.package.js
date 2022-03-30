const path = require("path");
const defaultConfig = require("./webpack.config.js");

const packageConfig = Object.assign(defaultConfig, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "package", "dist"),
        filename: "[name].js",
        library: {
            name: "ControlPanel",
            type: "umd"
        }
    },

    entry: {
        "ControlPanel": path.resolve(__dirname, "package", "ControlPanel")
    },

    plugins: [],

    externals: {
        "@heroicons/react": {
            commonjs: "@heroicons/react",
            commonjs2: "@heroicons/react",
            amd: "@heroicons/react"
        },
        "@knownout/lib": {
            commonjs: "@knownout/lib",
            commonjs2: "@knownout/lib",
            amd: "@knownout/lib"
        },
        "@knownout/interface": {
            commonjs: "@knownout/interface",
            commonjs2: "@knownout/interface",
            amd: "@knownout/interface"
        },
        "recoil": {
            commonjs: "recoil",
            commonjs2: "recoil",
            amd: "recoil"
        },
        "react": {
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        },
        "react-router-dom": {
            commonjs: "react-router-dom",
            commonjs2: "react-router-dom",
            amd: "react-router-dom"
        },
        "react-router": {
            commonjs: "react-router",
            commonjs2: "react-router",
            amd: "react-router"
        }
    }
});

packageConfig.module.rules[1].use.options.configFile = "tsconfig.package.json";
module.exports = packageConfig;
