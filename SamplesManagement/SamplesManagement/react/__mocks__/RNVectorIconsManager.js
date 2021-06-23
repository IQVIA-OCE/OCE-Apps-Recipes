import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

NativeModules.RNVectorIconsManager = {};

Icon.loadFont = jest.fn();
