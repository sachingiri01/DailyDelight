import { Search } from "lucide-react";

const backend_domain ='http://127.0.0.1:8000'
const fetch_api ={
    feed_post :{
        url:`${backend_domain}/feed_posts`,
        method:'get'
    },  get_user :{
        url:`${backend_domain}/user/`,
        method:'get'
    },
    users:{
        url:`${backend_domain}/all_users`,
        method:'get'
    },
    search_user:{
        url:`${backend_domain}/search_user`,
        method:'get'
    },signup:{
        url:`http://127.0.0.1:8000/signup/`,
        method:'post'
    },login:{
        url:`http://127.0.0.1:8000/login/`,
        method:'post'
    }
}
export default fetch_api;