import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '@/_services';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if(!currentUser.hasProfile && props.location.pathname !== '/createprofile'){
          return <Redirect to={{pathname: '/createprofile'}}/>
        }

        if(currentUser.hasProfile && props.location.pathname !== '/myprofile'){
          return <Redirect to={{pathname: '/myprofile'}}/> //redirect to dashboard
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)