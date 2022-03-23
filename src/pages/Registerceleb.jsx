import React, {useEffect, useState} from 'react'
import { Button, FormControl, InputLabel, Select, TextField, MenuItem } from '@mui/material'
import Paperbase from '../components/Landing/Paperbase'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { connect, useSelector } from "react-redux";
import styles from "./Allcelebs.module.css";
import axios from "axios";
import StickyHeadTable from '../components/MUI/StickyHeadTable';
import {getAllCelebs} from '../actions/celebs'
const  Registerceleb =({token,getAllCelebs, celebs_list})=> {
  
const [celebList, setCelebList] = useState([]);
const [selectedCeleb, setSelectedCeleb] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [repeatPassword, setRepeatPassword] = useState("");

const selectCelebrity = (e) => {
  setSelectedCeleb(e.target.value);
}
useEffect(() => {
    async function fetchUsers() {
        const res = await getAllCelebs(token);
        console.log(res);
        setCelebList(res);
    }
    fetchUsers()
}, [getAllCelebs])
const addCelebHandler=async(e)=>{
  e.preventDefault();
  console.log(selectedCeleb, email, password, repeatPassword);
  const body = JSON.stringify({ name: selectedCeleb, email, password,role:"CELEBRITY" });
  const config = {
    headers: {
        "Content-Type": "application/json"
    },
};
 if(password===repeatPassword)
 {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/signup`,body, config);
  console.log(res);
  window.alert("Celebrity Register Successfully!")
  setPassword('');
  setEmail('')
  setRepeatPassword('')
 }
 else
 { 
   console.log("Passwords don't match");
   window.alert("Passwords don't match!");
 }

}
  return (
    <Paperbase >
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Celebrities</h1>
            <div className={styles.add_btn}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} className={styles.search_icon} />
              <TextField id="input-with-sx" sx={{mr:5}}label="Search..." variant="standard" />
              <Button variant="contained" startIcon={<PersonAddIcon />} className={styles.btn_icon}>Add celebrity</Button>
            </div>
          </div>
          <div className={styles.info}>
              <div className={styles.dropdown}>
              <FormControl fullWidth variant="standard">
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                      Select Celebrity
                  </InputLabel>
                  <Select
                  // defaultValue={1}
                    onChange={selectCelebrity}
                  >
                    {
                      celebList.map((celeb, idx) => 
                        <MenuItem value={celeb.name} key={idx}> {celeb.name}-{celeb.category},{celeb.tier} </MenuItem> 
                      )
                    }
                      {/* <MenuItem value={1}>Adam Zampa-Sports,Tier-2</MenuItem>
                      <MenuItem value={2}>Amitesh Kumar-Photography,Tier-1</MenuItem>
                      <MenuItem value={3}>Arpit Kumar-Photography,Tier-1</MenuItem> */}
                      </Select>
                      </FormControl>
              </div>
              <div className={styles.namePass}>
              <TextField id="name-input" label="Name" variant="standard" style={{width:"40%"}} value={selectedCeleb}/>
              <TextField id="email-input" label="Email" variant="standard" style={{width:"40%"}} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.emailPass}>
              <TextField id="password-input" label="Password" variant="standard" style={{width:"40%"}} value={password} onChange={(e) => setPassword(e.target.value)} />
              <TextField id="reenter-password-input" label="Confirm Password" variant="standard" style={{width:"40%"}} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} error={password!==repeatPassword} helperText={password!==repeatPassword ? "Passwords don't match" : ""} />
              </div>
              <div className={styles.btn}>
                <Button variant="contained" onClick={addCelebHandler}>Add Celebrity</Button>
              </div>
          </div>
      </div>
    </Paperbase>
  )
}

const mapStateToProps = (state) => ({
    token: state.auth.jwt_token
});

const mapDispatchToProps = {
    getAllCelebs
}

export default connect(mapStateToProps, mapDispatchToProps)(Registerceleb);