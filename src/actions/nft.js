import axios from "axios";
import { NFT_UPLOAD, ERROR, NO_ACTION } from "./types";

// Post NFTs
export const uploadNft = (name, bio, nftData) => async (dispatch) => {
    const body = JSON.stringify({ name, bio });
    console.log(name, bio, nftData)

    const formData = new FormData();
    formData.append('file', nftData);
    formData.append("body", body);
    // formData.append("description", bio);
    // console.log(formData);
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
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

export const updateNFTData=(contentHash, tokenid, enteredAddress)=>async(dispatch)=>{
    try{
        const payload = {
            content_hash:contentHash,
            tokenid:tokenid,
            owner_address:enteredAddress
        }
        await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/nft`,payload)
        dispatch({
            type: NO_ACTION,
        })
    }catch(err){
        console.log(err)
        dispatch({
            type: NO_ACTION,
        })
    }
}