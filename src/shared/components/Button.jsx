import classnames from 'classnames/bind';
import styles from './Button.scss';

const cx = classnames.bind(styles);

const Button = ({ children, onClick, full, type }) => (
    <button className={cx('btn', { 'full': full }, type)} onClick={onClick}>{ children }</button>
);

export default Button;