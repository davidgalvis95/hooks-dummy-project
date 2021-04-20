import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  //due that the useState is formed of 2 elements in an array we can take advantage of array destructuring to assign the properties and make it more verbose
  const [inputState, setInputState] = useState({title: '', amount: ''});

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
            {/*We had to update the whole object in order to update the state*/}
            <input
                type="text" id="title" value={inputState.title}
                onChange={event => {
                  const newTitle = event.target.value;
                  //This is the way to ensure that we are updating te state based on the last available state, in the old one we could not ensure that we get the last available
                  setInputState(prevInputState => ({
                    title: newTitle,
                    amount: prevInputState.amount
                  }))
                }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            {/*here we just get the 0 because use state result is an array of 2 position where the first one is the actual updated state, and the second
            is the function that updates the state*/}
            <input
                type="number" id="amount" value={inputState.amount}
                onChange={event =>{
                    //Since this is a closure, the event input variable is not reachable by the second key stroke it dies and running time,
                  // when this is passed to the function parameters
                    const newAmount = event.target.value;
                    setInputState(prevInputState => ({
                      title: prevInputState.title,
                      amount: newAmount
                    }))
                }}/>
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
