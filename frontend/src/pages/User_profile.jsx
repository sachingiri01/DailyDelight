import React, { lazy } from 'react';

import { useState ,useEffect ,useRef,useContext } from 'react';
import '../custom.css'
import heart_like from '../assets/like.svg'
import heart_unlike from '../assets/unlike.svg'
import fetch_api from '../fetch/fetch'
import { useNavigate,useLocation } from 'react-router-dom';
import Searching from "../components/searching"
import unlike from "../assets/unlike.svg"
import demo from '../assets/demo.jpg'
import { UserContext } from '../context/Usercontext';
import { Unlink } from 'lucide-react';
import Comments from '../components/Comments';
const HomePage = () => {
  const nevigate=useNavigate();
  const [admin, setadmin] = useState([])
  const [user_id, setuser_id] = useState('')
  const [user_feed, setuser_feed] = useState([])
  const [trend_user, settrend_user] = useState([])
  const [loading, setloading] = useState(true)
  const { user, logout } = useContext(UserContext);
  const [friends_sent_req, setfriends_sent_req] = useState(0)
  const profile = {
    name: 'John Doe',
    bio: 'Software Engineer at ABC Company',
    profilePicture: 'https://example.com/john.jpg',
    stats: {
      posts: 100,
      followers: 1000,
      following: 500,
    },
  };
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get('user_id'); // Get the 'user_id' parameter from the query string
  };
  const handle_redirect=(id)=>{
    nevigate(`/user_profile?user_id=${admin.user_id}`);
}
  
   const user_id_id = getQueryParams();
   //("getting user_id ",user_id_id);
   
  const feed_post=async()=>{
    const response=await fetch("http://localhost:3000/feed_posts_user",{
      method:"post",
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user_id_id }),
    
})
const res=await response.json();

if(res.Success){

  setuser_feed(res.data); 
}
  }

  const report=async(post_id)=>{
    const confirmed=confirm("You really want to report?")
    if(!confirmed) return; 
    const user_id=getQueryParams();

    const response = await fetch('http://localhost:3000/create-report', {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({post_id:post_id?post_id:null,reported_user_id:user_id}),
  });
  
  const res = await response.json();
  if (res.success) {
      alert(res.Message);
      // Optionally reset form fields
      setReportedUserId('');
      setPostId('');
  } else {
    alert(res.Message);
  }
  }
  

 

  const get_user=async()=>{
    const response=await fetch(fetch_api.users.url,{
      method:fetch_api.users.method,
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
    },
        })
        const res=await response.json();
    
        if(res.Success){  
          //(res);
          
          settrend_user(res.data);
        }
        
  }

   const get_user_admin = async () => {
    const response = await fetch("http://localhost:3000/user_profile", {
        method: "POST", // Ensure you use POST since you're sending a body
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id_id }), // Convert the object to a JSON string
    });

    const res = await response.json();
    
    //("admin  :   opopop   heelo   : ", res);
    
    if (res.Success) { // Check for Success instead of success (case-sensitive)
        setadmin(res.user);
        setloading(false);
    } else {
       alert("try again")
    }
}


  

  useEffect(() => {
    const fetchData = async () => {
      await feed_post();
      await get_user();
      await get_user_admin();
    };
  
    fetchData();
  }, [user_id_id]);
  

  const trendingHashtags = ['#React', '#JavaScript', '#WebDevelopment', '#Fitness', '#TechTrends'];

  const random_color_generate=()=>{
    const r=Math.random()*255;
    const g=Math.random()*255;
    const b=Math.random()*255;
    return rgb($`{r},${g},${b}`)
  }
  const mouse_enter=(e)=>{
    e.target.style.backgroundColor=random_color_generate();

  }
  const mouse_leave=(e)=>{
    e.target.style.backgroundColor='#374151';
  }
//    const Ttuser=({suggestion})=>{
//     //("this is hhh : ",suggestion);
    
