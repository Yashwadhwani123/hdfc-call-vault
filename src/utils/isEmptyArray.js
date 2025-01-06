/**
 * Returns true if value is empty or undefined or null or zero
 * @param {number | string} value
 */
 const isInvalidArray = (value) => value === '' || value === undefined || value === null || value.length === 0;

 export default isInvalidArray;
 