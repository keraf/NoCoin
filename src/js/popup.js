/**
 * No Coin - Stop coin miners in your browser
 **
 * @author      Rafael Keramidas <ker.af>
 * @license     MIT
 * @source      https://github.com/keraf/NoCoin
 */

$(() => {

    let currentTabId = 0;
    let whitelisted = false;

    const setToggleText = (isEnabled) => {
        if (isEnabled) {
            $('.toggle').addClass('red').removeClass('green');
        } else {
            $('.toggle').addClass('green').removeClass('red');
        }

        $('.toggle').text(isEnabled ? 'Pause No Coin' : 'Resume No Coin');
    }

    const showWhitelistButtons = (isVisible) => {
        if (isVisible) {
            $('.whitelist').show();
        } else {
            $('.whitelist').hide();
        }
    }
    
    const showBlacklistButton = (isVisible) => {
        if (isVisible) {
            $('.blacklist').show();
        } else {
            $('.blacklist').hide();
        }
    }
    
    const setWhitelistOptions = (isWhitelisted) => {
        whitelisted = isWhitelisted;
        showWhitelistButtons(!isWhitelisted);
        showBlacklistButton(isWhitelisted);
    };

    $('.toggle').click(() => {
        chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
            setToggleText(response);
            chrome.tabs.reload(currentTabId);
        });
    });

    $('.list').click((e) => {
        chrome.runtime.sendMessage({ 
            type: 'WHITELIST', 
            time: $(e.target).data('time'),
            tabId: currentTabId,
            whitelisted,
        }, (response) => {
            setWhitelistOptions(response);
            chrome.tabs.reload(currentTabId);
        });
    });

    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        if (tabs && tabs[0]) {
            currentTabId = tabs[0].id;

            chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: currentTabId }, (response) => {
                setToggleText(response.toggle);
                setWhitelistOptions(response.whitelisted);
            });
        }
    });

});