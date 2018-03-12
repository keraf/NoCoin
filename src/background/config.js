class Config {

    _defaultConfig = {
        enabled: true,
        notifications: false,
        blacklistRemote: true,
        blacklistRefresh: 60,
        whitelist: [],
        customBlacklist: [],
    };

    _currentConfig = {};
    
    constructor() {
        // Load the config on construct (will populate _currentConfig)
        this.getConfig();
    }

    /**
     * Getter for current configuration
     * @return {object} - Object with the current configuration values
     */
    get currentConfig() {
        return this._currentConfig;
    }

    /**
     * Get config values (sync) - Returns defaults if values are not set
     * @return {Promise} - True if successful, string containing error message if not
     */
    getConfig = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this._defaultConfig, (items) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError.message);
                }

                this._currentConfig = items;
    
                return resolve(this._currentConfig);
            });
        });
    }

    /**
     * Save config (sync)
     * @param {object} config - Config values to save ({ key: value })
     * @return {Promise} - True if successful, string containing error message if not
     */
    setConfig = (items) => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(items, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError.message);
                }

                this._currentConfig = {
                    ...this._currentConfig,
                    ...items,
                };
    
                return resolve(this._currentConfig);
            });
        });
    };

}

export default Config;