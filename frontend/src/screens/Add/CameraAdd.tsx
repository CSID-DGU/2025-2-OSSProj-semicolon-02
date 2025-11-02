import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

// 👉 필요하면 앱 자산 이미지를 넣어도 됨.
// const PLACEHOLDER = require('../../assets/mock_coffee.jpg');
const PLACEHOLDER = { uri: 'https://picsum.photos/900/1400' }; // 임시 원격 이미지

export default function CameraAddScreen() {
  const navigation = useNavigation();
  const [shotUri, setShotUri] = useState<string | null>(null);

  const onClose = () => navigation.goBack();
  const onCapture = () => setShotUri(shotUri ? null : (PLACEHOLDER as any).uri ?? '');
  const onPickGallery = () => setShotUri((PLACEHOLDER as any).uri ?? '');

  return (
    <View style={styles.container}>
      {/* 닫기(X) */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 미리보기 영역 */}
      <View style={styles.previewWrap}>
        {shotUri ? (
          <Image source={PLACEHOLDER} style={styles.previewImg} resizeMode="contain" />
        ) : (
          <>
            {/* 상/하 레터박스 느낌 */}
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
            {/* 가운데 흰 프레임 */}
            <View style={styles.fakeFrame}>
              <Text style={styles.hint}>카메라 미리보기 (Mock)</Text>
            </View>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
          </>
        )}
      </View>

      {/* 하단 컨트롤 바 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={onPickGallery} activeOpacity={0.85}>
          <Ionicons name="images-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureRing, shotUri && {borderColor: '#aaa'}]}
          onPress={onCapture}
          activeOpacity={0.9}
        >
          <View style={[styles.captureCore, shotUri && {backgroundColor: '#bbb'}]} />
        </TouchableOpacity>

        {/* 우측 균형 맞춤용 공간 */}
        <View style={{width: 40}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  closeBtn: {position: 'absolute', top: 50, right: 20, zIndex: 10},
  previewWrap: {flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'},
  fakeFrame: {
    width: '92%',
    height: '70%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#5E6AD2', // 캡처처럼 푸른 테두리
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {color: '#999', fontSize: 14},
  previewImg: {width: '100%', height: '100%'},
  bottomBar: {
    height: 120,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  iconBtn: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  captureRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 3, borderColor: '#7FD0F9',
    alignItems: 'center', justifyContent: 'center',
  },
  captureCore: {
    width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff',
  },
});