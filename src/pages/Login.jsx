import React, { useState , useEffect} from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from "../actions/auth";
import { useNavigate } from "react-router";
import styles from"./Login.module.css"
import logo from "../logo2.jpg"


const Login = ({login, isAuthenticated}) => {
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [formIsValid, setFormValid]=useState(false)
    const navigate = useNavigate();
    const emailChangeHandler=(event)=>{
        setEnteredEmail(event.target.value)
    }
    const passwordChangeHandler=(event)=>{
        setEnteredPassword(event.target.value)
    }
    useEffect(()=>{
        //Adding Debounce
        const identifier=setTimeout(()=>{
            setFormValid(
                enteredEmail.includes('@') && enteredPassword.length>0 && enteredEmail.trim().length>0
            )
        }, 500)
        
        return ()=>{
            clearTimeout(identifier)
        }
    }, [enteredEmail, enteredPassword])
    
    if(isAuthenticated) {
        navigate("/");
    }

    const onFormSubmitHandler = async (e) => {
		e.preventDefault();
		login(enteredEmail, enteredPassword);
	};

	//Redirect if logged in
	// if (isAuthenticated) {
	// 	return navigate('/');
	// }

    return (
        <>
            <div className={styles.login_background} >
                {/* <div className="container contactb">
                    <div className="row">
                        <div className="col-md-6" style={{ borderRight: '1px solid #cccccc' }}>
                            <img src="img/bg-right.jpg" width="100%" height="auto" alt="some" />
                        </div>
                        <div className="col-md-6">
                            <form id="contact" action method="post" style={{ padding: '50px 40px 0px 20px' }} onSubmit={onFormSubmitHandler}>
                                <h3 className="signuptitle">Log In</h3>
                                <fieldset>
                                    <input placeholder="Email" type="email" tabIndex={1} value={enteredEmail} onChange={emailChangeHandler} required autofocus />
                                </fieldset>
                                <fieldset>
                                    <input placeholder="Password" type="password" tabIndex={2} required value={enteredPassword} onChange={passwordChangeHandler} />
                                </fieldset>
                                <fieldset>
                                    {formIsValid? (<><button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Login</button></>): (<><button name="submit" type="submit" id="contact-submit" data-submit="...Sending" disabled>Login</button></>)}
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div> */}
                <div className={styles.login_container}>
                    <div className={styles.login_logo_container}>
                        <img src={logo} width="100%" height="auto" alt="some" />
                    </div>
                    <div className={styles.login_form_container}>
                        <div className={styles.login_text}>
                            <h3 className={styles.login_title}>Log In</h3>
                            <p>Acccess to our dashboard.</p>
                        </div>
                        <div className={styles.login_text_small}>
                            
                        </div>
                        <form id="contact" action method="post" style={{ padding: '50px 40px 0px 20px' }} onSubmit={onFormSubmitHandler}>

                                <fieldset className={styles.login_form_input}>
                                    <input placeholder="Email" type="email" value={enteredEmail} onChange={emailChangeHandler} required autoFocus />
                                </fieldset>
                                <fieldset className={styles.login_form_input}>
                                    <input placeholder="Password" type="password" required value={enteredPassword} onChange={passwordChangeHandler} />
                                </fieldset>
                                <fieldset className={styles.login_form_button}>
                                    {formIsValid? (<><button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Login</button></>): (<><button name="submit" type="submit" id="contact-submit" data-submit="...Sending" disabled>Login</button></>)}
                                </fieldset>
                                <fieldset className={styles.login_form_forgot_pass}>
                                    <span className={styles.login_forgot_pass}>
                                        Forgot Password?
                                    </span>
                                </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}


Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);