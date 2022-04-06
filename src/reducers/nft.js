import { NO_ACTION, NFT_UPLOAD, ERROR, ALL_NFTS } from '../actions/types'

const initialState = {
    nftStore:null,
    errorMessage: null,
    nft_list:[]
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
        case ALL_NFTS:
            return {
                ...state,
                nft_list: payload
            }
        case NO_ACTION:
        default:
            return state;
    }
};
export default nfts;