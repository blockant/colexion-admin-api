import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { connect, useSelector } from "react-redux";
import {FormControl, InputLabel, TextField, Button,TextareaAutosize, Alert, Select, MenuItem, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types'
import { uploadNft, updateNFTData } from "../actions/nft";
import styles from "./Batchmint.module.css";
import TablePagination from '@mui/material/TablePagination';
import Web3 from "web3";
import ERC721ABI from"../ERC721.json";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Paperbase from "../components/Landing/Paperbase";
import BasicModal from '../components/MUI/Modal';
import ERC1155ABI from "../ERC1155.json";
import Carousel from 'react-material-ui-carousel'
import StickyHeadTable from '../components/MUI/StickyHeadTable';
import getNetworkFromChainId from '../utility/utils';

//const tableHeaders=[{ id: 'fileName', label: 'File(s) Name', minWidth: 170 },{ id: 'nft_link', label: 'Link', minWidth: 170 },{ id: 'address_input', label: 'User Address', minWidth: 170 }]
const Batchmint = ({ uploadNft, updateNFTData, jwt_token, isMetaMaskConnected }) => {
    const navigate=useNavigate()
    const [success, setSuccess] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [enteredCeleb, setEnteredCeleb] = useState("Random");
    const [enteredBio, setEnteredBio] = useState('');
    const [copies, setCopies] = useState([]);
    const [enteredAddress,setEnteredAddress] = useState('');
    const [fileURL,setFileURL] = useState('');
    const [nftImg, setNftImg] = useState(null);
    const [nftData, setNftData] = useState(null);
    const [contentHash,setContenthash]=useState([])
    const [processingIPFSupload, setprocessingIPFSupload]=useState(false)
    const [ipfsProcessedStatus, setIpfsProcessedStatus]=useState(false)
    const [ipfsImageCloudUrl, setIpfsImageCloudUrl]=useState([])
    const [processingMintNFT, setprocessingMintNFT]=useState(false)
    const [mintNFTstatus, setmintNFTstatus]=useState(false)
    const [category, setCategory]=useState('')
    const [openModalStatus, setOpenModalStatus]=useState(false)
    const [mintType, setMintType] = useState('');
    const [imgarr,setImgarr]=useState([]);
    const [nftjson,setNftjson]= useState([]);
    const [nftProcessedData,setNftProcessedData]= useState([]);
    const [enteredAddresses, setEnteredAddresses]=useState({})
    const [enteredCopies, setEnteredCopies]=useState({})
    const [page, setPage] = useState(0);
    const [ermint,setErmint]= useState(false);
    const [tableHeaders, setTableHeaders]=useState([
        { id: 'fileName', label: 'File(s) Name' },
        { id: 'nft_link', label: 'Link' },
        { id: 'address_input', label: 'User Address' }
    ])
const [rowsPerPage, setRowsPerPage] = React.useState(5);
    //variable to store TokenID
    const handleChangeCategory=(event)=>{
        setCategory(event.target.value)
    }
    const handleOpenModalStatus=(event)=>{
        setOpenModalStatus(!openModalStatus)
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    const nftChangeHandler = (event) => {
        for(const file of event.target.files) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    const dataUri=reader.result
                    const fileName=file.name
                    imgarr.push({fileResult: file, fileName, dataUri});
                    setNftImg(reader.result);
                    setImgarr(imgarr);
                    console.log('Image Array is', imgarr)
                }
            }
            reader.readAsDataURL(file);
        }
        // console.log("Image read");
        // setNftData(event.target.files)
        // console.log("Image data set");
        // console.log(event.target.files[0])
    }

    const jsonChangeHandler = (event) => {
        for(const file of event.target.files) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    console.log('Reader.result is', reader.result)
                    const base64result = reader.result.split(',')[1];
                    const result={...JSON.parse(atob(base64result)), fileName: file.name}
                    console.log('Result is', result)
                    nftjson.push(result)
                    setNftjson(nftjson);
                    console.log("Nft JSON is", nftjson);
                }
            }
            reader.readAsDataURL(file);
        }
        // reader.readAsText(event.target.files[0]);
        // console.log(event.target.files[0]);
        // console.log("JSON read");
        // setNftjson(event.target.files[0])
        // console.log((event.target.files[0]));
        
        // console.log("JSON data set");
    }

    const addressChangeHandler = (e) =>{
        enteredAddresses[`${e.target.name}`]=e.target.value 
        setEnteredAddresses(enteredAddresses)
        console.log('Entered Addresses is', enteredAddresses)
    }
    const copiesChangeHandler = (e) => {
        enteredCopies[`${e.target.name}`]=e.target.value 
        setEnteredCopies(enteredCopies)
        console.log('Entered Copies is', enteredCopies)
    }
    const clickHandleron = (e)=>{
            setErmint(true);
            if(tableHeaders.length===3)
            {
                tableHeaders.push({ id: 'copy_input', label: 'No. of Copies', minWidth: 170 });
                setTableHeaders(tableHeaders)
            }  
    }

    const clickHandleroff = (e)=>{
        setErmint(false);
        if(tableHeaders.length ===4)
        {
            tableHeaders.splice(3,1);
            setTableHeaders(tableHeaders)
        }
    }
    // console.log(tableHeaders);
    const mintHandler = (e) => {
        setMintType(e.target.value);
    }
    /**
     * 
     * @param {Event} e 
     * This Form Pins Data To IPFS
     */
    const onFormSubmitHandler = async (e) => {
        try{
            if(!isMetaMaskConnected){
                alert('Connect Metamsk First!')
            }else{
                console.log('Image Arr is', imgarr); 
                console.log('NFT JSON is', nftjson); 
                imgarr.sort((a, b) => a.fileName > b.fileName)
                nftjson.sort((a, b) => a.fileName > b.fileName)
                if(imgarr.length!==nftjson.length){
                    throw new Error('Count f Images and Json Must be same')
                }
                console.log('Processed Status before Submit', ipfsProcessedStatus)
                const processedData=[]
                for(let i=0;i<imgarr.length;i++)
                { 
                    setprocessingIPFSupload(true)
                    e.preventDefault();
                    // console.log(enteredName, enteredBio, enteredCeleb, nftData);
                    // const base64result =imgarr[i].fileResult.split(',')[1];
                    const response=await uploadNft(jwt_token, nftjson[i]?.name, nftjson[i]?.description,imgarr[i].fileResult, nftjson[i]?.category)
                    contentHash.push(response.data?.nft?.content_hash);
                    setContenthash(contentHash);
                    ipfsImageCloudUrl.push(response.data?.nft?.file_cloud_url);
                    setIpfsImageCloudUrl(ipfsImageCloudUrl);
                    console.log('Content Hash array is',contentHash);
                    processedData.push({
                        nft_link: "https://gateway.pinata.cloud/ipfs/" + response.data.nft.content_hash,
                        fileName: `${imgarr[i].fileName}/${nftjson[i].fileName}`,
                        nft_id: response.data.nft._id,
                        contentHash: response.data.nft.content_hash
                    })
                    // console.log(ipfsImageCloudUrl);
                    // setSuccess(!success);
                }
                setNftProcessedData(processedData)
                setprocessingIPFSupload(false)
                setIpfsProcessedStatus(true)
                console.log('Processed After before Submit', ipfsProcessedStatus)
            } 
        }catch(err){
                console.log(err)
                alert(err.message)
                setprocessingIPFSupload(false)
        }    
    };
    const mintBatchNFT = async (event) => {
        try{
                event.preventDefault()
                setprocessingMintNFT(true)
                const urls=[]
                const userAddresses=[]
                const copies=[]
                const nftIds=[]
                if(Object.keys(enteredAddresses).length!==nftProcessedData.length || (ermint && (Object.keys(enteredCopies).length!==nftProcessedData.length)) ){
                    alert('All Addresses and copies must be filled')
                    setprocessingMintNFT(false)
                }else{
                    for (const [key, value] of Object.entries(enteredAddresses)) {
                        const contentHash=key.split('-')[2]
                        const nftId=key.split('-')[1]
                        urls.push('https://gateway.pinata.cloud/ipfs/'+ contentHash)
                        userAddresses.push(value)
                        nftIds.push(nftId)
                        //True Value of ERMINT Implies it's ERC1155, hence copies are required
                        if(ermint){
                            if(enteredCopies[`copies-${nftId}-${contentHash}`]){
                                copies.push(enteredCopies[`copies-${nftId}-${contentHash}`])
                            }else{
                                copies.push(1)
                            }
                        }
                    }
                    console.log('NFT Id To Addresses',nftIds)
                    if (window.ethereum) {
                        window.web3 = new Web3(window.ethereum);
                        await window.ethereum.enable();
                    }
                    if (window.web3) {
                        window.web3 = new Web3(window.web3.currentProvider);
                    } else {
                        return window.alert("Please install MetaMask!");
                    }
                    //setWeb3(window.web3)
                    const web3 = window.web3;
                    //current wallet address
                    const accounts = await web3.eth.getAccounts();
                    //default account who will be taking actions
                    web3.eth.defaultAccount = accounts[0];
                    console.log("Default Acoount : "+ accounts[0]);
                    //deployed contract address :: 0xABCe6e88635B8CA86b0d3ef77e78f1077ab2B9B0
                    if(ermint){
                        const contract_address = "0xABCe6e88635B8CA86b0d3ef77e78f1077ab2B9B0";
                        //creating instance of smart contract
                        const med = new web3.eth.Contract(ERC1155ABI,contract_address, {});
                        //minting NFT here two parameters :: enteredAddress && IPFSURL(fileURL)
                        const response = await med.methods.batchMintByOwner(userAddresses,copies,urls).send({from:web3.eth.defaultAccount})
                        console.log('Response of batch mint ERC1155', response)
                        if(response?.status){
                            const transferEvent = response?.events?.TransferSingle
                            const chainID=await window.web3.eth.getChainId()
                            const network=getNetworkFromChainId(chainID)
                            //Optimise Currently, O(n^2)
                            for (let index=0; index<userAddresses.length; index++) {
                                console.log('Transfer Return values are', transferEvent?.[index]?.returnValues)
                                if(transferEvent[index].returnValues?.value){
                                    await updateNFTData(nftIds[index], transferEvent[index].returnValues?.value, userAddresses[index], network, "ERC1155", copies[index])
                                }
                            }
                            setprocessingMintNFT(false)
                            setmintNFTstatus(true)
                            window.alert(`NFT(s) Minted Successfully!, Transaction Hash: ${response?.transactionHash}`)
                            return navigate("/nft");
                        }
                        setprocessingMintNFT(false)
                    }else{
                        const contract_address = "0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E";
                        //creating instance of smart contract
                        const med = new web3.eth.Contract(ERC721ABI,contract_address, {});
                        const response = await med.methods.batchMintByOwner(userAddresses,urls).send({from:web3.eth.defaultAccount})
                        console.log(response)
                        if(response?.status){
                            console.log("Response From batchMint ERC721: ", response);
                            const transferEvent = response?.events?.Transfer
                            const chainID=await window.web3.eth.getChainId()
                            const network=getNetworkFromChainId(chainID)
                            //Optimise Currently, O(n^2)
                            for (let index=0; index<userAddresses.length; index++) {
                                console.log('Transfer Return values are', transferEvent[index].returnValues)
                                if(transferEvent[index].returnValues?.tokenId){
                                    await updateNFTData(nftIds[index], transferEvent[index].returnValues?.tokenId, userAddresses[index], network, "ERC721")
                                }
                            }
                            setprocessingMintNFT(false)
                            setmintNFTstatus(true)
                            window.alert(`NFT(s) Minted Successfully!, Transaction Hash: ${response?.transactionHash}`)
                            return navigate("/nft");
                        }
                    }
                    setprocessingMintNFT(false)
                }         
            } catch (err) {
                console.log("caught", err);
                setprocessingMintNFT(false)
                alert(err.message)
            }
    };


    // setTimeout(() => { if (success) { setSuccess(!success) } }, 3000);
    //TODO: Add paperbase
    return (
        <>
        <Paperbase>
         {/* <BasicModal openStatus={openModalStatus} onClick={handleOpenModalStatus} messageComponent={<Alert severity="success">NFT Minted Success!</Alert>}></BasicModal> */}
            {mintNFTstatus ? (
                <>
                <BasicModal openStatus={openModalStatus} onClick={handleOpenModalStatus} messageComponent={<Alert severity="success">NFT Minted Success!</Alert>}></BasicModal>
                Minted Success
            </>): (<>
                
            </>)}
            <main className={styles.main}>
                {ipfsProcessedStatus?(
                    <>
                      <div className={styles.btnContain}>
                        <Button className={styles.btn} onClick={clickHandleroff}variant="outlined">Mint ERC721</Button>
                        <Button  className={styles.btn}onClick={clickHandleron}variant="outlined">Mint ERC1155</Button></div>
                        {/**TODO: Add A text specifying which contract are you minting rn */}
                        <form action="" method="" onSubmit={mintBatchNFT}>
                        <Paper >
                            <TableContainer  component={Paper} className={styles.tableContainer} >
                                <Table className={styles.table} stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                    {tableHeaders.map((column) => (
                                        <TableCell className={styles.tableHeaderCell} key={column.id} align={column.align}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{borderTopLeftRadius: "8px !important"}}>
                                {nftProcessedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow className={styles.row} hover key={row.nft_link}>
                                            <TableCell className={styles.table_text} align="right">{row.fileName}</TableCell>
                                            <TableCell className={styles.table_text} align="right">{row.nft_link}</TableCell>
                                            {/* <TableCell className={styles.table_text} align="right">{'https://gateway.pinata.cloud/ipfs/'+ row.contentHash}</TableCell> */}
                                            <TableCell className={styles.table_text} align="right"><TextField fullWidth label="User Address" id="address" name={`address-${row.nft_id}-${row.contentHash}`} onChange={addressChangeHandler}/></TableCell>
                                            {ermint? (<><TableCell  className={styles.table_text} align="right"><TextField fullWidth label="Copies" id="copies" name={`copies-${row.nft_id}-${row.contentHash}`} onChange={copiesChangeHandler}/></TableCell></>): (<></>)}
                                        </TableRow>
                                ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                            className={styles.pagination}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={nftProcessedData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                        <div className={styles.mintbtn}>
                           {processingMintNFT?(<><Button className={styles.btn} variant="outlined">Processing ...</Button></>):(<><Button onClick={mintBatchNFT} className={styles.btn}type="submit" variant="outlined">{ermint? "Mint ERC1155":"Mint ERC721"}</Button></>)} 
                        </div>
                        </form>
                   </>):(
                <>
                    <div className={styles.left}>
                        {/* <Header /> */}
                        <div className="tf-create-item tf-section">
                            <div className="themesflat-container">

                                {success ? (<>
                                    <div className='alert alert-success'>
                                        <span>NFT uploaded successfully!</span>
                                    </div>
                                </>) : (<>
                                </>)}

                                <div className={styles.nft}>
                                    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                        <div className="sc-card-profile text-center">
                                            {/* <div className="card-media">
                                                <img id="profileimg" src={nftImg} alt="Axies" />
                                            </div> */}
                                            <Carousel indicators={false}>
                                        {imgarr.map((img) => 
                                            <img key={img.fileName}className={styles.img} src={img.dataUri} alt="nft img" />
                                        )}
                                        </Carousel>
                                            <div id="upload-profile" className={styles.upload_profile} >
                                                <div style={{color:"white"}}>
                                                    Upload NFTs: 
                                                </div>
                                                <input id="tf-upload-img" type="file" name="profile"
                                                    accept='image/*'
                                                    onChange={nftChangeHandler}
                                                    multiple
                                                />
                                            </div>
                                            
                                        </div>

                                    </div>
                                    <div>
                                        
                                    </div>
                                    <div className="col-xl-9 col-lg-8 col-md-12 col-12">
                                        <div className="form-upload-profile">
                                        <div className="sc-card-profile text-center">
                                            {/* <div className="card-media">
                                                <img id="profileimg" src={nftImg} alt="Axies" />
                                            </div> */}
                                            <div id="upload-profile" className={styles.upload_profile} >
                                                <div style={{color:"white"}}>
                                                    Upload JSONs: 
                                                </div>
                                                <input id="tf-upload-img" type="file" name="profile"
                                                    accept='JSON/*'
                                                    onChange={jsonChangeHandler}
                                                    multiple
                                                />
                                            </div>
                                            
                                        </div >
                                            {/* <form method="post" onSubmit={onFormSubmitHandler} autoComplete='off' className="form-profile">
                                                <div className="form-infor-profile">
                                                    <div className="info-account" >
                                                        
                                                        <div className={styles.nft}>
                                                            <h2 className="title-create-item">NFT info</h2>
                                                            <div className={styles.nftname}>
                                                                <TextField id="Address" label="NFT Name" variant="outlined" onChange={nameChangeHandler} style={{width:"80%", margin:"0 auto"}}/>
                                                            </div>
                                                            <div className={styles.nftowner}>
                                                                <TextField id="Address" label="NFT Owner" value="colexion"  variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                            </div>
                                                            <div className={styles.celebrity}>
                                                                <TextField id="Address" label="Celebrity Name" variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                            </div>
                                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={category}
                                                                    label="Category"
                                                                    onChange={handleChangeCategory}
                                                                    style={{width:"56%"}}
                                                                >
                                                                    <MenuItem value={"Celebrities"}>Celebrities</MenuItem>
                                                                    <MenuItem value={"Sports"}>Sports</MenuItem>
                                                                    <MenuItem value={"Music"}>Music</MenuItem>
                                                                    <MenuItem value={"Others"}>Others</MenuItem>
                                                                </Select>
                                                            <div className={styles.description}>
                                                                <TextareaAutosize
                                                                aria-label="Description"
                                                                minRows={6}
                                                                onChange={bioChangeHandler}
                                                                placeholder="Description"
                                                                style={{ width: "80%", backgroundColor:"#14141f",color:"white" }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <>
                                                    {processingIPFSupload ? (<><CircularProgress  /> <span className={styles.msg}>Pinning Data To IPFS Hold on.....</span></>): (<><div className={styles.btnContainer}><Button onClick={onFormSubmitHandler}  name='submit' className={styles.bt}>Pin to IPFS</Button></div></>)}
                                                </>
                                            {/* </form> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                             
                        </div>
                    
                    </div>
                </>)}
            </main>
            </Paperbase>
        </>
    );
}


const mapStateToProps = (state) => ({
    jwt_token: state.auth.jwt_token,
    isMetaMaskConnected: state.metamask.isMetaMaskConnected
});

const mapDispatchToProps = {
    uploadNft,
    updateNFTData
}

export default connect(mapStateToProps, mapDispatchToProps)(Batchmint);
