import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({id, name, type, placeholder, icon, value, required, error,
                       handleChange, showPassword, toggleShowPassword}) => (
    <div className="text-input">
        {name === "password" && <p
            className="show-password"
            onClick={toggleShowPassword}>
            {showPassword ? 'HIDE' : 'SHOW'}
        </p>}
        {error &&
        <i title={error} className="error-icon fas fa-info-circle">
        </i>}
        <i className={icon}>
        </i>
        <label htmlFor={id}>{placeholder}</label>
        <input className={error && "input-error"}
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={error || placeholder}
            required={required}
        />
    </div>
);

TextInput.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    showPassword: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    toggleShowPassword: PropTypes.func
};

export default TextInput;
