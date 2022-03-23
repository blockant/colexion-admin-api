import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { connect, useSelector } from "react-redux";
import {TextField, FormControl, InputLabel, NativeSelect, Button, Select, MenuItem} from "@mui/material";
import Paperbase from '../components/Landing/Paperbase';
import styles from "./Tempcelebs.module.css";
import { addCeleb } from '../actions/celebs';

const Addceleb=({ token,addCeleb })=>{
  const navigate = useNavigate();
  const [name,setName] = useState('');
  const [tier,setTier] = useState("Tier-1");
  const [category,setCategory] = useState("Sports");
  const nameHandler=(e)=>{
    setName(e.target.value);
  }
  const tierHandler=(e)=>{
    setTier(e.target.value);
  }

  const categoryHandler=(e)=>{
    setCategory(e.target.value);
  }

  const submitHandler=async(e)=>{
    e.preventDefault();
    await addCeleb(token,name,tier,category);
    window.alert("Celeb added successfully!")
    setName('');
    setTier("Tier-1");
    setCategory("Sports")
    navigate("/allceleb")
  }
  return(
    <Paperbase>
      <div className={styles.form}>
        <div className={styles.name}>
          <TextField id="standard-basic" label="Name" onChange={nameHandler} variant="standard" />
        </div>
        <div className={styles.categories}>
          <FormControl variant="standard">
          <InputLabel id="category">Category</InputLabel>
            <Select
              defaultValue="Sports"
              onChange={categoryHandler}
              labelId="category"
              id="demo-simple-select-standard"
            >
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Art">Art</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Domain Names">Domain Names</MenuItem>
              <MenuItem value="Trading Cards">Trading card</MenuItem>
              <MenuItem value="Utility">Utility</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.tier}>
          <FormControl variant="standard">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Tier
            </InputLabel>
            <Select
              defaultValue="Tier-1"
              onChange={tierHandler}
            >
                    <MenuItem value="Tier-1">Tier-1</MenuItem>
                    <MenuItem value="Tier-2">Tier-2</MenuItem>
                    <MenuItem value="Tier-3">Tier-3</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.btn}>
                 <Button onClick={submitHandler} variant="contained">Proceed</Button> 
              </div>
            </div>
    </Paperbase>
  );
}

const mapStateToProps = (state) => ({
  token: state.auth.jwt_token
});

const mapDispatchToProps = {
    addCeleb
}

export default connect(mapStateToProps, mapDispatchToProps)(Addceleb);


    