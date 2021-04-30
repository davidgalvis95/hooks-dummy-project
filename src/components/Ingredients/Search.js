import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    //this is object destructuring to obtain certain object/property from the parent object
    const {onLoadIngredients} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    //useRef gives us the current value of any property we link to
    const inputSearchRef = useRef();

    //This will only be executed when the enteredFilter changes
    useEffect(() => {
        const timer = setTimeout( () => {
            //For closures, the enteredFilter variable is locked in when that one is called, so it is not the current filter, but the one that was taken
            //500 ms before when the setTimeout closure started
            //so here i need to know if the current value of that filter, is the same to what was entered 500 ms ago, so that we know that is the value the user wants to go with
            if(enteredFilter === inputSearchRef.current.value){
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
            }
            //when having this kind of things that pass values regularly as this timer, we should clean that up
            return () => {
                //this will clean the useEffect before it runs again, so it will prevent to have redundant timers by every keystroke
                //when returning in useEffect we make a clean up process before executing the next useEffect
                clearTimeout(timer);
            }
        }, 500)
    //    this inputsEARCHrEF is also a dependency because we need to know if that has changed in order to execute the query into firebase or not
    }, [enteredFilter, onLoadIngredients, inputSearchRef])

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        ref={inputSearchRef}
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
