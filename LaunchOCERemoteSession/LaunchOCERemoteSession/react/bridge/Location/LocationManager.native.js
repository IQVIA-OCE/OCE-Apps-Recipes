

import { NativeEventEmitter, NativeModules } from 'react-native';
const { LocationBridge } = NativeModules;

class LocationManager {

    LocationManagerEmitter = undefined

	lastKnownLocation(): Promise<Object> {
		return LocationBridge.deviceLastKnownLocation()
	}

	getLocationStatus(): Promise<Object> {
		return LocationBridge.getLocationStatus()
	}

	addLocationListener(callback: function): Promise<Object> {
        try {
        	if (!this.LocationManagerEmitter) {
                this.LocationManagerEmitter = new NativeEventEmitter(LocationBridge);
            }

            const listener = this.LocationManagerEmitter.addListener('LocationEvent', (body) => {console.log(body), callback(body)});
            return new Promise((resolve, reject) => {
                resolve(listener);
            });
        } catch(error) {
        	return new Promise((resolve, reject) => {
          		reject(error);
          	});
        }
    }

    removeLocationListener(listener): Promise<Object> {
        try {
        	const subscriptionsForType = listener.subscriber._subscriptionsForType[listener.eventType];
            if (subscriptionsForType) {
            	if (subscriptionsForType[listener.key]) {
                    listener.remove()
                } else {
                    throw "Listener already removed"
                }
            } else {
               	throw "There are no subscriptions for event " + listener.eventType
            }
            return new Promise((resolve, reject) => {
                resolve(true);
            })
        } catch(error) {
            return new Promise((resolve, reject) => {
                reject(error);
            })
        }
    }

}

export const locationManager = new LocationManager();
