/**
 * Switch icon from colored to non-colored (for enabled/disabled status)
 * @param {bool} color - Whether to display the icon in color or not
 */
const setIconColored = (color = true) => {
    chrome.browserAction.setIcon({
        path: `img/${color ? 'logo_enabled' : 'logo_disabled'}.png`,
    });
};

const setWarning = (tabId, isWhitelisted = false) => {
    const color = isWhitelisted ? [200, 0, 0, 100] : [200, 0, 0, 100]; // Colors - Green : Red

    chrome.browserAction.setBadgeBackgroundColor({
        color,
        tabId,
    });
    
    chrome.browserAction.setBadgeText({
        text: '⚠️',
        tabId: tabId,
    });
};

export {
    setIconColored,
    setWarning,
};