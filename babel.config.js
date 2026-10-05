module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-dynamic-import',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
    ...(process.env.NODE_ENV === 'production'
      ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
      : []),
    'react-native-reanimated/plugin',
  ],
};
