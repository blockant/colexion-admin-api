import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { connect, useSelector } from "react-redux";
import {FormControl, InputLabel, TextField, Button,TextareaAutosize, Alert, Select, MenuItem} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types'
import { uploadNft, updateNFTData } from "../actions/nft";
import styles from "./AdminPanel.module.css";
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
import getNetworkFromChainId from '../utility/utils'
const AdminPanel = ({ uploadNft, updateNFTData, jwt_token, isMetaMaskConnected }) => {

    const [success, setSuccess] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [enteredCeleb, setEnteredCeleb] = useState("Random");
    const [enteredBio, setEnteredBio] = useState('');
    const [copies, setCopies] = useState('');
    const [enteredAddress,setEnteredAddress] = useState('');
    const [fileURL,setFileURL] = useState('');
    const [nftImg, setNftImg] = useState(null);
    const [nftData, setNftData] = useState(null);
    const [contentHash,setContenthash]=useState('')
    const [nftId,setnftId]=useState('')
    const [processingIPFSupload, setprocessingIPFSupload]=useState(false)
    const [ipfsProcessedStatus, setIpfsProcessedStatus]=useState(false)
    const [ipfsImageCloudUrl, setIpfsImageCloudUrl]=useState('')
    const [processingMintNFT, setprocessingMintNFT]=useState(false)
    const [mintNFTstatus, setmintNFTstatus]=useState(false)
    const [category, setCategory]=useState('')
    const [openModalStatus, setOpenModalStatus]=useState(false)
    const [mintType, setMintType] = useState('');
    //variable to store TokenID
    const handleChangeCategory=(event)=>{
        setCategory(event.target.value)
    }
    const handleOpenModalStatus=(event)=>{
        setOpenModalStatus(!openModalStatus)
    }
    const nameChangeHandler = (event) => {
        setEnteredName(event.target.value)
    }
    const bioChangeHandler = (event) => {
        setEnteredBio(event.target.value)
    }
    const nftChangeHandler = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setNftImg(reader.result);
                console.log("Nft image set");
            }
        }
        reader.readAsDataURL(event.target.files[0])
        console.log("Image read");
        setNftData(event.target.files[0])
        console.log("Image data set");
        // console.log(event.target.files[0])
    }

    const addressChangeHandler = (e) =>{
        setEnteredAddress(e.target.value);
    }
    const copiesChangeHandler = (e) => {
        setCopies(e.target.value);
    }
    const mintHandler = (e) => {
        setMintType(e.target.value);
    }
    const [formIsValid, setFormValid] = useState(false)

    useEffect(() => {
        //Adding Debounce
        const identifier = setTimeout(() => {
            setFormValid(
                enteredName.length > 0
            )
        }, 500)
        return () => {
            clearTimeout(identifier)
        }
    }, [enteredName])
    /**
     * 
     * @param {Event} e 
     * This Form Pins Data To IPFS
     */
    const onFormSubmitHandler = async (e) => {
        try{
            if(!isMetaMaskConnected){
                alert('Connect Wallet First')
            }else{
                setprocessingIPFSupload(true)
                e.preventDefault();
                // console.log(enteredName, enteredBio, enteredCeleb, nftData);
                const response=await uploadNft(jwt_token, enteredName, enteredBio, nftData, category)
                setFileURL("https://gateway.pinata.cloud/ipfs/" + response.data.nft.content_hash)
                setContenthash(response.data?.nft?.content_hash);
                setnftId(response.data?.nft?._id)
                setIpfsImageCloudUrl(response.data?.nft?.file_cloud_url)
                setSuccess(!success);
                setprocessingIPFSupload(false)
                setIpfsProcessedStatus(true)
            }
        }catch(err){
            console.log(err)
            setprocessingIPFSupload(false)
        }
        
    };
    const mintNFTHandler = (e) => {
        if(!isMetaMaskConnected){
            alert('Connect your Wallet first')
        }else{
            if(mintType === "ERC721") {
                mintNFT();
            } else if(mintType === "ERC1155") {
                mintNFT1155();
            }else{
                alert('Illegal Mint Type!')
            }
        }
    }
    //Minting ERC721 Contract
    const mintNFT = async (event) => {
        try{
                console.log('Minting ERC721')
                setprocessingMintNFT(true)
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
                const contract_address = "0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E";
                //current wallet address
                const accounts = await web3.eth.getAccounts();
                //default account who will be taking actions
                web3.eth.defaultAccount = accounts[0];
                console.log("Default Acoount : "+ accounts[0]);
                
                //entered address from UI :: (to_account) for which NFT will be minted
                console.log(enteredAddress);

                //creating instance of smart contract
                const med = new web3.eth.Contract(abi,contract_address, {});

                //IPFS file URL
                console.log("URL: "+fileURL);
                //minting NFT here two parameters :: enteredAddress && IPFSURL(fileURL)
                const response = await med.methods.mintByOwner(enteredAddress,fileURL).send({from:web3.eth.defaultAccount})
                console.log(response)
                if(response?.status){
                    // console.log("Transaction Hash of Minting: "+transactionHash);
                    // printing the log of transaction
                    console.log("Response From mintByOwner: ", response);
                    const TOKENID = response?.events?.Transfer?.returnValues?.['2'];
                    const chainID=await window.web3.eth.getChainId()
                    const network=getNetworkFromChainId(chainID)
                    await updateNFTData(nftId, TOKENID, enteredAddress.toLowerCase(), network, "ERC721")
                    setprocessingMintNFT(false)
                    setmintNFTstatus(true)
                    window.alert("NFT Minted Successfully!");
                    // console.log("Token ID: ", TOKENID);
                }
            } catch (error) {
                console.log("caught", error);
                setprocessingMintNFT(false)
            }
    };
    const mintNFT1155 = async (event) => {
        if(copies === "") {
            window.alert("Please enter the number of copies!");
            return;
        } else if(copies <= 0) {
            window.alert("Number of copies should be a positive integer!");
            return;
        }
        try{
                console.log('Minting ERC1155')
                setprocessingMintNFT(true)
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
                const response = await med.methods.mintByOwner(enteredAddress,copies, fileURL).send({from:web3.eth.defaultAccount})
                console.log(response)
                if(response?.status){
                    // console.log("Transaction Hash of Minting: "+transactionHash);
                    // printing the log of transaction
                    console.log("Response From mintByOwner: ", response);
                    const TOKENID = response?.events?.Transfer?.returnValues?.['2'];
                    const chainID=await window.web3.eth.getChainId()
                    const network=getNetworkFromChainId(chainID)
                    await updateNFTData(nftId, TOKENID, enteredAddress.toLowerCase(), network, "ERC1155", copies)
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
    setTimeout(() => { if (success) { setSuccess(!success) } }, 3000);
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
                    <Card sx={{ maxWidth: 345 }} style={{backgroundColor:"#14141f", color:"white", border:"1px solid white"}}>
                    <CardMedia
                        component="img"
                        alt="Uploaded IPFS Image"
                        height="140"
                        image={ipfsImageCloudUrl}
                    />
                    <CardContent style={{ color:"white"}}>
                        <Typography gutterBottom variant="h5" component="div">
                        Mint the Uploaded NFT
                        </Typography>
                        <Typography variant="body2">
                            Pinned To IPFS Success, with content Hash {contentHash}
                        </Typography>
                        <TextField id="Address" label="Address" variant="outlined" style={{width:"69%", margin:"10px auto"}} onChange={addressChangeHandler}/>
                        <InputLabel id="MintingOptions" style={{fontSize: "0.75rem", position: "absolute"}}>Minting options</InputLabel>
                        <Select
                            onChange={mintHandler}
                            style={{width:"50%",color:"white"}}
                            labelId="MintingOptions"
                        >
                            <MenuItem value="ERC721">Mint ERC721</MenuItem>
                            <MenuItem value="ERC1155">Mint ERC1155</MenuItem>
                        </Select>
                        {
                            (mintType === "ERC1155") &&
                            <>
                                <Typography variant="body2">
                                    No. of copies for minting to IRC1155
                                </Typography>
                                <TextField id="copies" label="No. of copies" variant="outlined" type="number" style={{width:"69%", margin:"10px auto"}} onChange={copiesChangeHandler}/>
                            </>
                        }
                        
                    </CardContent>
                    <CardActions className={styles.btnContainer}>
                        {!processingMintNFT? (
                        <>
                            <Button onClick={mintNFTHandler} size="small" className={styles.bt}>Mint {mintType}</Button>
                        </>): (<><CircularProgress /> Minting The NFT.....</>)}
                            
                    </CardActions>
                    </Card>
                    {/* <div className={styles.right}>
                        
                        
                        <div>
                            
                        </div>
                    </div> */}
                </>): (
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

                                <div className="row">
                                    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                        <div className="sc-card-profile text-center">
                                            {/* <div className="card-media">
                                                <img id="profileimg" src={nftImg} alt="Axies" />
                                            </div> */}
                                            <div id="upload-profile" className={styles.upload_profile} >
                                                <div style={{color:"white"}}>
                                                    Upload NFT: 
                                                </div>
                                                <input id="tf-upload-img" type="file" name="profile"
                                                    accept='image/*'
                                                    onChange={nftChangeHandler}
                                                />
                                            </div>
                                            
                                        </div>
                                       
                                    </div>
                                    <div className="col-xl-9 col-lg-8 col-md-12 col-12">
                                        <div className="form-upload-profile">
                                            <form method="post" onSubmit={onFormSubmitHandler} autoComplete='off' className="form-profile">
                                                <div className="form-infor-profile">
                                                    <div className="info-account" >
                                                        
                                                        <div className={styles.nft}>
                                                            <h2 className="title-create-item">NFT info</h2>
                                                            <div className={styles.nftname}>
                                                                <TextField id="Address" label="NFT Name" variant="outlined" onChange={nameChangeHandler} style={{width:"80%", margin:"0 auto"}}/>
                                                            </div>
                                                            {/* <div className={styles.nftowner}>
                                                                <TextField id="Address" label="NFT Owner" value="colexion"  variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                            </div> */}
                                                            {/* <div className={styles.celebrity}>
                                                                <TextField id="Address" label="Celebrity Name" variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                            </div> */}
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
                                                </div>
                                                {formIsValid ? (<>
                                                    {processingIPFSupload ? (<><CircularProgress  /> <span className={styles.msg}>Pinning Data To IPFS Hold on.....</span></>): (<><div className={styles.btnContainer}><Button onClick={onFormSubmitHandler}  name='submit' className={styles.bt}>Pin to IPFS</Button></div></>)}
                                                </>) : (<><Button name='submit' variant="contained" disabled>Pin to IPFS</Button></>)}
                                            </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
