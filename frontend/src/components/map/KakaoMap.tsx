import React, { useMemo, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Cafe } from '../../api/cafes';
import { KAKAO_JAVASCRIPT_KEY } from '../../config/apiKeys';

type Props = {
  userCoords: { lat: number; lng: number }; // 현재 위치
  cafes: Cafe[];
  onMarkerPress?: (cafe: Cafe) => void; // 마커 클릭 시 상위로 전달할 콜백
  onCenterChanged?: (coords: { lat: number; lng: number }) => void; // 지도 중심 변경 시 콜백
};

//WebView 안에서 실행할 JavaScript 코드
const KakaoMap = ({
  userCoords,
  cafes,
  onMarkerPress,
  onCenterChanged,
}: Props) => {
  const script = useMemo(() => {
    console.log('🗺️ [KakaoMap] 스크립트 생성:', {
      userCoords,
      cafesCount: cafes.length,
    });
    return `
    (function() {
      function log(msg) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'log', message: String(msg)}));
          }
        } catch(e) {}
        console.log('[WebView]', msg);
      }
      
      function error(msg, err) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: String(msg),
              error: err ? String(err.message) : null,
              stack: err ? String(err.stack) : null
            }));
          }
        } catch(e) {}
        console.error('[WebView]', msg, err);
      }
      
      log('스크립트 실행 시작');
      
      // 전역 변수
      var mapInstance = null;
      var cafeMarkers = [];
      var userMarker = null;
      var retryCount = 0;
      var maxRetries = 20; // 최대 20번 재시도 (약 6초)
      
      // 카페 마커 추가 함수
      function addCafeMarkers(cafes) {
        if (!mapInstance) {
          log('지도가 아직 준비되지 않았습니다.');
          return;
        }
        
        // 기존 카페 마커 제거
        cafeMarkers.forEach(function(marker) {
          marker.setMap(null);
        });
        cafeMarkers = [];
        
        if (!cafes || cafes.length === 0) {
          log('카페 데이터가 없습니다.');
          return;
        }
        
        log('카페 마커 추가 시작: ' + cafes.length + '개');
        
        cafes.forEach(function(cafe, index) {
          try {
            if (!cafe || typeof cafe.lat !== 'number' || typeof cafe.lng !== 'number') {
              log('카페 ' + index + ' 좌표 데이터 오류: ' + JSON.stringify(cafe));
              return;
            }
            
            log('마커 추가 시도: ' + cafe.name + ' (' + cafe.lat + ', ' + cafe.lng + ')');
            
            const marker = new kakao.maps.Marker({
              map: mapInstance,
              position: new kakao.maps.LatLng(cafe.lat, cafe.lng),
              title: cafe.name || '카페'
            });
            
            cafeMarkers.push(marker);
            log('마커 생성 완료: ' + cafe.name);
            
            kakao.maps.event.addListener(marker, 'click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerClick',
                cafe: cafe
              }));
            });
          } catch (err) {
            error('마커 생성 중 에러 (카페 ' + index + '):', err);
          }
        });
        
        log('모든 마커 추가 완료: ' + cafeMarkers.length + '개');
      }
      
      // 카페 마커 업데이트를 위한 전역 함수
      window.updateCafeMarkers = function(cafes) {
        log('updateCafeMarkers 호출: ' + cafes.length + '개');
        addCafeMarkers(cafes);
      };
      
      function initMap() {
        retryCount++;
        
        if (typeof kakao === 'undefined' || !kakao.maps) {
          if (retryCount <= maxRetries) {
            if (retryCount % 5 === 0) { // 5번마다만 로그 출력
              log('Kakao Maps API 로드 대기 중... (' + retryCount + '/' + maxRetries + ')');
            }
            setTimeout(initMap, 300);
          } else {
            error('Kakao Maps API 로드 실패: 최대 재시도 횟수 초과');
          }
          return;
        }
        
        log('Kakao Maps API 로드 확인됨');
        
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          error('#map 요소를 찾을 수 없습니다!');
          return;
        }
        
        log('지도 요소 찾음');
        
        try {
          kakao.maps.load(function() {
            log('kakao.maps.load 완료');
            
            try {
              const map = new kakao.maps.Map(mapElement, {
                center: new kakao.maps.LatLng(${userCoords.lat}, ${
      userCoords.lng
    }),
                level: 4
              });
              
              // 전역 변수에 지도 인스턴스 저장
              mapInstance = map;
              log('지도 생성 완료');

              // 지도 중심 변경 이벤트 리스너 (드래그 감지)
              kakao.maps.event.addListener(map, 'center_changed', function() {
                const center = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'centerChanged',
                  coords: {
                    lat: center.getLat(),
                    lng: center.getLng()
                  }
                }));
              });

              // 현재 위치 마커
              userMarker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(${userCoords.lat}, ${
      userCoords.lng
    }),
                title: '현재 위치'
              });
              
              log('현재 위치 마커 추가 완료');

              // 초기 카페 마커 추가
              const initialCafes = ${JSON.stringify(cafes)};
              if (initialCafes && initialCafes.length > 0) {
                addCafeMarkers(initialCafes);
              }
            } catch (err) {
              error('지도 생성 중 에러:', err);
            }
          });
        } catch (err) {
          error('kakao.maps.load 호출 중 에러:', err);
        }
      }
      
      // 스크립트 로드 확인
      function checkScriptLoaded() {
        var script = document.querySelector('script[src*="dapi.kakao.com"]');
        if (script && script.getAttribute('src')) {
          log('Kakao Maps 스크립트 태그 발견');
        } else {
          log('Kakao Maps 스크립트 태그를 찾을 수 없음');
        }
      }
      
      // DOM 준비 대기
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          log('DOMContentLoaded 이벤트 발생');
          checkScriptLoaded();
          setTimeout(initMap, 1000); // 스크립트 로드를 위해 더 긴 대기
        });
      } else {
        log('DOM 이미 로드됨');
        checkScriptLoaded();
        setTimeout(initMap, 1000);
      }
      
      // 스크립트 로드 에러 확인
      window.addEventListener('error', function(e) {
        if (e.filename && e.filename.indexOf('kakao') !== -1) {
          error('Kakao Maps 스크립트 로드 에러: ' + e.message);
        }
      }, true);
    })();
    true;
    `;
  }, [userCoords, cafes]);

  const webViewRef = useRef<WebView>(null);

  // 카페 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (webViewRef.current && cafes.length > 0) {
      const cafesJson = JSON.stringify(cafes);
      const script = `
        if (window.updateCafeMarkers) {
          window.updateCafeMarkers(${cafesJson});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
      console.log('🗺️ [KakaoMap] 카페 마커 업데이트:', cafes.length, '개');
    }
  }, [cafes]);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      javaScriptEnabled
      injectedJavaScript={script}
      onLoadStart={() => console.log('🗺️ [지도] WebView 로드 시작')}
      onLoadEnd={() => console.log('✅ [지도] WebView 로드 완료')}
      onError={syntheticEvent => {
        const { nativeEvent } = syntheticEvent;
        console.error('❌ [지도] WebView 에러:', nativeEvent);
      }}
      onMessage={event => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          // 로그 메시지 처리
          if (data.type === 'log') {
            console.log('📝 [WebView]', data.message);
            return;
          }

          // 에러 메시지 처리
          if (data.type === 'error') {
            console.error('❌ [WebView 에러]', data.message);
            if (data.error) {
              console.error('Error:', data.error);
            }
            if (data.stack) {
              console.error('Stack:', data.stack);
            }
            return;
          }

          // 지도 중심 변경 처리
          if (data.type === 'centerChanged' && data.coords) {
            onCenterChanged?.(data.coords);
            return;
          }

          // 마커 클릭 처리
          if (data.type === 'markerClick') {
            onMarkerPress?.(data.cafe);
            return;
          }

          // 기존 형식 호환 (cafe 객체만 전달된 경우)
          const cafe = data as Cafe;
          if (cafe.id && cafe.name) {
            onMarkerPress?.(cafe);
          }
        } catch (e) {
          console.error(
            '❌ [지도] 메시지 파싱 에러:',
            e,
            event.nativeEvent.data,
          );
        }
      }}
      source={{
        html: `
              <!doctype html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                  <script src="https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_JAVASCRIPT_KEY}"></script>
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      overflow: hidden;
                    }
                    #map {
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                </head>
                <body>
                  <div id="map"></div>
                </body>
              </html>`,
      }}
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
    />
  );
};

export default KakaoMap;
