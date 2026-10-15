import React, { useCallback, useContext, useEffect, useRef } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ToDoListContext } from '../ToDoList/ToDoListProvider';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SwipeableItem = ({
  children,
  itemKey,
  leftButtons = [],
  rightButtons = [],
}) => {
  const swipeableRef = useRef(null);
  const { openedItemKey, setOpenedItemKey } = useContext(ToDoListContext);

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const openRight = () => {
    if (swipeableRef.current) {
      swipeableRef.current.openRight();
    }
  };

  const handleSwipe = () => {
    setOpenedItemKey(itemKey);
  };

  const handlePress = (onPress) => {
    close();
    if (onPress) onPress();
  };

  useEffect(() => {
    if (openedItemKey && itemKey !== openedItemKey) {
      close();
    }
  }, [itemKey, openedItemKey]);

  const renderButtons = useCallback((buttons) => {
    return (
      <>
        {buttons.map(({ key, onPress, text }) => {
          return (
            <TouchableOpacity
              onPress={() => handlePress(onPress)}
              key={key}
              style={styles.swipeButton}
            >
              <View style={{ marginBottom: 5 }}>
                <MaterialIcon
                  name="check-circle-outline"
                  color={'white'}
                  size={38}
                />
              </View>
              <View>
                <Text style={styles.buttonText}>{text}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  }, []);

  const renderRightButtons = useCallback(() => {
    return renderButtons(rightButtons);
  }, [rightButtons]);

  const renderLeftButtons = useCallback(() => {
    return renderButtons(leftButtons);
  }, [leftButtons]);


  return (
    <Swipeable
      childrenContainerStyle={{
        position: 'relative',
      }}
      ref={swipeableRef}
      friction={1.3}
      onSwipeableWillOpen={handleSwipe}
      renderRightActions={renderRightButtons}
      renderLeftActions={renderLeftButtons}
      overshootFriction={20}
      key={itemKey}
    >
      {React.cloneElement(children, {openRight})}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeButton: {
    backgroundColor: '#00C221',
    paddingHorizontal: 10,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
