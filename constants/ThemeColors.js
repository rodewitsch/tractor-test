const themeColors = {
    dark: {
        background: '#101010',
        middleground: '#1F1F1F',
        text: '#FFFFFF',
        category: '#333333',
        questionNumber: '#343434',
        defaultAnswerColor: '#1F1F1F'
    },
    light: {
        background: '#FFFFFF',
        middleground: '#EEEEEE',
        text: '#000000',
        category: '#e6e6e6',
        questionNumber: '#D3D3D3',
        defaultAnswerColor: '#EEEEEE'
    }
};

export default darkTheme => themeColors[(darkTheme ? 'dark' : 'light')];

