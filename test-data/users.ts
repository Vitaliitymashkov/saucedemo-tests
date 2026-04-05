export const STANDARD_USER = {
    get username() { return process.env.STANDARD_USER_USERNAME!; },
    get password() { return process.env.STANDARD_USER_PASSWORD!; },
};

export const LOCKED_USER = {
    get username() { return process.env.LOCKED_OUT_USER_USERNAME!; },
    get password() { return process.env.LOCKED_OUT_USER_PASSWORD!; },
};
