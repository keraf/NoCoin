/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */
    
let currentTabId = 0;
let whitelisted = false;
let domain = '';

const setToggleButton = (isEnabled) => {
    const element = document.querySelector('.toggle');

    if ((element.classList.contains('disabled') && isEnabled) || (!element.classList.contains('disabled') && !isEnabled)) {
        element.classList.toggle('disabled');
    }

    toggleClassVisible('whitelisting', isEnabled);

    element.innerText = `${isEnabled ? 'Pause' : 'Resume' } No Coin`;
};

const toggleClassVisible = (className, isVisible) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = isVisible ? 'block': 'none';
    }
};

const setWhitelistDisplay = (isWhitelisted) => {
    whitelisted = isWhitelisted;
    
    document.querySelector('.whitelisted').innerHTML = `<b>${domain}</b> is currently white listed.`

    toggleClassVisible('dropdown', !isWhitelisted);
    toggleClassVisible('whitelist', !isWhitelisted);
    toggleClassVisible('unwhitelist', isWhitelisted);
    toggleClassVisible('whitelisted', isWhitelisted);
};

const setDetectedVisible = (isDetected) => {
    document.querySelector('.detected').style.display = isDetected ? 'block': 'none';
};

const setVersion = (version) => {
    document.querySelector('.version').innerText = version;
};

const sendWhitelistUpdate = (time) => {
    chrome.runtime.sendMessage({ 
        type: 'WHITELIST', 
        time: time,
        tabId: currentTabId,
        whitelisted,
    }, (response) => {
        setWhitelistDisplay(response);
        chrome.tabs.reload(currentTabId);
    });
}

// Pause/Unpause
document.querySelector('.toggle').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
        setToggleButton(response);
        chrome.tabs.reload(currentTabId);
    });
});

// Whitelist button
document.querySelector('.whitelist').addEventListener('click', () => {
    const time = document.querySelector('.dropdown').value;
    sendWhitelistUpdate(time);
});

// Un-whitelist button
document.querySelector('.unwhitelist').addEventListener('click', () => {    
    sendWhitelistUpdate();
});

// Get current state
chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    if (tabs && tabs[0]) {
        currentTabId = tabs[0].id;

        chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: currentTabId }, (response) => {
            domain = response.domain;
            setVersion(response.version);
            setToggleButton(response.toggle);
            setWhitelistDisplay(response.whitelisted);
            setDetectedVisible(response.detected);
        });
    }
});