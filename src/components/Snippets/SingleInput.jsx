import React from 'react';
import PropTypes from 'prop-types';

const SingleInput = ({
  title,
  name,
  inputType,
  value,
  onChange,
  placeholder
}) => (  
  <div className="form-group">
    <label className="form-label">{title}</label>
    <input
      className="form-input"
      name={name}
      type={inputType}
      value={value}
      onChange={onChange}
      placeholder={placeholder} />
  </div>
);

SingleInput.propTypes = {  
  inputType: PropTypes.oneOf(['text', 'number']).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
};

export default SingleInput;