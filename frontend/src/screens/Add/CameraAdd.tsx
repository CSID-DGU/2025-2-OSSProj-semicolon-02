// CameraAddScreen.tsx

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

// ✅ 목업용 이미지 (에뮬레이터 / 카메라 디바이스 없을 때 사용)
const PLACEHOLDER = {
  uri: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA0MThfMTI5/MDAxNjE4NzQ3MDI1NDgw.0K6GVeUMDyHDupFCi5O8AdNuJKdnRSSOfxbG4rrD8x8g.dp0gIeUaX9TlUR7Yog70VofFRj8WhCV4-NUDTs480YIg.JPEG.dbwlsdl0117/IMG_7827.jpg?type=w800',
};

export default function CameraAddScreen() {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<Camera | null>(null);

  const [shotUri, setShotUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back; // 후면 카메라

  // 📌 카메라 권한 요청
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    })();
  }, []);

  const onClose = () => navigation.goBack();

  // 📸 사진 촬영 / 다시 찍기
  const onCapture = async () => {
    // 이미 한 번 찍은 상태면 “다시 찍기”로 동작
    if (shotUri) {
      setShotUri(null);
      return;
    }

    // 카메라 디바이스가 없으면 → 목업 이미지 사용 (에뮬레이터용)
    if (!device) {
      setShotUri(PLACEHOLDER.uri);
      return;
    }

    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
      });
      const uri = 'file://' + photo.path;
      console.log('photo path =>', uri);
      setShotUri(uri);
    } catch (e) {
      console.warn('takePhoto error', e);
    }
  };

  // ✅ 확인 버튼: 다음 페이지로 이동
  const onConfirm = () => {
    if (!shotUri) return;

    // ❗ 여기서 화면 이름은 네가 네비게이션에 등록한 이름으로 바꿔줘
    navigation.navigate('SelectDrink', {
      imageUri: shotUri,
    });
  };

  // 📁 갤러리 권한 요청 (Android용)
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      // Android 13+ 은 READ_MEDIA_IMAGES, 그 이하는 READ_EXTERNAL_STORAGE
      const perm =
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ??
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(perm);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('gallery permission error', err);
      return false;
    }
  };

  // 📁 갤러리에서 사진 선택
  const onPickGallery = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) {
      console.warn('갤러리 권한 거부됨');
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        console.warn(
          'image picker error =>',
          response.errorCode,
          response.errorMessage,
        );
        return;
      }
      const asset: Asset | undefined = response.assets && response.assets[0];
      if (asset?.uri) {
        console.log('gallery uri =>', asset.uri);
        setShotUri(asset.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* 닫기(X) */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onClose}
        activeOpacity={0.8}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 미리보기 영역 */}
      <View style={styles.previewWrap}>
        {!hasPermission ? (
          // 🔐 권한 아직 없을 때
          <>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
            <View style={styles.fakeFrame}>
              <Text style={styles.hint}>
                설정에서 카메라 권한을 허용해주세요.
              </Text>
            </View>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
          </>
        ) : shotUri ? (
          // ✅ 찍힌(또는 갤러리) 이미지 미리보기
          <Image
            source={{uri: shotUri}}
            style={styles.previewImg}
            resizeMode="contain"
          />
        ) : device ? (
          // 📹 실기기: 실제 카메라 프리뷰
          <>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
            <View style={styles.fakeFrame}>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                captureAudio={false}
                enableZoomGesture={true}
              />
            </View>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
          </>
        ) : (
          // 📌 에뮬레이터: 카메라 디바이스 없음
          <>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
            <View style={styles.fakeFrame}>
              <Text style={styles.hint}>
                에뮬레이터에서는 실제 카메라 대신 샘플 이미지를 사용합니다.{'\n'}
              </Text>
            </View>
            <View style={{height: 56, backgroundColor: '#000', width: '100%'}} />
          </>
        )}
      </View>

      {/* 하단 컨트롤 바 */}
      <View style={styles.bottomBar}>
        {/* 갤러리 버튼 */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onPickGallery}
          activeOpacity={0.85}>
          <Ionicons name="images-outline" size={28} color="#fff" />
        </TouchableOpacity>

        {/* 촬영 버튼 (찍기 / 다시 찍기) */}
        <TouchableOpacity
          style={[styles.captureRing, shotUri && {borderColor: '#aaa'}]}
          onPress={onCapture}
          activeOpacity={0.9}>
          <View
            style={[styles.captureCore, shotUri && {backgroundColor: '#bbb'}]}
          />
        </TouchableOpacity>

        {/* 오른쪽: 사진이 있을 때만 확인 버튼 */}
        {shotUri ? (
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onConfirm}
            activeOpacity={0.85}>
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        ) : (
          // 아직 안 찍었을 때는 균형 맞추기용 더미 뷰
          <View style={{width: 60}} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  closeBtn: {position: 'absolute', top: 50, right: 20, zIndex: 10},
  previewWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeFrame: {
    width: '92%',
    height: '70%',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#5E6AD2',
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {color: '#999', fontSize: 14, textAlign: 'center'},
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
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#7FD0F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureCore: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
  },
  confirmBtn: {
    minWidth: 60,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
  },
});