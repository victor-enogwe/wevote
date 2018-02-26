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
        if (!(/[A-Za-z0-9]{3,50}/.test(details[field]))) {
            errors[field] = `Please enter your ${field}`;
            valid = false;
        }
    }
    return { valid, errors };
}

/**
 * Validates the bio form
 * @param {object} userDetails
 * @returns {object} validity
 */
export function bio({firstname, surname, state}) {
    return validateFields({firstname, surname, state});
}

/**
 * Validates the save form
 * @param {object} userDetails
 * @returns {object} validity
 */
export function save({phone, email}) {
    const validity = validateFields({phone});
    if (!validator.isNumeric(phone) || !validator.isLength(phone, { min: 6 })) {
        validity.errors.phone = 'Please enter a valid phone number';
        validity.valid = false;
    }

    if (email && !validator.isEmail(email)) {
        validity.errors.email = 'Please enter a valid email';
        validity.valid = false;
    }
    return validity;
}

/**
 * Validates the phone login form
 * @param {object} signInDetails
 * @returns {object} validate
 */
export function phone({phone}) {
    const validity = validateFields({phone});
    if (!validator.isNumeric(phone) || !validator.isLength(phone, { min: 6 })) {
        validity.errors.phone = 'Please enter a valid phone number';
        validity.valid = false;
    }
    return validity;
}

/**
 * Validates the login form
 * @param {object} signInDetails
 * @returns {object} validate
 */
export function surname({surname}) {
    return validateFields({surname});

}
