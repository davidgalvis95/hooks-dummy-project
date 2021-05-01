import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from "./IngredientForm";
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //this useEffect is doing the same than in search but with all the ingredients, something done already in search useEffect
    //The useEffect when without the [] in the end is like a componentDidUpdate, will run after every component update or re render
    //with [] as a dependency it acts as a componentDidMount, it runs only once after the first render
    // useEffect(() => {
    //     fetch('https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients.json')
    //         .then(response => response.json())
    //         .then(responseData => {
    //             const loadedIngredients = [];
    //             for(const key in responseData) {
    //                 loadedIngredients.push({
    //                     id: key,
    //                     title: responseData[key].title,
    //                     amount: responseData[key].amount
    //                 })
    //             }
    //             //this will cause an infinite loop cause we are updating the state and the component is getting re-rendered, and then again
    //             // when the component is re-rendered we update the state and so on
    //             setIngredients(loadedIngredients);
    //         });
    // }, []);


    useEffect(() => {
        //The use effect can be used as many times as we want, here for example this is rendered twice, because of the initial render, and the state update in the useEffect of above
        console.log('RENDERING INGREDIENTS')
    })

    useEffect(() => {
        //here for example this is rendered once, only when the ingredients array of the useState get updated
        console.log('RENDERING INGREDIENTS WHEN INGREDIENTS GET UPDATED (CONDITIONALLY)', ingredients)
    }, [ingredients])

    //Here we wrap the function with the useCallback hook that basically caches the function and prevent it to change if the component re-renders(preventing infinite loops)
    //This implementation was applied because of a problem that is happening with the search component when it uses this function reference to load the ingredients and update them depending
    //in a filter that is executed with useEffect, that useEffect has a dependency in this function, and since it runs whenever this function is different(every time this ingredient component is
    // re-rendered the function is different) it updates the state and the ingredient component is re-rendered, sending a new function reference, then search useEffect is re-rendered sending back
    //a new state to ingredient component, rendering it again....and so on, creating an infinite loop
    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setIngredients(filteredIngredients);
    },[]);

    const removeIngredientHandler = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients${ingredientId}.json`, {
            method: 'DELETE',

        }).then(responseData => {
            setIngredients(prevIngredientsState => prevIngredientsState.filter(ingredient => ingredient.id !== ingredientId));
            setIsLoading(false);
        }).catch(error => {
            setError('Something went wrong!');
            setIsLoading(false);
        })
    }

    const addIngredientsHandler = ingredient =>{
        setIsLoading(true);
        //Whenever this handler is executed we save the new ingredient in the FIREBASE database and display it there with the previous ingredients
        fetch('https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            setIngredients(prevIngredientsState => [...prevIngredientsState, {
                //this id is set accordingly to the one provided in FIREBASE, instead of passing a dummy one
                id: responseData.name,
                ...ingredient
            }
            ]);
            setIsLoading(false);
        }).catch(error => {
            setError('Something went wrong!');
            setIsLoading(false);
        })
    }

    const clearError = () => {
        //When we have two calls to the setState of the useState that happen synchronously they are batched together to be executed all in one row
        //it means that if there are two calls as in the following two lines, they won't cause 2 renders of the component but only one
        setError(null);
        //however this is not the best place to put this
        //setIsLoading(false);
    }

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm
                onAddIngredient={addIngredientsHandler}
                loading={isLoading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
