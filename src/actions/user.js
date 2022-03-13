import axios from "axios";
import {  ALL_USERS, NO_ACTION} from "./types";
// Get All Users
export const getAllUsers=(page, limit)=>async (dispatch)=>{
    try{
        const params={
            page: page || 1,
            limit: limit || 10,
            paginate: 'false'
        }
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/all`, {params: params});
        dispatch({
            type: ALL_USERS,
            payload:res.data.foundUsers
        })
    }catch(err){
		console.log(err)
        dispatch({ type: NO_ACTION });
    }
}