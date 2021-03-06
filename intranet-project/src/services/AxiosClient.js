
import axios from 'axios';
import router from '../main';
import LoginService from "@/services/LoginService";

const axiosClient = axios.create({
    //when in docker change to 'http://127.0.0.1:80/api' 
    baseURL: 'http://localhost:8080/api' //TODO Change when in production
});

axiosClient.interceptors.request.use(
    function (config) {
        config.headers["X-CSRF-TOKEN"] = document.cookie.match('(^|;)\\s*' + 'csrf_access_token' + '\\s*=\\s*([^;]+)')?.pop();
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((config) => {
    return config;
},
    (error) => {
        // catch request timeouts expiring
        if (error.code == "ECONNABORTED") {
            return Promise.reject(error);
        }
        // catch JWT auth expiring
        if (error.response.status == 401 && localStorage.getItem("loggedIn") && !router.currentRoute.value.fullPath.includes('/login')) {
            LoginService.logout();
            window.location.reload();
        }
        // catch users accessing pages they shouldn't, without letting them know the page exists
        if (error.response.status == 403) {
            if (localStorage.getItem("access_status") == 0) {
                router.push({ path: "/no_access" });
                return;
            } else {
                router.push({ path: "/404" });
            }
        }
        return Promise.reject(error);
    });

export default axiosClient
