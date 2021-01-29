import './App.scss';
import TagsInput from "./components/TagslInput/tags-input";
import emailsData from './emails.json';
import {useState} from "react";
const emails = emailsData.map(({email}) => email);

function App() {
    const [autocomplete, setAutocomplete ] = useState([]);
    const search = (query) => {
        setAutocomplete(emails.filter((email) => email.includes(query)));
    };
    const changeHandler = (newValue) => {
        console.log('New tags value: ', newValue);
    }
  return (
    <div className="App">
      <TagsInput onSearch={search} autocomplete={autocomplete} onChange={changeHandler}/>
    </div>
  );
}

export default App;
