import {ALL_CELEBS,UPDATE_CELEB, NO_ACTION, DELETE_CELEB} from '../actions/types'
const initialState = {
	celeb_list: []
};
const getcelebs = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ALL_CELEBS:
            // localStorage.setItem("user_list", JSON.stringify(payload))
			return {
				...state,
				celeb_list: payload,
			};
		case DELETE_CELEB:
			// console.log(payload.id);
			let list = state.celeb_list.filter(celeb => celeb._id !== payload.id);
			// console.log(list);
			return {
				...state,
				celeb_list: list
			}
		case UPDATE_CELEB:
			return state.celeb_list.map((celeb)=>{
				if(celeb._id === payload.id)
				{
					return {
						...state,
						...payload
					};
				}
				else
				{
					return celeb;
				}
			})
		case NO_ACTION:
		default:
			return state;
	}
};
export default getcelebs;