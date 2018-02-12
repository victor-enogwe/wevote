import React from 'react';
const Fragment = React.Fragment;


const OptionFragments = ({fields, placeholder}) => (
    <Fragment>
        <option value="">{placeholder}</option>
        {Object.entries(fields).map(field =>
            <option key={field[0]} value={field[0]}>{field[1]}</option>
        )}
    </Fragment>
);

export default OptionFragments;
