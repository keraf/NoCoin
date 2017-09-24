/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Arthur Geron <arthur.geron>
 * @version     0.9
 * @license     GNULGPL3.0
 * @source      https://github.com/arthurgeron/NoCoin
 */

// Config
const defaultConfig = {
    toggle: true,
};

const localConfig = JSON.parse(localStorage.getItem('config'));
let config = {
    ...defaultConfig,
    ...localConfig,
};

// Load the blacklist and run the request checker

const blacklist = chrome.runtime.getURL("blacklist.txt");
let blacklistedUrls;
/**
 * Functions
 */
const saveConfig = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

const isBlackListed = async (domain) => {
    while(blacklistedUrls  === undefined){
    }
    return blacklistedUrls.indexOf(domain) !== -1; 
}

const isBlackListedSynchronous = (domain) => {
    while(blacklistedUrls  === undefined){
    }
    return blacklistedUrls.indexOf(domain) !== -1; 
}

const changeToggleIcon = (isEnabled) => {
    chrome.browserAction.setIcon({
        path: 'img/'+ (isEnabled ? 'logo' : 'logo_disabled') + '.png',
    });
};

const getDomain = (url) => {
    let regex = /:\/\/(.[^/]+)/gi, output = [];
    if (!!url) {
        while (matches = regex.exec(url)) {
            output.push(matches[1]);
        }
        if (output.length>=1) {
            return output[0];
        }
    }
    return '';
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

const notify = (title, message, icon = '../img/logo.png') => {
    chrome.notifications.create(
        {   
        type: 'basic', 
        iconUrl: icon, 
        title: title, 
        message: message 
        }
    );
}

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
}
const analyseCurrentTab = (domain) => {
    let isWhiteListed;
    let isInBlackList;
    let messageType;
    isBlackListed(domain).then((blackListed) => {
        isWhiteListed = isDomainWhitelisted(domain);
        if (isWhiteListed && blackListed) {
            messageType = 'MINING';
        } else if (blackListed) {
            messageType = 'WARNING';
        } else {
            messageType = 'OK';
        }
        action(messageType, domain);
    });
}


const action = (messageType, domain) => {
    let message;
    switch (messageType)
    {
        case 'MINING':
        message = 'The domain ' + domain + ' is currently mining!';
        break;

        case 'WARNING':
        message = 'The domain ' + domain + ' tried to run a miner but was blocked!';
        break;
    }
    if (message !== undefined) {
        notify(messageType, message);
    }
    chrome.runtime.sendMessage({ type: messageType });
}
/**
 * Main
 */
let domains = [];

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab, details) => {
    if(tabId !== undefined && tab !== undefined) {
        domains[tabId] = getDomain(tab.url);
        analyseCurrentTab(getDomain(tab.url));
    }
});

// Updating domain for synchronous checking in onBeforeRequest
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab, details) => {
    domains[tabId] = getDomain(tab.url);
    analyseCurrentTab(getDomain(tab.url));
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});

// Run with the right icon
if (!config.toggle) {
    changeToggleIcon(false);
}

fetch(blacklist)
    .then(resp => {
        resp.text()
            .then(text => {
                blacklistedUrls = text.split('\r\n');
                
                chrome.webRequest.onBeforeRequest.addListener(details => {
                    let domain = domains[details.tabId];
                    // Globally paused
                    if (!config.toggle) {
                        action('DISABLED', domain);
                        return { cancel: false };
                    }

                    // Is domain white listed
                    if (isDomainWhitelisted(domains[details.tabId])) {
                        if(isBlackListedSynchronous(domain)) {
                            action('MINING', domain);   
                        }
                        else {
                            action('OK', domain);
                        }
                        return { cancel: false };
                    }

                    action('WARNING', domain);
                    return { cancel: true };
                }, { 
                    urls: blacklistedUrls
                }, ['blocking']);
            })
            .catch(err => {
                // TODO: Handle this
                console.log(err);
                alert('An error has occured, please report this to the developers!\n'+ err);
            });
    })
    .catch(err => {
        // TODO: Handle this
        console.log(err);
    });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'GET_STATE':
            sendResponse({
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
        case 'STATUS': {
            analyseCurrentTab();
        }
    }
});