// @flow


import invariant from 'invariant'
import warnOnce from "react-native/Libraries/Utilities/warnOnce";

export const deprecateProperty = (
  target: any,
  oldProp: string,
  newProp: string
): any => {
  return new Proxy(target, {
    get(target, key) {
      if (key === oldProp) {
        // eslint-disable-next-line no-console
        console.warn(`${oldProp} is deprecated. Please, use ${newProp} instead`)
      }

      return Reflect.get(...arguments)
    },
  })
}

export const exportDeprecate = (
  obj: Object,
  name: string,
  identifier: string,
  message: string,
  callback: () => Object
) => {
  Object.defineProperty(obj, name, {
    configurable: true,
    get() {
      warnOnce(identifier, message)
      return callback()
    },
  })
}

export const exportErrorDeprecate = (
  obj: any,
  name: string,
  message: string
) => {
  Object.defineProperty(obj, name, {
    configurable: true,
    // eslint-disable-next-line getter-return
    get() {
      invariant(false, message)
    },
  })
}
