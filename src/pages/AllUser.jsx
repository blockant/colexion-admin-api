import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import Web3 from 'web3';
import { getAllUsers } from "../actions/user";
import StickyHeadTable from "../components/MUI/StickyHeadTable";
import Paperbase from "../components/Landing/Paperbase";
const AllUser= ({getAllUsers, user_list})=>{
    const tableHeaders=[
        { id: '_id', label: 'User Id', minWidth: 170 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'email', label: 'Email', minWidth: 170 },
        { id: 'email_verified', label: 'Email Verified', minWidth: 170 },
        { id: 'role', label: 'Role', minWidth: 170}
    ]
    useEffect(() => {
        async function fetchUsers() {
            await getAllUsers()
        }
        fetchUsers()
    }, [getAllUsers])
  return (
      <>
       <Paperbase table={<StickyHeadTable columns={tableHeaders} rows={user_list}/>}/>
       {/* Hello
       <StickyHeadTable columns={tableHeaders} rows={user_list}/> */}
      </>
  );
}
AllUser.propTypes = {
  
}

const mapStateToProps = (state) => ({
    user_list: state.users.user_list
})

const mapDispatchToProps = {
    getAllUsers,
}
export default connect(mapStateToProps, mapDispatchToProps)(AllUser)