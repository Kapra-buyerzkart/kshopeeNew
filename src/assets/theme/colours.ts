// src/theme/colors.ts

const lightColors = {
    primary: '#1A72DD',
    secondary: '#1A72DD',
    black: '#000000',
    white: '#ffffff',
    inputBackground: 'rgba(0, 0, 0, 0.05)',
    background: '#ffffff',
    text: '#2A3256',
    card: '#b4f0edff',
    border: '#d1d1d1ff',
    grey: '#808080',
    lightGrey: '#d3d3d3',
    red: '#ff0000',
    green: '#11dd11ff',
    blue: '#0000ff',
    halfTransparent: 'rgba(0, 0, 0, 0.5)'
};

const darkColors = {
    primary: '#1A72DD',
    secondary: '#1A72DD',
    black: '#000000',
    white: '#ffffff',
    background: '#221d2eff',
    backgroundLight: '#ececeeff',
    text: '#fcfcfcff',
    card: '#145891ff',
    border: '#333333',
    grey: '#aaaaaa',
    lightGrey: '#2c2c2c',
    red: '#ff6b6b',
    green: '#32d296',
    blue: '#7abaff',
    halfTransparent: 'rgba(0, 0, 0, 0.5)'
};

export const colors = lightColors;

export const getThemeColors = () => colors;



