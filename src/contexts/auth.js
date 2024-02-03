import React, { createContext, useEffect, useState } from 'react';
import api from '../services/api';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() =>{
    async function loadStorage(){
      const storageUser = await AsyncStorage.getItem('@finToken');
      if(storageUser){
        console.log( 'user do local storage no efffects ==> ', storageUser)
        const response = await api.get('/me', {
          headers: {
            'Authorization': `Bearer ${storageUser}`
          }
        })
        .catch(() =>{
          console.log('------------catch do get da api');
          setUser(null);
        })
        api.defaults.headers['Authorization'] = `Bearer ${storageUser}`;
        setUser(response.data);
        console.log('-------- setei o usuario buscado da api no setUser ==> ', response.data);
        console.log('----------- setei nome do usuario no user do contexto => ', {user});
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  },[])

  async function signUp(email, password, nome){
    setLoadingAuth(true);
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
       //salva os dados do usuario logado no Storage.
       await AsyncStorage.setItem('@finToken', token);

       api.defaults.headers['Authorization'] = `Bearer ${token}`;
       setUser({id, name, email});
       setLoadingAuth(false);
       console.log('------------- token ==> ', data.token);

    }catch(err){
      setLoadingAuth(false);
      console.log('------------- deu pau nessa porra. ERRO ==> ', err);
    }
  }

  async function signOut(){
    await AsyncStorage.clear()
      .then(() =>{
        console.log('---------- logout FUNFOU! -------------');
        setUser(null);
      })
  }

  return(
    <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, loadingAuth, loading, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;