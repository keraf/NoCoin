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
        path: `img/${isEnabled ? 'logo' : 'logo_disabled'}.png`,
    });
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