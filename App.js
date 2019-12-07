/**
 * @author : Dushman Nalin
 * @date : November 30, 2019
 * @version : 1.0
 * @ changes: added redux and saga and axios interceptors
 * @copyright : © 2010-2019 Information International Limited. All Rights Reserved
 */
import React from "react";
import "./App.scss";
import "./scss/Main.scss";
import LoginController from "./component/common/login/LoginController";
import Loader from "./component/atom/loader/Loader";
import { connect } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import {
    activateLoader,
    deactivateLoader
} from "./redux/action/admin/actionIndexRedux";
import { logOutAction } from "../src/middleware/action/admin/actionIndexSaga";
import * as  actionIndexRedux from '../src/redux/action/admin/actionIndexRedux';
import store  from '../src/redux/store/store';
import ErrorBoundary from './component/common/ErrorBoundary/ErrorBoundary';
// import store from './redux/store/store';

/**
 * this interceptor will add the access_token for all request's
 * Start axios interceptors //superadmin
 */

let configObject = null;

/////// Add a request interceptor
axios.interceptors.request.use(
    config => {
        // Do something before request is sent
        let access_token = Cookies.get("access_token");
        config.headers = { Authorization: "Bearer " + access_token };
        // console.log("config @ interceptors request", config);
        configObject = config;
        return config;
    },
    error => {
        // Do something with request error
        console.log("error @ request", error);
        return Promise.reject(error);
    }
);

/**
 * if back end give a 401 response(unauthorised response), this interceptor will call to the
 * refresh token API and set it to the cookies. and callback to the
 * last unauthorized API.
 */
//////// Add a response interceptor
let refresh_token = Cookies.get("refresh_token");
let userName = Cookies.get("userName");

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const originalRequest = error.config;

        let requestUrl = process.env.REACT_APP_BASE_URL + process.env.REACT_APP_PREFIX + process.env.REACT_APP_MODULE_ADMIN
            + process.env.REACT_APP_OAUTH_LOGIN;

        store.dispatch(actionIndexRedux.deactivateLoader());
        if (error.response.status === 401 && !originalRequest._retry && requestUrl != configObject.url) {
            originalRequest._retry = true;

            store.dispatch(actionIndexRedux.activateLoader());

            return axios.post(
                process.env.REACT_APP_BASE_URL +
                process.env.REACT_APP_PREFIX +
                process.env.REACT_APP_MODULE_ADMIN +
                process.env.REACT_APP_OAUTH_REFRESH,
                {
                    userName: userName,
                    refreshToken: refresh_token
                }
            )
                .then(newResponse => {
                    store.dispatch(actionIndexRedux.deactivateLoader());
                    Cookies.remove("access_token", {
                        path: process.env.REACT_APP_FRONT_END_BASE_URL
                    });
                    Cookies.set("access_token", newResponse.data.access_token, {
                        expires: 1,
                        path:process.env.REACT_APP_FRONT_END_BASE_URL
                    });
                    // this.props.deactivateLoader();
                    axios.defaults.headers.common["Authorization"] =
                        "Bearer " + newResponse.data.access_token;
                    originalRequest.headers["Authorization"] =
                        "Bearer " + newResponse.data.access_token;
                    return axios(originalRequest);
                });
        } else if (error.response.status === 408) {
            // console.log("error.response.status === 408");

            window.history.pushState(process.env.REACT_APP_FRONT_END_BASE_URL, "root", "/session-time-out");

            Cookies.remove("access_token", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            Cookies.remove("refresh_token", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            Cookies.remove("expires_in", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            Cookies.remove("scope", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            Cookies.remove("userId", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            Cookies.remove("userName", {
                path: process.env.REACT_APP_FRONT_END_BASE_URL
            });
            //after changed the url, you must shange the redux state, if not, ui will not render.
            // Import:this redux action call have done, out side of react component
            store.dispatch(actionIndexRedux.changeLogOutStatus({}));
        }
        return Promise.reject(error);
    }
);

/**
 * end axios interceptors
 */

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let loader = this.props.loaderStatus;
        return (
            <div className="theme-midnightBlue ">
            <Loader loading={loader.loaderStatus} />
        {/* <ErrorBoundary> */}
         <LoginController {...this.props} {...this.state} {...this.functions} />
        {/* </ErrorBoundary> */}
    </div>
    );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatching actions returned by action creators
        activateLoader: () => dispatch(activateLoader()),
        deactivateLoader: () => dispatch(deactivateLoader()),
        logOutAction: () => dispatch(logOutAction())
    };
};

const mapStateToProps = state => ({
    loaderStatus: state.loaderReducerTest
});

export default connect(mapStateToProps, mapDispatchToProps)(App);


