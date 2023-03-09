import {configureStore} from "@reduxjs/toolkit";
import { likeReducer, myPostsReducer, userPostsReducer } from "./Reducers/Post";
import { allUsersReducer, postOfFollowingUser, userProfileReducer, userReducer } from "./Reducers/User";
// const initialState = {}
const store = configureStore({
    reducer:{
        user:userReducer,
        postOfFollowing:postOfFollowingUser,
        allUsers:allUsersReducer,
        like:likeReducer,
        myPosts:myPostsReducer,
        userProfile:userProfileReducer,
        userPosts:userPostsReducer,
    }
});

export default store;