const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "oklab-function": { preserve: true },
      },
    },
  },
};

export default config;