import React, {useState} from 'react';

import IngredientForm from "./IngredientForm";
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {

    const [ingredients, setIngredients] = useState([]);

    const addIngredientsHandler = ingredient =>{
        setIngredients(prevIngredientsState => [...prevIngredientsState, { id:
                Math.random().toString(),
            ingredient
        }
        ]);
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
