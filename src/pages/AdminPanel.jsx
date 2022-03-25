import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { connect, useSelector } from "react-redux";
import {FormControl, InputLabel, TextField, Button,TextareaAutosize} from "@mui/material";
import PropTypes from 'prop-types'
import { uploadNft } from "../actions/nft";
import styles from "./AdminPanel.module.css";
import axios from "axios";
import Web3 from "web3";
import abi from"../ERC721.json";
import Logo from "../logo2.jpg";
import { style } from '@mui/system';

const AdminPanel = ({token,uploadNft }) => {

    const [success, setSuccess] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [enteredCeleb, setEnteredCeleb] = useState("Random");
    const [enteredBio, setEnteredBio] = useState('');
    const [enteredAddress,setEnteredAddress] = useState('');
    const [fileURL,setFileURL] = useState('');
    const [nftImg, setNftImg] = useState(Logo);
    const [nftData, setNftData] = useState(null);
    let contentHash;
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

    const onFormSubmitHandler = async (e) => {
        e.preventDefault();
        // console.log(enteredName, enteredBio, enteredCeleb, nftData);
        const res = await uploadNft(token,enteredName, enteredBio, nftData)
        contentHash=res.data.nft.content_hash;
        setFileURL("https://gateway.pinata.cloud/ipfs/"+contentHash);
        //console.log(contentHash);
        //console.log(fileURL);
        setSuccess(!success);
    };
    //console.log(fileURL);

    const mintNFT = async (event) => {
        try{
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
            
            //address (to) for which NFT will be minted
            // const to_address = enteredAddress;
            console.log(enteredAddress);
            // console.log("Address where NFT is minted to: "+to_address);

            //creating instance of smart contract
            const med = new web3.eth.Contract(abi,contract_address, {
                //string:: gas price in wei to use for transactions.
                //gasPrice: '100000000000',
                //number:: maximum gas provided for a transaction(gas limit).
                //gas: 500000
            });
            console.log("hi!!!!");

            //two parameters :: inputAddress && IPFSURL(fileURL)
            console.log("URL: "+fileURL);
            const receipt = await med.methods.mintByOwner(accounts[0],fileURL).
	        send({from:web3.eth.defaultAccount},function(error,transactionHash){
		    console.log("hello!!!");
            if(!error){
			    console.log("Transaction Hash of Minting: "+transactionHash);
		    } else {
		        console.log(error);
		    }
            });
            console.log("Receipt from the event: "+receipt.events);

            } catch (error) {
                console.log("caught", error);
            }
    };

    // useEffect(async () => {
    //     await loadUser(jwt_token)
    //     setEnteredName(user.name);
    //     setEnteredBio(user?.bio);
    //     // console.log('Inside UseEffect', user)
    // }, [success, jwt_token, loadUser, user.name])
    setTimeout(() => { if (success) { setSuccess(!success) } }, 3000);
    let enterName;
    const getbox = ()=>{
        enterName = prompt('Number of copies');
    }
    return (
        <>
        <main className={styles.main}>
            {/* <Header /> */}
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">

                    {success ? (<>
                        <div className='alert alert-success'>
                            <span>NFT uploaded successfully!</span>
                        </div>
                    </>) : (<>
                    </>)}

                    <div className={styles.row}>
                        <div className={styles.form_img}>
                            <div className="sc-card-profile text-center">
                                <div className={styles.card_media} >
                                    <img className={styles.profileimg}  style={{minHeight: "20rem",minWidth: "26rem"}} src={nftImg} alt="Axies" />
                                </div>
                                <div id="upload-profile" className={styles.upload_profile} >
                                    <div>
                                    <Link to="#" className={styles.btn_upload_nft} style={{color: "white"}}>
                                    
                                        Upload NFT: 
                                        
                                    </Link>
                                    </div>
                                    <input id="tf-upload-img" type="file" name="profile"
                                        accept='image/*'
                                        onChange={nftChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.form_img} style={{marginTop:"20px"}}>
                            <div className="form-upload-profile">
                                <form method="post" onSubmit={onFormSubmitHandler} autoComplete='off' className="form-profile">
                                    <div className="form-infor-profile">
                                        <div className="info-account">
                                            
                                            <div className={styles.nft}>
                                                <h2 className="title-create-item" >NFT info</h2>
                                                <div className={styles.nftname}>
                                                    <TextField id="Address" label="NFT Name" variant="outlined" onChange={nameChangeHandler} style={{width:"80%", margin:"0 auto"}}/>
                                                </div>
                                                <div className={styles.nftowner}>
                                                    <TextField id="Address" label="NFT Owner" value="colexion"  variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                </div>
                                                <div className={styles.celebrity}>
                                                    <TextField id="Address" label="Celebrity Name" variant="outlined" style={{width:"80%", margin:"0 auto"}}/>
                                                </div>
                                                <div className={styles.description}>
                                                    <TextareaAutosize
                                                    aria-label="Description"
                                                    minRows={6}
                                                    onChange={bioChangeHandler}
                                                    placeholder="Description"
                                                    style={{ width: "79%",backgroundColor:"#14141f",color:"white"}}
                                                    />
                                                </div>
                                                <Button className={styles.bt} name='submit' variant="contained" disabled>Pin to IPFS</Button>
                                                
                                            </div>
                                            
                                        </div>
                                       
                                    </div>
                                </form>
                            </div>
                             
                        </div>
                    
                    </div>
                    <hr></hr>
                </div>
            </div>
        <div className={styles.right}>
                <TextField id="Address" label="Address" variant="outlined" style={{width:"69%", margin:"0 auto"}} onChange={addressChangeHandler}/>
                <div>
                    <Button className={styles.btn} onClick={mintNFT}variant="contained">Mint ERC721</Button>
                    <Button className={styles.btn}  onClick={getbox}variant="contained">Mint ERC1155</Button>
                </div>
        </div>
        </main>
        </>
    );
}


const mapStateToProps = (state) => ({
    token: state.auth.jwt_token
});

const mapDispatchToProps = {
    uploadNft
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
