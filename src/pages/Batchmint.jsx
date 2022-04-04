import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { connect, useSelector } from "react-redux";
import {FormControl, InputLabel, TextField, Button,TextareaAutosize, Alert, Select, MenuItem, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types'
import { uploadNft, updateNFTData } from "../actions/nft";
import styles from "./Batchmint.module.css";
import TablePagination from '@mui/material/TablePagination';
import Web3 from "web3";
import abi from"../ERC721.json";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Paperbase from "../components/Landing/Paperbase";
import BasicModal from '../components/MUI/Modal';
import ABI from "../ERC1155.json";
import Carousel from 'react-material-ui-carousel'
import StickyHeadTable from '../components/MUI/StickyHeadTable';

const tableHeaders=[
    { id: 'File Name', label: 'File Name', minWidth: 170 },
    { id: 'content_hash', label: 'JSON File', minWidth: 170 },
    { id: 'link', label: 'Link', minWidth: 170 },
    { id: 'address_input', label: 'User Address', minWidth: 170 },
]
const dummyData=[
    {
        contentHash: 'xyz',
        fileName: '1.json'
    },
    {
        contentHash: 'abc',
        fileName: '2.json'
    },
    {
        contentHash: 'qwe',
        fileName: '3.json'
    }
]
const Batchmint = ({ uploadNft, updateNFTData, jwt_token }) => {

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
    const [enteredAddresses, setEnteredAddresses]=useState({})
    const [enteredCopies, setEnteredCopies]=useState({})
    const [page, setPage] = useState(0);
    const [ermint,setErmint]= useState(false);
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
            if(tableHeaders.length <=4)
            {
            tableHeaders.push({ id: 'copy_input', label: 'No. of Copies', minWidth: 170 });
            }  
    }

    const clickHandleroff = (e)=>{
        setErmint(false);
        if(tableHeaders.length ===5)
        {
        tableHeaders.splice(4,1);
        }
    }
    console.log(tableHeaders);
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
            console.log('Image Arr is', imgarr); 
            console.log('NFT JSON is', nftjson); 
            imgarr.sort((a, b) => a.fileName > b.fileName)
            nftjson.sort((a, b) => a.fileName > b.fileName)
            if(imgarr.length!==nftjson.length){
                throw new Error('Count f Images and Json Must be same')
            }
            for(let i=0;i<imgarr.length;i++)
            { 
                setprocessingIPFSupload(true)
                e.preventDefault();
                // console.log(enteredName, enteredBio, enteredCeleb, nftData);
                // const base64result =imgarr[i].fileResult.split(',')[1];
                const response=await uploadNft(jwt_token, nftjson[i]?.name, nftjson[i]?.description,imgarr[i].fileResult, nftjson[i]?.category)
                setFileURL("https://gateway.pinata.cloud/ipfs/" + response.data.nft.content_hash)
                contentHash.push(response.data?.nft?.content_hash);
                setContenthash(contentHash);
                ipfsImageCloudUrl.push(response.data?.nft?.file_cloud_url);
                setIpfsImageCloudUrl(ipfsImageCloudUrl);
                console.log('Content Hash array is',contentHash);
                // console.log(ipfsImageCloudUrl);
                // setSuccess(!success);
            }
            setprocessingIPFSupload(false)
            setprocessingIPFSupload(false)
        }catch(err){
                console.log(err)
                alert(err.message)
                setprocessingIPFSupload(false)
        }    
    };
    function createData(id, name, tier, category, action) {
        return { id, name, tier, category, action };
      }
    const rows = dummyData.map(celeb => createData(celeb._id, celeb.name, celeb.tier, celeb.category, "update", "delete"));
    const mintBatchNFT = async (event) => {
        try{
                setprocessingMintNFT(true)
                const urls=[]
                const userAddresses=[]
                const copies=[]
                for (const [key, value] of Object.entries(enteredAddresses)) {
                    const contentHash=key.split('-')[0]
                    urls.push('https://gateway.pinata.cloud/ipfs/'+ contentHash)
                    userAddresses.push(value)
                    if(enteredCopies[`copies-${contentHash}`]){
                        copies.push(enteredCopies[`copies-${contentHash}`])
                    }else{
                        copies.push(1)
                    }
                 }
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

                //deployed contract address :: 0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E
                const batch_contract_address = "0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E";
                //current wallet address
                const accounts = await web3.eth.getAccounts();
                //default account who will be taking actions
                web3.eth.defaultAccount = accounts[0];
                console.log("Default Acoount : "+ accounts[0]);
                
                //entered address from UI :: (to_account) for which NFT will be minted
                console.log(enteredAddress);

                //creating instance of smart contract
                const med = new web3.eth.Contract(ABI,batch_contract_address, {});

                //IPFS file URL
                console.log("URL: "+fileURL);
                
                //minting NFT here two parameters :: enteredAddress && IPFSURL(fileURL)
                const response = await med.methods.batchMintByOwner(enteredAddress,copies,"fileURL").send({from:web3.eth.defaultAccount})
                console.log(response)
                if(response?.status){
                    // console.log("Transaction Hash of Minting: "+transactionHash);
                    // printing the log of transaction
                    console.log("Response From mintByOwner: ", response);
                    const TOKENID = response?.events?.TransferSingle?.returnValues?.['3'];
                    //const TOKENID = response?.events?.TransferSingle?.returnValues?.['3'];
                    await updateNFTData(contentHash, TOKENID, enteredAddress.toLowerCase())
                    setprocessingMintNFT(false)
                    setmintNFTstatus(true)
                    window.alert("NFT Minted Successfully!")
                    // console.log("Token ID: ", TOKENID);
                }
            } catch (error) {
                console.log("caught", error);
                setprocessingMintNFT(false)
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
                {!ipfsProcessedStatus?(
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
                                {dummyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow className={styles.row} hover key={row.contentHash}>
                                            <TableCell className={styles.table_text} align="right">{row.contentHash}</TableCell>
                                            <TableCell className={styles.table_text} align="right">{row.fileName}</TableCell>
                                            <TableCell className={styles.table_text}align="right">{'https://gateway.pinata.cloud/ipfs/'+ row.contentHash}</TableCell>
                                            {/* <TableCell className={styles.table_text} align="right">{'https://gateway.pinata.cloud/ipfs/'+ row.contentHash}</TableCell> */}
                                            <TableCell className={styles.table_text} align="right"><TextField fullWidth label="User Address" id="address" name={`address-${row.contentHash}`} onChange={addressChangeHandler}/></TableCell>
                                            {tableHeaders.length===5? (<><TableCell  className={styles.table_text} align="right"><TextField fullWidth label="Copies" id="copies" name={`copies-${row.contentHash}`} onChange={copiesChangeHandler}/></TableCell></>): (<></>)}
                                        </TableRow>
                                ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
                            {/* <TablePagination
                            className={styles.pagination}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dummyData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            /> */}
                        </Paper>
                        <div className={styles.mintbtn}>
                        {ermint?(<Button className={styles.btn}type="submit" variant="outlined">Mint ERC1155</Button>):(<Button className={styles.btn}type="submit" variant="outlined">Mint ERC721</Button>)}</div>
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
                                            <Carousel>
                                        {imgarr.map((img) => 
                                            <img key={img.fileName}className={styles.img}src={img.dataUri} alt="nft img" />
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
    jwt_token: state.auth.jwt_token
});

const mapDispatchToProps = {
    uploadNft,
    updateNFTData
}

export default connect(mapStateToProps, mapDispatchToProps)(Batchmint);
