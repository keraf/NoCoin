/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Arthur Geron <arthur.geron>
 * @version     0.7
 * @license     GNULGPL3.0
 * @source      https://github.com/arthurgeron/NoCoin
 */


let currentTabId = 0, whitelisted = false;

const updateCurrentStatus = (message, messageType) => {
    let defaultMessage = 'Current Status: ';
    document.getElementById('status').innerText = defaultMessage + message;
    if (messageType === 'Mining.' || messageType === 'Blocked.') {
        document.getElementById('status').classList.remove('green');
        document.getElementById('status').classList.add('red');
    } else {
        document.getElementById('status').classList.remove('red');
        document.getElementById('status').classList.add('green');
    }
}

const setToggleTextAndColor = (isEnabled) => {
    document.querySelector('.toggle').classList.toggle('red');
    document.querySelector('.toggle').classList.toggle('green');
    document.querySelector('.toggle').innerText = isEnabled ? 'Pause No Coin' : 'Unpause No Coin';
}

const showWhitelistButtons = (isVisible) => {
    if (isVisible) {
        document.querySelector('.whitelist').style.display = 'block';
    } else {
        document.querySelector('.whitelist').style.display = 'none';
    }
}

const showBlacklistButton = (isVisible) => {
    if (isVisible) {
        document.querySelector('.blacklist').style.display = 'block';
    } else {
        document.querySelector('.blacklist').style.display = 'none';
    }
}

const setWhitelistOptions = (isWhitelisted) => {
    whitelisted = isWhitelisted === undefined ? whitelisted : isWhitelisted;
    showWhitelistButtons(!isWhitelisted);
    showBlacklistButton(isWhitelisted);
};

document.querySelector('.toggle').addEventListener('click',() => {
    chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
        setToggleTextAndColor(response);
        chrome.tabs.reload(currentTabId);
    });
});

document.querySelectorAll('.list').forEach((element) => {
    if (element.options === undefined)
        element.addEventListener('click',(e) => {
            setWhitelistOptions();
            chrome.tabs.reload(currentTabId);
        });
    else
        element.addEventListener('change',(e) => {
            let selectedTime = e.srcElement.options[e.srcElement.selectedIndex].value;
            if (selectedTime !== 'None') {
                chrome.runtime.sendMessage({
                    type: 'WHITELIST', 
                    time: e.srcElement.options[e.srcElement.selectedIndex].value,
                    tabId: currentTabId,
                    whitelisted,
                }, (response) => {
                    setWhitelistOptions(response);
                    chrome.tabs.reload(currentTabId);
                    e.srcElement.selectedIndex = 0;
                });
            }
        });
});

chrome.tabs.query({currentWindow: true, active: true}, tabs => {
    if (tabs && tabs[0]) {
        currentTabId = tabs[0].id;

        chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: currentTabId }, (response) => {
            setToggleTextAndColor(response.toggle);
            setWhitelistOptions(response.whitelisted);
        });
    }
});

chrome.runtime.sendMessage({ type: 'STATUS' });

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'MINING':
            updateCurrentStatus('Mining.');
            break;
        case 'WARNING':
             updateCurrentStatus('Blocked.');
            break;
        case 'OK': {
             updateCurrentStatus('No miners.');
            break;
        }
    }
});
