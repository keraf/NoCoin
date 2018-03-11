import { Component } from 'inferno';
import classnames from 'classnames/bind';

import General from 'options/containers/General';
import Whitelist from 'options/containers/Whitelist';
import Blacklist from 'options/containers/Blacklist';

import styles from './Main.scss';

const cx = classnames.bind(styles);

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
                <ul className={cx('menu')}>
                    { tabs.map(t => (
                        <li key={t.name}>
                            <a href="#" className={cx({ 'active': t.name === tab })} onClick={this.onTabChange(t.name)}>
                                { t.label }
                            </a>
                        </li>
                    )) }
                </ul>
                { tabs.find(t => t.name === tab).component }
            </div>
        );

    }

}

export default Main;