//     const [acpt_sent_follow_chat, setacpt_sent_follow_chat] = useState('')
//     useEffect(() => {
//         setacpt_sent_follow_chat("Follow")
//     }, [])
    
//     const unfollow_follow=async()=>{
//       console.log("is it here");
      
//       if(acpt_sent_follow_chat=="Follow"){
//         setacpt_sent_follow_chat("Sent");
//         setfriends_sent_req(friends_sent_req+1)
//         // await sent_follow;
//       }
//       else if(acpt_sent_follow_chat=="Following"){
//         setacpt_sent_follow_chat("Follow");
//         // await unfollow;
//       }
//       else if(acpt_sent_follow_chat=='Sent'){
//         setacpt_sent_follow_chat('Follow');
//         setfriends_sent_req(friends_sent_req-1)
//         // await remove_sent_follow;
// // 
//       }else if(acpt_sent_follow_chat=='Accept'){
//         setacpt_sent_follow_chat("Following");
//         // await accpt_follow;
//       }
//     }


//     // useEffect(() => {
//     //   if (suggestion.friends_id && suggestion.friends_id.includes(admin.user_id)) {

//     //     setacpt_sent_follow_chat('Following');
//     // } else if (suggestion.request_sent_id && suggestion.request_sent_id.includes(admin.user_id)) {
       
//     //     setacpt_sent_follow_chat('Accept');
//     // } else if (suggestion.request_received_id && suggestion.request_received_id.includes(admin.user_id)) {
     
//     //     setacpt_sent_follow_chat('Sent');
//     // } else {
      
//     //     setacpt_sent_follow_chat('Follow');
//     // }
//     // }, [])
       
//     const handle_redirect=(id)=>{
//       nevigate(`/user_profile?user_id=${id}`);
//   }
  
//         return(
//           <li     className="flex hover:cursor-pointer items-center mb-3 hover:bg-slate-600 p-1 px-3 rounded-md">
//           <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
//            <img className='w-10 h-10 rounded-full' onClick={()=>handle_redirect(suggestion.user_id)} key={suggestion.user_id} src={suggestion.profile_picture} alt="" />
//           </div>
//           <span className="text-white">{suggestion.username.substring(0,11)}</span>
//           <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-lg" onClick={unfollow_follow}>
//             {acpt_sent_follow_chat}
//           </button>
//         </li>
//         )
//    }

