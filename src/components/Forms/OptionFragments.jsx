import React from 'react';
const Fragment = React.Fragment;


const OptionFragments = ({fields, placeholder}) => (
    <Fragment>
        <option value="">{placeholder}</option>
        {fields.map(field =>
            <option key={field} value={field.toLowerCase()}>{field}</option>
        )}
    </Fragment>
);

export default OptionFragments;
