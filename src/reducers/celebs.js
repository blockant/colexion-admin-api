import {ALL_CELEBS,NO_ACTION} from '../actions/types'

const initialState = {
    celeb_list:[],
};

const celebs = (state = initialState, action) => {
    const { type, payload } = action;
	switch (type) {
		case ALL_CELEBS:
            // localStorage.setItem("user_list", JSON.stringify(payload))
			return {
				...state,
				celeb_list: payload,
			};
		case NO_ACTION:
		default:
			return state;
	}
};
export default celebs;
