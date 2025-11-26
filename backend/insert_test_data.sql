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

-- Intake 추가는 더 이상 하지 않음 (사용자가 직접 추가)

-- 확인
SELECT * FROM users WHERE id = 1;
SELECT * FROM beverages WHERE name = 'Latte';

