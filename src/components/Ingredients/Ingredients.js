//useMemo is also used to avoid a component to be rendered again if there are no dependencies that make it render
//this can be caused because of the rendering of the component which also renders the internal components even if that last one has not changed
import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from "./IngredientForm";
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

//This reducer makes the same operations than the redux reducers in the class based components, but does not have to do with them
//The reducer not necessarily needs to be outside of the component, it can be inside for example when needing some props or somehow, but otherwise it should be Outside, to avoid
//recreations of the reducer whenever the component renders
const ingredientReducer = (currentIngredients, action) => {
    switch (action.type){
        case 'SET':
            //this is defined by the reducer designer, it depends in how the action behaves
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ingredient => ingredient.id === action.id);
        default:
            throw new Error('Should not get there')
    }
}



const Ingredients = () => {

    //This is the way to call the reducer using hooks which pass as a param into that the reducer, and the initial state
    //and returns the new state of the variable we are looking at, and the name of the function which will be used to send the actions (dispatch)
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const {isLoading, error, data, sendRequestFunctionPointer, reqExtra, reqIdentifier, clearFunctionPointer} = useHttp();

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


    //REMEMBER THAT THIS HOOK RUNS AFTER EVERY RENDER CYCLE
    //For this useEffect, we have to consider that this runs whenever the child component is rendered again, and that happens even when a property of the state is loading,
    //for example when a SEND request is sent and the isLoading property of the http hook is changed, but not the others as the data/responseData property, which is the one that has the response
    //do if that happens, we will have a 'cannot read property of undefined inside this hook, when dispatching the ADD'
    useEffect(() => {
        //The use effect can be used as many times as we want, here for example this is rendered twice, because of the initial render, and the state update in the useEffect of above
        console.log('RENDERING INGREDIENTS');
        if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
            dispatch({type: 'DELETE', id: reqExtra })
        }else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
            dispatch({
                type: 'ADD',
                ingredient: { id: data.name, ...reqExtra }
            })
        }
    }, [data, reqExtra, reqIdentifier, isLoading, error])

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
        // setIngredients(filteredIngredients);
        //Normally to use the reducer this is sent using objects to set the action type and the object that is the new object
        dispatch({type: 'SET', ingredients: filteredIngredients});
    },[]);

    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequestFunctionPointer(
            `https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients${ingredientId}.json`,
            'DELETE',
            null,
            ingredientId,
            'REMOVE_INGREDIENT');
    }, [sendRequestFunctionPointer]);

    //the useCallback ook is used to not render a function if that one does not change, unless some specified dependencies change, which are defined in the second arg
    //of useCallback, generally the dispatch functions of useReducer are not treated as dependencies
    const addIngredientsHandler = useCallback(ingredient =>{
        sendRequestFunctionPointer(
            'https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients.json',
            'POST',
            JSON.stringify(ingredient),
            ingredient,
            'ADD_INGREDIENT');
    }, [sendRequestFunctionPointer]);

    //with this, the component is only rendered when the dependencies ar updated or they change
    const ingredientList = useMemo(() => {
        return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>;
    },[ingredients, removeIngredientHandler])

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearFunctionPointer}>{error}</ErrorModal>}
            <IngredientForm
                onAddIngredient={addIngredientsHandler}
                loading={isLoading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
