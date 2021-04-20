import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const inputState = useState({title: '', amount: ''});

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            {/*This approach of updating the state does not work well cause this is not like the state of the class based components, where
            the changed state is merged into the old state, here it is not merged, and if we are working with objects as in this case, we have to update the whole object
            instead of a single property of that object*/}
            <input type="text" id="title" value={inputState[0].title} onChange={event => inputState[1]({title: event.target.value})}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            {/*here we just get the 0 because use state result is an array of 2 position where the first one is the actual updated state, and the second
            is the function that updates the state*/}
            <input type="number" id="amount" value={inputState[0].amount} onChange={event => inputState[1]({amount: event.target.value})}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
