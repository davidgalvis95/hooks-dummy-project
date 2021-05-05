//since this is not a component but a reducer, we do not need this to be there
import {useReducer, useCallback} from 'react';

//here we get the reducer outside again because we dont want it to be re rendered when the useHttp is rendered
//This is also good to use when there are multiple related states as in this case the loading and error are related to the http request
const httpReducer = (currentHttpRelatedState, action) => {
    switch (action.type){
        case 'SEND':
            return { loading: true, error: null, data: null }
        case 'RESPONSE':
            return { ...currentHttpRelatedState, loading: false, data: action.responseData }
        case 'ERROR':
            return {loading: false, error: action.errorMessage, data: null }
        case 'CLEAR-ERROR':
            return {...currentHttpRelatedState, error: null}
        default:
            throw new Error('Should not get there')
    }
}

const useHttp = () => {
    const [httpRelatedState, dispatchHttpDependantActions] = useReducer(httpReducer,
        {
            loading: false,
            error: null,
            data: null
        });

    const sendRequest = useCallback((url, method, body) => {
        dispatchHttpDependantActions({type: 'SEND'});
        fetch(url,
            {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then( response => response.json())
            .then(responseData => {
            dispatchHttpDependantActions({type: 'RESPONSE', responseData: responseData});
        })
            .catch(error => {
            dispatchHttpDependantActions({type: 'ERROR', errorMessage: 'Something went wrong!'});
        });

        // fetch(`https://react-hooks-update-6eb9b-default-rtdb.firebaseio.com/ingredients${ingredientId}.json`, {
        //     method: 'DELETE',
        //
        // }).then(responseData => {
        //     // setIngredients(prevIngredientsState => prevIngredientsState.filter(ingredient => ingredient.id !== ingredientId));
        //     dispatch({type: 'DELETE', id: ingredientId});
        //     dispatchHttpDependantActions({type: 'RESPONSE'});
        // }).catch(error => {
        //     dispatchHttpDependantActions({type: 'ERROR', errorMessage: 'Something went wrong!'});
        // });
    }, []);

    return {
        isLoading: httpRelatedState.loading,
        error: httpRelatedState.error,
        data: httpRelatedState.data,
        sendRequestFunctionPointer: sendRequest
    }
};

export default useHttp;