-- AI管家演示彩排后清理测试账号(138000000xx)产生的订单/票/预订；seed.js 重灌可复位演示数据
-- 列名已核实：payment_record 用 orderId（src/modules/pay/entity/record.ts），其余明细表用 orderNo
DELETE FROM order_ticket WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_reservation WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_product WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM payment_record WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM food_reservation WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM travel_e_ticket WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
