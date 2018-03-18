/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */

import Config from 'background/config.js';
import Whitelist from 'background/whitelist.js';
import { urlToDomain } from 'shared/helpers/domain.js';

const config = new Config();
const whitelist = new Whitelist();

let domains = []; // domains during navigation for a tabId

const requestChecker = (details) => {
    const currentConfig = config.currentConfig;

    if (!currentConfig.enabled) {
        return { cancel: false };
    }

    // Check against the blacklist

    return { cancel: false };
};

const runRequestChecker = () => {
    // Get blacklist URL
    const urls = [];

    if(chrome.webRequest.onBeforeRequest.hasListener(requestChecker)){
        chrome.webRequest.onBeforeRequest.removeListener(requestChecker);
    }

    chrome.webRequest.onBeforeRequest.addListener(requestChecker, { urls }, ['blocking']);
};

// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = urlToDomain(tab.url);
    /*
    domains[tabId] = getDomain(tab.url);
    
    // Set back to normal when navigating
    if (changeInfo === 'loading') {
        if (config.toggle) {
            chrome.browserAction.setIcon({
                path: 'img/logo_enabled.png',
                tabId,
            });
        }

        detected[tabId] = false;
    
        chrome.browserAction.setBadgeText({
            text: '',
            tabId,
        });
    }
    */
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
            break;
        }
        case 'WHITELIST_REMOVE': {
            whitelist.removeFromWhitelist(domains[message.tabId]);
            break;
        }
        case 'BLACKLIST_GET': {
            break;
        }
        case 'BLACKLIST_ADD': {
            break;
        }
        case 'BLACKLIST_REMOVE': {
            break;
        }

        /*
        case 'GET_STATE':
            sendResponse({
                version: chrome.runtime.getManifest().version,
                whitelisted: isDomainWhitelisted(domains[message.tabId]),
                domain: domains[message.tabId],
                detected: detected[message.tabId] || false,
                toggle: config.toggle,
            });
            break;
        case 'TOGGLE':
            config.toggle = !config.toggle;
            saveConfig();

            changeToggleIcon(config.toggle);
            sendResponse(config.toggle);
            break;
        case 'WHITELIST': {
            if (message.whitelisted) {
                removeDomainFromWhitelist(domains[message.tabId]);
            } else {
                addDomainToWhitelist(domains[message.tabId], message.time);
            }

            sendResponse(!message.whitelisted);
            break;
        }
        case 'GET_WHITELIST': {
            sendResponse(config.whitelist);
            break;
        }
        case 'WHITELIST_ADD': {
            const domain = getDomain(message.url);
            addDomainToWhitelist(domain, message.time);

            sendResponse({
                domain,
                expiration: getTimestamp() + (message.time * 60),
            });
            break;
        }
        case 'WHITELIST_REMOVE': {
            removeDomainFromWhitelist(message.domain);
            break;
        }
        */
    }
});