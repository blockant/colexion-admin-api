import {ALL_USERS, NO_ACTION} from '../actions/types'
const initialState = {
	user_list: []
};
const users = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ALL_USERS:
            // localStorage.setItem("user_list", JSON.stringify(payload))
			return {
				...state,
				user_list: payload,
			};
		case NO_ACTION:
		default:
			return state;
	}
};
export default users