import classnames from 'classnames/bind';
import styles from './Header.scss';

const cx = classnames.bind(styles);

const Header = ({ version }) => (
    <a className={cx('header')} href="https://github.com/keraf/NoCoin" target="_blank">
        <div className={cx('logo')}>
            <img src="../img/logo_enabled.png" />
        </div>
        <div className={cx('title')}>
            <h1>No Coin</h1>
            <small>Version { version }</small>
        </div>
    </a>
);

export default Header;