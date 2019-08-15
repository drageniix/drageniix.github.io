const initialState = {};

export default (
    state = initialState,
    { type, payload }: { type: string; payload?: any }
): any => {
    switch (type) {
        default:
            return { ...state, payload };
    }
};
