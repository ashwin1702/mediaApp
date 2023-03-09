import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../../Actions/User';
import "./Register.css"
const Register = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const alert = useAlert();
    const dispatch = useDispatch();
    const handleImageChange = (e)=>{
        const file=e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file);
        Reader.onload=()=>{
            if(Reader.readyState===2){
                setAvatar(Reader.result);
            }
        } 
    };

    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(registerUser(name,email,password,avatar));
    }

    const {loading,error} = useSelector((state)=>state.user);

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({type:"clearError"});
          }
    },[dispatch,alert,error])

  return (
    <div className='register'>
        <form className="registerForm" onSubmit={submitHandler}>

        <Typography variant='h3' style={{padding:'2vmax'}}>Social App</Typography>

        <Avatar
        src={avatar}
        alt="user"
        sx={{height:"10vmax",width:"10vmax"}} />

        <input type="file" 
        accept='image/*'
        onChange={handleImageChange} />


        <input type="text" 
        value={name}
        required
        className="registerInputs"
        placeholder="Name" 
        onChange={(e)=>setName(e.target.value)}/>

        <input type="email" 
        placeholder='Email' 
        required 
        className="registerInputs"
        value={email} 
        onChange={(e)=>setEmail(e.target.value)}/>
        
        <input 
        className="registerInputs"
        type="password" 
        placeholder='Password' 
        required 
        value={password} 
        onChange={(e)=>setPassword(e.target.value)}/>

        <Link to="/"><Typography>Already Signed Up??</Typography></Link>

        <Button disabled={loading} type='submit'>Sign Up</Button>

        </form>
    </div>
  )
}

export default Register