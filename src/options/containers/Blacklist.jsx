import { Component } from 'inferno';

class Blacklist extends Component {

    /** TODO
     * Enable disable blacklists (normal, strict)
     * Add custom URLs to the blacklist
     */

    constructor(props) {
        super(props);

        this.state = {
            domains: [],
            domain: '',
        };
    }

    onDomainChange = (e) => {
        this.setState({ domain: e.target.value });
    }

    onAddToWhitelist = () => {
        // Add to whitelist
    }

    render() {

        return (
            <div>
                <p>Blacklist</p>
            </div>
        );

    }

}

export default Blacklist;