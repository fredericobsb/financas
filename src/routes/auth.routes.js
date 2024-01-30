import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';

const AuthStack = createNativeStackNavigator();

function AuthRoutes(){
  return(
    <AuthStack.Navigator>
      <AuthStack.Screen 
        name="SignIn"
        component={SignIn}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
      />
    </AuthStack.Navigator>
  )
}

export default AuthRoutes;