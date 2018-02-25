import classnames from 'classnames/bind';
import styles from './Dropdown.scss';

const cx = classnames.bind(styles);

const Dropdown = ({ options, value, onChange, full }) => (
    <select className={cx('dropdown', { 'full': full })} value={value} onChange={onChange}>
        { options.map(option => (
            <option key={option.value} value={option.value}>{option.name}</option>
        )) }
    </select>
);

export default Dropdown;