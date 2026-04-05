function getEnvOrThrow(key: string): string {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Environment variable ${key} is not set or empty. If running in CI, ensure your GitHub Secrets are properly configured.`);
    }
    return val;
}

export const STANDARD_USER = {
    get username() { return getEnvOrThrow('STANDARD_USER_USERNAME'); },
    get password() { return getEnvOrThrow('STANDARD_USER_PASSWORD'); },
};

export const LOCKED_USER = {
    get username() { return getEnvOrThrow('LOCKED_OUT_USER_USERNAME'); },
    get password() { return getEnvOrThrow('LOCKED_OUT_USER_PASSWORD'); },
};
