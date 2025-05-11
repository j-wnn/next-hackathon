/**
 * Conditionally join class names together
 * 
 * @param  {...any} classes - Any number of class names or class name conditions
 * @returns {string} - Joined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
