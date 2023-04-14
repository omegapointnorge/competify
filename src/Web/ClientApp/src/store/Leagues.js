const LEAGUES_FETCH_PENDING = "LEAGUES_FETCH_PENDING";
const LEAGUES_FETCH_SUCCESS = "LEAGUES_FETCH_SUCCESS";

const LEAGUE_FETCH_PENDING = "LEAGUE_FETCH_PENDING";
const LEAGUE_FETCH_SUCCESS = "LEAGUE_FETCH_SUCCESS";

const ADD_ROUND_PENDING = "ADD_ROUND_PENDING";
const ADD_ROUND_SUCCESS = "ADD_ROUND_SUCCESS";
const ADD_ROUND_FAILURE = "ADD_ROUND_FAILURE";

const initialState = {
    leagues: [],
    leaguesIsLoading: false,

    league: [],
    leagueIsLoading: false,

    addRoundIsPending: false,
    undoAddRoundIsPending: false,
};

const getAuthenticationHeaders = () => {
    let authenticationToken = localStorage.getItem("authenticationToken");
    return {"X-AUTHENTICATION-TOKEN": authenticationToken};
};

const getPostHeaders = () => {
    return {
        "Content-Type": "application/json; charset=utf-8",
        ...getAuthenticationHeaders(),
    };
};

export const actionCreators = {
    requestLeagues: () => async (dispatch, getState) => {
        if (getState().leaguesIsLoading) return;

        dispatch({type: LEAGUES_FETCH_PENDING});

        const url = `api/leagues`;
        const response = await fetch(url, {headers: getAuthenticationHeaders()});
        const leagues = await response.json();

        dispatch({type: LEAGUES_FETCH_SUCCESS, leagues});
    },

    requestLeague: (leagueId) => async (dispatch, getState) => {
        if (getState().leagueIsLoading) return;

        dispatch({type: LEAGUE_FETCH_PENDING});

        const url = `api/leagues/${leagueId}`;
        const response = await fetch(url, {headers: getAuthenticationHeaders()});
        const league = await response.json();

        dispatch({type: LEAGUE_FETCH_SUCCESS, league});
    },

    addRound: (leagueId, round) => async (dispatch, getState) => {
        if (getState().addRoundIsPending) return;

        dispatch({type: ADD_ROUND_PENDING});

        const url = `api/leagues/${leagueId}/addRound`;
        const response = await fetch(url, {
            method: "POST",
            headers: getPostHeaders(),
            body: JSON.stringify(round),
        });

        if (response.ok) {
            const league = await response.json();
            dispatch({type: ADD_ROUND_SUCCESS, league});
        } else {
            dispatch({type: ADD_ROUND_FAILURE});
        }
    },

    undoAddRound: (leagueId) => async (dispatch, getState) => {
        if (getState().addRoundIsPending) return;
        dispatch({type: ADD_ROUND_PENDING});

        const url = `api/Leagues/${leagueId}/undoAddRound`;
        const response = await fetch(url, {
            method: "POST",
            headers: getPostHeaders(),
        });
        if (response.ok) {
            const league = await response.json();
            dispatch({type: ADD_ROUND_SUCCESS, league});
        } else {
            dispatch({type: ADD_ROUND_FAILURE});
        }
    },

    punishInactivity: (leagueId) => async (dispatch, getState) => {
        if (getState().addRoundIsPending) return;
        dispatch({type: ADD_ROUND_PENDING});

        const url = `api/Leagues/${leagueId}/punishInactivity`;
        const response = await fetch(url, {
            method: "POST",
            headers: getPostHeaders(),
        });
        if (response.ok) {
            const league = await response.json();
            dispatch({type: ADD_ROUND_SUCCESS, league});
        } else {
            dispatch({type: ADD_ROUND_FAILURE});
        }
    },
};

export const reducer = (state, action) => {
    state = state || initialState;

    ////
    // LEAGUES
    ///////
    if (action.type === LEAGUES_FETCH_PENDING) {
        return {
            ...state,
            leaguesIsLoading: true,
        };
    } else if (action.type === LEAGUES_FETCH_SUCCESS) {
        return {
            ...state,
            leagues: action.leagues,
            leaguesIsLoading: false,
        };
    }

        ////
        // SINGLE LEAGUE
    ///////
    else if (action.type === LEAGUE_FETCH_PENDING) {
        return {
            ...state,
            leagueIsLoading: true,
        };
    } else if (action.type === LEAGUE_FETCH_SUCCESS) {
        return {
            ...state,
            league: action.league,
            leagueIsLoading: false,
        };
    }

        ////
        // ADD ROUND
    ///////
    else if (action.type === ADD_ROUND_PENDING) {
        return {
            ...state,
            addRoundIsPending: true,
        };
    } else if (action.type === ADD_ROUND_SUCCESS) {
        return {
            ...state,
            league: action.league,
            addRoundIsPending: false,
        };
    } else if (action.type === ADD_ROUND_FAILURE) {
        return {
            ...state,
            addRoundIsPending: false,
        };
    }

    return state;
};
