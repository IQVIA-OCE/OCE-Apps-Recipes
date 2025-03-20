import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, themeGrey, withTheme, Text } from '@oce-apps/apollo-react-native';
import color from 'color';

class FormHeader extends Component {
  render() {
    const {
      icon,
      iconColor,
      label,
      title,
      controls,
      children,
      theme,
    } = this.props;
    const iconName = icon ? icon : 'account';
    let borderColor = themeGrey[200];
    let labelColor = color(theme.colors.text).darken(0.85).hex();

    if (theme.dark) {
      borderColor = "none";
      labelColor = color(theme.colors.text).darken(0.12).hex();
    }

    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background, borderColor }]}
      >
        <View
          style={[
            styles.icon,
            {
              backgroundColor: iconColor ? iconColor : themeGrey[600],
            },
          ]}
        >
          <Icon name={iconName} size={32} color={'#fff'} />
        </View>
        <View style={styles.textContainer}>
          {label && (
            <Text style={[styles.label, { color: labelColor }]}>
              {label.toUpperCase()}
            </Text>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View>{children}</View>
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
    borderWidth: 1,
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

export default withTheme(FormHeader);
