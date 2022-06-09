import { IllegalArgumentException } from './exception';

/**
 * Check argument validity.
 * 
 * @param condition Condition to be verified.
 * @param errorMessage Error thrown when the condition hasn't been verified.
 */
export function checkArgument(condition: boolean, errorMessage: string): void {
    if (!condition)
        throw new IllegalArgumentException(errorMessage);
}

/**
 * Check null or empty value.
 * 
 * @param value Value to be verified.
 * @param errorMessage Error thrown when the value is null or empty.
 */
export function checkEmpty(value: string, errorMessage: string): void {
    checkArgument(value != null && value !== "", errorMessage);
}

/**
 * Check null value.
 * 
 * @param value Value to be verified.
 * @param errorMessage Error thrown when the value is null.
 */
export function checkNotNull(value: unknown, errorMessage: string): void {
    if (value === null) {
        throw new IllegalArgumentException(errorMessage);
    }
}

/**
 * Check for null or empty value.
 * 
 * @param value  Value to be verified.
 * @returns TRUE if value is null of empty.
 */
export function isEmpty(value: string): boolean {
    return !value || value == null;
}

/**
 * Validate email format.
 * 
 * @param email Email address to be verified.
 * @returns TRUE if the specified value is a valid email address.
 */
export function isValidEmail (email: string) {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}