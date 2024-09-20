import config from "../config/index";

import Home from "../components/pages/Dashboard";
import Login from "../components/pages/Auth/Login";
import ForgotPassword from "../components/pages/Auth/ForgotPassWord";
import ResetPassword from "../components/pages/Auth/ResetPassword";


const privateRoutes = [
     // Dashboard routes
     { path: config.routes.home, component: Home },

     
];

const authenticationRoutes = [
    { path: config.routes.login, component: Login },
    // { path: config.routes.register, component: Register },
    { path: config.routes.forgot_password, component: ForgotPassword },
    { path: config.routes.reset_password, component: ResetPassword },
    // { path: config.routes.profile, component: Profile },
];

export { privateRoutes, authenticationRoutes };