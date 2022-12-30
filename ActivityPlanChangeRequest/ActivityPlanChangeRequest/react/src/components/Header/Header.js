import { Button } from 'apollo-react-native/lib/module';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';

const gradientOptions = {
  colors: ['#250056', '#0076ae'],
  start: { x: 0, y: 0.8 },
  end: { x: 0.8, y: 0.8 },
};

const Header = ({
  onCancel,
  onSave,
  title,
  navigation,
  cancelText = 'Cancel',
  saveText = 'Save',
}) => {
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
          color="tertiary"
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

export default withNavigation(Header);
