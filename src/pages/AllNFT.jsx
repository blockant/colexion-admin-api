import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@mui/material/Button';
import Web3 from 'web3';
import { getAllNFT } from "../actions/nft";
import StickyHeadTable from "../components/MUI/StickyHeadTable";
import Paperbase from "../components/Landing/Paperbase";
const AllUser= ({getAllNFT, nft_list})=>{
    const tableHeaders=[
        { id: '_id', label: 'NFT Id', minWidth: 170 },
        { id: 'content_hash', label: 'content hash', minWidth: 170 },
        { id: 'name', label: 'name', minWidth: 170 },
        { id: 'createdAt', label: 'Created At', minWidth: 170 },
    ]
    useEffect(() => {
        async function fetchNFTS() {
            await getAllNFT()
        }
        fetchNFTS()
    }, [getAllNFT])
  return (
      <>
       <Paperbase table={<StickyHeadTable columns={tableHeaders} rows={nft_list}/>}/>
       {/* Hello
       <StickyHeadTable columns={tableHeaders} rows={nft_list}/> */}
      </>
  );
}
AllUser.propTypes = {
  
}

const mapStateToProps = (state) => ({
    nft_list: state.nfts.nft_list
})

const mapDispatchToProps = {
    getAllNFT,
}
export default connect(mapStateToProps, mapDispatchToProps)(AllUser)