import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({id, name, type, placeholder, icon, value, required, error, handleChange}) => (
    <div className="text-input">
        <i className={icon}>
        </i>
        <label htmlFor={id}>{placeholder}</label>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
        />
        {error && <span className="input-error">{error}</span>}
    </div>
);

TextInput.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    handleChange: PropTypes.func.isRequired
};

export default TextInput;
