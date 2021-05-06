//since this is not a component but a reducer, we do not need this to be there
import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    //This value will be used for sending values when performing the request but also returning them after the hook has been executed
    //And use them in the useEffect of ingredients component, to perform some operations later on, taking advantage that everytime this sendRequest function returns
    //it updates the state of this component and also re renders parent component, so due that useEffect is run after render cycle,
    // then values can passed there to perform post operations
    extra: null,
    identifier: null
}

//here we get the reducer outside again because we dont want it to be re rendered when the useHttp is rendered
//This is also good to use when there are multiple related states as in this case the loading and error are related to the http request
const httpReducer = (currentHttpRelatedState, action) => {
    switch (action.type){
        case 'SEND':
            return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
        case 'RESPONSE':
            return { ...currentHttpRelatedState, loading: false, data: action.responseData, extra: action.extra };
        case 'ERROR':
            return {loading: false, error: action.errorMessage, data: null };
        case 'CLEAR-ERROR':
            return initialState;
        default:
            throw new Error('Should not get there')
    }
}

const useHttp = () => {
    const [httpRelatedState, dispatchHttpDependantActions] = useReducer(httpReducer, initialState);

    const clear =  useCallback( () => dispatchHttpDependantActions({type: 'CLEAR'}), [] );

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttpDependantActions({type: 'SEND', identifier: reqIdentifier});
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
            dispatchHttpDependantActions({type: 'RESPONSE', responseData: responseData, extra: reqExtra});
        })
            .catch(error => {
            dispatchHttpDependantActions({type: 'ERROR', errorMessage: 'Something went wrong!'});
        });
    }, []);

    return {
        isLoading: httpRelatedState.loading,
        error: httpRelatedState.error,
        data: httpRelatedState.data,
        sendRequestFunctionPointer: sendRequest,
        reqExtra: httpRelatedState.extra,
        reqIdentifier: httpRelatedState.identifier,
        clearFunctionPointer:clear
    }
};

export default useHttp;