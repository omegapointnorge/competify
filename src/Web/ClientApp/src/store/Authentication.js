const AUTHENTICATION_PENDING = "AUTHENTICATION_PENDING";
const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";
const initialState = {
    authenticationToken: localStorage.getItem("authenticationToken"),
    isLoading: false,
};

export const actionCreators = {
    authenticate: (secret) => async (dispatch, getState) => {
        dispatch({type: AUTHENTICATION_PENDING, secret});

        const url = `api/Authentication/authenticate`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({secret}),
        });

        if (response.ok) {
            const result = await response.json();
            const authenticationToken = result.authenticationToken;
            dispatch({type: AUTHENTICATION_SUCCESS, authenticationToken});
        } else {
            dispatch({type: AUTHENTICATION_FAILURE});
        }
    },
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === AUTHENTICATION_PENDING) {
        return {
            ...state,
            isLoading: true,
        };
    } else if (action.type === AUTHENTICATION_SUCCESS) {
        localStorage.setItem("authenticationToken", action.authenticationToken);
        return {
            ...state,
            isLoading: false,
            authenticationToken: action.authenticationToken,
        };
    } else if (action.type === AUTHENTICATION_FAILURE) {
        localStorage.removeItem("authenticationToken");
        return {
            ...state,
            isLoading: false,
            authenticationToken: null,
        };
    }

    return state;
};
