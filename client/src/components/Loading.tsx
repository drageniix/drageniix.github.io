import React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../redux/types';

export const Loading = ({
    message,
    theme
}: ApplicationState): React.ReactElement => (
    <div className={theme}>Loading Message: {message}</div>
);

const mapStateToProps = (state: ApplicationState): ApplicationState => ({
    message: state.message,
    theme: state.theme
});

export default connect(mapStateToProps)(Loading);
