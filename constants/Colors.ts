export default {
  background: '#e8e8e8',
  text: '#000000',
  selectItemsBackground: '#fff',
  settingsButtonColor: '#808080',
  whiteText: '#fff',
  questionStatusDefaultBackground: '#808080',
  questionStatusSuccessBackground: '#6bc161',
  questionStatusActiveBackground: '#618cc1',
  questionStatusWrongBackground: '#c16161',
  dark: {
    primary: '#101010',
    background: '#101010',
    middleground: '#1F1F1F',
    text: '#FFFFFF',
    category: '#333333',
    questionNumber: '#343434',
    defaultAnswerColor: '#1F1F1F',
  },
  light: {
    primary: '#FFFFFF',
    background: '#FFFFFF',
    middleground: '#EEEEEE',
    text: '#000000',
    category: '#e6e6e6',
    questionNumber: '#D3D3D3',
    defaultAnswerColor: '#EEEEEE',
  },
};

export type ColorsType = {
  background: 'string';
  text: 'string';
  selectItemsBackground: string;
  settingsButtonColor: string;
  whiteText: string;
  questionStatusDefaultBackground: string;
  questionStatusSuccessBackground: string;
  questionStatusActiveBackground: string;
  questionStatusWrongBackground: string;
  dark: ThemeColorType;
  light: ThemeColorType;
};

export type ThemeColorType = {
  primary: string;
  background: string;
  middleground: string;
  text: string;
  category: string;
  questionNumber: string;
  defaultAnswerColor: string;
};
