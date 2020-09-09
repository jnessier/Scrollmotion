import {App} from "./scrollmotion/App";
import {defaultConfig} from "./defaultConfig";

export default (items = '.sm-item', customConfig?: unknown): App => {
    let config = defaultConfig;
    if (typeof customConfig === 'object') {
        config = Object.assign(config, customConfig);
    }

    return new App(items, config);
};