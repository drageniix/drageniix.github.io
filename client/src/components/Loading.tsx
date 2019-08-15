import React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../redux/types';

export const Loading = ({
    message
}: {
    message?: string;
}): React.ReactElement => <div>Loading Message: {message}</div>;

const mapStateToProps = (state: ApplicationState): { message: string } => ({
    message: state.message
});

export default connect(mapStateToProps)(Loading);
