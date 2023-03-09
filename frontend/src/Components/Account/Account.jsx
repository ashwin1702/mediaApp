import { Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProfile, getMyPosts, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import {Avatar} from '@mui/material';
import { useAlert } from 'react-alert';
import "./Account.css";
import { Link } from 'react-router-dom';
import User from '../User/User';
const Account = () => {
    const dispatch = useDispatch();
    const alert  = useAlert();

    const {user,loading:userLoading} = useSelector((state)=>state.user);
    const {loading,error,posts} = useSelector((state)=>state.myPosts)
    const {error:likeError,message,loading:deleteLoading} = useSelector((state)=>state.like);

    const [followersToggle,setFollowersToggle] = useState(false);
    const [followingToggle,setFollowingToggle] = useState(false);

    const logoutHandler = async()=>{
       await  dispatch(logoutUser());
       alert.success("Logged Out Successfully");
    }
    const deleteProfileHandler = async()=>{
        await dispatch(deleteProfile());
        dispatch(logoutUser());
    }


    useEffect(() => {
        dispatch(getMyPosts());
    }, [dispatch])
    useEffect(() => {
        if(error){
          alert.error(error);
          dispatch({type: "clearError"});
        }
       
        if(likeError){
            alert.error(likeError);
            dispatch({type: "clearError"});
          }
        if(message){
          alert.success(message);
          dispatch({type: "clearMessage"});
        }
      }, [alert,error,likeError,message,dispatch]);
  return loading===true || userLoading===true ?(
        <Loader/>
    ) : (
        <div className='account'>
        <div className="accountleft">
        {
            posts && posts.length > 0 ? posts.map((post)=>(
                <Post 
                key={post._id}
                postId={post._id}
                caption={post.caption}
                postImage={post.image.url}
                likes={post.likes}
                comments={post.comments}
                ownerImage={post.owner.avatar.url}
                ownerName={post.owner.name}
                ownerId={post.owner._id}
                isAccount={true}
                isDelete={true}
                />
            )) : (<Typography variant='h6'>No Post</Typography>
            )
        }
        </div>
        <div className="accountright">
            <Avatar src={user.avatar.url}
            sx={{height:"8vmax",width:"8vmax"}}/>
            <Typography variant='h5'>{user.name}</Typography>
            <div>
                <button onClick={()=>setFollowersToggle(!followersToggle)}>
                    <Typography>Followers</Typography>
                </button>
                <Typography>{user.followers.length}</Typography>
            </div>
            <div>
                <button onClick={()=>setFollowingToggle(!followingToggle)}>
                    <Typography>Following</Typography>
                </button>
                <Typography>{user.following.length}</Typography>
            </div>
            <div>
                <Typography>Post</Typography>
                <Typography>{user.posts.length}</Typography>
            </div>

            <Button onClick={logoutHandler} variant='contained'>Logout</Button>
            <Link to="/update/profile">Edit Profile</Link>
            <Link to="/update/password">Update Password</Link>

            <Button disabled={deleteLoading} onClick={deleteProfileHandler} variant="text"
          style={{ color: "red", margin: "2vmax" }}>Delete My Profile</Button>

<Dialog open = {followersToggle} onClose={()=> setFollowersToggle(!followersToggle)}>
            <div className="DialogBox">
                <Typography variant='h4'>Followers </Typography>
                {
                    user && user.followers.length > 0 ? user.followers.map((follower)=>((
                        <User
                        key={follower._id}
                        userId={follower._id}
                        name={follower.name}
                        avatar={follower.avatar.url}/>
                    ))) : <Typography style={{margin:"2vmax"}}>You Have No Followers</Typography>
                }
            </div>
        </Dialog>

        <Dialog open = {followingToggle} onClose={()=> setFollowingToggle(!followingToggle)}>
            <div className="DialogBox">
                <Typography variant='h4'>Following </Typography>
                {
                    user && user.following.length > 0 ? user.following.map((following)=>((
                        <User
                        key={following._id}
                        userId={following._id}
                        name={following.name}
                        avatar={following.avatar.url}/>
                    ))) : <Typography style={{margin:"2vmax"}}>You Have No following</Typography>
                }
            </div>
        </Dialog>
        </div>
    </div>
    )
  
};

export default Account


