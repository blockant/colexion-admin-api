import axios from "axios";
import { NFT_UPLOAD, ERROR } from "./types";

// Post NFTs
export const uploadNft = (token,name, bio, nftData) => async (dispatch) => {
    const body = JSON.stringify({ name, bio });
    console.log(token,name, bio, nftData)

    const formData = new FormData();
    formData.append('file', nftData);
    formData.append("body", body);
    // formData.append("description", bio);
    // console.log(formData);
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        };

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/nft/upload`, formData, config);
        console.log(res);
        dispatch({
            type: NFT_UPLOAD,
            payload: res.data.nft
        });
        return res;
    } catch (err) {
        console.log(err)
        dispatch({
            type: ERROR,
            payload: err.response.data
        })
    }
};