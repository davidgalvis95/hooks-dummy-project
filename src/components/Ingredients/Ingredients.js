import React, {useState, useEffect} from 'react';

import IngredientForm from "./IngredientForm";
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);

    //The useEffect when without the [] in the end is like a componentDidUpdate, will run after every component update or re render
    //with [] as a dependency it acts as a componentDidMount, it runs only once after the first render
    useEffect(() => {
        fetch('https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients.json')
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
                //this will cause an infinite loop cause we are updating the state and the component is getting re-rendered, and then again
                // when the component is re-rendered we update the state and so on
                // setIngredients(loadedIngredients);
            });
    }, []);


    useEffect(() => {
        //The use effect can be used as many times as we want, here for example this is rendered twice, because of the initial render, and the state update in the useEffect of above
        console.log('RENDERING INGREDIENTS')
    })

    useEffect(() => {
        //here for example this is rendered once, only when the ingredients array of the useState get updated
        console.log('RENDERING INGREDIENTS WHEN INGREDIENTS GET UPDATED (CONDITIONALLY)', ingredients)
    }, [ingredients])

    const addIngredientsHandler = ingredient =>{
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
        })
    }

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientsHandler}/>

            <section>
                <Search/>
                <IngredientList ingredients={ingredients} onRemoveItem={() => {}}/>
            </section>
        </div>
    );
}

export default Ingredients;
