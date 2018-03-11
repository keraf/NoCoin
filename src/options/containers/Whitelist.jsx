import { Component } from 'inferno';
import moment from 'moment';

import Box from 'shared/components/Box';
import Button from 'shared/components/Button';
import List from 'shared/components/List';
import TextInput from 'shared/components/TextInput';

class Whitelist extends Component {

    /** TODO
     * Manage websites that have been previously whitelisted
     * Add websites to the whitelist
     */

    constructor(props) {
        super(props);

        this.state = {
            domains: [],
            domain: '',
            url: '',
            time: 0,
        };
    }

    componentWillMount = () => {
        this.loadWhitelist();
    }

    loadWhitelist = () => {
        chrome.runtime.sendMessage({ type: 'GET_WHITELIST' }, (response) => {
            this.setState({
                domains: response,
            });
        });
    }

    onChange = (field, isNumeric = false) => (e) => {
        const { value } = e.target;

        this.setState({
            [field]: isNumeric ? Number(value) : value,
        });
    }

    onRemoveDomain = () => {
        const { domains, domain } = this.state;

        // Remove from background list
        chrome.runtime.sendMessage({ type: 'WHITELIST_REMOVE', domain });

        // Remove from state
        this.setState({
            domains: domains.filter(d => d.domain !== domain),
        });
    }

    onAddDomain = () => {
        const { domains, url, time } = this.state; 

        // Add to background list
        chrome.runtime.sendMessage({ type: 'WHITELIST_ADD', url, time }, response => {
            // Add to the state and clear form 
            this.setState({
                domains: [
                    ...domains,
                    {
                        domain: response.domain,
                        expiration: response.expiraton, 
                    },
                ],
                url: '',
                time: 0,
            });
        });
    }

    render() {

        const { 
            domains,
            domain,
            url,
            time,
        } = this.state;

        return (
            <div>
                <h1>Whitelist</h1>
                <Box>You can manage domains that are going to be ignored by No Coin's blacklist below. Whitelisting can be set permanently or with an automatic expiratin.</Box>
                
                <h2>Current whitelist</h2>
                <List 
                    onChange={this.onChange('domain')}
                    value={domain} 
                    options={domains.map(d => ({
                        value: d.domain,
                        name: `${d.domain} - ${d.expiration === 0 ? 'Never expires' : `Expires in about ${moment(d.expiraton).toNow(true)}`}`,
                    }))} 
                    size={10}
                    full />
                <Button type={'red'} full onClick={this.onRemoveDomain}>Remove</Button>
                
                <h2>Add to white list</h2>
                <label>URL</label><br />
                <TextInput
                    onChange={this.onChange('url')}
                    value={url}
                    placeholder={'Simply enter the URL of the page you wish to white list'} 
                    full /><br />
                
                <label>Duration</label><br />
                <List
                    onChange={this.onChange('time', true)}
                    value={time}
                    options={[
                        { value: 0, name: 'Permanent' },
                        { value: 60, name: '1 minute' },
                        { value: 3600, name: '1 hour' },
                    ]} 
                    full /><br />

                <Button type={'green'} full onClick={this.onAddDomain}>Add</Button>
            </div>
        );

    }

}

export default Whitelist;