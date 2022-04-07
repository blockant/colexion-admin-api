import axios from "axios";
import { NFT_UPLOAD, ERROR, NO_ACTION, ALL_NFTS } from "./types";

//  (PIN TO IPFS)
export const uploadNft = (token,name, bio, nftData, category) => async (dispatch) => {
    const body = JSON.stringify({ name, bio, category });
    const formData = new FormData();
    formData.append('file', nftData);
    formData.append("name", name);
    formData.append("description", bio)
    formData.append("category", category)
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

export const updateNFTData=(nftId, tokenid, enteredAddress, deployed_network, contract_type, quantity)=>async(dispatch)=>{
    try{
        const payload = {
            nftId:nftId,
            tokenId:tokenid,
            owner_address:enteredAddress,
            deployed_network: deployed_network,
            contract_type: contract_type
        }
        if(quantity){
            payload.quantity=quantity
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

export const getAllNFT=()=>async(dispatch)=>{
    try{
        const params={
            paginate: false
        }
        const response=await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/nft`, {params: params})
        dispatch({
            type: ALL_NFTS,
            payload: response.data.foundNFTS
        })
    }catch(err){
        console.log(err)
        dispatch({
            type: NO_ACTION,
        })
    }
}