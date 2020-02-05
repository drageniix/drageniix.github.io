import React from 'react';
import Loading from '../components/Loading';

export const HomePage = (): React.ReactElement => (
    <div>
        Oh my god, I loaded!
        <Loading />
    </div>
);

export default HomePage;
