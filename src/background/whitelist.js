/** TODO
 * Convert full URL to whitelistable domain
 * Check if domain is whitelisted or not
 * Add to whitelist
 * Remove from whitelist
 */

const urlToDomain = (url) => {
    const match = url.match(/:\/\/(.[^/]+)/);
    
    return match ? match[1] : '';
};

const isWhitelisted = (domain) => {

};

const addToWhitelist = (domain) => {

};

const removeFromWhitelist = (domain) => {

};