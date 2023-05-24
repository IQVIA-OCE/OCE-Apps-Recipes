import {
  DarkTheme,
  DefaultTheme,
  Provider as ApolloProvider,
} from 'apollo-react-native';
import { sfNetAPI, layoutBridge } from 'oce-apps-bridges';
import React from 'react';
import { useColorScheme, Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CompleteToDo } from './src/screens/CompleteToDo/CompleteToDo';
import { ToDoScreen } from './src/screens/ToDoScreen/ToDoScreen';

Icon.loadFont();
sfNetAPI.enablePromises();

export const App = ({ instanceId }) => {
  const colorScheme = useColorScheme();
  let preferredTheme = DefaultTheme;

  if (Platform.OS === 'ios') {
    preferredTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  }

  const Stack = createStackNavigator();

  if (instanceId) {
    layoutBridge.setHeight(600);
  } 

  const Navigation = () => {
    return (
      <Stack.Navigator
        initialRouteName={'ToDoScreen'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ToDoScreen" component={ToDoScreen} />
        <Stack.Screen name="CompleteToDo" component={CompleteToDo} />
      </Stack.Navigator>
    );
  };

  return (
    <ApolloProvider theme={preferredTheme}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </ApolloProvider>
  );
};
