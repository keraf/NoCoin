/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */

import Config from 'background/config.js';
import Whitelist from 'background/whitelist.js';
import Blacklist from 'background/blacklist.js';
import * as ui from 'background/ui.js';
import { urlToDomain } from 'shared/helpers/domain.js';

const config = new Config();
const whitelist = new Whitelist();
const blacklist = new Blacklist();

let domains = []; // domains during navigation for a tabId

const requestChecker = (details) => {
    const { tabId } = details;
    const currentConfig = config.currentConfig;

    const isWhitelisted = whitelist.isWhitelisted(domains[tabId]);
    ui.setWarning(tabId, isWhitelisted);

    if (!currentConfig.enabled) {
        return { cancel: false };
    }

    if (isWhitelisted) {
        return { cancel: false };
    }

    return { cancel: true };
};

const runRequestChecker = () => {
    const urls = blacklist.fullBlacklist;

    if (chrome.webRequest.onBeforeRequest.hasListener(requestChecker)) {
        chrome.webRequest.onBeforeRequest.removeListener(requestChecker);
    }

    chrome.webRequest.onBeforeRequest.addListener(requestChecker, { urls }, ['blocking']);
};

// First run
config.getConfig()
    .then(config => {
        // Set the icon color to its enabled status (color = enabled)
        ui.setIconColored(config.enabled);

        // Load the blacklist (with fallback to local if failed)
        blacklist.updateBlacklist()
            .then(() => {
                runRequestChecker();
            })
            .catch(() => {
                blacklist.updateBlacklist(true)
                    .then(() => {
                        runRequestChecker();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
    })
    .catch(err => {
        console.log(err);
    });

// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = urlToDomain(tab.url);

    if (changeInfo === 'loading') {
        if (config.toggle) {
            ui.setIconColored(true);
        }
    
        ui.resetWarning();
    }
});

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        /** TODO (rewrite)
         * INIT - Get initial state
         * TOGGLE - Toggle extension
         * CONFIG_GET - Get the current config
         * CONFIG_SET - Update the config
         * WHITELIST_GET - Get current whitelist
         * WHITELIST_ADD - Add to whitelist
         * WHITELIST_REMOVE - Remove from whitelist
         * BLACKLIST_GET - Get custom blacklist
         * BLACKLIST_ADD - Add to custom blacklist
         * BLACKLIST_REMOVE - Remove from the custom blacklist
         */
        case 'INIT': {
            sendResponse({
                ...config.currentConfig,
                domain: domains[message.tabId],
                whitelisted: whitelist.isWhitelisted(domains[message.tabId]),
            });
            break;
        }
        case 'TOGGLE': {
            const { enabled } = config.currentConfig;

            ui.setIconColored(!enabled);
            config.setConfig({ enabled: !enabled });
            sendResponse(!enabled);
            break;
        }
        case 'CONFIG_GET': {
            break;
        }
        case 'CONFIG_SET': {
            break;
        }
        case 'WHITELIST_GET': {
            sendResponse(config.currentConfig.whitelist);
            break;
        }
        case 'WHITELIST_ADD': {
            whitelist.addToWhitelist(domains[message.tabId], message.time);
            
            sendResponse({
                domain: domains[message.tabId],
                time: message.time,
            });
            break;
        }
        case 'WHITELIST_REMOVE': {
            whitelist.removeFromWhitelist(domains[message.tabId]);
            break;
        }
        case 'BLACKLIST_GET': {
            sendResponse({
                customBlacklist: blacklist.customBlacklist,
            });
            break;
        }
        case 'BLACKLIST_ADD': {
            blacklist.addToCustomBlacklist(message.url);
            
            sendResponse({
                url: message.url,
            });
            break;
        }
        case 'BLACKLIST_REMOVE': {
            blacklist.removeFromCustomBlacklist(message.url);
            break;
        }
    }
});