/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */

// Config
const defaultConfig = {
    toggle: true,
    whitelist: [{
        domain: 'cnhv.co',
        expiration: 0,
    }],
};

const localConfig = JSON.parse(localStorage.getItem('config'));
let config = {
    ...defaultConfig,
    ...localConfig,
};

/**
 * Variables
 */
let domains = [];
let detected = [];

/**
 * Functions
 */
const saveConfig = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

const changeToggleIcon = (isEnabled) => {
    chrome.browserAction.setIcon({
        path: `img/${isEnabled ? 'logo_enabled' : 'logo_disabled'}.png`,
    });
};

const getDomain = (url) => {
    const match = url.match(/:\/\/(.[^/]+)/);
    
    return match ? match[1] : '';
};

const getTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};

const isDomainWhitelisted = (domain) => {
    if (!domain) return false;

    const domainInfo = config.whitelist.find(w => w.domain === domain);

    if (domainInfo) {
        if (domainInfo.expiration !== 0 && domainInfo.expiration <= getTimestamp()) {
            removeDomainFromWhitelist(domain);

            return false;
        }

        return true;
    }

    return false;
};

const addDomainToWhitelist = (domain, time) => {
    if (!domain) return;
    time = +time || 0;

    // Make sure the domain is not already whitelisted before adding it
    if (!isDomainWhitelisted(domain)) {
        config.whitelist = [
            ...config.whitelist,
            {
                domain: domain,
                expiration: time === 0 ? 0 : getTimestamp() + (time * 60),
            },
        ];
        saveConfig();
    }
};

const removeDomainFromWhitelist = (domain) => {
    if (!domain) return;

    config.whitelist = config.whitelist.filter(w => w.domain !== domain);
    saveConfig();
};

const runBlocker = (blacklist) => {
    const blacklistedUrls = blacklist.split('\n');

    chrome.webRequest.onBeforeRequest.addListener(details => {
        chrome.browserAction.setBadgeBackgroundColor({
            color: [200, 0, 0, 100],
            tabId: details.tabId,
        });
        
        chrome.browserAction.setBadgeText({
            text: '!',
            tabId: details.tabId,
        });

        detected[details.tabId] = true;

        // Globally paused
        if (!config.toggle) {
            return { cancel: false };
        }

        // Is domain white listed
        if (isDomainWhitelisted(domains[details.tabId])) {
            chrome.browserAction.setIcon({
                path: 'img/logo_enabled_whitelisted.png',
                tabId: details.tabId,
            });

            return { cancel: false };
        }

        chrome.browserAction.setIcon({
            path: 'img/logo_enabled_blocked.png',
            tabId: details.tabId,
        });

        return { cancel: true };
    }, { 
        urls: blacklistedUrls
    }, ['blocking']);
};

const runFallbackBlocker = () => {
    fetch(chrome.runtime.getURL('blacklist.txt'))
        .then(resp => {
            resp.text().then(text => runBlocker(text));
        });
};

/**
 * Main
 */

// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = getDomain(tab.url);
    
    // Set back to normal when navigating
    if (changeInfo === 'loading') {
        if (config.toggle) {
            chrome.browserAction.setIcon({
                path: 'img/logo_enabled.png',
                tabId,
            });
        }

        detected[details.tabId] = false;
    
        chrome.browserAction.setBadgeText({
            text: '',
            tabId,
        });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});

// Run with the right icon
if (!config.toggle) {
    changeToggleIcon(false);
}

// Load the blacklist and run the blocker
const blacklist = 'https://raw.githubusercontent.com/keraf/NoCoin/master/src/blacklist.txt';
fetch(blacklist)
    .then(resp => {
        if (resp.status !== 200) {
            throw 'HTTP Error';
        }

        resp.text().then((text) => {
            if (text === '') {
                throw 'Empty response';
            }

            runBlocker(text);
        });
    })
    .catch(err => {
        runFallbackBlocker();
    });

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
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
                removeDomainFromWhitelist(domains[message.tabId], message.time);
            } else {
                addDomainToWhitelist(domains[message.tabId], message.time);
            }

            sendResponse(!message.whitelisted);
            break;
        }
    }
});
