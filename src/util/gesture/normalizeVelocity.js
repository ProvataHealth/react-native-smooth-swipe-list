import { Platform } from 'react-native';

import { ANDROID_TO_IO_VELOCITY_MOD } from '../../constants';


export default function normalizeVelocity(v) {
    if (Platform.OS === 'android') {
        return v * ANDROID_TO_IO_VELOCITY_MOD;
    }
    else {
        return v;
    }
};