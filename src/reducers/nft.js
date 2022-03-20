import { NO_ACTION, NFT_UPLOAD, ERROR } from '../actions/types'

const initialState = {
    nftStore:null,
    errorMessage: null
};

const nfts = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case NFT_UPLOAD:
            return {
                ...state,
                nftStore:payload
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