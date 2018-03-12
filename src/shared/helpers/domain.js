const urlToDomain = (url) => {
    const match = url.match(/:\/\/(.[^/]+)/);
    
    return match ? match[1] : '';
};

export {
    urlToDomain,
};