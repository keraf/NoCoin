import Config from 'background/config.js';
import { getTimestamp } from 'shared/helpers/time.js';

const config = new Config();

class Whitelist {

    _whitelist = [];

    constructor() {
        config.getConfig()
            .then(items => {
                this._whitelist = items.whitelist;
            })
            .catch(err => {
                // TODO: Do something with this error
            });
    }

    isWhitelisted = (domain) => {
        if (!domain) { 
            return false;
        }

        return this._whitelist.find(w => w.domain === domain /* TODO: Check if expired */) !== undefined;
    };
    
    addToWhitelist = (domain, time) => {
        if (domain && !this.isWhitelisted(domain)) {
            const expiration = getTimestamp() + time;

            this._whitelist = [
                ...this._whitelist,
                { domain, expiration },
            ];

            // TODO: Promise, check result and do something with it
            config.setConfig({
                whitelist: this._whitelist,
            });
        }
    };
    
    removeFromWhitelist = (domain) => {
        if (this.isWhitelisted(domain)) {
            this._whitelist = this._whitelist.filter(w => w.domain !== domain);

            // TODO: Promise, check result and do something with it
            config.setConfig({
                whitelist: this._whitelist,
            });
        }
    };

}

export default Whitelist;