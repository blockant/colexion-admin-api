import { AUTH_ERROR, LOGIN_SUCCESS, LOGOUT,  NO_ACTION} from "../actions/types";

const initialState = {
	isAuthenticated: null,
    loading: true,
	user: null,
    jwt_token: null,
};

const auth = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case LOGIN_SUCCESS:
			localStorage.setItem("token", payload.token);
            localStorage.setItem("user", JSON.stringify(payload.user))
			return {
				...state,
				isAuthenticated: true,
                user: payload.user,
                loading: false,
                jwt_token: payload.token
			};
       
		case AUTH_ERROR:
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                jwt_token: null
            }
		case LOGOUT:
            localStorage.clear()
            console.log('Auth Error or Logged Out')
			return {
				...state,
				isAuthenticated: false,
				user: null,
                loading: false,
                jwt_token: null
			};
		case NO_ACTION:
		default:
			return state;
	}
};

export default auth;