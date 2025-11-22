USE caffit;

-- User 생성 (id는 자동으로 1이 됨)
INSERT INTO users (email, name, password) 
VALUES ('seohyun@gmail.com', 'seohyun', '12345678');

-- Beverage 생성 (beverage_id는 자동으로 1이 됨)
INSERT INTO beverages (name, caffeine_mg_per_serv, serving_ml, is_active) 
VALUES ('Americano', 150.0, 355.0, 1);

-- 확인
SELECT * FROM users WHERE id = 1;
SELECT * FROM beverages WHERE beverage_id = 1;

