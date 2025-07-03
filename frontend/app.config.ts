export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiBaseUrl: 'http://127.0.0.1:8000',
    },
    plugins: [
      'expo-font'
    ],
  };
};