USE caffit;

-- User 생성 (이미 있으면 무시)
INSERT IGNORE INTO users (email, name, password) 
VALUES ('seohyun@gmail.com', 'seohyun', '12345678');

-- 중복된 Beverage 정리 (beverage_id 3, 4가 있으면 beverage_id 2로 통합 후 삭제)
-- 1단계: intakes에서 beverage_id 3, 4를 beverage_id 2로 변경
UPDATE intakes 
SET beverage_id = 2 
WHERE beverage_id IN (3, 4);

-- 2단계: beverage_id 3, 4 삭제
DELETE FROM beverages WHERE beverage_id IN (3, 4);

-- Beverage 추가 (같은 name이 이미 있으면 추가하지 않음)
INSERT INTO beverages (name, caffeine_mg_per_serv, serving_ml, is_active) 
SELECT 'Latte', 120.0, 355.0, 1
WHERE NOT EXISTS (
  SELECT 1 FROM beverages WHERE name = 'Latte'
);

INSERT INTO beverages (name, caffeine_mg_per_serv, serving_ml, is_active) 
SELECT 'Americano', 150.0, 355.0, 1
WHERE NOT EXISTS (
  SELECT 1 FROM beverages WHERE name = 'Americano'
);

-- Cafe 데이터 추가 (한 번만 실행)
INSERT INTO cafe (name, address, lat, lng) VALUES
('스타벅스 강남점', '서울시 강남구 테헤란로 152', 37.4979, 127.0276),
('이디야커피 역삼점', '서울시 강남구 역삼동 737', 37.5000, 127.0300),
('할리스커피 선릉점', '서울시 강남구 선릉로 433', 37.5045, 127.0490),
('투썸플레이스 강남역점', '서울시 강남구 강남대로 396', 37.4980, 127.0280),
('카페베네 역삼점', '서울시 강남구 역삼동 681', 37.5010, 127.0310);

-- 확인
SELECT * FROM users WHERE id = 1;
SELECT * FROM beverages WHERE name = 'Latte';
SELECT * FROM beverages WHERE beverage_id = 1;
SELECT * FROM cafe;

