import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

const ProtectedRoute = ({isAuthenticated, children}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
      }
    
      return children;
};
  
  ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool
  };
  
  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
  });
  
  export default connect(mapStateToProps)(ProtectedRoute);