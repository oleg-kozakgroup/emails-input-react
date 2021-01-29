import * as styles from './tags-input.module.scss';
import {useState, createRef, useEffect } from "react";
import Tag from "../Tag/tag";

const TagsInput = ({ autocomplete = [], onSearch = () => {}, onChange = () => {}, defaults = []}) => {
    const inputRef = createRef();
    const dropdownRef = createRef();
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const [tags, setTags] = useState(defaults);
    const [placeholderVisibility, setPlaceholderVisibility] = useState(true);
    const [ dropDownStyle, setDropdownStyle] = useState({ display: 'none'})
    const clickHandler = () => {
        setPlaceholderVisibility(false);
        inputRef.current.focus();
    }
    
    useEffect(() => {
        const listener = () => {
            if(inputRef.current){
                inputRef.current.innerText = '';
                inputRef.current.blur();
                setDropdownStyle({ display: 'none'});
            }
        }
        if(dropDownStyle.display === 'none'){
            document.removeEventListener('click', listener)
        } else {
            document.addEventListener('click', listener)
        }
        
        return () => document.removeEventListener('click', listener);
    }, [dropDownStyle, inputRef]);
    
    const keyDownHandler = (evt) => {
        const key = evt.key;
        if(key === 'Backspace'){
            setImmediate(() => {
                const text = evt.target.innerText;
                if(!text){
                    setDropdownStyle({ display: 'none'});
                    const tagsCopy = [ ...tags];
                    tagsCopy.pop();
                    setTags(tagsCopy);
                } else {
                    const { left: l, top: t, height, width } = evt.target.getBoundingClientRect();
                    onSearch(text);
                    setDropdownStyle({ display: 'flex', left: l + width, top: t + height });
                }
            });
        }else if(['Enter','Tab'].includes(key)){
            evt.preventDefault();
            setImmediate(() => {
                const text = evt.target.innerText;
                if(text){
                    const newTags = [...tags, text]
                    setTags(newTags);
                    onChange(newTags);
                    setDropdownStyle({ display: 'none'});
                    evt.target.innerText = '';
                }
            });
        } else {
            setImmediate(() => {
                const text = evt.target.innerText;
                if(text){
                    const { left: l, top: t, height, width } = evt.target.getBoundingClientRect();
                    onSearch(text);
                    setDropdownStyle({ display: 'flex', left: l + width, top: t + height });
                } else {
                    setDropdownStyle({ display: 'none'})
                }
            });
        }
    }
    
    const tagRemoveHandler = (index) => {
        const newTags = [ ...tags];
        newTags.splice(index,1);
        setTags(newTags);
        onChange(newTags);
    }
    
    const tagAddHandler = (newTag) => {
        const newTags = [...tags, newTag]
        setTags(newTags);
        onChange(newTags);
        setDropdownStyle({ display: 'none'});
        inputRef.current.innerText = '';
        inputRef.current.focus();
    }
    
    return (
        <div className={`${styles.input} ${tags.length ? '' : styles.active}`} onClick={clickHandler}>
            {!tags.length && placeholderVisibility  && <span className={styles.placeholder}>Enter recipients…</span>}
            {tags.map((t, i) => <Tag key={i} pattern={pattern} onRemove={tagRemoveHandler.bind(null, i)} value={t}/>)}
            <span ref={inputRef} contentEditable={true} onKeyDown={keyDownHandler} className={styles.text}></span>
            {!!autocomplete.length && <ul ref={dropdownRef} className={styles.dropdown} style={dropDownStyle}>
                {autocomplete.map((item, i) => <li onClick={tagAddHandler.bind(null, item)} key={i}>{item}</li>)}
            </ul>}
        </div>
    );
}

export default TagsInput;