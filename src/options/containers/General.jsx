import { Component } from 'inferno';

import Box from 'shared/components/Box';

class General extends Component {

    /** TODO
     * Enable/Disable notifications
     * Use local/remote blacklists
     * Select time to refresh blacklist (or disable it)
     * Display general about information
     */

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <h1>General</h1>
                <Box>HELP TEXT.</Box>
                
                <p>Enable/Disable notifications</p>
                <p>Use local blacklist</p>
                <p>Blacklist refresh interval</p>
                
                <h2>About</h2>
                <Box>
                    No Coin is a free and open source (MIT Licensed) browser extension developed by <a href={'https://ker.af/'} target={'_blank'}>Rafael (Keraf) Keramidas</a>. If you like this extension, please consider donating to keep the project alive.
                    <b>PayPal button</b>
                </Box>
            </div>
        );

    }

}

export default General;