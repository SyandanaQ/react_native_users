import 'dotenv/config';

export default {
  expo: {
    name: 'react_native_users',
    slug: 'react_native_users',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
