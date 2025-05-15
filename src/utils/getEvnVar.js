function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing process.env.${name}`);
}

export { getEnvVar };


// export const getEnvVar = (key) => {
//   const value = process.env[key];
//   if (!value) {
//     throw new Error(`Environment variable ${key} is not defined`);
//   }
//   return value;
// };
