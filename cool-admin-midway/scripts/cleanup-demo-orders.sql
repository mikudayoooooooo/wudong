-- AI管家演示彩排后清理测试账号(138000000xx)产生的订单/票/预订；seed.js 重灌可复位演示数据
-- 列名已核实：order 明细三表(order_ticket/order_reservation/order_product)与 payment_record 用 orderId，food_reservation/travel_e_ticket 用 userId
DELETE FROM order_ticket WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_reservation WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_product WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM payment_record WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM food_reservation WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM travel_e_ticket WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
