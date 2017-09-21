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
        // Globally paused
        if (!config.toggle) {
            return { cancel: false };
        }

        // Is domain white listed
        if (isDomainWhitelisted(domains[details.tabId])) {
            return { cancel: false };
        }

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
let domains = [];

// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    domains[tabId] = getDomain(tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});

// Run with the right icon
if (!config.toggle) {
    changeToggleIcon(false);
}

// Load the blacklist and run the blocker
const blacklist = 'https://raw.githubusercontent.com/keraf/aaaNoCoin/master/src/blacklist.txt';
fetch(blacklist)
    .then(resp => {
        if (resp.status === 200) {
            resp.text().then(text => runBlocker(text));
        } else {
            runFallbackBlocker();
        }
    })
    .catch(err => {
        runFallbackBlocker();
    });

// Communication with the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'GET_STATE':
            sendResponse({
                whitelisted: isDomainWhitelisted(domains[message.tabId]),
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