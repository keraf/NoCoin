import { render, Component } from 'inferno';

import Header from './Header';
import Box from 'shared/components/Box';
import Button from 'shared/components/Button';
import Dropdown from 'shared/components/Dropdown';

import './App.scss';

class Main extends Component {

    constructor(props) {
        super(props);

        this.currentTabId = 0;

        // State
        this.state = {
            domain: '',
            version: '0.0.0',
            toggle: false,
            whitelisted: false,
            detected: false,
            whitelistTime: 1,
        };

        // 
        chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
            if (tabs && tabs[0]) {
                this.currentTabId = tabs[0].id;
        
                chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: this.currentTabId }, (response) => {
                    this.setState({
                        ...response,   
                    });
                });
            }
        });
    }

    toggleExtension = () => {
        chrome.runtime.sendMessage({ type: 'TOGGLE' }, (response) => {
            chrome.tabs.reload(this.currentTabId);
            
            this.setState({
                toggle: !this.state.toggle,
            });
        });
    }

    whistelist = () => {
        chrome.runtime.sendMessage({ 
            type: 'WHITELIST', 
            time: this.state.whitelistTime,
            tabId: this.currentTabId,
            whitelisted: this.state.whitelisted,
        }, (response) => {
            chrome.tabs.reload(this.currentTabId);

            this.setState({
                whitelisted: response,
            });
        });
    }

    onWhitelistTimeChange = (e) => {
        this.setState({
            whitelistTime: e.target.value,
        });
    }

    render() {

        const { 
            detected,
            domain,
            toggle,
            version,
            whitelisted,
            whitelistTime,
        } = this.state;

        return (
            <div className={'main'}>
                <Header version={version} />
                <div className={'content'}>
                    { detected && 
                        <Box>A coin miner has been detected on this page.</Box>
                    }
                    { toggle && 
                        <div>
                            { !whitelisted ? 
                                <div>
                                    <Dropdown full onChange={this.onWhitelistTimeChange} value={whitelistTime} options={[
                                        { value: '1', name: 'Whist list for 1 minute' },
                                        { value: '30', name: 'Whist list for 30 minutes' },
                                        { value: '0', name: 'Whist list permanently' },
                                    ]} />
                                    <Button full type={'green'} onClick={this.whistelist}>White list</Button>
                                </div>
                            :
                                <div>
                                    <Box><b>{ domain }</b> is currently white listed.</Box>
                                    <Button full type={'red'} onClick={this.whistelist}>Remove form white list</Button>
                                </div>
                            }
                        </div>
                    }
                    <Button full type={toggle ? 'red' : 'green'} onClick={this.toggleExtension}>{toggle ? 'Pause' : 'Resume'} No Coin</Button>
                </div>
            </div>
        );

    }

}

render(<Main />, document.getElementById('app'));