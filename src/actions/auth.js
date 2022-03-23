import axios from "axios";
import { AUTH_ERROR, LOGIN_SUCCESS, LOGOUT ,  NO_ACTION} from "./types";

//Login user
export const login = (email, password) => async (dispatch) => {
	const body = JSON.stringify({ email, password });
	try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, body, config);
        console.log(res.data);
        if(res.data.user.role === "ADMIN") {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
        } else {
            dispatch({type: AUTH_ERROR});
        }
	} catch (err) {
		console.log(err)
        dispatch({ type: AUTH_ERROR });
	}
};


// Logout
export const logout = () => (dispatch) => {
	dispatch({ type: LOGOUT });
};