import { Button, useTheme } from 'apollo-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Header = ({
  onCancel,
  onSave,
  title,
  cancelText = 'Cancel',
  saveText = 'Save',
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const gradientColors = theme.dark ? [theme.colors.background, theme.colors.surface] : ['#250056', '#0076ae'];

  const gradientOptions = {
    colors: gradientColors,
    start: { x: 0, y: 0.8 },
    end: { x: 0.8, y: 0.8 },
  };

  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient {...gradientOptions} style={styles.container}>
          <Text
            style={styles.cancel}
            onPress={() => onCancel || navigation.goBack()}
            testID="HeaderCancelButton"
          >
            {cancelText}
          </Text>
        <Text style={styles.title}>{title || ''}</Text>
        <Button
          testID="HeaderSaveButton"
          color={theme.dark ? 'primary' : 'tertiary'}
          mode="contained"
          size="small"
          onPress={onSave || null}
        >
          {saveText}
        </Button>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  cancel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Header;
