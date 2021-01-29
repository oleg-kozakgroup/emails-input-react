import * as styles from './tag.module.scss';
import { useEffect, useState } from 'react';

const Tag = ({value, onRemove, pattern }) => {
    const [valid, setValid ] = useState(true);
    useEffect(() => setValid(new RegExp(pattern).test(value)), [value, pattern]);
    const removeHandler = (evt) => {
        evt.stopPropagation();
        onRemove();
    }
    return <span className={`${styles.tag} ${valid ? '' : styles.invalid}`}>
        <div className={styles.wrapper}>
            <b>{value}</b>
            <span className={styles['error_icon']}>!</span>
            <button className={styles['remove-btn']} onClick={removeHandler}>&#10005;</button>
        </div>
    </span>;
}

export default Tag;