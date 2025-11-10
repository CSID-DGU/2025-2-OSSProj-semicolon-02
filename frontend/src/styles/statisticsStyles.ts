import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const statisticsStyles = StyleSheet.create({
  screen: {
    flex: 1,
   
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingBottom: theme.spacing(6),
  },
  header: {
    position: 'relative',
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(4),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: '#f3e9d8ff',
    marginTop: 0,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    marginTop: theme.spacing(3),
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
  },
  periodSelector: {
    marginTop: theme.spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.2),
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 999,
  },
  monthScroll: {
    marginTop: theme.spacing(2),
  },
  monthPill: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: 999,
    marginRight: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  monthPillActive: {
    backgroundColor: theme.colors.primary,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray700,
  },
  monthLabelActive: {
    color: theme.colors.white,
  },
  section: {
    paddingHorizontal: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(3),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  chartAxes: {
    flexDirection: 'row',
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing(1),
  },
  chartYAxisLabel: {
    fontSize: 12,
    color: theme.colors.gray500,
  },
  chartScrollArea: {
    flex: 1,
    paddingLeft: theme.spacing(2),
  },
  chartColumn: {
    width: 36,
    alignItems: 'center',
  },
  chartBar: {
    width: 16,
    borderRadius: 8,
  },
  chartDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 12,
  },
  chartXAxisLabel: {
    marginTop: theme.spacing(1),
    fontSize: 11,
    color: theme.colors.gray500,
  },
  drinkList: {
    marginTop: theme.spacing(2),
  },
  drinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  drinkThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2D6',
    marginRight: theme.spacing(2),
  },
  drinkBrand: {
    fontSize: 13,
    color: theme.colors.gray600,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  drinkMeta: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  drinkListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  subtle: {
    fontSize: 13,
    color: theme.colors.gray500,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  monthPickerBase: {
    position: 'absolute',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(0.5),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: 'hidden',
    zIndex: 1000,
  },

  monthPicker: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
  },
  monthPickerScroll: {
    maxHeight: theme.spacing(20),
  },
  monthPickerItem: {
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  monthPickerItemActive: {
    backgroundColor: theme.colors.primary,
  },
  monthPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gray700,
  },
  monthPickerLabelActive: {
    color: theme.colors.white,
  },
});
