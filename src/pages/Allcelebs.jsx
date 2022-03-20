import React from 'react'
import { Button, FormControl, InputLabel, NativeSelect, TextField, Box } from '@mui/material'
import Paperbase from '../components/Landing/Paperbase'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import styles from "./Allcelebs.module.css";

function Allcelebs() {
  return (
    <Paperbase>
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
              <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                      Select Celebrity
                  </InputLabel>
                  <NativeSelect
                  defaultValue={1}
                  >
                      <option value={1}>Adam Zampa-Sports,Tier-2</option>
                      <option value={2}>Amitesh Kumar-Photography,Tier-1</option>
                      <option value={3}>Arpit Kumar-Photography,Tier-1</option>
                      </NativeSelect>
                      </FormControl>
              </div>
              <div className={styles.namePass}>
              <TextField id="name-input" label="Name" variant="standard" style={{width:"40%"}} />
              <TextField id="email-input" label="Email" variant="standard" style={{width:"40%"}} />
              </div>
              <div className={styles.emailPass}>
              <TextField id="password-input" label="Password" variant="standard" style={{width:"40%"}} />
              <TextField id="reenter-password-input" label="Confirm Password" variant="standard" style={{width:"40%"}} />
              </div>
              <div className={styles.btn}>
                <Button variant="contained">Add Celebrity</Button>
              </div>
          </div>
      </div>
    </Paperbase>
  )
}

export default Allcelebs