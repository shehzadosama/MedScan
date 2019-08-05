import AsyncStorage from '@react-native-community/async-storage';
import {Platform, StatusBar} from 'react-native';

// code: '',
// codeType: '',
// timestamp: 0,
// latitude: 0,
// longitude: 0,
// detectionCount: 0

export var strings = {
    app_name_version: "MedScan v1.0b",
}

export var statusbarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
export var mainTopPadding = Platform.OS === 'ios' ? 20 : 0;

var _codeList = [];
var _setting = {
    batchScan: false,
    delimiter: ',',
};


export function getBarcodes() {return _codeList};
export function addBarcode(code) {
    _codeList.push(code);
    saveToStorage("Barcodes", _codeList);
}
export function setBarcodes(codes) {
    _codeList = codes;
    saveToStorage("Barcodes", _codeList);
};

export function getSetting() {return _setting};
export function setOneSetting(key, val) {
    _setting[key] = val;
    saveToStorage("Settings", _setting);
}
export function setSetting(setting) {
    _setting = setting;
    saveToStorage("Settings", _setting);
}

export async function storeData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch(error) {
        console.log('Saving data \"%s\" is failed.', key);
    }
}

export async function loadData(key) {
    try {
        const value = await AsyncStorage.getItem(key)
        return value;
      } catch(e) {
        // error reading value
        console.log("Error in loading data \"%s\"", key);
        return undefined;
      }
}

export async function removeFromStorage(key) {
    try {
        await AsyncStorage.removeItem(key);
        console.log("Removed Info:", key);
    } catch(error) {
        console.log("Removing Info Failed: ", error.message);
    }
}

export async function getFromStorage(key) {
    try {
        const info = await AsyncStorage.getItem(key);
        if (info) {
            // logged before, so go to users scene
            // console.log('Got Info from Storage', key, info);
            let result = await JSON.parse(info);
            return result;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function saveToStorage(key, info) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(info));
        console.log("Saved Info:", key, info);
    } catch(error) {
        console.log("Saving Info Failed: ", error.message);
    }
}

export async function loadAppData() {
    try {
        var codes = await getFromStorage("Barcodes");
        if (codes) setBarcodes(codes);
        var setting = await getFromStorage("Settings")
        if (setting) setSetting(setting);
    } catch(error) {
        console.log("Error in Loading SettingValue: %s", error);
    }
}

export function findItemWithKeyInArray(key, val, arr) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i][key] == val)
            return i;
    }
    return -1;
}
