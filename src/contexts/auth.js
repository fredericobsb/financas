import React, { createContext, useState } from 'react';
import api from '../services/api';
import {useNavigation} from '@react-navigation/native';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(false);

  const navigation = useNavigation();

  async function signUp(email, password, nome){
    setLoadingAuth(true);
    console.log('----------- cchecando nome == ', nome);
    console.log('----------- cchecando email == ', email);
    console.log('----------- cchecando password == ', password);
    
    try{
        const response = await api.post('/users', {
          name:nome,
          password:password,
          email:email
        })
        setLoadingAuth(false);
        navigation.goBack();
    }catch(err){
      console.log('------ deu pau no cadastro. erro ==> ', err);
      setLoadingAuth(false);
    } 
  }

  async function signIn(email,password){
   console.log('--------- entrei na signIn de contexts.auth');
   console.log('--------- email ==>', email);
   console.log('--------- password ==>', password);
    setLoadingAuth(true);
    try{
       const response = await api.post('/login', {
        email:email,
        password:password
       })
       const {id, name, token} = response.data;
       const data = {
          id, name, token, email
       };
       console.log('--------- ANTES DO HEADES 2345');
       api.defaults.headers['Authorization'] = `Bearer ${token}`;
       setUser({id, name, email});
       setLoadingAuth(false);
       console.log('------------- token ==> ', data.token);

    }catch(err){
      setLoadingAuth(false);
      console.log('------------- deu pau nessa porra. ERRO ==> ', err);
    }
}

  return(
    <AuthContext.Provider value={{ signed: !!user, signUp, signIn, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;