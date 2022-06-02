export function checkArgument(condition: boolean, errorMessage: string): void {
    if (!condition)
        throw new Error(errorMessage);
}

export function checkEmpty(value: string, errorMessage: string): void {
    checkArgument(value != null && value !== "", errorMessage);
}

export function checkNotNull(value: any, errorMessage: string): void {
    if (value === null) {
        throw new Error(errorMessage);
    }
}

export function isEmpty(value: string): boolean {
    return !value || value == null;
}

export function isValidEmail (email: string) {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}