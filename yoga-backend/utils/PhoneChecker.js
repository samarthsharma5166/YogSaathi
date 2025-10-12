import {parsePhoneNumberFromString } from 'libphonenumber-js';

export function isIndianNumber(phone) {
    const number = parsePhoneNumberFromString(phone, 'IN');
    return number && number.isValid() && number.country === 'IN';
}
