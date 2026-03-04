import { createGlobalTheme } from '@vanilla-extract/css';

// 이 파일은 scripts/generate-theme.js로 자동 생성됩니다.
// 직접 수정하지 말고 tokens.json을 수정한 뒤 npm run tokens:generate 를 실행하세요.

export const vars = createGlobalTheme(':root', {
  typoType: {
    button2: {
      fontSize:      '16px',
      fontWeight:    '600',
      lineHeight:    '24px',
      letterSpacing: '-0.2px',
    },
    button3: {
      fontSize:      '14px',
      fontWeight:    '600',
      lineHeight:    '20px',
      letterSpacing: '-0.2px',
    },
    button4: {
      fontSize:      '13px',
      fontWeight:    '600',
      lineHeight:    '18px',
      letterSpacing: '-0.1px',
    },
    button5: {
      fontSize:      '12px',
      fontWeight:    '600',
      lineHeight:    '16px',
      letterSpacing: '0px',
    },
  },
  color: {
    primary: {
      default:      '#bada55',
      hover:        '#175CD3',
      disabled:     '#B2CCFF',
      text:         '#FFFFFF',
      textDisabled: '#FFFFFF',
    },
    gray: {
      default:      '#344054',
      hover:        '#1D2939',
      disabled:     '#D0D5DD',
      text:         '#FFFFFF',
      textDisabled: '#FFFFFF',
    },
    red: {
      default:      '#D92D20',
      hover:        '#B42318',
      disabled:     '#FECDCA',
      text:         '#FFFFFF',
      textDisabled: '#FFFFFF',
    },
    yellow: {
      default:      '#DC6803',
      hover:        '#B54708',
      disabled:     '#FEF0C7',
      text:         '#FFFFFF',
      textDisabled: '#98A2B3',
    },
    green: {
      default:      '#039855',
      hover:        '#027A48',
      disabled:     '#D1FADF',
      text:         '#FFFFFF',
      textDisabled: '#98A2B3',
    },
  },
});
