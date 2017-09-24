/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */
    
let currentTabId = 0;
let whitelisted = false;

const setToggleButton = (isEnabled) => {
    const element = document.querySelector('.toggle');

    if ((element.classList.contains('disabled') && isEnabled) || (!element.classList.contains('disabled') && !isEnabled)) {
        element.classList.toggle('disabled');
    }

    element.innerText = `${isEnabled ? 'Pause' : 'Resume' } No Coin`;
};

const toggleClassVisible = (className, isVisible) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = isVisible ? 'block': 'none';
    }
};

const setWhitelistOptions = (isWhitelisted) => {
    whitelisted = isWhitelisted;
    toggleClassVisible('whitelist', !isWhitelisted);
    toggleClassVisible('blacklist', isWhitelisted);
};

const setDetectedText = (isDetected) => {
    const element = document.querySelector('.detected');

    if (isDetected) {
        element.innerText = 'A coin miner has been detected on this page.';
    } else {
        element.innerText = 'No coin miner detected on this page.';
    }
};

// Pause/Unpause
document.querySelector('.toggle').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
        setToggleButton(response);
        chrome.tabs.reload(currentTabId);
    });
});

// Whitelisting
const listElements = document.getElementsByClassName('list');
for (let i = 0; i < listElements.length; i++) {
    listElements[i].addEventListener('click', (e) => {
        chrome.runtime.sendMessage({ 
            type: 'WHITELIST', 
            time: e.target.getAttribute('data-time'),
            tabId: currentTabId,
            whitelisted,
        }, (response) => {
            setWhitelistOptions(response);
            chrome.tabs.reload(currentTabId);
        });
    });
}

// Get current state
chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    if (tabs && tabs[0]) {
        currentTabId = tabs[0].id;

        chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: currentTabId }, (response) => {
            setToggleButton(response.toggle);
            setWhitelistOptions(response.whitelisted);
            setDetectedText(response.detected);
        });
    }
});