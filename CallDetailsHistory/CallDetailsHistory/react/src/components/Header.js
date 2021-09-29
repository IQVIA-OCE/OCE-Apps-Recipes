import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Title } from 'apollo-react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Title style={{ fontSize: 15 }}>
        Call Details History
      </Title>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Header;
