/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Arthur Geron <arthur.geron>
 * @version     0.5
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

// Functions
const saveConfig = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

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

// Main
if (!config.toggle) {
    changeToggleIcon(false);
}

const blacklist = chrome.runtime.getURL("blacklist.txt");
fetch(blacklist)
    .then(resp => {
        resp.text()
            .then(text => {
                const blacklistedUrls = text.split('\r\n');
                
                chrome.webRequest.onBeforeRequest.addListener(details => {
                    if (!config.toggle) {
                        return { cancel: false };
                    }
            
                    return { cancel: true };
                }, { 
                    urls: blacklistedUrls
                }, ['blocking']);
            })
            .catch(err => {
                // TODO: Handle this
                console.log(err);
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
    }
});