const Ttuser = ({ suggestion }) => {
  const [acpt_sent_follow_chat, setacpt_sent_follow_chat] = useState(() => {
      // Determine the initial state based on the suggestion
      if (suggestion.friends_id && suggestion.friends_id.includes(admin.user_id)) {
          return 'Following';
      } else if (suggestion.request_sent_id && suggestion.request_sent_id.includes(admin.user_id)) {
          return 'Accept';
      } else if (suggestion.request_received_id && suggestion.request_received_id.includes(admin.user_id)) {
          return 'Sent';
      } else {
          return 'Follow';
      }
  });

  const [friends_sent_req, setfriends_sent_req] = useState(0); // Initialize this state if needed

  const unfollow_follow = async () => {
      if (acpt_sent_follow_chat === 'Follow') {
          setacpt_sent_follow_chat('Following');
          setfriends_sent_req(friends_sent_req + 1);
          // await sent_follow;
      } else if (acpt_sent_follow_chat === 'Following') {
          setacpt_sent_follow_chat('Follow');
          // await unfollow;
      } else if (acpt_sent_follow_chat === 'Following') {
          setacpt_sent_follow_chat('Follow');
          setfriends_sent_req(friends_sent_req - 1);
          // await remove_sent_follow;
      } else if (acpt_sent_follow_chat === 'Accept') {
          setacpt_sent_follow_chat('Following');
          // await accpt_follow;
      }
  };

  const handle_redirect = (id) => {
      nevigate(`/user_profile?user_id=${id}`);
  };

  return (
      <li className="flex hover:cursor-pointer items-center mb-3 hover:bg-slate-600 p-1 px-3 rounded-md">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
              <img 
                  className="w-10 h-10 rounded-full" 
                  onClick={() => handle_redirect(suggestion.user_id)} 
                  key={suggestion.user_id} 
                  src={suggestion.profile_picture} 
                  alt="" 
              />
          </div>
          <span className="text-white">{suggestion.username.substring(0, 11)}</span>
          <button 
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-lg" 
              onClick={unfollow_follow}
          >
              {acpt_sent_follow_chat}
          </button>
      </li>
  );
};


  const Posst = (post ) => {
    const [likecount, setlikecount] = useState(post.post.like_user_id.length);
    const [liked, setliked] = useState(false);
    useEffect(() => {
      const checkUserLiked = async () => {
        //(post.post.post_id);
        
          try {
              const response = await fetch('http://localhost:3000/is-liked', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ post_id: post.post.post_id }),
                  credentials:"include",
              });

              const data = await response.json();

              if (data.Success) {
                  setliked(data.isLiked);
                  //(data);
                   // Set liked status based on response
              }
          } catch (error) {
              console.error('Error checking like status:', error);
          }
      };

      checkUserLiked();
  }, []);
    const do_like = async (userId) => {
      const response = await fetch(fetch_api.like.url, {
        method: fetch_api.like.method, 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: userId }),
        credentials: 'include' 
      });
  
      const res = await response.json();
      //(res);
  
      if (res.Success) {
        setliked(true);
        setlikecount((likecount) => likecount + 1);
      } else {
        setliked(false);
        setlikecount((likecount) => likecount - 1);
      }
    };
  
    const get_like = async () => {
      try {
        await do_like(post.post.post_id);
      } catch (error) {
        console.error("Error liking the post:", error);
      }
    };
 
    const [showComments, setShowComments] = useState(false);
    const toggleComments = () => {
      setShowComments(!showComments);
  };
    
  const handle_delete_post=async()=>{
    console.log("getting hit");
    
    const response = await fetch('http://localhost:3000/delete_post', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: post.post.post_id }),
      credentials:"include",
  });
   const res=await response.json();
   if(res.success){
    alert(res.message)
   }else{
    alert(res.message)
   }

  } 
  
    return (
      <div key={post.post.user_id} className="mb-6 bg-slate-800 py-5 px-5 rounded-md">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
            <span className="text-white text-sm">{post.post.user_id.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{admin.username}</h3>
            <span className="text-white text-sm">#{post.post.category}</span>
          </div>
        </div>
        <p className="text-gray-400 mb-3">{post.post.content}</p>
        <div className="max-h-[400px] object-cover items-center flex justify-center">
          <img src={post.post.image_url} className="h-[400px]  w-full object-scale-down" alt="" />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <button className="text-red-400 hover: flex items-center gap-1">
            <img className="w-6" onClick={get_like} src={!liked ? unlike : heart_like} alt="" />
            {likecount} Like
          </button>
         
           <button 
            className="text-blue-400 hover:underline"
            onClick={toggleComments}
                   >
                💬  Comment 
                 </button>
        {showComments && <Comments postId={post.post.post_id} />}
         

          <button className="font-bold text-red-500 hover:" onClick={()=>report(post.post.post_id)}>
            Report 
          </button>

          <p className="text-purple-400 hover:text-red-400 underline hover:cursor-pointer" onClick={handle_delete_post}>Delete Post 🗑️ </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-slate-900 p-2 text-white min-h-screen flex">
      {/* About You Section */}
     {
      !loading && (
        <div className="w-1/5 rounded-md p-4 h-screen overflow-y-auto bg-slate-800">
        <div className="p-6 rounded-lg shadow-lg items-center">
          <div className="rounded-full w-20 h-20 mb-4 mx-auto bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xl"> <img  src={admin.profile_picture} className='rounded-full h-20 w-20 object-fill'  alt={admin.username.substring(0,2)} /> </span>
          </div>
          <p className="text-2xl font-bold text-center text--600 mb-2 tracking-wide">
  {admin.username}
</p>

          <p className="text-gray-400 text-center">{admin.user_id}</p>
          <div className=" justify-around text-sm mt-6 text-center">
            <p className='translate-x-2 transition-transform animate-slide duration-200 repeat text-lg font-semibold text-sky-400 underline '>Hello {admin.username}</p>
            <p>About Me : {admin.bio}</p>
           
          </div>
          <p className='text-center py-2 text-green-400'>{admin.email_id}</p>
        </div>
        <div>
          <ul className='flex flex-col gap-2'>
            <li onMouseEnter={mouse_enter} onMouseLeave={mouse_leave} className='bg-gray-600 hover:cursor-pointer hover:py-2 transition duration-400 hover:translate-x-3  rounded-md p-1 pl-2  hover:shadow-pink-700 shadow-md'>
            <button>Follow 🤝</button>
            </li>
            <li onMouseEnter={mouse_enter} onMouseLeave={mouse_leave} className='bg-gray-600  hover:cursor-pointer hover:py-2 transition hover:translate-x-3 duration-400 rounded-md p-1 pl-2  hover:shadow-green-700 shadow-md'>
              <button onClick={handle_redirect}>Your Profile 👌</button>
            </li>
            <li onMouseEnter={mouse_enter} onMouseLeave={mouse_leave} className='bg-gray-600  hover:cursor-pointer hover:py-2 transition hover:translate-x-3 duration-400 rounded-md p-1 pl-2  hover:shadow-yellow-400 shadow-md'>
              <button onClick={()=>report(false)}>Report 😒</button>
            </li>
            

            <li onMouseEnter={mouse_enter} onMouseLeave={mouse_leave} className='bg-gray-600 hover:cursor-pointer hover:py-2 transition duration-400 hover:translate-x-3 rounded-md p-1 pl-2 hover:shadow-orange-400 shadow-md'>
              <button>Message 💬</button>
            </li>

            <li onMouseEnter={mouse_enter} onMouseLeave={mouse_leave} className='bg-gray-600  hover:cursor-pointer hover:py-2 transition duration-400 hover:translate-x-3 rounded-md p-1 pl-2  hover:shadow-indigo-700 shadow-md'>
              <button>Your Posts ❤ </button>
            </li>
          </ul>
        </div>
      </div>

      )
     }
      {/* Posts Feed Section */}
      <div className="w-3/5 p-4 h-screen overflow-y-auto">
    

        <div className="rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        <div className='flex flex-col gap-2'>
        {
          loading ? (
            <div className="animate-pulse text-center text-2xl flex flex-col gap-2">Data Loading</div>
          ):(
            user_feed.map((post, index) => (
              <Posst key={post.post_id} post={post} />
          ))
          )
        }
        </div>
        </div>
      </div>

      {/* Trending Hashtags and More Section */}
      <div className="w-1/5 p-4 rounded-md overflow-y-auto bg-slate-800">
        <div className="p-6 rounded-lg bg-gray-700 hover:shadow-orange-500 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trending Hashtags</h2>
          <ul className="text-blue-400">
            {trendingHashtags.map((hashtag, index) => (
              <li key={index} className="hover:underline mb-1">{hashtag}</li>
            ))}
          </ul>
        </div>
        <div className="py-6 px-3 rounded-lg bg-gray-700 hover:shadow-indigo-500 scrool-none shadow-md mt-6 h-[350px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Suggestions for You📜 </h2>
          <ul className=''>
            {trend_user.map((suggestion) => (
                     <Ttuser suggestion={suggestion}/>
            ))}
          </ul>
        </div>
      </div>
     
    </div>
  );
};

export default HomePage;


