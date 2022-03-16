import { NO_ACTION, NFT_UPLOAD, ERROR } from '../actions/types'

const initialState = {
    errorMessage: null
};

const nfts = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case NFT_UPLOAD:
            return {
                ...state
            }
        case ERROR:
            return {
                ...state,
                errorMessage: payload
            }
        case NO_ACTION:
        default:
            return state;
    }
};
export default nfts;