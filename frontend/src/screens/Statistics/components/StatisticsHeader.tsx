import React, {useMemo, useState} from 'react';
import {Image, Modal,Pressable, ScrollView, Text, TouchableOpacity, View} from 'react-native';              
import Ionicons from 'react-native-vector-icons/Ionicons';
import {statisticsStyles} from '../../../styles/statisticsStyles';
import {theme} from '../../../styles/theme';

type Props = {
  title: string;
  months: string[];
  selectedIndex: number;
  selectedLabel: string; 
  onSelect: (index: number) => void;
};

export default function StatisticsHeader({title, months, selectedIndex,selectedLabel, onSelect}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false); 
  const [buttonLayout, setButtonLayout] = useState<{x: number; y: number; width: number; height: number} | null>(null);

  const openPicker = () => setPickerOpen(true);       
  const closePicker = () => setPickerOpen(false);      
  const handleSelect = (index: number) => {             
    onSelect(index);
    closePicker();
  };

  const anchoredPickerStyle = useMemo(() => {     
    if (!buttonLayout) {
      return null;
    }
    return {
      position: 'absolute' as const,
      top: buttonLayout.y + buttonLayout.height + theme.spacing(1),
      left: buttonLayout.x,
      width: buttonLayout.width,
    };
  }, [buttonLayout]);
  
  
  
  return (
    <View style={statisticsStyles.header}>
      <View style={statisticsStyles.headerTopRow}>
        <TouchableOpacity style={statisticsStyles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={statisticsStyles.profileWrap}>
          <Image
            source={{uri: 'https://i.pravatar.cc/100?img=12'}}//바꾸기
            style={statisticsStyles.avatar}
          />
          <Text style={{fontSize: 14, fontWeight: '600', color: theme.colors.text}}>
            서현 님
          </Text>
        </View>
      </View>

      <Text style={statisticsStyles.headerTitle}>{title}</Text>

      <View style={statisticsStyles.periodSelector}>
        <Text style={{fontSize: 15, color: theme.colors.gray600}}>월별</Text>
        <TouchableOpacity style={statisticsStyles.dropdownButton} 
        activeOpacity={0.8} 
        onPress={openPicker}   
        onLayout={event => setButtonLayout(event.nativeEvent.layout)}
                   
        >
          <Text style={{fontSize: 14, fontWeight: '600', color: theme.colors.text}}>{selectedLabel}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <Pressable style={statisticsStyles.modalBackdrop} onPress={closePicker}>
          {anchoredPickerStyle ? (
      <View
        style={[
          statisticsStyles.monthPickerBase,       
          anchoredPickerStyle,                    
        ]}>
        <ScrollView
          style={statisticsStyles.monthPickerScroll}   
          showsVerticalScrollIndicator={false}>
          {months.map((month, index) => {
            const active = index === selectedIndex;
              return (
                <Pressable
                  key={month}
                  style={[
                    statisticsStyles.monthPickerItem,
                    active && statisticsStyles.monthPickerItemActive,
                  ]}
                  onPress={() => handleSelect(index)}
                >
                  <Text
                    style={[
                      statisticsStyles.monthPickerLabel,
                      active && statisticsStyles.monthPickerLabelActive,
                    ]}
                  >
                    {month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
      </View>
    ) : null}
  </Pressable>
</Modal>


      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={statisticsStyles.monthScroll}
      >
        {months.map((month, index) => {
          const active = index === selectedIndex;
          return (
            <TouchableOpacity
              key={month}
              activeOpacity={0.8}
              onPress={() => onSelect(index)}
              style={[
                statisticsStyles.monthPill,
                active && statisticsStyles.monthPillActive,
              ]}
            >
              <Text
                style={[
                  statisticsStyles.monthLabel,
                  active && statisticsStyles.monthLabelActive,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

