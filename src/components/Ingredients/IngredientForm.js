import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {

  //due that the useState is formed of 2 elements in an array we can take advantage of array destructuring to assign the properties and make it more verbose
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            {/*We had to update the whole object in order to update the state*/}
            <input
                type="text" id="title" value={enteredTitle}
                onChange={event => setEnteredTitle(event.target.value)}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            {/*here we just get the 0 because use state result is an array of 2 position where the first one is the actual updated state, and the second
            is the function that updates the state*/}
            {/*When working with multiple states, due that it's pretty cumbersome to update the whole object if the case is the one of a pretty large object
             it's better to separate the state into single properties*/}
            <input
                type="number" id="amount" value={enteredAmount}
                onChange={event => setEnteredAmount(event.target.value)}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {/*{props.loading ? <LoadingIndicator/>: null}*/}
            {/*//a shortcut */}
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
