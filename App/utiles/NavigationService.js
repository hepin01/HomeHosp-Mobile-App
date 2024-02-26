
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

function goBack() {
    if (navigationRef.isReady()) {
        navigationRef.goBack();
    }
}

function push(...args) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(...args));
    }
}

function pop(...args) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.pop(...args));
    }
}

function popToTop(...args) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop(...args));
    }
}

export default {
    navigate,
    goBack,
    push,
    pop,
    popToTop
};
