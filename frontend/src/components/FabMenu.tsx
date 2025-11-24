import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import {theme} from '../styles/theme';

const {width, height} = Dimensions.get('window');
const SIZE = 64; // 액션 원 크기
const BTN = 72; 
const RADIUS = 120;
const START_DEG = 120;
const END_DEG   = 60; 
const LIFT = 28;
const GAP = 8;
const ANGLES = [150, 90, 30];
const RADII  = [120, 140, 120];
const EXTRA_LIFT = [0, 4, 0];

export default function FabMenu() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [open, setOpen] = useState(false);
  const op = useRef(new Animated.Value(0)).current;

  const openMenu = () => { setOpen(true); Animated.timing(op, {toValue:1,duration:180,useNativeDriver:true}).start(); };
  const closeMenu = () => { Animated.timing(op, {toValue:0,duration:160,useNativeDriver:true}).start(()=>setOpen(false)); };

  // 3개 버튼: 수동등록, 카메라, 즐겨찾기
  const actions = [
    { key:'manual',  label:'수동등록',  icon:'✍️', onPress:()=>nav.navigate('ManualAdd') },
    { key:'camera',  label:'카메라',    icon:'📷', onPress:()=>nav.navigate('CameraAdd') },   // 화면 없으면 아래 2단계 참고
    { key:'favorite',label:'즐겨찾기',  icon:'⭐️', onPress:()=>nav.navigate('Favorites') },  // 화면 없으면 아래 2단계 참고
  ];

  // 하단에서 부채꼴(210°~330°)로 펼치기
  const radius = 120;
  const start = 210, end = 330;
  const positions = actions.map((_,i)=>{
    const deg = start + ((end-start)/(actions.length-1))*i;
    const rad = (deg*Math.PI)/180;
    return {tx: Math.cos(rad)*radius, ty: Math.sin(rad)*radius};
  });

  return (
    <View pointerEvents="box-none" style={{position:'absolute',left:0, right:0, bottom:24, alignItems: 'center'}}>
      {/* 오버레이 */}
      {open && (
        <Animated.View
          style={{
            position:'absolute', left:0, right : 0, bottom: 0, alignItems: 'center',
            backgroundColor:'rgba(0,0,0,0.35)', opacity:op,
          }}
        >
          <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={closeMenu}/>
        </Animated.View>
      )}

      {/* 액션들 */}
      {open && actions.map((a,idx)=>{
          const deg = ANGLES[idx];                     // ★ 개별 각도
  const rad = (deg * Math.PI) / 180;
  const r   = RADII[idx];                      // ★ 개별 반경
  const tx  = Math.cos(rad) * r;               // 좌(-) 우(+)
  const ty  = Math.sin(rad) * r;               // 위(+)
        return (
          <Animated.View
            key={a.key}
            style={{
                position: 'absolute',
        left: 0, right: 0,
        bottom: 0,                     // 기준을 X 버튼 ‘윗변’으로
        alignItems: 'center',
        transform: [
          { translateX: op.interpolate({ inputRange:[0,1], outputRange:[0,  tx] }) },
          { translateY: op.interpolate({ inputRange:[0,1], outputRange:[0, -(ty + (EXTRA_LIFT[idx]||0))] }) },
          { scale: op },
                   ],
            }}>
            <TouchableOpacity
              onPress={()=>{ a.onPress(); closeMenu(); }}
              activeOpacity={0.85}
              style={{
                width:SIZE, height:SIZE, borderRadius:SIZE/2,
                backgroundColor:'#3b3b3b', alignItems:'center', justifyContent:'center',
                shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:6
              }}>
              <Text style={{fontSize:26}}>{a.icon}</Text>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 6,
                fontWeight: '800',
                color: '#FFF', 
                textShadowColor: '#797979', 
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {a.label}
            </Text>
          </Animated.View>
        );
      })}

      {/* 중앙 + / 닫기 버튼 */}
      <TouchableOpacity
        onPress={open?closeMenu:openMenu}
        activeOpacity={0.95}
        style={{
          width:BTN, height:BTN, borderRadius:BTN/2,
          alignItems:'center', justifyContent:'center',
          backgroundColor: theme.colors.primary,
          shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:8
        }}>
        <Text style={{fontSize:30, color:'#fff'}}>{open?'✕':'＋'}</Text>
      </TouchableOpacity>
    </View>
  );
}