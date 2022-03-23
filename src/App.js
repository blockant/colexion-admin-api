import React from 'react';
import { Provider } from 'react-redux';
import Paperbase from './components/Landing/Paperbase';
import store from "./store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllUser from './pages/AllUser';
import AdminPanel from './pages/AdminPanel';
import Addceleb from './pages/Addceleb';
import Allcelebs from './pages/Allcelebs';
import Registerceleb from './pages/Registerceleb'
import { LOGIN_SUCCESS } from './actions/types'
import Login from './pages/Login'
import ProtectedRoutes from './pages/Protectedroute';
import Update from './pages/Updateceleb';
import AllNFT from './pages/AllNFT';

function App() {
	if (localStorage.getItem("user") && localStorage.token) {
		console.log('Local Storage user is', localStorage.user)
		store.dispatch({ type: LOGIN_SUCCESS, payload: { user: JSON.parse(localStorage.getItem("user")), token: localStorage.token } });
	}
	return (
		<>
			<Provider store={store}>
				<Router>
					<>
						<Routes>
							<Route 
								path="/" 
								element={
									<ProtectedRoutes>
										<Paperbase />
									</ProtectedRoutes>
								}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/users" element={<AllUser />} />
							<Route path="/nft" element={<AllNFT />} />
							<Route path="/nft/create" element={<AdminPanel />} />
							<Route path="/addceleb" element={<Addceleb />} />
							<Route path="/registerceleb" element={<Registerceleb />} />
							<Route path="/allceleb" element={<Allcelebs />} />
							<Route path="/update/:id" element={<Update/>} />

							{/* <Route exact path="/login" component={LoginComponent} />
						<Route exact path="/signup" component={SignUpComponent} />
						<Route exact path="/marketplace" component={GameList} />
						<Route exact path="/profile" component={ProfileComponent} />
						<Route exact path="/game/:gameId/earn" render={()=>(<InGameItems type='earn'/>)}/>
						<Route exact path="/game/:gameId/buy" render={()=>(<InGameItems type='buy'/>)}/> */}
						</Routes>
					</>
				</Router>
			</Provider>
		</>
	);
}

export default App;