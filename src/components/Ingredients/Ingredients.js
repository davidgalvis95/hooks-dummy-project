import React, {useState} from 'react';

import IngredientForm from "./IngredientForm";
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);

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
