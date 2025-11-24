import React, { useMemo } from 'react';
import { WebView } from 'react-native-webview';
import { Cafe } from '../../api/cafes';

type Props = {
    userCoords: { lat: number; lng: number }; // 현재 위치
    cafes: Cafe[];                            
    onMarkerPress?: (cafe: Cafe) => void;      // 마커 클릭 시 상위로 전달할 콜백
  };

  //WebView 안에서 실행할 JavaScript 코드
  const KakaoMap = ({ userCoords, cafes, onMarkerPress }: Props) => {
    const script = useMemo(() => `
    window.onload = () => {
      kakao.maps.load(() => {
        //1. 지도생성
   const map = new kakao.maps.Map(document.getElementById('map'), {
          center: new kakao.maps.LatLng(${userCoords.lat}, ${userCoords.lng}),
          level: 4
        });

 //현재 위치 마커
 new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(${userCoords.lat}, ${userCoords.lng}),
          title: '현재 위치'
        });

 // 카페목록& 마커
  const cafes = ${JSON.stringify(cafes)};
        cafes.forEach(cafe => {
          // Kakao 마커
          const marker = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(cafe.lat, cafe.lng),
            title: cafe.name
          });
    //WebView 내부의 JavaScript와 RN 컴포넌트는 바로 서로 접근 불가해서 사용함
        kakao.maps.event.addListener(marker, 'click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify(cafe));
          });
        });
      });
    };
    true;
      `, [userCoords, cafes]);



      return (
        <WebView
          originWhitelist={['*']}
          javaScriptEnabled
          injectedJavaScript={script}
          onMessage={(event) => {
            const cafe = JSON.parse(event.nativeEvent.data) as Cafe;
            onMarkerPress?.(cafe);
          }}
          source={{
            html: `
              <!doctype html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <script src="//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY}"></script>
                  <style>html,body,#map{margin:0;height:100%}</style>
                </head>
                <body><div id="map"></div></body>
              </html>`,
          }}
          style={{ flex: 1 }}
        />
      );
    };
    
    export default KakaoMap;