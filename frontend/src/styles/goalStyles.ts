import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const goalStyles = StyleSheet.create({
  segmentedWrap: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 4,
    alignSelf: 'center',
  },
  segmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  segmentText: {
    fontSize: 13,
    color: theme.colors.gray600,
  },
  segmentTextActive: {
    color: theme.colors.text,
    fontWeight: '700',
  },

  card: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing(2),
  },

  // number row
  numberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  numberLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  numberRight: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    borderColor: theme.colors.line, backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnTxt: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: -2 },
  numberInput: {
    width: 88, height: 40, borderRadius: 10, borderWidth: 1,
    borderColor: theme.colors.line, backgroundColor: theme.colors.white,
    marginHorizontal: 8, paddingHorizontal: 10, textAlign: 'center', fontSize: 16,
  },
  unit: { fontSize: 14, color: theme.colors.gray600 },

  // presets
  presetWrap: { flexDirection: 'row', gap: 8, marginTop: 8 },
  presetBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999,
    borderWidth: 1, borderColor: theme.colors.line, backgroundColor: theme.colors.surface,
  },
  presetTxt: { fontSize: 13, color: theme.colors.text },

  // preview text
  previewTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
});
