import classnames from 'classnames/bind';
import styles from './List.scss';

const cx = classnames.bind(styles);

const List = ({ options, value, onChange, full, size }) => (
    <select className={cx('list', { 'full': full })} size={size} value={value} onChange={onChange}>
        { options.map(option => (
            <option key={option.value} value={option.value}>{option.name}</option>
        )) }
    </select>
);

List.defaultValues = {
    options: [],
};

export default List;