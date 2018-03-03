import { Component } from 'inferno';

import General from 'options/containers/General';
import Blacklist from 'options/containers/Blacklist';

const tabs = [
    { name: 'general', label: 'General', component: <General /> },
    { name: 'whitelist', label: 'Whitelist', component: <Whitelist /> },
    { name: 'blacklist', label: 'Blacklist', component: <Blacklist /> },
];

class Main extends Component {

    /** TODO
     * Design tabs and form
     */

    constructor(props) {
        super(props);

        this.state = {
            tab: 'general',
        };
    }

    onTabChange = (tab) => () => {
        this.setState({ tab });
    }

    render() {

        const { tab } = this.state;

        return (
            <div>
                <ul>
                    { tabs.map(t => (
                        <li key={t.name} onClick={this.onTabChange(t.name)}>{ t.label }</li>
                    )) }
                </ul>
                { tabs.find(t => t.name === tab).component }
            </div>
        );

    }

}

export default Main;