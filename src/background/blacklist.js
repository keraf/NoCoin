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
        // Load the custom blacklist from the config
    }

    // Getter for full blacklist (merging standard with custom)
    get blacklist() {
        return [
            ...this._blacklist,
            ...this._customBlacklist,
        ];
    }

    updateBlacklist = () => {
        return this._fetchBlacklist(config.currentConfig.blacklistRemote);
    }

    // Check entire blacklist
    isInBlacklist = (url) => {
        const blacklist = this.getBlacklist();
    }

    // Is in custom blacklist
    isInCustomBlacklist = (url) => {
    
    }

    getCustomBlacklist = () => {

    }

    addToCustomBlacklist = (url) => {

    }

    removeFromCustomBlacklist = (url) => {

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
                    // Fallback to local blacklist if the HTTP one can't be loaded
                    if (remote) {
                        return this._fetchBlacklist(false);
                    }

                    return reject(err);
                });
        });
    }

}