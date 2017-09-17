$(() => {

    const setToggleText = (isEnabled) => {
        if (isEnabled) {
            $('.toggle').addClass('red').removeClass('green');
        } else {
            $('.toggle').addClass('green').removeClass('red');
        }

        $('.toggle').text(isEnabled ? 'Pause No Coin' : 'Unpause No Coin');
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