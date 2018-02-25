import classnames from 'classnames/bind';
import styles from './Box.scss';

const cx = classnames.bind(styles);

const Box = ({ children }) => (
    <p className={cx('box')}>{ children }</p>
);

export default Box;