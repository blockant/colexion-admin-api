import React from 'react';
import { Provider } from 'react-redux';
import Paperbase from './components/Landing/Paperbase';
import store from "./store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllUser from './pages/AllUser';
import AdminPanel from './pages/AdminPanel';
import Addceleb from './pages/Addceleb';
import Allcelebs from './pages/Allcelebs';
import Batchmint from './pages/Batchmint';
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
							<Route path="/users" element={<ProtectedRoutes><AllUser /></ProtectedRoutes>} />
							<Route path="/nft" element={<ProtectedRoutes><AllNFT /></ProtectedRoutes>} />
							<Route path="/nft/create" element={<ProtectedRoutes><AdminPanel /></ProtectedRoutes>} />
							<Route path="/nft/batchcreate" element={<ProtectedRoutes><Batchmint /></ProtectedRoutes>} />
							<Route path="/celeb/add" element={<ProtectedRoutes><Addceleb /></ProtectedRoutes>} />
							<Route path="/celeb/register" element={<ProtectedRoutes><Registerceleb /></ProtectedRoutes>} />
							<Route path="/celeb" element={<ProtectedRoutes><Allcelebs /></ProtectedRoutes>} />
							<Route path="/update/:id" element={<ProtectedRoutes><Update/></ProtectedRoutes>} />
						</Routes>
					</>
				</Router>
			</Provider>
		</>
	);
}

export default App;