const urlRegex = new RegExp(/(\*|https?|wss?):\/\/(\*|((\*|[a-z0-9\\-]+).){1,}\.[a-z]+)(\\:[0-9]{1,5})?\/(.*)/);

const isValidUrl = (url) => {
    return urlRegex.test(url);
};

export {
    isValidUrl,
};