/**
* @typedef Auth
* @property {string} email - Min length 4 characters
* @property {string} phoneNumber - Min length 4 characters
* @property {string} password.required - Min length 6 characters
*/

/**
* @typedef AuthResponse
* @property {string} token
* @property {number} expire_in
* @property {UserResponse.model} user
*/
