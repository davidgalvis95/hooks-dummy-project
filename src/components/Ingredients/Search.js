import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    //this is object destructuring to obtain certain object/property from the parent object
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');

    //This will only be executed when the enteredFilter changes
    useEffect(() => {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients.json' + query)
            .then(response => response.json())
            .then(responseData => {
                const loadedIngredients = [];
                for(const key in responseData) {
                    loadedIngredients.push({
                        id: key,
                        title: responseData[key].title,
                        amount: responseData[key].amount
                    })
                }
                //we had a warning of including the props as a dependency because here we are relying on props
                //when destructuring since this is a dependency too, we can add that in the deps of useEffect and invoke without props keyword
                onLoadIngredients(loadedIngredients);
                //..
            });
    }, [enteredFilter, onLoadIngredients])

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        type="text"
                        value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
