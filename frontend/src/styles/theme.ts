export const theme = {
    colors: {
        primary: '#9b8e7d',
        background: '#FFFFFF',
        surface: '#FFFDF9',
        primaryDark: '#9b856d',
        muted: '#8e8e8e',
        line: '#EFE7DB',
        text: '#191919',
        gray500: '#8C8C8C',
        gray300: '#D9D9D9',
        card: '#eaded1',
        warning: '#FF715B',
        gray700: '#616161',
        gray900: '#212121',
        gray100: '#F7F7F7',
        gray600: '#757575'
    },
    spacing: (n: number) => n * 8,
    radius: { sm: 10, md: 16, lg: 20, xl: 28 },
    shadow: {
        card: {
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
        },
    },
};