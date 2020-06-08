import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Colors } from 'apollo-react-native';

class FormHeader extends Component {
  render() {
    const { icon, iconColor, label, title, controls } = this.props;
    const iconName = icon ? icon : 'account';

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: iconColor ? iconColor : Colors.themeGrey[600],
            },
          ]}
        >
          <Icon name={iconName} size={32} color={'#fff'} />
        </View>
        <View style={styles.textContainer}>
          {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {controls &&
            controls.map(({ label, color, mode, onPress, disabled }, i) => {
              return (
                <Button
                  key={i}
                  onPress={onPress}
                  size="small"
                  mode={mode ? mode : 'outlined'}
                  color={color ? color : 'secondary'}
                  style={styles.button}
                  disabled={disabled}
                >
                  {label}
                </Button>
              );
            })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.themeGrey[50],
    borderWidth: 1,
    borderColor: Colors.themeGrey[200],
    padding: 12,
    alignItems: 'center',
  },
  icon: {
    borderRadius: 3,
    marginRight: 10,
    height: 35,
    width: 35,
    alignItems: 'center',
  },
  textContainer: {
    flexGrow: 1,
  },
  label: {
    letterSpacing: 2,
    color: Colors.black[400],
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  button: {
    marginLeft: 7,
  },
});

export default FormHeader;
