import validator from 'validator';

/**
 * Confirm that all required fields are filled
 * @param {object} [details]
 * @returns {object} errors and valid
 */
function validateFields(details) {
    const errors = {};
    let valid = true;
    for (let field in details) {
        if (validator.isEmpty(details[field])) {
            errors[field] = `Please enter your ${field}`;
            valid = false;
        }
    }
    return { valid, errors };
}

/**
 * Validates the signUp form
 * @param {object} userDetails
 * @returns {object} validate
 */
export function signUp(userDetails) {
    const validity = validateFields(userDetails);
    if (!validator.isEmail(userDetails.email)) {
        validity.errors.email = 'Please enter a valid email';
        validity.valid = false;
    }
    if (!validator.isInt(userDetails.age, { min: 10, max: 100 })) {
        validity.errors.age = 'Please enter a valid age';
        validity.valid = false;
    }
    if (!validator.isNumeric(userDetails.phone) || !validator.isLength(userDetails.phone, { min: 6 })) {
        validity.errors.phone = 'Please enter a valid phone number';
        validity.valid = false;
    }
    if (!validity.errors.password && !validator.isLength(userDetails.password, { min: 8, max: 49 })) {
        validity.errors.password = 'Your password should be a minimum of 8 letters';
        validity.valid = false;
    }
    return validity;
}


/**
 * Validates the signIn form
 * @param {object} userDetails
 * @returns {object} validate
 */
export function signIn(userDetails) {
    const validity =  validateFields(userDetails);
    if (!validator.isEmail(userDetails.email)) {
        validity.errors.email = 'Please enter a valid email';
        validity.valid = false;
    }
    if (!validity.errors.password && !validator.isLength(userDetails.password, { min: 8, max: 49 })) {
        validity.errors.password = 'Your password should be a minimum of 8 characters';
        validity.valid = false;
    }
    return validity;
}
