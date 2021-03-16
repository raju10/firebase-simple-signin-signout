import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser , setNewUser] = useState(false)
const [users, setUser] = useState({
  isSignIn : false,
  name  : "",
  email : "",
  password : "",
  photo : ""
 
  
})


  const provider = new firebase.auth.GoogleAuthProvider();

  const handelSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user
      const signInUser = {
        isSignIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(signInUser)

      console.log(displayName, photoURL, email)
    })
    .catch(err => {
      console.log(err)
      console.log(err.message)
    })
  }
// sign out 
  const handelSignOut =() =>{
    firebase.auth().signOut()
    .then(res => {  
     const signOutUser = {
      isSignIn : false,
      name  : "",
      email : "",
      photo : "",
      error : ""
     }
     setUser(signOutUser)
     
    })
    .catch(err => {
      console.log(err)
    })
  }
  ///

  /// login

  const handelBlur =(e) =>{
    
    let isFormValid = true;
    if(e.target.name === "email"){
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value)
       isFormValid = isEmailValid

    }
    if(e.target.name === "password"){
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNum = /\d{1}/.test(e.target.value)
       isFormValid = isPasswordValid && passwordHasNum
   
    }
    if(isFormValid){
       const newUserInfo = {...users}
       newUserInfo[e.target.name] = e.target.value
       setUser(newUserInfo)
    }
  }
  // submit 
  const handelSubmit =(e) =>{
    console.log(users.email , users.password , users.name)
   //sign up
    if(newUser && users.email && users.password){
       console.log('submatting')
       firebase.auth().createUserWithEmailAndPassword(users.email, users.password)
       .then(res => {
      
        console.log(res)
        
      })
       .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
         const newUserInfo = {...users}
        newUserInfo.error = error.errorMessage;
        setUser(newUserInfo)
        
         console.log("err", errorCode, errorMessage)
      });
    }
    // log in / sign in

    if(!newUser && users.email & users.password){
         firebase.auth().signInWithEmailAndPassword(users.email, users.password)
         .then(res => {
            console.log(res)
        })
         .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("errrr", errorCode,errorMessage)
        });
    }
    ///////
    e.preventDefault()
    
  }


  return (
    <div className="App">
      {
        users.isSignIn === true ? <button onClick={handelSignOut}>Sign out</button> :
        <button onClick={handelSignIn}>Sign In</button> 
      }

      
      {
        users.isSignIn === true && <div>
            <h2>Welcome , {users.name}</h2>
            <p>Your email : {users.email}</p>
            <img src={users.photo} alt=""/>
        </div> 
      }
      <h2>Our Own Authencation system</h2>
      <p>Email : {users.email}</p>
      <p>password : {users.password}</p>
      <p>Confrom password : {users.password}</p>
      <p>Name : {users.name}</p>

      <input type="checkbox" name="" id="" onChange={()=>setNewUser(!newUser)}/>
      <label htmlFor="newUser">New user sign up</label>
    <form onSubmit={handelSubmit} >    
      {newUser && <input type="text" name="name" onBlur={handelBlur} placeholder="Your name"/>}
      <br/>
      <input type="text" name="email" id="" onBlur={handelBlur} placeholder="Your email addres" required/>
      <br/>
      <input type="password" name="password" id="" onBlur={handelBlur} placeholder=" Your password" required/>
      <br/>
      {/* <input type="password" name="password" id="" onBlur={handelBlur} placeholder=" Confrom password" required/>
      <br/> */}
      <input type="submit" value="Submit"/>
     

    </form>
        <p style={{color:"red"}}>{users.error}</p>
    </div>
  );
}

export default App;
