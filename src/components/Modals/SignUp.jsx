import React from 'react';

const SignUp = ({handleHide}) => (
    <div className='modal'>
        Sign Up
        <button onClick={handleHide}>
            Hide
        </button>
    </div>
);

export default SignUp;