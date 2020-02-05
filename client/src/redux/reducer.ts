import { ApplicationState } from './types';

const initialState: ApplicationState = {
    message: 'Hello World?',
    theme: 'sandbox'
};

export default (
    state = initialState,
    { type, payload }: { type: string; payload?: any }
): ApplicationState => {
    switch (type) {
        default:
            return { ...state };
    }
};
