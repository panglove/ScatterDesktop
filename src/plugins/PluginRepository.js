import * as PluginTypes from './PluginTypes';
import {Blockchains, BlockchainsArray} from '../models/Blockchains';
import {RUNNING_TESTS} from "../util/TestingHelper";

/***
 * Setting up for plugin based generators,
 * this will add more blockchain compatibility in the future.
 */

class PluginRepositorySingleton {

    constructor(){
        this.plugins = [];
        this.loadPlugins();
    }

    loadPlugins(){
        // if(RUNNING_TESTS) return;
        BlockchainsArray.map(({value:blockchain}) => {
            if(RUNNING_TESTS){
                // scrypt causes tests to fail due to no prebuilds
                if(blockchain === Blockchains.ETH) return;
            }

            const plugin = require('./defaults/'+blockchain).default;
            this.plugins.push(new plugin);
        });
    }

    signatureProviders(){
        return this.plugins.filter(plugin => plugin.type === PluginTypes.BLOCKCHAIN_SUPPORT);
    }

    supportedBlockchains(){
        return this.signatureProviders().map(plugin => name)
    }

    plugin(name){
        return this.plugins.find(plugin => plugin.name === name);
    }

    async endorsedNetworks(){
        return await Promise.all(this.signatureProviders().map(async plugin => await plugin.getEndorsedNetwork()));
    }

    defaultExplorers(){
        return BlockchainsArray.reduce((acc,x) => {
            acc[x.value] = [this.plugin(x.value).defaultExplorer()];
            return acc;
        }, {})
    }
}

const PluginRepository = new PluginRepositorySingleton();
export default PluginRepository;