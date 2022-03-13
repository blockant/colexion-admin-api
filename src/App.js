import React from 'react';
import { Provider } from 'react-redux';
import ConnectMetamask from './components/Landing/ConnectMetamask';
import Navbar from './components/Landing/Navigator';
import Paperbase from './components/Landing/Paperbase';
import store from "./store";
import { BrowserRouter as Router,  Route, Routes, Switch, useLocation } from "react-router-dom";
import AllUser from './pages/AllUser';

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
				<>
					<Routes>
            <Route path="/" element={<Paperbase/>} />
						<Route path="/users" element={<AllUser/>} />
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