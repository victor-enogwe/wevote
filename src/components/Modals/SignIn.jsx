import React from 'react';

const SignIn = ({handleHide}) => (
    <div className='modal'>
        Sign In
        <button onClick={handleHide}>
            Hide
        </button>
    </div>
);

export default SignIn;