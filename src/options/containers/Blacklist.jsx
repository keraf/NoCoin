import { Component } from 'inferno';

import Box from 'shared/components/Box';
import Button from 'shared/components/Button';
import List from 'shared/components/List';
import TextInput from 'shared/components/TextInput';

import { isValidUrl } from 'shared/helpers/url.js';

class Blacklist extends Component {

    /** TODO
     * Enable disable blacklists (normal, strict)
     * Add custom URLs to the blacklist
     */

    constructor(props) {
        super(props);

        this.state = {
            customBlacklist: [],
            blacklistUrl: '',
            newUrl: '',
        };
    }

    onChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    }

    onAddToBlacklist = () => {
        const { customBlacklist, newUrl } = this.state; 

        if (newUrl === '' || !isValidUrl(newUrl)) {
            console.log(newUrl);
            return;
        }

        // Add to background list
        chrome.runtime.sendMessage({ type: 'BLACKLIST_ADD', url: newUrl }, response => {
            // Add to the state and clear form 
            this.setState({
                customBlacklist: [
                    ...customBlacklist,
                    response.url,
                ],
                newUrl: '',
            });
        });
    }

    onRemoveFromBlacklist = () => {
        const { customBlacklist, blacklistUrl } = this.state;

        // Remove from background list
        chrome.runtime.sendMessage({ type: 'BLACKLIST_REMOVE', blacklistUrl });

        // Remove from state
        this.setState({
            customBlacklist: customBlacklist.filter(cb => cb !== blacklistUrl),
        });
    }

    render() {

        const { 
            customBlacklist,
            blacklistUrl,
            newUrl,
        } = this.state;

        return (
            <div>
                <h1>Blacklist</h1>
                <Box>TMP</Box>
                
                <h2>Current custom blacklist</h2>
                <List 
                    onChange={this.onChange('blacklistUrl')}
                    value={blacklistUrl} 
                    options={customBlacklist.map(cb => ({
                        value: cb,
                        name: cb,
                    }))} 
                    size={10}
                    full />
                <Button type={'red'} full onClick={this.onRemoveFromBlacklist}>Remove</Button>
                
                <h2>Add to custom black list</h2>
                <label>URL</label><br />
                <TextInput
                    onChange={this.onChange('newUrl')}
                    value={newUrl}
                    placeholder={'BLANK'} 
                    full /><br />

                <Button type={'green'} full onClick={this.onAddToBlacklist}>Add</Button>
            </div>
        );

    }

}

export default Blacklist;