export const common = {
  getEnv: (key) => {
    const value = process.env[key];
    if (!value) {
      console.error(`Environment variable ${key} is not defined`);
    }
    return value;
  },
};