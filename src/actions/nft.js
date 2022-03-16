import axios from "axios";
import { NFT_UPLOAD, ERROR } from "./types";

// Post NFTs
export const uploadNft = (token, name, bio, celeb, nftData) => async (dispatch) => {
    const body = JSON.stringify({ name, bio });
    console.log(token, name, bio, nftData)

    const formData = new FormData();
    formData.append('nft', nftData);
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
        };

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/nft/create`, body, config);

        dispatch({
            type: NFT_UPLOAD,
            payload: res.data.nft
        });
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
};