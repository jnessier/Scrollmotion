import {App} from "./scrollmotion/App";
import {config as defaultConfig} from "./default/config";

export default (items = '.sm-item', customConfig?: unknown): App => {
    let config = defaultConfig;
    if (customConfig instanceof Object) {
        config = Object.assign({}, config, customConfig);
    }

    return new App(items, config);
};