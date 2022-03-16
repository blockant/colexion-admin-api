import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { connect, useSelector } from "react-redux";
import PropTypes from 'prop-types'
import { uploadNft } from "../actions/nft";

const AdminPanel = ({ uploadNft }) => {

    const [success, setSuccess] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [enteredCeleb, setEnteredCeleb] = useState("Random");
    const [enteredBio, setEnteredBio] = useState('');

    const [nftImg, setNftImg] = useState(null);
    const [nftData, setNftData] = useState(null);

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
            }
        }
        reader.readAsDataURL(event.target.files[0])

        setNftData(event.target.files[0])
        // console.log(event.target.files[0])
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
        await uploadNft("", enteredName, enteredBio, enteredCeleb, nftData)
        setSuccess(!success);
    };

    // useEffect(async () => {
    //     await loadUser(jwt_token)
    //     setEnteredName(user.name);
    //     setEnteredBio(user?.bio);
    //     // console.log('Inside UseEffect', user)
    // }, [success, jwt_token, loadUser, user.name])
    setTimeout(() => { if (success) { setSuccess(!success) } }, 3000);

    return (
        <div>
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
                                <div className="card-media">
                                    <img id="profileimg" src={nftImg} alt="Axies" />
                                </div>
                                <div id="upload-profile">
                                    <Link to="#" className="btn-upload">
                                        Upload NFT </Link>
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
                                        <div className="info-account">
                                            <h4 className="title-create-item">NFT info</h4>
                                            <fieldset>
                                                <h4 className="title-infor-account">NFT name</h4>
                                                <input type="text" placeholder="Trista Francis"
                                                    value={enteredName}
                                                    onChange={nameChangeHandler}
                                                    required />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">NFT Owner</h4>
                                                <input type="text" value="Colexion" readOnly />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Celeb Name</h4>
                                                <input type="email"
                                                    value={enteredCeleb}
                                                    readOnly />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Description</h4>
                                                <textarea tabIndex="4" rows="12"
                                                    placeholder='Describe this NFT...'
                                                    value={enteredBio}
                                                    onChange={bioChangeHandler}
                                                >
                                                </textarea>
                                            </fieldset>
                                        </div>
                                    </div>
                                    {formIsValid ? (<>
                                        <button className="tf-button-submit mg-t-15" name='submit' type="submit">Pin to IPFS</button>
                                    </>) : (<>
                                        <button className="tf-button-submit mg-t-15" name='submit' type="submit" disabled>Pin to IPFS</button>
                                    </>)}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
    uploadNft
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
