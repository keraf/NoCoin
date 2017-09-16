$(() => {

    const setToggleText = (isEnabled) => {
        if (isEnabled) {
            $('.toggle').addClass('enabled');
        } else {
            $('.toggle').removeClass('enabled');
        }

        $('.toggle').text(isEnabled ? 'Pause NoCoin' : 'Unpause NoCoin');
    }

    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
        setToggleText(response.toggle);
    });

    $('.toggle').click(() => {
        chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
            setToggleText(response);
        });
    });

});