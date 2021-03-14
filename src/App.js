import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
const [users, setUser] = useState({
  isSignIn : false,
  name  : "",
  email : "",
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
      photo : ""
     }
     setUser(signOutUser)
     
    })
    .catch(err => {
      console.log(err)
    })
  }
  ///


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
    
    </div>
  );
}

export default App;
