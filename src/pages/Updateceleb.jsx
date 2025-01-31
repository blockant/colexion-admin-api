import React,{useEffect, useState} from 'react';
import {Link,useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { connect, useSelector } from "react-redux";
import {TextField, FormControl, InputLabel, NativeSelect, Button, Select, MenuItem} from "@mui/material";
import Paperbase from '../components/Landing/Paperbase';
import styles from "./Tempcelebs.module.css";
import { updateCeleb, getCelebById } from '../actions/celebs';

const UpdateCeleb=({ updateCeleb, token, getCelebById , active_celeb})=>{
  let navigate = useNavigate();
  const [name,setName] = useState('');
  const [tier,setTier] = useState("Tier-1");
  const [category,setCategory] = useState("Sports");
  let { id } = useParams();

  const nameHandler=(e)=>{
    setName(e.target.value);
  }
  const tierHandler=(e)=>{
    setTier(e.target.value);
  }

  const categoryHandler=(e)=>{
    setCategory(e.target.value);
  }
  useEffect(() => {
    async function fetchActiveCeleb() {
        await getCelebById(token, id)
    }
    fetchActiveCeleb()
}, [getCelebById, token, id])
  const submitHandler=async(e)=>{
    try{
      e.preventDefault();
      await updateCeleb(token, id, name,tier,category);
      navigate("/celeb");
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Paperbase>
      <div className={styles.form}>
        <div className={styles.name}>
          <TextField id="standard-basic" label="Name" onChange={nameHandler} variant="outlined" value={active_celeb?.name}/>
        </div>
        <div className={styles.categories}>
          <FormControl variant="outlined">
          <InputLabel id="category">Category</InputLabel>
            <Select
              defaultValue={active_celeb?.category}
              onChange={categoryHandler}
              labelId="category"
              id="demo-simple-select-standard"
            >
             <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Art">Art</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Trading Cards">Trading card</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.tier}>
          <FormControl variant="outlined">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Tier
            </InputLabel>
            <Select
              onChange={tierHandler}
              defaultValue={active_celeb?.tier}
            >
                    <MenuItem value="Tier-1">Tier-1</MenuItem>
                    <MenuItem value="Tier-2">Tier-2</MenuItem>
                    <MenuItem value="Tier-3">Tier-3</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.btn_container}>
                 <Button onClick={submitHandler} className={styles.btn}>Update</Button> 
              </div>
            </div>
    </Paperbase>
  );
}

const mapStateToProps = (state) => ({
    token: state.auth.jwt_token,
    active_celeb: state.celebs.active_celeb
});

const mapDispatchToProps = {
    updateCeleb,
    getCelebById
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCeleb);


    