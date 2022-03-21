import { NO_ACTION, ADD_CELEB} from '../actions/types'

const initialState = {
    celeb_list:null,
};

const celebs = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ADD_CELEB:
            return {
                ...state,
                celeb_list:payload
            }
        case NO_ACTION:
        default:
            return state;
    }
};
export default celebs;
