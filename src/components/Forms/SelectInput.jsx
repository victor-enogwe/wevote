import React from 'react';
import PropTypes from 'prop-types';
import OptionFragments from './OptionFragments';

const SelectInput = ({id, name, value, handleChange, placeholder, fields, error }) => (
    <div className="select-input">
        <select
            id={id}
            name={name}
            onChange={handleChange}
            value={value}
            className={error && "select-error"}
        >
            <OptionFragments
                fields={fields}
                placeholder={error || placeholder}
            />
        </select>
    </div>
);

SelectInput.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    fields: PropTypes.object
};

export default SelectInput;
