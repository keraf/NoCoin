/** 
 * TODO
 * Get the custom blacklist
 * Add URLs to the custom blacklist
 * Remove URLs from the custom blacklist 
 * Get the full blacklist
 */

import Config from 'background/config.js';

const config = new Config();

class Blacklist {

    _blacklist = [];
    _customBlacklist = [];

    constructor() {
        config.getConfig()
            .then(items => {
                this._customBlacklist = items.customBlacklist;
            })
            .catch(err => {
                // TODO: Do something with this error
            });
    }

    // Getter for full blacklist (merging standard with custom)
    get fullBlacklist() {
        return [
            ...this._blacklist,
            ...this._customBlacklist,
        ];
    }

    get baseBlacklist() {
        return this._blacklist;
    }

    get customBlacklist() {
        return this._customBlacklist;
    }

    updateBlacklist = (forceLocal) => {
        return this._fetchBlacklist(forceLocal ? false : config.currentConfig.blacklistRemote);
    }

    // Check entire blacklist
    isInBlacklist = (url) => {
        const blacklist = this.fullBlacklist;

        return blacklist.find(b => b === url) !== undefined;
    }

    // Is in custom blacklist
    isInCustomBlacklist = (url) => {
        const blacklist = this.customBlacklist;

        return blacklist.find(b => b === url) !== undefined;
    }

    addToCustomBlacklist = (url) => {
        if (!this.isInCustomBlacklist(url)) {
            this._customBlacklist = [
                ...this._customBlacklist,
                url,
            ];
    
            config.setConfig({
                customBlacklist: this._customBlacklist,
            });
        }
    }

    removeFromCustomBlacklist = (url) => {
        if (this.isInCustomBlacklist(url)) {
            this._customBlacklist = this._customBlacklist.filter(b => b !== url);
    
            config.setConfig({
                customBlacklist: this._customBlacklist,
            });
        }
    }

    _fetchBlacklist = (remote = true) => {
        return new Promise((resolve, reject) => {    
            const localUrl = chrome.runtime.getURL('blacklist.txt');
            const remoteUrl = 'https://raw.githubusercontent.com/keraf/NoCoin/master/src/blacklist.txt';

            fetch(remote ? remoteUrl : localUrl)
                .then(response => {
                    if (response.status !== 200) {
                        throw 'HTTP error';
                    }

                    return response.text();
                })
                .then(text => {
                    if (text === '') {	
                        throw 'Empty response';
                    }

                    const blacklist = text.split('\n')
                    this._blacklist = blacklist;

                    return resolve(blacklist);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

}

export default Blacklist;