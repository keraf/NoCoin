import classnames from 'classnames/bind';

import styles from './TextInput.scss';

const cx = classnames.bind(styles);

const TextInput = ({ onChange, value, full, placeholder }) => (
    <input 
        type={'text'} 
        className={cx('input', { 'full': full })} 
        onInput={onChange} 
        value={value} 
        placeholder={placeholder} />
);

export default TextInput;