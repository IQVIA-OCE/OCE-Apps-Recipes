
import { NativeModules, findNodeHandle } from 'react-native';

export const splitStringFromArray = (arr, val) => {
    return arr.map((key) => `'${key[val]}'`).join(",")
}

export const splitStringByDelimiter = (str, delimiter) => {
    return str.split(delimiter).filter((val) => val != '').map(s => `'${s}'`).join(',');
}


export function getRectForRef(ref) {
    return new Promise((resolve, reject) => {
        if (ref.current) {

            NativeModules.UIManager.measure(
                findNodeHandle(ref.current),
                (_1, _2, width, height, x, y) =>
                    resolve({ x, y, width, height })
            );
        } else {
            reject(new Error('getRectForRef - current is not set'));
        }
    });
}

export const calcTopPostion = (position, childElement) => {
    const arrowPostionY = Math.round(childElement.y);
    const iconPositionY = Math.round(position.y);
    const diff = iconPositionY - arrowPostionY;
    const iconHeight = Math.round(position.height);
    const top = Math.round((diff + (iconHeight / 2) - 6.5))
    return top;
}

export const calcRightPosition = (position) => {
    const arrowIconWidth = Math.round(position.width);
    const iconFontSize = 32; //defined in icon size
    const iconRightPadding = 15; // defined in style
    const right = Math.round((arrowIconWidth / 2) + iconFontSize + iconRightPadding)
    return right;
}

export const mapAccessLevels = (accessLevels) => {
    return accessLevels.fields.filter((al) => al.name === 'AccountAccessLevel')[0].picklistValues;
}