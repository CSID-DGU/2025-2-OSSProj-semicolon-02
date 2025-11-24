USE caffit;

-- User 생성 (id는 자동으로 1이 됨)
INSERT INTO users (email, name, password) 
VALUES ('seohyun@gmail.com', 'seohyun', '12345678');

-- Beverage 생성 (beverage_id는 자동으로 1이 됨)
INSERT INTO beverages (name, caffeine_mg_per_serv, serving_ml, is_active) 
VALUES ('Americano', 150.0, 355.0, 1);

-- Cafe 데이터 추가 (한 번만 실행)
INSERT INTO cafe (name, address, lat, lng) VALUES
('스타벅스 강남점', '서울시 강남구 테헤란로 152', 37.4979, 127.0276),
('이디야커피 역삼점', '서울시 강남구 역삼동 737', 37.5000, 127.0300),
('할리스커피 선릉점', '서울시 강남구 선릉로 433', 37.5045, 127.0490),
('투썸플레이스 강남역점', '서울시 강남구 강남대로 396', 37.4980, 127.0280),
('카페베네 역삼점', '서울시 강남구 역삼동 681', 37.5010, 127.0310);

-- 확인
SELECT * FROM users WHERE id = 1;
SELECT * FROM beverages WHERE beverage_id = 1;
SELECT * FROM cafe;

