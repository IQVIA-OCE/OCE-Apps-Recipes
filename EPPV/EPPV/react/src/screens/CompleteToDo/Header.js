import { Button, useTheme } from '@oce-apps/apollo-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from 'color';

export const Header = ({ onComplete, isSubmitting }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const borderSeparatorColor = theme.dark
    ? color(theme.colors.placeholder).darken(0.7).hex()
    : color(theme.colors.surface).darken(0.1).hex();

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: borderSeparatorColor,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        testID="headerBackButton"
        disabled={isSubmitting}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="chevron-left"
            size={40}
            style={[styles.backButtonIcon, { color: theme.colors.primary }]}
          />
          <Text
            style={[styles.backButtonText, { color: theme.colors.primary }]}
          >
            Back
          </Text>
        </View>
      </TouchableOpacity>
      <Button
        testID={'completeButton'}
        onPress={onComplete}
        mode={'contained'}
        loading={isSubmitting}
        disabled={isSubmitting}
        icon={'check-circle'}
        touchableStyle={styles.completeButtonTouchable}
        style={{
          borderWidth: 0,
        }}
      >
        {'Complete'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
  },
  backButtonIcon: {
    borderWidth: 0,
  },
  completeButtonTouchable: {
    backgroundColor: '#00C221',
    shadowColor: 'transparent',
    borderWidth: 0,
    elevation: 10,
    borderColor: 'red',
  },
});
