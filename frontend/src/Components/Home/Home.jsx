import React, { useEffect } from 'react'
import Post from '../Post/Post'
import User from '../User/User'
import "./Home.css";
import {useDispatch, useSelector} from 'react-redux';
import { getAllUsers, getFollowingPost } from '../../Actions/User';
import Loader from "../Loader/Loader"
import { Typography } from '@mui/material';
import { useAlert } from 'react-alert';
const Home = () => {
  const dispatch = useDispatch();
  const {posts,loading,error} = useSelector((state)=>state.postOfFollowing);
  const {users,loading:usersLoading} = useSelector((state)=>state.allUsers);
  const {error:likeError,message} = useSelector((state)=>state.like);
  const alert  = useAlert();
  
  useEffect(() => {
    dispatch(getFollowingPost());
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    if(likeError){
      alert.error(likeError);
      dispatch({type: "clearError"});
    }
    if(error){
      alert.error(error);
      dispatch({type: "clearError"});
    }
    if(message){
      alert.success(message);
      dispatch({type: "clearMessage"});
    }
  }, [alert,error,likeError,message,dispatch]);
  return loading ===true || usersLoading===true ?(
     <Loader/> ) : (
      <div className='home'>
    <div className="homeleft">
    {posts && posts.length>0 ? (posts.map((post)=>(
      <Post 
      key={post._id}
      postId = {post._id}
     caption={post.caption}
    comments={post.comments}
    likes = {post.likes}
    ownerImage={post.owner.avatar.url}
    ownerName={post.owner.name}
    ownerId={post.owner._id}
    postImage={post.image.url}
     />
    ))):<Typography variant='h6'>No Posts Yet</Typography>}
    </div>
    <div className="homeright">
      {users && users.length>0 ? (users.map((user)=>(
        <User key={user._id} userId={user._id} 
        name = {user.name}
        avatar ={user.avatar.url} />
      ))): <Typography>No User Found</Typography>}
    </div>
  </div>
     ) 
   
}

export default Home