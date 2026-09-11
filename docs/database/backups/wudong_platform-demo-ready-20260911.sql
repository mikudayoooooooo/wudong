-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: wudong_platform
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `wudong_platform`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `wudong_platform` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `wudong_platform`;

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT 'ç”¨æˆ·å',
  `password` varchar(255) NOT NULL COMMENT 'å¯†ç ï¼ˆbcryptåŠ å¯†ï¼‰',
  `real_name` varchar(50) NOT NULL COMMENT 'çœŸå®žå§“å',
  `role_id` int unsigned NOT NULL COMMENT 'è§’è‰²ID',
  `phone` varchar(11) DEFAULT NULL COMMENT 'æ‰‹æœºå·',
  `email` varchar(100) DEFAULT NULL COMMENT 'é‚®ç®±',
  `avatar` varchar(500) DEFAULT NULL COMMENT 'å¤´åƒ',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1æ­£å¸¸ 0ç¦ç”¨',
  `last_login_at` datetime DEFAULT NULL COMMENT 'æœ€åŽç™»å½•æ—¶é—´',
  `last_login_ip` varchar(45) DEFAULT NULL COMMENT 'æœ€åŽç™»å½•IP',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ç®¡ç†å‘˜è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (1,'admin','$2a$10$XxNKjI5EQvhRqN9mK.zQ5.8N8YJ9g0h5G5Y3Q8L0J9K5N6M7O8P9Q','è¶…çº§ç®¡ç†å‘˜',1,NULL,NULL,NULL,1,NULL,NULL,'2026-09-08 09:18:32','2026-09-08 09:18:32');
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `startTime` varchar(255) DEFAULT NULL COMMENT '生效开始时间',
  `endTime` varchar(255) DEFAULT NULL COMMENT '生效结束时间',
  `isTop` int NOT NULL DEFAULT '0' COMMENT '是否置顶',
  `createdBy` int DEFAULT NULL COMMENT '创建人ID',
  `type` int NOT NULL DEFAULT '1' COMMENT '类型：1系统 2活动',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态：1发布 0草稿',
  PRIMARY KEY (`id`),
  KEY `IDX_a901afc750f717aeba1df87880` (`createTime`),
  KEY `IDX_a77e6451dbbb27004b4e381568` (`updateTime`),
  KEY `IDX_26e70ab8a2e6f97cb234fa7d50` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (1,'中秋两日游余票紧张','中秋前后路线余票紧张，建议提前 3 天预订。','2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,NULL,1,1,1,1),(2,'新上线：银饰锻造体验票','银饰工坊体验票上线，体验 60 分钟锻造。','2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,NULL,0,1,2,1);
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banner`
--

DROP TABLE IF EXISTS `banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `image` varchar(500) NOT NULL COMMENT '图片URL',
  `position` varchar(20) NOT NULL COMMENT '位置：home/product/food/accommodation等',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `linkType` varchar(20) NOT NULL DEFAULT 'none' COMMENT '跳转类型',
  `linkValue` varchar(500) DEFAULT NULL COMMENT '跳转地址',
  `startTime` varchar(255) DEFAULT NULL COMMENT '生效开始时间',
  `endTime` varchar(255) DEFAULT NULL COMMENT '生效结束时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态：1启用 0禁用',
  PRIMARY KEY (`id`),
  KEY `IDX_f1d6d9b6b533cf80b8ae83a94c` (`createTime`),
  KEY `IDX_79efbf81c4fc414c03e73c0f9c` (`updateTime`),
  KEY `IDX_09812456a00de81966f6a26bc8` (`tenantId`),
  KEY `IDX_7dbb63a47a24092469798cd6ae` (`position`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner`
--

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES (1,'苗寨秋收节','ph-banner1','home',1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'page','/route',NULL,NULL,1),(2,'非遗体验周','ph-banner2','home',2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'page','/scenic',NULL,NULL,1);
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_conf`
--

DROP TABLE IF EXISTS `base_sys_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_conf` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cKey` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置键',
  `cValue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9be195d27767b4485417869c3a` (`cKey`),
  KEY `IDX_905208f206a3ff9fd513421971` (`createTime`),
  KEY `IDX_4c6f27f6ecefe51a5a196a047a` (`updateTime`),
  KEY `IDX_03fc424a2f8093a538730a7ff2` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_conf`
--

LOCK TABLES `base_sys_conf` WRITE;
/*!40000 ALTER TABLE `base_sys_conf` DISABLE KEYS */;
INSERT INTO `base_sys_conf` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'logKeep','31'),(2,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'recycleKeep','31'),(3,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'init_db_base','time consuming：127ms'),(4,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'init_db_dict','time consuming：74ms'),(5,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'init_db_task','time consuming：21ms'),(6,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'init_menu_base','success');
/*!40000 ALTER TABLE `base_sys_conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_department`
--

DROP TABLE IF EXISTS `base_sys_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门名称',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `parentId` int DEFAULT NULL COMMENT '上级部门ID',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_be4c53cd671384fa588ca9470a` (`createTime`),
  KEY `IDX_ca1473a793961ec55bc0c8d268` (`updateTime`),
  KEY `IDX_f19e8ffd9c62ddb17e76c8b9d7` (`tenantId`),
  KEY `IDX_f5fb5ac30b3609c27af3517727` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_department`
--

LOCK TABLES `base_sys_department` WRITE;
/*!40000 ALTER TABLE `base_sys_department` DISABLE KEYS */;
INSERT INTO `base_sys_department` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'COOL',NULL,NULL,0),(11,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'开发',NULL,12,2),(12,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'测试',NULL,1,1),(13,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'游客',NULL,1,3);
/*!40000 ALTER TABLE `base_sys_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_log`
--

DROP TABLE IF EXISTS `base_sys_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '用户ID',
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '行为',
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ip',
  `params` json DEFAULT NULL COMMENT '参数',
  PRIMARY KEY (`id`),
  KEY `IDX_c9382b76219a1011f7b8e7bcd1` (`createTime`),
  KEY `IDX_bfd44e885b470da43bcc39aaa7` (`updateTime`),
  KEY `IDX_384bde153859845bf0dcdc00f6` (`tenantId`),
  KEY `IDX_51a2caeb5713efdfcb343a8772` (`userId`),
  KEY `IDX_938f886fb40e163db174b7f6c3` (`action`),
  KEY `IDX_24e18767659f8c7142580893f2` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=3087 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_log`
--

LOCK TABLES `base_sys_log` WRITE;
/*!40000 ALTER TABLE `base_sys_log` DISABLE KEYS */;
INSERT INTO `base_sys_log` VALUES (1,'2026-09-08 17:23:13','2026-09-08 17:23:13',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(2,'2026-09-08 17:35:58','2026-09-08 17:35:58',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(3,'2026-09-08 17:35:59','2026-09-08 17:35:59',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(4,'2026-09-08 17:36:02','2026-09-08 17:36:02',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(5,'2026-09-08 17:36:02','2026-09-08 17:36:02',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(6,'2026-09-08 17:36:02','2026-09-08 17:36:02',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(7,'2026-09-08 17:36:10','2026-09-08 17:36:10',NULL,NULL,'/admin/base/open/captcha','127.0.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(8,'2026-09-08 17:36:22','2026-09-08 17:36:22',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"b9a8ec40-ab68-11f1-98f8-0db9a91f8887\", \"verifyCode\": \"c757\"}'),(9,'2026-09-08 17:36:23','2026-09-08 17:36:23',NULL,1,'/admin/base/comm/permmenu','127.0.0.1','{}'),(10,'2026-09-08 17:36:23','2026-09-08 17:36:23',NULL,1,'/admin/dict/info/data','127.0.0.1','{}'),(11,'2026-09-08 17:36:23','2026-09-08 17:36:23',NULL,1,'/admin/base/comm/person','127.0.0.1','{}'),(12,'2026-09-08 17:41:47','2026-09-08 17:41:47',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(13,'2026-09-08 17:41:48','2026-09-08 17:41:48',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(14,'2026-09-08 17:42:43','2026-09-08 17:42:43',NULL,1,'/admin/base/sys/param/page','127.0.0.1','{\"page\": 1, \"size\": 20}'),(15,'2026-09-09 10:10:03','2026-09-09 10:10:03',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{}'),(16,'2026-09-09 10:10:24','2026-09-09 10:10:24',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(17,'2026-09-09 10:13:32','2026-09-09 10:13:32',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"9e5f3bc0-abf3-11f1-ab5e-39b5b84d38ed\", \"verifyCode\": \"0zgt\"}'),(18,'2026-09-09 10:13:33','2026-09-09 10:13:33',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(19,'2026-09-09 10:13:33','2026-09-09 10:13:33',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(20,'2026-09-09 10:13:33','2026-09-09 10:13:33',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(21,'2026-09-09 16:06:29','2026-09-09 16:06:29',NULL,NULL,'/app/user/info/person','::1','{}'),(22,'2026-09-09 18:47:52','2026-09-09 18:47:52',NULL,NULL,'/app/user/login/captcha','127.0.0.1','{\"width\": \"100\", \"height\": \"40\"}'),(23,'2026-09-09 18:48:12','2026-09-09 18:48:12',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13811112222\"}'),(24,'2026-09-09 18:48:44','2026-09-09 18:48:44',NULL,NULL,'/app/member/login/register','127.0.0.1','{\"phone\": \"13811112222\", \"smsCode\": \"191735\", \"password\": \"abc123456\"}'),(25,'2026-09-09 18:48:58','2026-09-09 18:48:58',NULL,NULL,'/app/member/login/password','127.0.0.1','{\"phone\": \"13811112222\", \"password\": \"abc123456\"}'),(26,'2026-09-09 18:48:58','2026-09-09 18:48:58',NULL,NULL,'/app/member/info/person','127.0.0.1','{}'),(27,'2026-09-09 18:48:58','2026-09-09 18:48:58',NULL,NULL,'/app/member/info/person','127.0.0.1','{}'),(28,'2026-09-09 18:48:58','2026-09-09 18:48:58',NULL,NULL,'/app/member/favorite/toggle','127.0.0.1','{\"targetId\": 1, \"targetType\": \"scenic\"}'),(29,'2026-09-09 18:49:15','2026-09-09 18:49:15',NULL,NULL,'/app/member/info/person','127.0.0.1','{}'),(30,'2026-09-09 18:49:15','2026-09-09 18:49:15',NULL,NULL,'/swagger-ui/index.html','127.0.0.1','{}'),(31,'2026-09-09 18:49:33','2026-09-09 18:49:33',NULL,NULL,'/swagger-ui/json','127.0.0.1','{}'),(32,'2026-09-09 18:49:33','2026-09-09 18:49:33',NULL,NULL,'/swagger-doc.json','127.0.0.1','{}'),(33,'2026-09-09 18:49:33','2026-09-09 18:49:33',NULL,NULL,'/_open/api.json','127.0.0.1','{}'),(34,'2026-09-09 18:49:46','2026-09-09 18:49:46',NULL,NULL,'/swagger-ui/index.html','127.0.0.1','{}'),(35,'2026-09-09 18:49:57','2026-09-09 18:49:57',NULL,NULL,'/swagger-ui/index.html','127.0.0.1','{}'),(36,'2026-09-09 18:50:32','2026-09-09 18:50:32',NULL,NULL,'/swagger','127.0.0.1','{}'),(37,'2026-09-09 18:50:32','2026-09-09 18:50:32',NULL,NULL,'/swagger/json','127.0.0.1','{}'),(38,'2026-09-09 20:15:01','2026-09-09 20:15:01',NULL,NULL,'/app/user/login/captcha','127.0.0.1','{\"width\": \"100\", \"height\": \"40\"}'),(39,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800001111\"}'),(40,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,NULL,'/app/member/login/register','127.0.0.1','{\"phone\": \"13800001111\", \"smsCode\": \"717288\", \"password\": \"abc123456\"}'),(41,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,NULL,'/app/order/create','127.0.0.1','{\"items\": [{\"price\": 80, \"useDate\": \"2026-10-01\", \"quantity\": 3, \"targetId\": 1, \"targetName\": \"��կ����\", \"ticketName\": \"����Ʊ\"}], \"module\": \"travel\", \"orderType\": 4}'),(42,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,NULL,'/app/pay/create','127.0.0.1','{\"channel\": \"wechat\", \"orderNo\": \"202609092015236492846\"}'),(43,'2026-09-09 20:15:24','2026-09-09 20:15:24',NULL,NULL,'/app/pay/mock','127.0.0.1','{\"paymentNo\": \"PAY202609092015239257883\"}'),(44,'2026-09-09 20:15:24','2026-09-09 20:15:24',NULL,NULL,'/app/order/detail','127.0.0.1','{\"orderNo\": \"202609092015236492846\"}'),(45,'2026-09-09 20:15:24','2026-09-09 20:15:24',NULL,NULL,'/app/order/page','127.0.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(46,'2026-09-09 20:15:43','2026-09-09 20:15:43',NULL,NULL,'/swagger/json','127.0.0.1','{}'),(47,'2026-09-09 20:18:35','2026-09-09 20:18:35',NULL,NULL,'/app/user/login/captcha','127.0.0.1','{\"width\": \"100\", \"height\": \"40\"}'),(48,'2026-09-09 20:18:35','2026-09-09 20:18:35',NULL,NULL,'/app/order/page','127.0.0.1','{}'),(49,'2026-09-09 20:18:35','2026-09-09 20:18:35',NULL,NULL,'/app/order/order/page','127.0.0.1','{}'),(50,'2026-09-09 20:18:35','2026-09-09 20:18:35',NULL,NULL,'/app/pay/create','127.0.0.1','{}'),(51,'2026-09-09 20:18:35','2026-09-09 20:18:35',NULL,NULL,'/app/pay/pay/create','127.0.0.1','{}'),(52,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800002222\"}'),(53,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/member/login/register','127.0.0.1','{\"phone\": \"13800002222\", \"smsCode\": \"970395\", \"password\": \"abc123456\"}'),(54,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/order/page','127.0.0.1','{\"page\": \"1\", \"size\": \"1\"}'),(55,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/order/order/page','127.0.0.1','{\"page\": \"1\", \"size\": \"1\"}'),(56,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/pay/record','127.0.0.1','{\"orderNo\": \"1\"}'),(57,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,NULL,'/app/pay/pay/record','127.0.0.1','{\"orderNo\": \"1\"}'),(58,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/user/login/captcha','127.0.0.1','{\"width\": \"100\", \"height\": \"40\"}'),(59,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800003333\"}'),(60,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/member/login/register','127.0.0.1','{\"phone\": \"13800003333\", \"smsCode\": \"239933\", \"password\": \"abc123456\"}'),(61,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/merchant/apply','127.0.0.1','{\"idCard\": \"522301199001010011\", \"module\": \"product\", \"shopName\": \"��ʾ����\", \"idCardBack\": \"b\", \"contactName\": \"����\", \"idCardFront\": \"f\", \"contactPhone\": \"13800003333\", \"businessLicense\": \"l\"}'),(62,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/merchant/application','127.0.0.1','{}'),(63,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/app/message/unreadCount','127.0.0.1','{}'),(64,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,NULL,'/swagger/json','127.0.0.1','{}'),(65,'2026-09-09 21:11:51','2026-09-09 21:11:51',NULL,NULL,'/app/user/login/captcha','127.0.0.1','{\"width\": \"100\", \"height\": \"40\"}'),(66,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/operate/banner/list','127.0.0.1','{\"position\": \"home\"}'),(67,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(68,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800004444\"}'),(69,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/member/login/register','127.0.0.1','{\"phone\": \"13800004444\", \"smsCode\": \"948420\", \"password\": \"abc123456\"}'),(70,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/cart/add','127.0.0.1','{\"skuId\": 11, \"quantity\": 2, \"productId\": 1}'),(71,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,NULL,'/app/cart/page','127.0.0.1','{\"page\": \"1\", \"size\": \"1\"}'),(72,'2026-09-09 22:45:07','2026-09-09 22:45:07',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(73,'2026-09-09 22:45:08','2026-09-09 22:45:08',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800000001\"}'),(74,'2026-09-09 22:45:08','2026-09-09 22:45:08',NULL,NULL,'/app/member/login/password','127.0.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(75,'2026-09-09 22:45:08','2026-09-09 22:45:08',NULL,NULL,'/app/travel/ticket/my','127.0.0.1','{}'),(76,'2026-09-10 08:36:03','2026-09-10 08:36:03',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(77,'2026-09-10 08:56:08','2026-09-10 08:56:08',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(78,'2026-09-10 08:56:23','2026-09-10 08:56:23',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"68e74860-acb2-11f1-a1f2-c30deabd4bbb\", \"verifyCode\": \"d13o\"}'),(79,'2026-09-10 08:56:23','2026-09-10 08:56:23',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(80,'2026-09-10 08:56:23','2026-09-10 08:56:23',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(81,'2026-09-10 08:56:23','2026-09-10 08:56:23',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(82,'2026-09-10 08:56:27','2026-09-10 08:56:27',NULL,1,'/admin/plugin/info/page','172.18.0.1','{\"size\": 1000}'),(83,'2026-09-10 08:56:30','2026-09-10 08:56:30',NULL,1,'/admin/user/info/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(84,'2026-09-10 08:56:34','2026-09-10 08:56:34',NULL,1,'/admin/dict/type/page','172.18.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(85,'2026-09-10 08:56:34','2026-09-10 08:56:34',NULL,1,'/admin/dict/info/list','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"orderNum\", \"typeId\": 19}'),(86,'2026-09-10 08:56:34','2026-09-10 08:56:34',NULL,1,'/admin/dict/info/data','172.18.0.1','{\"types\": [\"brand\"]}'),(87,'2026-09-10 08:56:36','2026-09-10 08:56:36',NULL,1,'/admin/space/type/page','172.18.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(88,'2026-09-10 08:56:37','2026-09-10 08:56:37',NULL,1,'/admin/recycle/data/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(89,'2026-09-10 08:56:42','2026-09-10 08:56:42',NULL,1,'/admin/base/sys/department/list','172.18.0.1','{}'),(90,'2026-09-10 08:56:42','2026-09-10 08:56:42',NULL,1,'/admin/base/sys/user/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(91,'2026-09-10 08:56:44','2026-09-10 08:56:44',NULL,1,'/admin/base/open/eps','172.18.0.1','{}'),(92,'2026-09-10 08:56:44','2026-09-10 08:56:44',NULL,1,'/admin/base/sys/menu/list','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(93,'2026-09-10 08:56:44','2026-09-10 08:56:44',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(94,'2026-09-10 08:56:51','2026-09-10 08:56:51',NULL,1,'/admin/base/sys/menu/update','172.18.0.1','{\"id\": 40, \"isShow\": true}'),(95,'2026-09-10 08:57:23','2026-09-10 08:57:23',NULL,1,'/admin/base/sys/param/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(96,'2026-09-10 08:57:25','2026-09-10 08:57:25',NULL,1,'/admin/base/sys/log/getKeep','172.18.0.1','{}'),(97,'2026-09-10 08:57:25','2026-09-10 08:57:25',NULL,1,'/admin/base/sys/log/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(98,'2026-09-10 08:57:32','2026-09-10 08:57:32',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(99,'2026-09-10 08:57:32','2026-09-10 08:57:32',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(100,'2026-09-10 08:57:32','2026-09-10 08:57:32',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(101,'2026-09-10 08:57:32','2026-09-10 08:57:32',NULL,1,'/admin/base/sys/log/getKeep','172.18.0.1','{}'),(102,'2026-09-10 08:57:32','2026-09-10 08:57:32',NULL,1,'/admin/base/sys/log/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(103,'2026-09-10 09:03:30','2026-09-10 09:03:30',NULL,NULL,'/swagger','127.0.0.1','{}'),(104,'2026-09-10 09:03:49','2026-09-10 09:03:49',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(105,'2026-09-10 10:46:56','2026-09-10 10:46:56',NULL,NULL,'/app/accommodation/hotel/search','127.0.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(106,'2026-09-10 10:46:56','2026-09-10 10:46:56',NULL,NULL,'/app/operate/banner/list','127.0.0.1','{\"position\": \"home\"}'),(107,'2026-09-10 10:46:56','2026-09-10 10:46:56',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(108,'2026-09-10 10:46:56','2026-09-10 10:46:56',NULL,NULL,'/app/accommodation/hotel/detail','127.0.0.1','{\"id\": \"1\"}'),(109,'2026-09-10 10:49:50','2026-09-10 10:49:50',NULL,NULL,'/app/accommodation/hotel/search','127.0.0.1','{\"page\": \"1\", \"size\": \"20\"}'),(110,'2026-09-10 10:52:12','2026-09-10 10:52:12',NULL,NULL,'/app/accommodation/hotel/detail','127.0.0.1','{\"id\": \"1\"}'),(111,'2026-09-10 10:56:23','2026-09-10 10:56:23',NULL,NULL,'/app/accommodation/room-type/calendar','127.0.0.1','{\"endDate\": \"2026-10-09\", \"startDate\": \"2026-09-10\", \"roomTypeId\": \"1\"}'),(112,'2026-09-10 11:05:34','2026-09-10 11:05:34',NULL,NULL,'/app/accommodation/hotel/search','127.0.0.1','{\"page\": \"1\", \"size\": \"20\"}'),(113,'2026-09-10 11:05:35','2026-09-10 11:05:35',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(114,'2026-09-10 11:05:35','2026-09-10 11:05:35',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(115,'2026-09-10 11:05:35','2026-09-10 11:05:35',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(116,'2026-09-10 11:05:36','2026-09-10 11:05:36',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(117,'2026-09-10 11:05:37','2026-09-10 11:05:37',NULL,NULL,'/app/accommodation/hotel/search','127.0.0.1','{\"page\": \"1\", \"size\": \"20\"}'),(118,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(119,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(120,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(121,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(122,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(123,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(124,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(125,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"15\"}'),(126,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"14\"}'),(127,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"16\"}'),(128,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(129,'2026-09-10 11:05:39','2026-09-10 11:05:39',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(130,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(131,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(132,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(133,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(134,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(135,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(136,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(137,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"16\"}'),(138,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"14\"}'),(139,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"15\"}'),(140,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(141,'2026-09-10 11:11:17','2026-09-10 11:11:17',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(142,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(143,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(144,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(145,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(146,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(147,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(148,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(149,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"16\"}'),(150,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"14\"}'),(151,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"15\"}'),(152,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(153,'2026-09-10 11:23:16','2026-09-10 11:23:16',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(154,'2026-09-10 15:23:43','2026-09-10 15:23:43',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(155,'2026-09-10 15:23:43','2026-09-10 15:23:43',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(156,'2026-09-10 15:23:43','2026-09-10 15:23:43',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MDAxNzgzLCJleHAiOjE3OTAyOTc3ODN9.BmbYUg_8gwzs125h1-jACZwp3JUONJNbQJdyvr07tkE\"}'),(157,'2026-09-10 15:23:44','2026-09-10 15:23:44',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(158,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(159,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(160,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(161,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"size\": \"2\"}'),(162,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(163,'2026-09-10 15:30:08','2026-09-10 15:30:08',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(164,'2026-09-10 15:32:07','2026-09-10 15:32:07',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{}'),(165,'2026-09-10 15:32:07','2026-09-10 15:32:07',NULL,NULL,'/app/member/login/smsCode','172.18.0.1','{\"phone\": \"13800000001\"}'),(166,'2026-09-10 15:34:35','2026-09-10 15:34:35',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(167,'2026-09-10 15:34:35','2026-09-10 15:34:35',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(168,'2026-09-10 15:34:35','2026-09-10 15:34:35',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(169,'2026-09-10 15:34:36','2026-09-10 15:34:36',NULL,NULL,'/','172.18.0.1','{}'),(170,'2026-09-10 16:05:39','2026-09-10 16:05:39',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(171,'2026-09-10 16:05:39','2026-09-10 16:05:39',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(172,'2026-09-10 16:05:39','2026-09-10 16:05:39',NULL,NULL,'/app/member/login/smsCode','127.0.0.1','{\"phone\": \"13800000001\"}'),(173,'2026-09-10 16:25:19','2026-09-10 16:25:19',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(174,'2026-09-10 16:25:19','2026-09-10 16:25:19',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(175,'2026-09-10 16:25:20','2026-09-10 16:25:20',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(176,'2026-09-10 16:25:20','2026-09-10 16:25:20',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"size\": \"2\"}'),(177,'2026-09-10 16:25:20','2026-09-10 16:25:20',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(178,'2026-09-10 16:25:20','2026-09-10 16:25:20',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(179,'2026-09-10 16:32:32','2026-09-10 16:32:32',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(180,'2026-09-10 16:32:33','2026-09-10 16:32:33',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(181,'2026-09-10 16:32:34','2026-09-10 16:32:34',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(182,'2026-09-10 16:32:35','2026-09-10 16:32:35',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(183,'2026-09-10 16:32:35','2026-09-10 16:32:35',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(184,'2026-09-10 16:40:39','2026-09-10 16:40:39',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(185,'2026-09-10 16:40:39','2026-09-10 16:40:39',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(186,'2026-09-10 16:40:39','2026-09-10 16:40:39',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(187,'2026-09-10 16:45:32','2026-09-10 16:45:32',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(188,'2026-09-10 16:45:33','2026-09-10 16:45:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(189,'2026-09-10 16:45:33','2026-09-10 16:45:33',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(190,'2026-09-10 16:45:34','2026-09-10 16:45:34',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"size\": \"2\"}'),(191,'2026-09-10 16:45:34','2026-09-10 16:45:34',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(192,'2026-09-10 16:45:34','2026-09-10 16:45:34',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(193,'2026-09-10 16:49:20','2026-09-10 16:49:20',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(194,'2026-09-10 16:49:20','2026-09-10 16:49:20',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(195,'2026-09-10 17:09:40','2026-09-10 17:09:40',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(196,'2026-09-10 17:09:40','2026-09-10 17:09:40',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(197,'2026-09-10 17:09:41','2026-09-10 17:09:41',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(198,'2026-09-10 17:09:41','2026-09-10 17:09:41',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"size\": \"2\"}'),(199,'2026-09-10 17:09:41','2026-09-10 17:09:41',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(200,'2026-09-10 17:09:42','2026-09-10 17:09:42',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(201,'2026-09-10 17:14:13','2026-09-10 17:14:13',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(202,'2026-09-10 17:14:13','2026-09-10 17:14:13',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(203,'2026-09-10 17:14:15','2026-09-10 17:14:15',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(204,'2026-09-10 17:14:16','2026-09-10 17:14:16',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(205,'2026-09-10 17:14:17','2026-09-10 17:14:17',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(206,'2026-09-10 17:26:49','2026-09-10 17:26:49',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(207,'2026-09-10 17:42:02','2026-09-10 17:42:02',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(208,'2026-09-10 17:42:02','2026-09-10 17:42:02',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"2\"}'),(209,'2026-09-10 17:44:08','2026-09-10 17:44:08',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(210,'2026-09-10 17:44:08','2026-09-10 17:44:08',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(211,'2026-09-10 17:44:08','2026-09-10 17:44:08',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(212,'2026-09-10 17:44:08','2026-09-10 17:44:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(213,'2026-09-10 17:44:08','2026-09-10 17:44:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(214,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(215,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(216,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"15\"}'),(217,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(218,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"16\"}'),(219,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(220,'2026-09-10 17:44:09','2026-09-10 17:44:09',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(221,'2026-09-10 17:46:07','2026-09-10 17:46:07',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(222,'2026-09-10 17:46:07','2026-09-10 17:46:07',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(223,'2026-09-10 17:46:07','2026-09-10 17:46:07',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(224,'2026-09-10 17:46:07','2026-09-10 17:46:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(225,'2026-09-10 17:46:07','2026-09-10 17:46:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(226,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(227,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(228,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"15\"}'),(229,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(230,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"16\"}'),(231,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(232,'2026-09-10 17:46:08','2026-09-10 17:46:08',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(233,'2026-09-10 17:46:20','2026-09-10 17:46:20',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(234,'2026-09-10 17:46:23','2026-09-10 17:46:23',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(235,'2026-09-10 17:46:23','2026-09-10 17:46:23',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(236,'2026-09-10 17:46:23','2026-09-10 17:46:23',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(237,'2026-09-10 17:46:27','2026-09-10 17:46:27',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"20\"}'),(238,'2026-09-10 17:46:31','2026-09-10 17:46:31',NULL,NULL,'/app/accommodation/hotel/detail','172.18.0.1','{\"id\": \"3\"}'),(239,'2026-09-10 17:46:40','2026-09-10 17:46:40',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(240,'2026-09-10 17:46:42','2026-09-10 17:46:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(241,'2026-09-10 17:46:42','2026-09-10 17:46:42',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(242,'2026-09-10 17:46:50','2026-09-10 17:46:50',NULL,NULL,'/app/travel/inventory/list','172.18.0.1','{\"itemId\": \"1\", \"itemType\": \"route\"}'),(243,'2026-09-10 17:47:10','2026-09-10 17:47:10',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"1234567891\", \"password\": \"1\"}'),(244,'2026-09-10 17:47:20','2026-09-10 17:47:20',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \" abc123456\"}'),(245,'2026-09-10 17:47:32','2026-09-10 17:47:32',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(246,'2026-09-10 17:47:33','2026-09-10 17:47:33',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(247,'2026-09-10 17:47:36','2026-09-10 17:47:36',NULL,NULL,'/app/travel/inventory/list','172.18.0.1','{\"itemId\": \"1\", \"itemType\": \"route\"}'),(248,'2026-09-10 17:47:39','2026-09-10 17:47:39',NULL,NULL,'/app/travel/booking/create','172.18.0.1','{\"itemId\": 1, \"useDate\": \"2026-09-13\", \"itemType\": \"route\", \"quantity\": 2}'),(249,'2026-09-10 17:47:40','2026-09-10 17:47:40',NULL,NULL,'/app/pay/create','172.18.0.1','{\"channel\": \"wechat\", \"orderNo\": \"202609101747400171087\"}'),(250,'2026-09-10 17:47:40','2026-09-10 17:47:40',NULL,NULL,'/app/pay/mock','172.18.0.1','{\"paymentNo\": \"PAY202609101747407145343\"}'),(251,'2026-09-10 17:47:49','2026-09-10 17:47:49',NULL,NULL,'/app/travel/ticket/my','172.18.0.1','{}'),(252,'2026-09-10 17:47:54','2026-09-10 17:47:54',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(253,'2026-09-10 17:47:59','2026-09-10 17:47:59',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(254,'2026-09-10 17:47:59','2026-09-10 17:47:59',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(255,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(256,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(257,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(258,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(259,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(260,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"15\"}'),(261,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"16\"}'),(262,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(263,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(264,'2026-09-10 17:48:00','2026-09-10 17:48:00',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(265,'2026-09-10 17:48:49','2026-09-10 17:48:49',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(266,'2026-09-10 17:48:49','2026-09-10 17:48:49',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(267,'2026-09-10 17:54:50','2026-09-10 17:54:50',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(268,'2026-09-10 17:54:54','2026-09-10 17:54:54',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(269,'2026-09-10 17:54:54','2026-09-10 17:54:54',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(270,'2026-09-10 17:54:54','2026-09-10 17:54:54',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(271,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(272,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(273,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(274,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(275,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"16\"}'),(276,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"15\"}'),(277,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(278,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(279,'2026-09-10 17:54:55','2026-09-10 17:54:55',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(280,'2026-09-10 17:54:56','2026-09-10 17:54:56',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(281,'2026-09-10 17:54:56','2026-09-10 17:54:56',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(282,'2026-09-10 17:54:56','2026-09-10 17:54:56',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(283,'2026-09-10 17:54:59','2026-09-10 17:54:59',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(284,'2026-09-10 17:55:13','2026-09-10 17:55:13',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(285,'2026-09-10 17:55:14','2026-09-10 17:55:14',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(286,'2026-09-10 17:55:18','2026-09-10 17:55:18',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(287,'2026-09-10 17:55:18','2026-09-10 17:55:18',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(288,'2026-09-10 17:55:22','2026-09-10 17:55:22',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(289,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(290,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(291,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(292,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(293,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(294,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(295,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(296,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"16\"}'),(297,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"14\"}'),(298,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"15\"}'),(299,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(300,'2026-09-10 17:55:55','2026-09-10 17:55:55',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(301,'2026-09-10 17:55:58','2026-09-10 17:55:58',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(302,'2026-09-10 17:56:35','2026-09-10 17:56:35',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(303,'2026-09-10 17:56:35','2026-09-10 17:56:35',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(304,'2026-09-10 17:56:35','2026-09-10 17:56:35',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(305,'2026-09-10 18:05:25','2026-09-10 18:05:25',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(306,'2026-09-10 18:05:26','2026-09-10 18:05:26',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(307,'2026-09-10 18:05:27','2026-09-10 18:05:27',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(308,'2026-09-10 18:05:27','2026-09-10 18:05:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(309,'2026-09-10 18:05:28','2026-09-10 18:05:28',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(310,'2026-09-10 18:05:29','2026-09-10 18:05:29',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"size\": \"10\"}'),(311,'2026-09-10 18:05:30','2026-09-10 18:05:30',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(312,'2026-09-10 18:05:30','2026-09-10 18:05:30',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(313,'2026-09-10 18:05:31','2026-09-10 18:05:31',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"5\"}'),(314,'2026-09-10 18:05:31','2026-09-10 18:05:31',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(315,'2026-09-10 18:05:48','2026-09-10 18:05:48',NULL,NULL,'/app/community/post/detail','172.18.0.1','{\"id\": \"601\"}'),(316,'2026-09-10 18:05:48','2026-09-10 18:05:48',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(317,'2026-09-10 18:08:07','2026-09-10 18:08:07',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"5\"}'),(318,'2026-09-10 18:08:07','2026-09-10 18:08:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(319,'2026-09-10 18:08:08','2026-09-10 18:08:08',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(320,'2026-09-10 18:08:08','2026-09-10 18:08:08',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{}'),(321,'2026-09-10 18:08:09','2026-09-10 18:08:09',NULL,NULL,'/notexist','172.18.0.1','{}'),(322,'2026-09-10 18:26:58','2026-09-10 18:26:58',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(323,'2026-09-10 18:26:58','2026-09-10 18:26:58',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(324,'2026-09-10 18:26:58','2026-09-10 18:26:58',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(325,'2026-09-10 18:26:58','2026-09-10 18:26:58',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(326,'2026-09-10 18:27:02','2026-09-10 18:27:02',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(327,'2026-09-10 18:27:02','2026-09-10 18:27:02',NULL,NULL,'/app/community/post/detail','172.18.0.1','{\"id\": \"601\"}'),(328,'2026-09-10 18:27:03','2026-09-10 18:27:03',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(329,'2026-09-10 18:30:52','2026-09-10 18:30:52',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(330,'2026-09-10 18:46:16','2026-09-10 18:46:16',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(331,'2026-09-10 18:46:17','2026-09-10 18:46:17',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(332,'2026-09-10 18:46:19','2026-09-10 18:46:19',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(333,'2026-09-10 18:46:20','2026-09-10 18:46:20',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(334,'2026-09-10 18:46:21','2026-09-10 18:46:21',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(335,'2026-09-10 18:47:43','2026-09-10 18:47:43',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(336,'2026-09-10 18:47:44','2026-09-10 18:47:44',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(337,'2026-09-10 18:47:45','2026-09-10 18:47:45',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(338,'2026-09-10 18:47:47','2026-09-10 18:47:47',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(339,'2026-09-10 18:47:47','2026-09-10 18:47:47',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(340,'2026-09-10 20:15:17','2026-09-10 20:15:17',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(341,'2026-09-10 20:15:20','2026-09-10 20:15:20',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(342,'2026-09-10 20:15:20','2026-09-10 20:15:20',NULL,NULL,'/admin/base/comm/program','172.18.0.1','{}'),(343,'2026-09-10 20:15:21','2026-09-10 20:15:21',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(344,'2026-09-10 20:15:21','2026-09-10 20:15:21',NULL,NULL,'/admin/dict/info/types','172.18.0.1','{}'),(345,'2026-09-10 22:19:59','2026-09-10 22:19:59',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MDI1MDIzLCJleHAiOjE3OTAzMjEwMjN9.hTLqGH1sJQb7pLXrsxiydCfMPQakE2-wkd5q_-KdFm4\"}'),(346,'2026-09-10 22:19:59','2026-09-10 22:19:59',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(347,'2026-09-10 22:20:00','2026-09-10 22:20:00',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(348,'2026-09-10 22:19:59','2026-09-10 22:19:59',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(349,'2026-09-10 22:20:05','2026-09-10 22:20:05',NULL,1,'/admin/base/sys/param/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(350,'2026-09-10 22:20:08','2026-09-10 22:20:08',NULL,1,'/admin/user/info/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(351,'2026-09-10 23:43:24','2026-09-10 23:43:24',NULL,NULL,'/app/operate/banner/list','172.18.0.5','{\"position\": \"home\"}'),(352,'2026-09-11 07:56:11','2026-09-11 07:56:11',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MDQ5OTk5LCJleHAiOjE3OTAzNDU5OTl9._kWhkHs0bgGTrUBSsu92wGl8GfikzWBHLPWd9QO9t_c\"}'),(353,'2026-09-11 07:56:12','2026-09-11 07:56:12',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(354,'2026-09-11 07:56:12','2026-09-11 07:56:12',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(355,'2026-09-11 07:56:12','2026-09-11 07:56:12',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(356,'2026-09-11 07:56:17','2026-09-11 07:56:17',NULL,NULL,'/','172.18.0.1','{}'),(357,'2026-09-11 08:01:39','2026-09-11 08:01:39',NULL,NULL,'/app/food/restaurant/3','172.18.0.5','{}'),(358,'2026-09-11 08:01:39','2026-09-11 08:01:39',NULL,NULL,'/app/food/restaurant/3','172.18.0.5','{}'),(359,'2026-09-11 08:09:24','2026-09-11 08:09:24',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(360,'2026-09-11 08:09:24','2026-09-11 08:09:24',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(361,'2026-09-11 08:09:24','2026-09-11 08:09:24',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(362,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(363,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(364,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(365,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(366,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(367,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(368,'2026-09-11 08:09:28','2026-09-11 08:09:28',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(369,'2026-09-11 08:09:29','2026-09-11 08:09:29',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(370,'2026-09-11 08:09:29','2026-09-11 08:09:29',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(371,'2026-09-11 08:09:29','2026-09-11 08:09:29',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(372,'2026-09-11 08:09:29','2026-09-11 08:09:29',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(373,'2026-09-11 08:09:29','2026-09-11 08:09:29',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(374,'2026-09-11 08:10:56','2026-09-11 08:10:56',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(375,'2026-09-11 08:10:56','2026-09-11 08:10:56',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(376,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(377,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(378,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(379,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(380,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(381,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(382,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(383,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(384,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(385,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(386,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(387,'2026-09-11 08:31:35','2026-09-11 08:31:35',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(388,'2026-09-11 08:31:37','2026-09-11 08:31:37',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(389,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(390,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(391,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(392,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(393,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(394,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(395,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(396,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(397,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(398,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(399,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(400,'2026-09-11 08:31:39','2026-09-11 08:31:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(401,'2026-09-11 08:31:43','2026-09-11 08:31:43',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(402,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(403,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(404,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(405,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(406,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(407,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(408,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(409,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(410,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(411,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(412,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(413,'2026-09-11 08:31:46','2026-09-11 08:31:46',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(414,'2026-09-11 08:43:58','2026-09-11 08:43:58',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(415,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(416,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(417,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(418,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(419,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(420,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(421,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(422,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(423,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(424,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(425,'2026-09-11 08:43:59','2026-09-11 08:43:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(426,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(427,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(428,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(429,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(430,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(431,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(432,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(433,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(434,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(435,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(436,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(437,'2026-09-11 08:50:01','2026-09-11 08:50:01',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(438,'2026-09-11 08:50:45','2026-09-11 08:50:45',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(439,'2026-09-11 08:50:45','2026-09-11 08:50:45',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(440,'2026-09-11 08:50:45','2026-09-11 08:50:45',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(441,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(442,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(443,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(444,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(445,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(446,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(447,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(448,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(449,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(450,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(451,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(452,'2026-09-11 08:50:59','2026-09-11 08:50:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(453,'2026-09-11 08:51:34','2026-09-11 08:51:34',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(454,'2026-09-11 08:51:35','2026-09-11 08:51:35',NULL,NULL,'/app/travel/scenic/detail','172.18.0.5','{\"id\": \"5\"}'),(455,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(456,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(457,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(458,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(459,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(460,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(461,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(462,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(463,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(464,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(465,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(466,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(467,'2026-09-11 08:51:38','2026-09-11 08:51:38',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(468,'2026-09-11 08:51:39','2026-09-11 08:51:39',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(469,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(470,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(471,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(472,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(473,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(474,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(475,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(476,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(477,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(478,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(479,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(480,'2026-09-11 08:51:40','2026-09-11 08:51:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(481,'2026-09-11 08:51:42','2026-09-11 08:51:42',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(482,'2026-09-11 08:51:43','2026-09-11 08:51:43',NULL,NULL,'/app/accommodation/hotel/detail','172.18.0.5','{\"id\": \"3\"}'),(483,'2026-09-11 08:51:44','2026-09-11 08:51:44',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(484,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(485,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(486,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(487,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(488,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(489,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(490,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(491,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(492,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(493,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(494,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(495,'2026-09-11 08:51:45','2026-09-11 08:51:45',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(496,'2026-09-11 08:51:46','2026-09-11 08:51:46',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(497,'2026-09-11 08:51:46','2026-09-11 08:51:46',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(498,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(499,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(500,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(501,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(502,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(503,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(504,'2026-09-11 08:51:47','2026-09-11 08:51:47',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(505,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(506,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(507,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(508,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(509,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(510,'2026-09-11 08:51:48','2026-09-11 08:51:48',NULL,NULL,'/app/food/restaurant/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(511,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(512,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(513,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(514,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(515,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(516,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(517,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(518,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(519,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(520,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(521,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(522,'2026-09-11 08:51:50','2026-09-11 08:51:50',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(523,'2026-09-11 08:51:51','2026-09-11 08:51:51',NULL,NULL,'/app/food/farm-product/categories','172.18.0.5','{}'),(524,'2026-09-11 08:51:52','2026-09-11 08:51:52',NULL,NULL,'/app/food/farm-product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(525,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(526,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(527,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(528,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(529,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(530,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(531,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(532,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(533,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(534,'2026-09-11 08:51:53','2026-09-11 08:51:53',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(535,'2026-09-11 08:51:54','2026-09-11 08:51:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(536,'2026-09-11 08:51:54','2026-09-11 08:51:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(537,'2026-09-11 08:51:55','2026-09-11 08:51:55',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(538,'2026-09-11 08:51:55','2026-09-11 08:51:55',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(539,'2026-09-11 08:51:55','2026-09-11 08:51:55',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(540,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(541,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(542,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(543,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(544,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(545,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(546,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(547,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(548,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(549,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(550,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(551,'2026-09-11 08:51:56','2026-09-11 08:51:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(552,'2026-09-11 08:51:58','2026-09-11 08:51:58',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(553,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(554,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(555,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(556,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(557,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(558,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(559,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(560,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(561,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(562,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"22\"}'),(563,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"24\"}'),(564,'2026-09-11 08:51:59','2026-09-11 08:51:59',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"23\"}'),(565,'2026-09-11 09:00:06','2026-09-11 09:00:06',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(566,'2026-09-11 09:00:06','2026-09-11 09:00:06',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(567,'2026-09-11 09:00:07','2026-09-11 09:00:07',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(568,'2026-09-11 09:00:16','2026-09-11 09:00:16',NULL,1,'/admin/user/info/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(569,'2026-09-11 09:00:39','2026-09-11 09:00:39',NULL,NULL,'/','172.18.0.1','{}'),(570,'2026-09-11 09:00:49','2026-09-11 09:00:49',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(571,'2026-09-11 09:00:49','2026-09-11 09:00:49',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(572,'2026-09-11 09:00:49','2026-09-11 09:00:49',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(573,'2026-09-11 09:01:47','2026-09-11 09:01:47',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(574,'2026-09-11 09:01:58','2026-09-11 09:01:58',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(575,'2026-09-11 09:01:58','2026-09-11 09:01:58',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(576,'2026-09-11 09:01:59','2026-09-11 09:01:59',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(577,'2026-09-11 09:02:02','2026-09-11 09:02:02',NULL,1,'/admin/space/type/page','172.18.0.1','{\"page\": 1, \"size\": 50, \"sort\": \"asc\", \"order\": \"createTime\", \"keyWord\": \"\"}'),(578,'2026-09-11 09:02:04','2026-09-11 09:02:04',NULL,1,'/admin/user/info/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(579,'2026-09-11 09:05:55','2026-09-11 09:05:55',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(580,'2026-09-11 09:05:55','2026-09-11 09:05:55',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(581,'2026-09-11 09:05:55','2026-09-11 09:05:55',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(582,'2026-09-11 09:05:55','2026-09-11 09:05:55',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(583,'2026-09-11 09:05:55','2026-09-11 09:05:55',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(584,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(585,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(586,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(587,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(588,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(589,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(590,'2026-09-11 09:05:56','2026-09-11 09:05:56',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(591,'2026-09-11 09:06:58','2026-09-11 09:06:58',NULL,1,'/admin/base/sys/department/list','172.18.0.1','{}'),(592,'2026-09-11 09:06:59','2026-09-11 09:06:59',NULL,1,'/admin/base/sys/user/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\", \"departmentIds\": [1, 12, 11, 13]}'),(593,'2026-09-11 09:07:00','2026-09-11 09:07:00',NULL,1,'/admin/base/open/eps','172.18.0.1','{}'),(594,'2026-09-11 09:07:00','2026-09-11 09:07:00',NULL,1,'/admin/base/sys/menu/list','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"asc\", \"order\": \"orderNum\"}'),(595,'2026-09-11 09:07:00','2026-09-11 09:07:00',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(596,'2026-09-11 09:07:10','2026-09-11 09:07:10',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(597,'2026-09-11 09:07:10','2026-09-11 09:07:10',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(598,'2026-09-11 09:07:10','2026-09-11 09:07:10',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(599,'2026-09-11 09:07:33','2026-09-11 09:07:33',NULL,1,'/admin/task/info/page','172.18.0.1','{\"page\": 1, \"size\": 100}'),(600,'2026-09-11 09:14:27','2026-09-11 09:14:27',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(601,'2026-09-11 09:14:27','2026-09-11 09:14:27',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(602,'2026-09-11 09:14:37','2026-09-11 09:14:37',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(603,'2026-09-11 09:14:37','2026-09-11 09:14:37',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(604,'2026-09-11 09:14:37','2026-09-11 09:14:37',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(605,'2026-09-11 09:14:37','2026-09-11 09:14:37',NULL,1,'/admin/task/info/page','172.18.0.1','{\"page\": 1, \"size\": 100}'),(606,'2026-09-11 09:14:42','2026-09-11 09:14:42',NULL,1,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(607,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(608,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(609,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(610,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(611,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(612,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(613,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(614,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(615,'2026-09-11 09:55:43','2026-09-11 09:55:43',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(616,'2026-09-11 09:55:44','2026-09-11 09:55:44',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(617,'2026-09-11 09:55:44','2026-09-11 09:55:44',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(618,'2026-09-11 09:55:44','2026-09-11 09:55:44',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(619,'2026-09-11 09:58:29','2026-09-11 09:58:29',NULL,NULL,'/app/member/login/password','172.18.0.5','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(620,'2026-09-11 09:58:29','2026-09-11 09:58:29',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(621,'2026-09-11 09:58:29','2026-09-11 09:58:29',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(622,'2026-09-11 09:59:00','2026-09-11 09:59:00',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(623,'2026-09-11 09:59:30','2026-09-11 09:59:30',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(624,'2026-09-11 10:00:01','2026-09-11 10:00:01',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(625,'2026-09-11 10:00:08','2026-09-11 10:00:08',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(626,'2026-09-11 10:00:08','2026-09-11 10:00:08',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(627,'2026-09-11 10:00:10','2026-09-11 10:00:10',NULL,NULL,'/app/food/restaurant/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(628,'2026-09-11 10:00:14','2026-09-11 10:00:14',NULL,NULL,'/app/food/farm-product/categories','172.18.0.5','{}'),(629,'2026-09-11 10:00:14','2026-09-11 10:00:14',NULL,NULL,'/app/food/farm-product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(630,'2026-09-11 10:00:17','2026-09-11 10:00:17',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(631,'2026-09-11 10:00:18','2026-09-11 10:00:18',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(632,'2026-09-11 10:00:18','2026-09-11 10:00:18',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(633,'2026-09-11 10:00:22','2026-09-11 10:00:22',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(634,'2026-09-11 10:00:31','2026-09-11 10:00:31',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(635,'2026-09-11 10:00:42','2026-09-11 10:00:42',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(636,'2026-09-11 10:00:42','2026-09-11 10:00:42',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(637,'2026-09-11 10:01:02','2026-09-11 10:01:02',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(638,'2026-09-11 10:01:32','2026-09-11 10:01:32',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(639,'2026-09-11 10:02:02','2026-09-11 10:02:02',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(640,'2026-09-11 10:02:33','2026-09-11 10:02:33',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(641,'2026-09-11 10:03:03','2026-09-11 10:03:03',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(642,'2026-09-11 10:03:33','2026-09-11 10:03:33',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(643,'2026-09-11 10:03:46','2026-09-11 10:03:46',NULL,NULL,'/app/travel/scenic/detail','172.18.0.5','{\"id\": \"3\"}'),(644,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(645,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(646,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(647,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(648,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(649,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(650,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(651,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(652,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(653,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(654,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(655,'2026-09-11 10:03:54','2026-09-11 10:03:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(656,'2026-09-11 10:03:57','2026-09-11 10:03:57',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(657,'2026-09-11 10:03:57','2026-09-11 10:03:57',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(658,'2026-09-11 10:03:57','2026-09-11 10:03:57',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(659,'2026-09-11 10:03:58','2026-09-11 10:03:58',NULL,NULL,'/app/food/farm-product/categories','172.18.0.5','{}'),(660,'2026-09-11 10:03:59','2026-09-11 10:03:59',NULL,NULL,'/app/food/farm-product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(661,'2026-09-11 10:04:00','2026-09-11 10:04:00',NULL,NULL,'/app/food/restaurant/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(662,'2026-09-11 10:04:00','2026-09-11 10:04:00',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(663,'2026-09-11 10:04:00','2026-09-11 10:04:00',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(664,'2026-09-11 10:04:03','2026-09-11 10:04:03',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(665,'2026-09-11 10:04:12','2026-09-11 10:04:12',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(666,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(667,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(668,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(669,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(670,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(671,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(672,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(673,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(674,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(675,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(676,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(677,'2026-09-11 10:04:16','2026-09-11 10:04:16',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(678,'2026-09-11 10:04:18','2026-09-11 10:04:18',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(679,'2026-09-11 10:04:18','2026-09-11 10:04:18',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(680,'2026-09-11 10:04:18','2026-09-11 10:04:18',NULL,NULL,'/app/food/restaurant/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(681,'2026-09-11 10:04:19','2026-09-11 10:04:19',NULL,NULL,'/app/food/farm-product/categories','172.18.0.5','{}'),(682,'2026-09-11 10:04:19','2026-09-11 10:04:19',NULL,NULL,'/app/food/farm-product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(683,'2026-09-11 10:04:20','2026-09-11 10:04:20',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(684,'2026-09-11 10:04:20','2026-09-11 10:04:20',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(685,'2026-09-11 10:04:20','2026-09-11 10:04:20',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(686,'2026-09-11 10:04:20','2026-09-11 10:04:20',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(687,'2026-09-11 10:04:21','2026-09-11 10:04:21',NULL,NULL,'/app/travel/ticket/my','172.18.0.5','{}'),(688,'2026-09-11 10:04:23','2026-09-11 10:04:23',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(689,'2026-09-11 10:04:23','2026-09-11 10:04:23',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(690,'2026-09-11 10:04:23','2026-09-11 10:04:23',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(691,'2026-09-11 10:04:23','2026-09-11 10:04:23',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(692,'2026-09-11 10:04:24','2026-09-11 10:04:24',NULL,NULL,'/app/food/farm-product/categories','172.18.0.5','{}'),(693,'2026-09-11 10:04:24','2026-09-11 10:04:24',NULL,NULL,'/app/food/farm-product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(694,'2026-09-11 10:04:25','2026-09-11 10:04:25',NULL,NULL,'/app/food/restaurant/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(695,'2026-09-11 10:04:25','2026-09-11 10:04:25',NULL,NULL,'/app/product/categories','172.18.0.5','{}'),(696,'2026-09-11 10:04:25','2026-09-11 10:04:25',NULL,NULL,'/app/product/list','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(697,'2026-09-11 10:04:25','2026-09-11 10:04:25',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(698,'2026-09-11 10:04:26','2026-09-11 10:04:26',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(699,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(700,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(701,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(702,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(703,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(704,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(705,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(706,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(707,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(708,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(709,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(710,'2026-09-11 10:04:28','2026-09-11 10:04:28',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(711,'2026-09-11 10:04:30','2026-09-11 10:04:30',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(712,'2026-09-11 10:04:30','2026-09-11 10:04:30',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(713,'2026-09-11 10:04:33','2026-09-11 10:04:33',NULL,NULL,'/app/community/post/detail','172.18.0.5','{\"id\": \"601\"}'),(714,'2026-09-11 10:04:33','2026-09-11 10:04:33',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(715,'2026-09-11 10:04:33','2026-09-11 10:04:33',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(716,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(717,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(718,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(719,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(720,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(721,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(722,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(723,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(724,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(725,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(726,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(727,'2026-09-11 10:04:39','2026-09-11 10:04:39',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(728,'2026-09-11 10:05:03','2026-09-11 10:05:03',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(729,'2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,NULL,'/app/accommodation/booking/create','172.18.0.5','{\"rooms\": 1, \"guestName\": \"山野小鱼\", \"guestPhone\": \"\", \"roomTypeId\": 2, \"checkInDate\": \"2026-10-01\", \"checkOutDate\": \"2026-10-03\"}'),(730,'2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,NULL,'/app/food/reservation/create','172.18.0.5','{\"timeSlotId\": 301, \"contactName\": \"山野小鱼\", \"peopleCount\": 2, \"contactPhone\": \"13800000001\", \"restaurantId\": 3, \"reservationDate\": \"2026-10-01\"}'),(731,'2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,NULL,'/app/travel/booking/create','172.18.0.5','{\"itemId\": 2, \"useDate\": \"2026-10-01\", \"itemType\": \"route\", \"quantity\": 2}'),(732,'2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,NULL,'/app/pay/create','172.18.0.5','{\"channel\": \"wechat\", \"orderNo\": \"202609111005086549164\"}'),(733,'2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,NULL,'/app/pay/mock','172.18.0.5','{\"paymentNo\": \"PAY202609111005088323130\"}'),(734,'2026-09-11 10:05:30','2026-09-11 10:05:30',NULL,NULL,'/app/travel/ticket/my','172.18.0.5','{}'),(735,'2026-09-11 10:05:33','2026-09-11 10:05:33',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(736,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(737,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(738,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(739,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(740,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(741,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(742,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(743,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(744,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(745,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"27\"}'),(746,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"28\"}'),(747,'2026-09-11 10:05:41','2026-09-11 10:05:41',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"26\"}'),(748,'2026-09-11 10:06:04','2026-09-11 10:06:04',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(749,'2026-09-11 10:06:34','2026-09-11 10:06:34',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(750,'2026-09-11 10:07:04','2026-09-11 10:07:04',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(751,'2026-09-11 10:07:35','2026-09-11 10:07:35',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(752,'2026-09-11 10:08:06','2026-09-11 10:08:06',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(753,'2026-09-11 10:08:37','2026-09-11 10:08:37',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(754,'2026-09-11 10:09:07','2026-09-11 10:09:07',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(755,'2026-09-11 10:09:38','2026-09-11 10:09:38',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(756,'2026-09-11 10:10:09','2026-09-11 10:10:09',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(757,'2026-09-11 10:10:39','2026-09-11 10:10:39',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(758,'2026-09-11 10:11:09','2026-09-11 10:11:09',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(759,'2026-09-11 10:11:40','2026-09-11 10:11:40',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(760,'2026-09-11 10:12:11','2026-09-11 10:12:11',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(761,'2026-09-11 10:12:42','2026-09-11 10:12:42',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(762,'2026-09-11 10:13:12','2026-09-11 10:13:12',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(763,'2026-09-11 10:13:43','2026-09-11 10:13:43',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(764,'2026-09-11 10:14:14','2026-09-11 10:14:14',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(765,'2026-09-11 10:14:44','2026-09-11 10:14:44',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(766,'2026-09-11 10:15:15','2026-09-11 10:15:15',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(767,'2026-09-11 10:15:45','2026-09-11 10:15:45',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(768,'2026-09-11 10:16:16','2026-09-11 10:16:16',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(769,'2026-09-11 10:16:47','2026-09-11 10:16:47',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(770,'2026-09-11 10:17:17','2026-09-11 10:17:17',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(771,'2026-09-11 10:17:48','2026-09-11 10:17:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(772,'2026-09-11 10:18:19','2026-09-11 10:18:19',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(773,'2026-09-11 10:18:49','2026-09-11 10:18:49',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(774,'2026-09-11 10:19:19','2026-09-11 10:19:19',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(775,'2026-09-11 10:19:50','2026-09-11 10:19:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(776,'2026-09-11 10:20:20','2026-09-11 10:20:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(777,'2026-09-11 10:20:50','2026-09-11 10:20:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(778,'2026-09-11 10:21:21','2026-09-11 10:21:21',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(779,'2026-09-11 10:21:51','2026-09-11 10:21:51',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(780,'2026-09-11 10:22:22','2026-09-11 10:22:22',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(781,'2026-09-11 10:22:52','2026-09-11 10:22:52',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(782,'2026-09-11 10:23:23','2026-09-11 10:23:23',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(783,'2026-09-11 10:23:54','2026-09-11 10:23:54',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(784,'2026-09-11 10:24:24','2026-09-11 10:24:24',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(785,'2026-09-11 10:24:54','2026-09-11 10:24:54',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(786,'2026-09-11 10:25:25','2026-09-11 10:25:25',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(787,'2026-09-11 10:25:56','2026-09-11 10:25:56',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(788,'2026-09-11 10:26:26','2026-09-11 10:26:26',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(789,'2026-09-11 10:26:56','2026-09-11 10:26:56',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(790,'2026-09-11 10:27:26','2026-09-11 10:27:26',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(791,'2026-09-11 10:27:57','2026-09-11 10:27:57',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(792,'2026-09-11 10:28:27','2026-09-11 10:28:27',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(793,'2026-09-11 10:28:58','2026-09-11 10:28:58',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(794,'2026-09-11 10:29:29','2026-09-11 10:29:29',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(795,'2026-09-11 10:29:59','2026-09-11 10:29:59',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(796,'2026-09-11 10:30:30','2026-09-11 10:30:30',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(797,'2026-09-11 10:31:01','2026-09-11 10:31:01',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(798,'2026-09-11 10:31:31','2026-09-11 10:31:31',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(799,'2026-09-11 10:32:02','2026-09-11 10:32:02',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(800,'2026-09-11 10:32:32','2026-09-11 10:32:32',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(801,'2026-09-11 10:33:03','2026-09-11 10:33:03',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(802,'2026-09-11 10:33:34','2026-09-11 10:33:34',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(803,'2026-09-11 10:33:39','2026-09-11 10:33:39',NULL,NULL,'/app/food/restaurant/3','172.18.0.1','{}'),(804,'2026-09-11 10:34:05','2026-09-11 10:34:05',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(805,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,NULL,'/app/food/restaurant/3','172.18.0.1','{}'),(806,'2026-09-11 10:34:35','2026-09-11 10:34:35',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(807,'2026-09-11 10:35:06','2026-09-11 10:35:06',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(808,'2026-09-11 10:35:36','2026-09-11 10:35:36',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(809,'2026-09-11 10:36:07','2026-09-11 10:36:07',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(810,'2026-09-11 10:36:37','2026-09-11 10:36:37',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(811,'2026-09-11 10:37:08','2026-09-11 10:37:08',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(812,'2026-09-11 10:37:39','2026-09-11 10:37:39',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(813,'2026-09-11 10:38:09','2026-09-11 10:38:09',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(814,'2026-09-11 10:38:40','2026-09-11 10:38:40',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(815,'2026-09-11 10:38:50','2026-09-11 10:38:50',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(816,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(817,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(818,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(819,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(820,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(821,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(822,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(823,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(824,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(825,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(826,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(827,'2026-09-11 10:38:51','2026-09-11 10:38:51',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(828,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(829,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(830,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(831,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(832,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(833,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(834,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(835,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(836,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(837,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(838,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(839,'2026-09-11 10:42:47','2026-09-11 10:42:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(840,'2026-09-11 10:44:12','2026-09-11 10:44:12',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(841,'2026-09-11 10:44:12','2026-09-11 10:44:12',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(842,'2026-09-11 10:44:12','2026-09-11 10:44:12',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(843,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(844,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(845,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(846,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(847,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(848,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(849,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(850,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(851,'2026-09-11 10:44:13','2026-09-11 10:44:13',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(852,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(853,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(854,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(855,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(856,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(857,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(858,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(859,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(860,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(861,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(862,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(863,'2026-09-11 10:44:54','2026-09-11 10:44:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(864,'2026-09-11 10:48:36','2026-09-11 10:48:36',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(865,'2026-09-11 10:50:18','2026-09-11 10:50:18',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"6\"}'),(866,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(867,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(868,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(869,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(870,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(871,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(872,'2026-09-11 10:50:20','2026-09-11 10:50:20',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(873,'2026-09-11 10:50:21','2026-09-11 10:50:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(874,'2026-09-11 10:50:21','2026-09-11 10:50:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(875,'2026-09-11 10:50:21','2026-09-11 10:50:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(876,'2026-09-11 10:50:21','2026-09-11 10:50:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(877,'2026-09-11 10:50:21','2026-09-11 10:50:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(878,'2026-09-11 10:50:22','2026-09-11 10:50:22',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(879,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(880,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(881,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(882,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(883,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(884,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(885,'2026-09-11 10:50:23','2026-09-11 10:50:23',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(886,'2026-09-11 10:50:24','2026-09-11 10:50:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(887,'2026-09-11 10:50:24','2026-09-11 10:50:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(888,'2026-09-11 10:50:24','2026-09-11 10:50:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(889,'2026-09-11 10:50:24','2026-09-11 10:50:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(890,'2026-09-11 10:50:24','2026-09-11 10:50:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(891,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(892,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(893,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(894,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(895,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(896,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(897,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(898,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(899,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(900,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(901,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(902,'2026-09-11 10:50:46','2026-09-11 10:50:46',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(903,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(904,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(905,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(906,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(907,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(908,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(909,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(910,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(911,'2026-09-11 10:51:56','2026-09-11 10:51:56',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(912,'2026-09-11 10:51:57','2026-09-11 10:51:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(913,'2026-09-11 10:51:57','2026-09-11 10:51:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(914,'2026-09-11 10:51:57','2026-09-11 10:51:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(915,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(916,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(917,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(918,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(919,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(920,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(921,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(922,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(923,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(924,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(925,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(926,'2026-09-11 11:02:27','2026-09-11 11:02:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(927,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(928,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(929,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(930,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(931,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(932,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(933,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(934,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(935,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(936,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(937,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(938,'2026-09-11 11:02:33','2026-09-11 11:02:33',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(939,'2026-09-11 11:02:51','2026-09-11 11:02:51',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(940,'2026-09-11 11:02:53','2026-09-11 11:02:53',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(941,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(942,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(943,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(944,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(945,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(946,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(947,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(948,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(949,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(950,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(951,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(952,'2026-09-11 11:02:55','2026-09-11 11:02:55',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(953,'2026-09-11 11:15:20','2026-09-11 11:15:20',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MDg0NTcxLCJleHAiOjE3OTAzODA1NzF9.a1xdYCPmiIUh7a-AykwTT0JoICyq0faEQa0pg_e2gJs\"}'),(954,'2026-09-11 11:15:20','2026-09-11 11:15:20',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{}'),(955,'2026-09-11 11:15:22','2026-09-11 11:15:22',NULL,1,'/admin/product/page','172.18.0.1','{}'),(956,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(957,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(958,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(959,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(960,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(961,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(962,'2026-09-11 11:22:08','2026-09-11 11:22:08',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(963,'2026-09-11 11:22:09','2026-09-11 11:22:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(964,'2026-09-11 11:22:09','2026-09-11 11:22:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(965,'2026-09-11 11:22:09','2026-09-11 11:22:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(966,'2026-09-11 11:22:09','2026-09-11 11:22:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(967,'2026-09-11 11:22:09','2026-09-11 11:22:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(968,'2026-09-11 11:23:59','2026-09-11 11:23:59',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(969,'2026-09-11 11:24:12','2026-09-11 11:24:12',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(970,'2026-09-11 11:24:12','2026-09-11 11:24:12',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(971,'2026-09-11 11:24:13','2026-09-11 11:24:13',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(972,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(973,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(974,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(975,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(976,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(977,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(978,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(979,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(980,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(981,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(982,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(983,'2026-09-11 11:24:15','2026-09-11 11:24:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(984,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(985,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(986,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(987,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(988,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(989,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(990,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(991,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(992,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(993,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(994,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(995,'2026-09-11 11:24:25','2026-09-11 11:24:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(996,'2026-09-11 11:24:45','2026-09-11 11:24:45',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(997,'2026-09-11 11:25:16','2026-09-11 11:25:16',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(998,'2026-09-11 11:25:47','2026-09-11 11:25:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(999,'2026-09-11 11:26:17','2026-09-11 11:26:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1000,'2026-09-11 11:26:48','2026-09-11 11:26:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1001,'2026-09-11 11:27:19','2026-09-11 11:27:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1002,'2026-09-11 11:27:49','2026-09-11 11:27:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1003,'2026-09-11 11:28:20','2026-09-11 11:28:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1004,'2026-09-11 11:28:50','2026-09-11 11:28:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1005,'2026-09-11 11:29:21','2026-09-11 11:29:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1006,'2026-09-11 11:29:51','2026-09-11 11:29:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1007,'2026-09-11 11:30:20','2026-09-11 11:30:20',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1008,'2026-09-11 11:30:20','2026-09-11 11:30:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1009,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1010,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1011,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1012,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1013,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1014,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1015,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1016,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1017,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1018,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1019,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1020,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1021,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1022,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1023,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1024,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1025,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1026,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1027,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1028,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1029,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1030,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1031,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1032,'2026-09-11 11:30:24','2026-09-11 11:30:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1033,'2026-09-11 11:30:52','2026-09-11 11:30:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1034,'2026-09-11 11:31:03','2026-09-11 11:31:03',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1035,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1036,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1037,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1038,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1039,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1040,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1041,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1042,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1043,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1044,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1045,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1046,'2026-09-11 11:31:10','2026-09-11 11:31:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1047,'2026-09-11 11:31:13','2026-09-11 11:31:13',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1048,'2026-09-11 11:31:14','2026-09-11 11:31:14',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1049,'2026-09-11 11:31:19','2026-09-11 11:31:19',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1050,'2026-09-11 11:31:22','2026-09-11 11:31:22',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1051,'2026-09-11 11:31:23','2026-09-11 11:31:23',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1052,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1053,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1054,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1055,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1056,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1057,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1058,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1059,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1060,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1061,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1062,'2026-09-11 11:31:24','2026-09-11 11:31:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1063,'2026-09-11 11:31:37','2026-09-11 11:31:37',NULL,NULL,'/app/accommodation/booking/create','172.18.0.1','{\"rooms\": 1, \"guestName\": \"山野小鱼\", \"guestPhone\": \"\", \"roomTypeId\": 11, \"checkInDate\": \"2026-09-12\", \"checkOutDate\": \"2026-09-13\"}'),(1064,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1065,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1066,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1067,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1068,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1069,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1070,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1071,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1072,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1073,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1074,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1075,'2026-09-11 11:31:54','2026-09-11 11:31:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1076,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1077,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1078,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1079,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1080,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1081,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1082,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1083,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1084,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1085,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1086,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1087,'2026-09-11 11:34:37','2026-09-11 11:34:37',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1088,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1089,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1090,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1091,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1092,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1093,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1094,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1095,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1096,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1097,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1098,'2026-09-11 11:36:00','2026-09-11 11:36:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1099,'2026-09-11 11:36:01','2026-09-11 11:36:01',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1100,'2026-09-11 11:36:09','2026-09-11 11:36:09',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(1101,'2026-09-11 11:36:09','2026-09-11 11:36:09',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1102,'2026-09-11 11:36:09','2026-09-11 11:36:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1103,'2026-09-11 11:36:12','2026-09-11 11:36:12',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"6\"}'),(1104,'2026-09-11 11:36:15','2026-09-11 11:36:15',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1105,'2026-09-11 11:36:15','2026-09-11 11:36:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1106,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1107,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1108,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1109,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1110,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1111,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1112,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1113,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1114,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1115,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1116,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1117,'2026-09-11 11:36:21','2026-09-11 11:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1118,'2026-09-11 11:36:24','2026-09-11 11:36:24',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1119,'2026-09-11 11:36:28','2026-09-11 11:36:28',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1120,'2026-09-11 11:36:28','2026-09-11 11:36:28',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1121,'2026-09-11 11:36:30','2026-09-11 11:36:30',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1122,'2026-09-11 11:36:31','2026-09-11 11:36:31',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1123,'2026-09-11 11:36:31','2026-09-11 11:36:31',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1124,'2026-09-11 11:36:34','2026-09-11 11:36:34',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1125,'2026-09-11 11:36:34','2026-09-11 11:36:34',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1126,'2026-09-11 11:36:34','2026-09-11 11:36:34',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1127,'2026-09-11 11:36:39','2026-09-11 11:36:39',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1128,'2026-09-11 11:36:39','2026-09-11 11:36:39',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1129,'2026-09-11 11:36:41','2026-09-11 11:36:41',NULL,NULL,'/app/travel/ticket/my','172.18.0.1','{}'),(1130,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1131,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1132,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1133,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1134,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1135,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1136,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1137,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1138,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1139,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1140,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1141,'2026-09-11 11:36:43','2026-09-11 11:36:43',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1142,'2026-09-11 11:37:11','2026-09-11 11:37:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1143,'2026-09-11 11:37:41','2026-09-11 11:37:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1144,'2026-09-11 11:38:12','2026-09-11 11:38:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1145,'2026-09-11 11:38:42','2026-09-11 11:38:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1146,'2026-09-11 11:39:12','2026-09-11 11:39:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1147,'2026-09-11 11:39:42','2026-09-11 11:39:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1148,'2026-09-11 11:39:46','2026-09-11 11:39:46',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"6\"}'),(1149,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1150,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1151,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1152,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1153,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1154,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1155,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1156,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1157,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1158,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1159,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1160,'2026-09-11 11:39:56','2026-09-11 11:39:56',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1161,'2026-09-11 11:40:12','2026-09-11 11:40:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1162,'2026-09-11 11:40:43','2026-09-11 11:40:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1163,'2026-09-11 11:41:09','2026-09-11 11:41:09',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1164,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1165,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1166,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1167,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1168,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1169,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1170,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1171,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1172,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1173,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1174,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1175,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1176,'2026-09-11 11:41:11','2026-09-11 11:41:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1177,'2026-09-11 11:41:18','2026-09-11 11:41:18',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1178,'2026-09-11 11:41:41','2026-09-11 11:41:41',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1179,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1180,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1181,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1182,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1183,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1184,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1185,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1186,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1187,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1188,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1189,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1190,'2026-09-11 11:41:42','2026-09-11 11:41:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1191,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1192,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1193,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1194,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1195,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1196,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1197,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1198,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1199,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1200,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1201,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1202,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1203,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1204,'2026-09-11 11:42:01','2026-09-11 11:42:01',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1205,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(1206,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(1207,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(1208,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(1209,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1210,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(1211,'2026-09-11 11:42:02','2026-09-11 11:42:02',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(1212,'2026-09-11 11:42:03','2026-09-11 11:42:03',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(1213,'2026-09-11 11:42:03','2026-09-11 11:42:03',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(1214,'2026-09-11 11:42:03','2026-09-11 11:42:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(1215,'2026-09-11 11:42:03','2026-09-11 11:42:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(1216,'2026-09-11 11:42:03','2026-09-11 11:42:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(1217,'2026-09-11 11:42:34','2026-09-11 11:42:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1218,'2026-09-11 11:43:04','2026-09-11 11:43:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1219,'2026-09-11 11:43:34','2026-09-11 11:43:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1220,'2026-09-11 11:44:05','2026-09-11 11:44:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1221,'2026-09-11 11:44:35','2026-09-11 11:44:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1222,'2026-09-11 11:45:05','2026-09-11 11:45:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1223,'2026-09-11 11:45:36','2026-09-11 11:45:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1224,'2026-09-11 11:46:06','2026-09-11 11:46:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1225,'2026-09-11 11:46:36','2026-09-11 11:46:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1226,'2026-09-11 11:47:07','2026-09-11 11:47:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1227,'2026-09-11 11:47:37','2026-09-11 11:47:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1228,'2026-09-11 11:48:07','2026-09-11 11:48:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1229,'2026-09-11 11:48:38','2026-09-11 11:48:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1230,'2026-09-11 11:48:38','2026-09-11 11:48:38',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1231,'2026-09-11 11:48:38','2026-09-11 11:48:38',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1232,'2026-09-11 11:48:38','2026-09-11 11:48:38',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1233,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1234,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1235,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1236,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1237,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1238,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1239,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1240,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1241,'2026-09-11 11:48:39','2026-09-11 11:48:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1242,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1243,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1244,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1245,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1246,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1247,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1248,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1249,'2026-09-11 11:48:41','2026-09-11 11:48:41',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1250,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1251,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1252,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1253,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1254,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1255,'2026-09-11 11:48:42','2026-09-11 11:48:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1256,'2026-09-11 11:49:14','2026-09-11 11:49:14',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1257,'2026-09-11 11:49:39','2026-09-11 11:49:39',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{}'),(1258,'2026-09-11 11:49:39','2026-09-11 11:49:39',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{}'),(1259,'2026-09-11 11:49:42','2026-09-11 11:49:42',NULL,1,'/admin/community/post/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1260,'2026-09-11 11:49:44','2026-09-11 11:49:44',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1261,'2026-09-11 11:49:45','2026-09-11 11:49:45',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1262,'2026-09-11 11:49:48','2026-09-11 11:49:48',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{}'),(1263,'2026-09-11 11:49:49','2026-09-11 11:49:49',NULL,1,'/admin/product/page','172.18.0.1','{}'),(1264,'2026-09-11 11:49:52','2026-09-11 11:49:52',NULL,1,'/admin/sensitive/word/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1265,'2026-09-11 11:50:12','2026-09-11 11:50:12',NULL,1,'/admin/merchant/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1266,'2026-09-11 11:50:13','2026-09-11 11:50:13',NULL,1,'/admin/merchantApplication/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1267,'2026-09-11 11:50:16','2026-09-11 11:50:16',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1268,'2026-09-11 11:50:46','2026-09-11 11:50:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1269,'2026-09-11 11:51:17','2026-09-11 11:51:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1270,'2026-09-11 11:51:48','2026-09-11 11:51:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1271,'2026-09-11 11:52:19','2026-09-11 11:52:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1272,'2026-09-11 11:52:49','2026-09-11 11:52:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1273,'2026-09-11 11:53:20','2026-09-11 11:53:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1274,'2026-09-11 11:53:51','2026-09-11 11:53:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1275,'2026-09-11 11:53:59','2026-09-11 11:53:59',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1276,'2026-09-11 11:54:00','2026-09-11 11:54:00',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1277,'2026-09-11 11:54:00','2026-09-11 11:54:00',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1278,'2026-09-11 11:54:05','2026-09-11 11:54:05',NULL,NULL,'/app/community/search/list','172.18.0.1','{\"keyword\": \"下午\"}'),(1279,'2026-09-11 11:54:15','2026-09-11 11:54:15',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1280,'2026-09-11 11:54:19','2026-09-11 11:54:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1281,'2026-09-11 11:54:51','2026-09-11 11:54:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1282,'2026-09-11 11:55:17','2026-09-11 11:55:17',NULL,1,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1283,'2026-09-11 11:55:22','2026-09-11 11:55:22',NULL,1,'/admin/pay/record/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1284,'2026-09-11 11:55:22','2026-09-11 11:55:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1285,'2026-09-11 11:55:24','2026-09-11 11:55:24',NULL,1,'/admin/merchant/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1286,'2026-09-11 11:55:29','2026-09-11 11:55:29',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1287,'2026-09-11 11:55:30','2026-09-11 11:55:30',NULL,1,'/admin/travel/route/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1288,'2026-09-11 11:55:53','2026-09-11 11:55:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1289,'2026-09-11 11:56:24','2026-09-11 11:56:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1290,'2026-09-11 11:56:54','2026-09-11 11:56:54',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1291,'2026-09-11 11:57:25','2026-09-11 11:57:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1292,'2026-09-11 11:57:34','2026-09-11 11:57:34',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1293,'2026-09-11 11:57:34','2026-09-11 11:57:34',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1294,'2026-09-11 11:57:36','2026-09-11 11:57:36',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"1\"}'),(1295,'2026-09-11 11:57:40','2026-09-11 11:57:40',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1296,'2026-09-11 11:57:40','2026-09-11 11:57:40',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1297,'2026-09-11 11:57:54','2026-09-11 11:57:54',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(1298,'2026-09-11 11:57:54','2026-09-11 11:57:54',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(1299,'2026-09-11 11:57:56','2026-09-11 11:57:56',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1300,'2026-09-11 11:58:26','2026-09-11 11:58:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1301,'2026-09-11 11:58:57','2026-09-11 11:58:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1302,'2026-09-11 11:59:27','2026-09-11 11:59:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1303,'2026-09-11 11:59:58','2026-09-11 11:59:58',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1304,'2026-09-11 12:00:29','2026-09-11 12:00:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1305,'2026-09-11 12:00:59','2026-09-11 12:00:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1306,'2026-09-11 12:01:30','2026-09-11 12:01:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1307,'2026-09-11 12:02:00','2026-09-11 12:02:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1308,'2026-09-11 12:02:31','2026-09-11 12:02:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1309,'2026-09-11 12:03:02','2026-09-11 12:03:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1310,'2026-09-11 12:03:33','2026-09-11 12:03:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1311,'2026-09-11 12:04:03','2026-09-11 12:04:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1312,'2026-09-11 12:04:07','2026-09-11 12:04:07',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{}'),(1313,'2026-09-11 12:04:08','2026-09-11 12:04:08',NULL,1,'/admin/product/page','172.18.0.1','{}'),(1314,'2026-09-11 12:04:34','2026-09-11 12:04:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1315,'2026-09-11 12:05:04','2026-09-11 12:05:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1316,'2026-09-11 12:05:35','2026-09-11 12:05:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1317,'2026-09-11 12:06:06','2026-09-11 12:06:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1318,'2026-09-11 12:06:36','2026-09-11 12:06:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1319,'2026-09-11 12:07:07','2026-09-11 12:07:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1320,'2026-09-11 12:07:37','2026-09-11 12:07:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1321,'2026-09-11 12:08:08','2026-09-11 12:08:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1322,'2026-09-11 12:08:38','2026-09-11 12:08:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1323,'2026-09-11 12:09:09','2026-09-11 12:09:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1324,'2026-09-11 12:09:40','2026-09-11 12:09:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1325,'2026-09-11 12:10:10','2026-09-11 12:10:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1326,'2026-09-11 12:10:41','2026-09-11 12:10:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1327,'2026-09-11 12:11:11','2026-09-11 12:11:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1328,'2026-09-11 12:11:42','2026-09-11 12:11:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1329,'2026-09-11 12:12:12','2026-09-11 12:12:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1330,'2026-09-11 12:12:43','2026-09-11 12:12:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1331,'2026-09-11 12:13:13','2026-09-11 12:13:13',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1332,'2026-09-11 12:13:44','2026-09-11 12:13:44',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1333,'2026-09-11 12:14:14','2026-09-11 12:14:14',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1334,'2026-09-11 12:14:45','2026-09-11 12:14:45',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1335,'2026-09-11 12:15:16','2026-09-11 12:15:16',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1336,'2026-09-11 12:15:46','2026-09-11 12:15:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1337,'2026-09-11 12:16:17','2026-09-11 12:16:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1338,'2026-09-11 12:16:46','2026-09-11 12:16:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1339,'2026-09-11 12:17:18','2026-09-11 12:17:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1340,'2026-09-11 12:17:49','2026-09-11 12:17:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1341,'2026-09-11 12:18:20','2026-09-11 12:18:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1342,'2026-09-11 12:18:50','2026-09-11 12:18:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1343,'2026-09-11 12:19:21','2026-09-11 12:19:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1344,'2026-09-11 12:19:51','2026-09-11 12:19:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1345,'2026-09-11 12:20:22','2026-09-11 12:20:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1346,'2026-09-11 12:20:52','2026-09-11 12:20:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1347,'2026-09-11 12:21:23','2026-09-11 12:21:23',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1348,'2026-09-11 12:21:53','2026-09-11 12:21:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1349,'2026-09-11 12:22:24','2026-09-11 12:22:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1350,'2026-09-11 12:22:54','2026-09-11 12:22:54',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1351,'2026-09-11 12:23:25','2026-09-11 12:23:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1352,'2026-09-11 12:23:55','2026-09-11 12:23:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1353,'2026-09-11 12:24:26','2026-09-11 12:24:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1354,'2026-09-11 12:24:56','2026-09-11 12:24:56',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1355,'2026-09-11 12:25:27','2026-09-11 12:25:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1356,'2026-09-11 12:25:36','2026-09-11 12:25:36',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(1357,'2026-09-11 12:25:57','2026-09-11 12:25:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1358,'2026-09-11 12:26:28','2026-09-11 12:26:28',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1359,'2026-09-11 12:26:35','2026-09-11 12:26:35',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1360,'2026-09-11 12:26:49','2026-09-11 12:26:49',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"1\"}'),(1361,'2026-09-11 12:26:59','2026-09-11 12:26:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1362,'2026-09-11 12:27:29','2026-09-11 12:27:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1363,'2026-09-11 12:28:00','2026-09-11 12:28:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1364,'2026-09-11 12:28:30','2026-09-11 12:28:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1365,'2026-09-11 12:29:01','2026-09-11 12:29:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1366,'2026-09-11 12:29:31','2026-09-11 12:29:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1367,'2026-09-11 12:30:02','2026-09-11 12:30:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1368,'2026-09-11 12:30:32','2026-09-11 12:30:32',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1369,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1370,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1371,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1372,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1373,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1374,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1375,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1376,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1377,'2026-09-11 12:33:54','2026-09-11 12:33:54',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1378,'2026-09-11 12:33:55','2026-09-11 12:33:55',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1379,'2026-09-11 12:33:55','2026-09-11 12:33:55',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1380,'2026-09-11 12:33:55','2026-09-11 12:33:55',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1381,'2026-09-11 12:33:55','2026-09-11 12:33:55',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1382,'2026-09-11 12:34:06','2026-09-11 12:34:06',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1383,'2026-09-11 12:34:27','2026-09-11 12:34:27',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1384,'2026-09-11 12:34:27','2026-09-11 12:34:27',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1385,'2026-09-11 12:34:37','2026-09-11 12:34:37',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1386,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1387,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1388,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1389,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1390,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1391,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1392,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1393,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1394,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1395,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1396,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1397,'2026-09-11 12:34:47','2026-09-11 12:34:47',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1398,'2026-09-11 12:35:07','2026-09-11 12:35:07',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1399,'2026-09-11 12:35:38','2026-09-11 12:35:38',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1400,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1401,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1402,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1403,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1404,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1405,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1406,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1407,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1408,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1409,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1410,'2026-09-11 12:35:53','2026-09-11 12:35:53',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1411,'2026-09-11 12:35:54','2026-09-11 12:35:54',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1412,'2026-09-11 12:36:08','2026-09-11 12:36:08',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1413,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1414,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1415,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1416,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1417,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1418,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1419,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1420,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1421,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1422,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1423,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1424,'2026-09-11 12:36:19','2026-09-11 12:36:19',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1425,'2026-09-11 12:36:39','2026-09-11 12:36:39',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1426,'2026-09-11 12:37:09','2026-09-11 12:37:09',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1427,'2026-09-11 12:37:40','2026-09-11 12:37:40',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1428,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1429,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1430,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1431,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1432,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1433,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1434,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1435,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1436,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1437,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1438,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1439,'2026-09-11 12:37:44','2026-09-11 12:37:44',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1440,'2026-09-11 12:38:11','2026-09-11 12:38:11',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1441,'2026-09-11 12:38:41','2026-09-11 12:38:41',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1442,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1443,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1444,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1445,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1446,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1447,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1448,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1449,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1450,'2026-09-11 12:38:49','2026-09-11 12:38:49',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1451,'2026-09-11 12:38:50','2026-09-11 12:38:50',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1452,'2026-09-11 12:38:50','2026-09-11 12:38:50',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1453,'2026-09-11 12:38:50','2026-09-11 12:38:50',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1454,'2026-09-11 12:39:12','2026-09-11 12:39:12',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1455,'2026-09-11 12:39:42','2026-09-11 12:39:42',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1456,'2026-09-11 12:40:13','2026-09-11 12:40:13',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1457,'2026-09-11 12:40:43','2026-09-11 12:40:43',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1458,'2026-09-11 12:41:14','2026-09-11 12:41:14',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1459,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1460,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1461,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/base/comm/program','127.0.0.1','{}'),(1462,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1463,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1464,'2026-09-11 12:41:39','2026-09-11 12:41:39',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1465,'2026-09-11 12:41:44','2026-09-11 12:41:44',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1466,'2026-09-11 12:42:15','2026-09-11 12:42:15',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1467,'2026-09-11 12:42:45','2026-09-11 12:42:45',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1468,'2026-09-11 12:43:09','2026-09-11 12:43:09',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"smoke\", \"verifyCode\": \"smoke\"}'),(1469,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1470,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1471,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1472,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1473,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1474,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1475,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1476,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1477,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1478,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1479,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1480,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1481,'2026-09-11 12:43:16','2026-09-11 12:43:16',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1482,'2026-09-11 12:43:20','2026-09-11 12:43:20',NULL,NULL,'/admin/base/open/login','127.0.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"smoke\", \"verifyCode\": \"smoke\"}'),(1483,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1484,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1485,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1486,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1487,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1488,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1489,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1490,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1491,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1492,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1493,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1494,'2026-09-11 12:43:42','2026-09-11 12:43:42',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1495,'2026-09-11 12:43:46','2026-09-11 12:43:46',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1496,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1497,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1498,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1499,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1500,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1501,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1502,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1503,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1504,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1505,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1506,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1507,'2026-09-11 12:44:07','2026-09-11 12:44:07',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1508,'2026-09-11 12:44:17','2026-09-11 12:44:17',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1509,'2026-09-11 12:44:45','2026-09-11 12:44:45',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1510,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/recommend/list','127.0.0.1','{\"position\": \"home\"}'),(1511,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/route/list','127.0.0.1','{}'),(1512,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/scenic/list','127.0.0.1','{}'),(1513,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/community/topic/list','127.0.0.1','{}'),(1514,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/guide/list','127.0.0.1','{}'),(1515,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/community/post/feed','127.0.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1516,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/operate/announcement/list','127.0.0.1','{}'),(1517,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"1\"}'),(1518,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/travel/route/detail','127.0.0.1','{\"id\": \"2\"}'),(1519,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"34\"}'),(1520,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"36\"}'),(1521,'2026-09-11 12:44:53','2026-09-11 12:44:53',NULL,NULL,'/app/community/user/profile','127.0.0.1','{\"id\": \"35\"}'),(1522,'2026-09-11 12:45:18','2026-09-11 12:45:18',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1523,'2026-09-11 12:45:48','2026-09-11 12:45:48',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1524,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1525,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1526,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1527,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1528,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1529,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1530,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1531,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1532,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1533,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1534,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1535,'2026-09-11 12:46:45','2026-09-11 12:46:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1536,'2026-09-11 12:46:49','2026-09-11 12:46:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1537,'2026-09-11 12:47:00','2026-09-11 12:47:00',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(1538,'2026-09-11 12:47:20','2026-09-11 12:47:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1539,'2026-09-11 12:47:50','2026-09-11 12:47:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1540,'2026-09-11 12:48:21','2026-09-11 12:48:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1541,'2026-09-11 12:48:25','2026-09-11 12:48:25',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg4OTIwMDEzLCJleHAiOjE3OTAyMTYwMTN9.PiRk3GxpLnzuBgBD5VZlISkRj0kvpBNTgQNIyg1q68U\"}'),(1542,'2026-09-11 12:48:25','2026-09-11 12:48:25',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1543,'2026-09-11 12:48:25','2026-09-11 12:48:25',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1544,'2026-09-11 12:48:25','2026-09-11 12:48:25',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1545,'2026-09-11 12:48:51','2026-09-11 12:48:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1546,'2026-09-11 12:49:22','2026-09-11 12:49:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1547,'2026-09-11 12:49:52','2026-09-11 12:49:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1548,'2026-09-11 12:50:23','2026-09-11 12:50:23',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1549,'2026-09-11 12:50:53','2026-09-11 12:50:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1550,'2026-09-11 12:51:24','2026-09-11 12:51:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1551,'2026-09-11 12:51:55','2026-09-11 12:51:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1552,'2026-09-11 12:52:25','2026-09-11 12:52:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1553,'2026-09-11 12:52:55','2026-09-11 12:52:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1554,'2026-09-11 12:53:26','2026-09-11 12:53:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1555,'2026-09-11 12:54:11','2026-09-11 12:54:11',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1556,'2026-09-11 12:54:27','2026-09-11 12:54:27',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1557,'2026-09-11 12:54:33','2026-09-11 12:54:33',NULL,NULL,'/admin/base/open/eps','127.0.0.1','{}'),(1558,'2026-09-11 12:54:33','2026-09-11 12:54:33',NULL,NULL,'/admin/dict/info/types','127.0.0.1','{}'),(1559,'2026-09-11 12:54:57','2026-09-11 12:54:57',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1560,'2026-09-11 12:55:28','2026-09-11 12:55:28',NULL,NULL,'/app/cart/count','127.0.0.1','{}'),(1561,'2026-09-11 12:55:58','2026-09-11 12:55:58',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1562,'2026-09-11 12:56:29','2026-09-11 12:56:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1563,'2026-09-11 12:56:59','2026-09-11 12:56:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1564,'2026-09-11 12:57:30','2026-09-11 12:57:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1565,'2026-09-11 12:58:00','2026-09-11 12:58:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1566,'2026-09-11 12:58:31','2026-09-11 12:58:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1567,'2026-09-11 12:59:01','2026-09-11 12:59:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1568,'2026-09-11 12:59:11','2026-09-11 12:59:11',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(1569,'2026-09-11 12:59:32','2026-09-11 12:59:32',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1570,'2026-09-11 13:00:02','2026-09-11 13:00:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1571,'2026-09-11 13:00:33','2026-09-11 13:00:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1572,'2026-09-11 13:00:42','2026-09-11 13:00:42',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(1573,'2026-09-11 13:01:03','2026-09-11 13:01:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1574,'2026-09-11 13:01:06','2026-09-11 13:01:06',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1575,'2026-09-11 13:01:06','2026-09-11 13:01:06',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1576,'2026-09-11 13:01:06','2026-09-11 13:01:06',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1577,'2026-09-11 13:01:34','2026-09-11 13:01:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1578,'2026-09-11 13:01:58','2026-09-11 13:01:58',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1579,'2026-09-11 13:01:58','2026-09-11 13:01:58',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1580,'2026-09-11 13:01:58','2026-09-11 13:01:58',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1581,'2026-09-11 13:02:04','2026-09-11 13:02:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1582,'2026-09-11 13:02:35','2026-09-11 13:02:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1583,'2026-09-11 13:03:05','2026-09-11 13:03:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1584,'2026-09-11 13:03:34','2026-09-11 13:03:34',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1585,'2026-09-11 13:03:36','2026-09-11 13:03:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1586,'2026-09-11 13:04:06','2026-09-11 13:04:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1587,'2026-09-11 13:04:37','2026-09-11 13:04:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1588,'2026-09-11 13:05:07','2026-09-11 13:05:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1589,'2026-09-11 13:05:38','2026-09-11 13:05:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1590,'2026-09-11 13:06:08','2026-09-11 13:06:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1591,'2026-09-11 13:06:38','2026-09-11 13:06:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1592,'2026-09-11 13:07:09','2026-09-11 13:07:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1593,'2026-09-11 13:07:40','2026-09-11 13:07:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1594,'2026-09-11 13:08:10','2026-09-11 13:08:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1595,'2026-09-11 13:08:33','2026-09-11 13:08:33',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1596,'2026-09-11 13:08:34','2026-09-11 13:08:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1597,'2026-09-11 13:08:34','2026-09-11 13:08:34',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1598,'2026-09-11 13:08:34','2026-09-11 13:08:34',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1599,'2026-09-11 13:09:07','2026-09-11 13:09:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1600,'2026-09-11 13:09:37','2026-09-11 13:09:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1601,'2026-09-11 13:10:08','2026-09-11 13:10:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1602,'2026-09-11 13:10:38','2026-09-11 13:10:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1603,'2026-09-11 13:11:05','2026-09-11 13:11:05',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1604,'2026-09-11 13:11:05','2026-09-11 13:11:05',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1605,'2026-09-11 13:11:06','2026-09-11 13:11:06',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1606,'2026-09-11 13:11:06','2026-09-11 13:11:06',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1607,'2026-09-11 13:11:09','2026-09-11 13:11:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1608,'2026-09-11 13:11:28','2026-09-11 13:11:28',NULL,1,'/admin/food/restaurant/info','172.18.0.1','{\"id\": \"3\"}'),(1609,'2026-09-11 13:11:39','2026-09-11 13:11:39',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1610,'2026-09-11 13:12:01','2026-09-11 13:12:01',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1611,'2026-09-11 13:12:01','2026-09-11 13:12:01',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1612,'2026-09-11 13:12:01','2026-09-11 13:12:01',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1613,'2026-09-11 13:12:01','2026-09-11 13:12:01',NULL,1,'/admin/product/goods/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1614,'2026-09-11 13:12:10','2026-09-11 13:12:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1615,'2026-09-11 13:12:40','2026-09-11 13:12:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1616,'2026-09-11 13:13:10','2026-09-11 13:13:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1617,'2026-09-11 13:13:41','2026-09-11 13:13:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1618,'2026-09-11 13:14:11','2026-09-11 13:14:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1619,'2026-09-11 13:14:42','2026-09-11 13:14:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1620,'2026-09-11 13:15:12','2026-09-11 13:15:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1621,'2026-09-11 13:19:04','2026-09-11 13:19:04',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(1622,'2026-09-11 13:19:17','2026-09-11 13:19:17',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1623,'2026-09-11 13:19:17','2026-09-11 13:19:17',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1624,'2026-09-11 13:19:17','2026-09-11 13:19:17',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1625,'2026-09-11 13:19:17','2026-09-11 13:19:17',NULL,1,'/admin/product/goods/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1626,'2026-09-11 13:19:40','2026-09-11 13:19:40',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1627,'2026-09-11 13:19:40','2026-09-11 13:19:40',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1628,'2026-09-11 13:19:40','2026-09-11 13:19:40',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1629,'2026-09-11 13:19:41','2026-09-11 13:19:41',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1630,'2026-09-11 13:20:04','2026-09-11 13:20:04',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1631,'2026-09-11 13:20:04','2026-09-11 13:20:04',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1632,'2026-09-11 13:20:04','2026-09-11 13:20:04',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1633,'2026-09-11 13:20:04','2026-09-11 13:20:04',NULL,1,'/admin/product/category/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1634,'2026-09-11 13:21:25','2026-09-11 13:21:25',NULL,1,'/admin/product/category/add','172.18.0.1','{\"name\": \"织染绣品\", \"sort\": 0, \"status\": 1, \"parentId\": 0}'),(1635,'2026-09-11 13:21:25','2026-09-11 13:21:25',NULL,1,'/admin/product/category/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1636,'2026-09-11 13:21:55','2026-09-11 13:21:55',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1637,'2026-09-11 13:21:55','2026-09-11 13:21:55',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1638,'2026-09-11 13:21:55','2026-09-11 13:21:55',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1639,'2026-09-11 13:21:55','2026-09-11 13:21:55',NULL,1,'/admin/travel/route/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1640,'2026-09-11 13:58:07','2026-09-11 13:58:07',NULL,1,'/admin/travel/route/info','172.18.0.1','{\"id\": \"1\"}'),(1641,'2026-09-11 13:58:15','2026-09-11 13:58:15',NULL,1,'/admin/travel/route/info','172.18.0.1','{\"id\": \"1\"}'),(1642,'2026-09-11 14:11:15','2026-09-11 14:11:15',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1643,'2026-09-11 14:11:15','2026-09-11 14:11:15',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1644,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1645,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1646,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1647,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1648,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1649,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1650,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1651,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1652,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1653,'2026-09-11 14:11:16','2026-09-11 14:11:16',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1654,'2026-09-11 14:29:43','2026-09-11 14:29:43',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1655,'2026-09-11 14:29:43','2026-09-11 14:29:43',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1656,'2026-09-11 14:29:43','2026-09-11 14:29:43',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1657,'2026-09-11 14:29:43','2026-09-11 14:29:43',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1658,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1659,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1660,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1661,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1662,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1663,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1664,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1665,'2026-09-11 14:29:44','2026-09-11 14:29:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1666,'2026-09-11 14:29:51','2026-09-11 14:29:51',NULL,NULL,'/app/community/post/detail','172.18.0.1','{\"id\": \"603\"}'),(1667,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1668,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1669,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1670,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1671,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1672,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1673,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1674,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1675,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1676,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1677,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1678,'2026-09-11 14:29:54','2026-09-11 14:29:54',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1679,'2026-09-11 14:30:03','2026-09-11 14:30:03',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1680,'2026-09-11 14:30:08','2026-09-11 14:30:08',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1681,'2026-09-11 14:30:10','2026-09-11 14:30:10',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1682,'2026-09-11 14:30:10','2026-09-11 14:30:10',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1683,'2026-09-11 14:30:14','2026-09-11 14:30:14',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1684,'2026-09-11 14:30:15','2026-09-11 14:30:15',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1685,'2026-09-11 14:30:15','2026-09-11 14:30:15',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1686,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1687,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1688,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1689,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1690,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1691,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1692,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1693,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1694,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1695,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1696,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1697,'2026-09-11 14:30:45','2026-09-11 14:30:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1698,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1699,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1700,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1701,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1702,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1703,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1704,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1705,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1706,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1707,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1708,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1709,'2026-09-11 14:33:06','2026-09-11 14:33:06',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1710,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1711,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1712,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1713,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1714,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1715,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1716,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1717,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1718,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1719,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1720,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1721,'2026-09-11 14:37:10','2026-09-11 14:37:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1722,'2026-09-11 14:37:44','2026-09-11 14:37:44',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1723,'2026-09-11 14:37:44','2026-09-11 14:37:44',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1724,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1725,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1726,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1727,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1728,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1729,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1730,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1731,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1732,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1733,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1734,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1735,'2026-09-11 14:37:57','2026-09-11 14:37:57',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1736,'2026-09-11 14:38:25','2026-09-11 14:38:25',NULL,NULL,'/app/product/1','172.18.0.1','{}'),(1737,'2026-09-11 14:38:26','2026-09-11 14:38:26',NULL,NULL,'/app/product/1/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(1738,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1739,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1740,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1741,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1742,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1743,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1744,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1745,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1746,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1747,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1748,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1749,'2026-09-11 14:39:48','2026-09-11 14:39:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1750,'2026-09-11 14:39:59','2026-09-11 14:39:59',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1751,'2026-09-11 14:39:59','2026-09-11 14:39:59',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1752,'2026-09-11 14:40:00','2026-09-11 14:40:00',NULL,NULL,'/app/product/1','172.18.0.1','{}'),(1753,'2026-09-11 14:40:00','2026-09-11 14:40:00',NULL,NULL,'/app/product/1/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(1754,'2026-09-11 14:40:04','2026-09-11 14:40:04',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1755,'2026-09-11 14:40:04','2026-09-11 14:40:04',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1756,'2026-09-11 14:40:06','2026-09-11 14:40:06',NULL,NULL,'/app/product/1','172.18.0.1','{}'),(1757,'2026-09-11 14:40:06','2026-09-11 14:40:06',NULL,NULL,'/app/product/1/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(1758,'2026-09-11 14:40:07','2026-09-11 14:40:07',NULL,NULL,'/app/order/create','172.18.0.1','{\"items\": [{\"price\": 328, \"quantity\": 1, \"productId\": 1}], \"module\": \"product\", \"orderType\": 1}'),(1759,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1760,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1761,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1762,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1763,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1764,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1765,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1766,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1767,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1768,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1769,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1770,'2026-09-11 14:40:15','2026-09-11 14:40:15',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1771,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1772,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1773,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1774,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1775,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1776,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1777,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1778,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1779,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1780,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1781,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1782,'2026-09-11 14:44:05','2026-09-11 14:44:05',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1783,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1784,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1785,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1786,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1787,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1788,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1789,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1790,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1791,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1792,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1793,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1794,'2026-09-11 14:44:42','2026-09-11 14:44:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1795,'2026-09-11 14:46:23','2026-09-11 14:46:23',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1796,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1797,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1798,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1799,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1800,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1801,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1802,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1803,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1804,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1805,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1806,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1807,'2026-09-11 14:49:03','2026-09-11 14:49:03',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1808,'2026-09-11 14:49:14','2026-09-11 14:49:14',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1809,'2026-09-11 14:49:16','2026-09-11 14:49:16',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1810,'2026-09-11 14:49:16','2026-09-11 14:49:16',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1811,'2026-09-11 14:49:17','2026-09-11 14:49:17',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1812,'2026-09-11 14:49:18','2026-09-11 14:49:18',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1813,'2026-09-11 14:49:18','2026-09-11 14:49:18',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1814,'2026-09-11 14:49:19','2026-09-11 14:49:19',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1815,'2026-09-11 14:49:19','2026-09-11 14:49:19',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1816,'2026-09-11 14:49:19','2026-09-11 14:49:19',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1817,'2026-09-11 14:52:46','2026-09-11 14:52:46',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MDk2NTIwLCJleHAiOjE3OTAzOTI1MjB9.F7moqVrr58zaFCTKLDHpqsp0gVslqpaa3iA-KdaUWfI\"}'),(1818,'2026-09-11 14:52:46','2026-09-11 14:52:46',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{}'),(1819,'2026-09-11 14:52:46','2026-09-11 14:52:46',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{}'),(1820,'2026-09-11 14:52:51','2026-09-11 14:52:51',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(1821,'2026-09-11 14:52:51','2026-09-11 14:52:51',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(1822,'2026-09-11 14:52:52','2026-09-11 14:52:52',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(1823,'2026-09-11 14:52:52','2026-09-11 14:52:52',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1824,'2026-09-11 14:52:54','2026-09-11 14:52:54',NULL,1,'/admin/food/restaurant/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1825,'2026-09-11 14:52:56','2026-09-11 14:52:56',NULL,1,'/admin/community/post/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(1826,'2026-09-11 14:52:59','2026-09-11 14:52:59',NULL,1,'/admin/product/goods/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1827,'2026-09-11 14:53:00','2026-09-11 14:53:00',NULL,1,'/admin/product/category/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1828,'2026-09-11 14:53:01','2026-09-11 14:53:01',NULL,1,'/admin/food/farm-product/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(1829,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1830,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1831,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1832,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1833,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1834,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1835,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1836,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1837,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1838,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1839,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1840,'2026-09-11 14:54:07','2026-09-11 14:54:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1841,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1842,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1843,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1844,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1845,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1846,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1847,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1848,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1849,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1850,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1851,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1852,'2026-09-11 14:54:12','2026-09-11 14:54:12',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1853,'2026-09-11 14:55:41','2026-09-11 14:55:41',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1854,'2026-09-11 14:55:41','2026-09-11 14:55:41',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1855,'2026-09-11 14:55:47','2026-09-11 14:55:47',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\", \"categoryId\": \"1\"}'),(1856,'2026-09-11 14:55:49','2026-09-11 14:55:49',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1857,'2026-09-11 14:55:50','2026-09-11 14:55:50',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1858,'2026-09-11 14:55:51','2026-09-11 14:55:51',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1859,'2026-09-11 14:55:51','2026-09-11 14:55:51',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1860,'2026-09-11 14:55:52','2026-09-11 14:55:52',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1861,'2026-09-11 14:55:56','2026-09-11 14:55:56',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1862,'2026-09-11 14:55:57','2026-09-11 14:55:57',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1863,'2026-09-11 14:55:57','2026-09-11 14:55:57',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1864,'2026-09-11 14:55:57','2026-09-11 14:55:57',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1865,'2026-09-11 14:55:57','2026-09-11 14:55:57',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1866,'2026-09-11 14:55:57','2026-09-11 14:55:57',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1867,'2026-09-11 14:55:58','2026-09-11 14:55:58',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1868,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1869,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1870,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1871,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1872,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1873,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1874,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1875,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1876,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1877,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1878,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1879,'2026-09-11 14:56:00','2026-09-11 14:56:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1880,'2026-09-11 14:56:07','2026-09-11 14:56:07',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1881,'2026-09-11 14:56:25','2026-09-11 14:56:25',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(1882,'2026-09-11 14:56:25','2026-09-11 14:56:25',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1883,'2026-09-11 14:56:25','2026-09-11 14:56:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1884,'2026-09-11 14:56:55','2026-09-11 14:56:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1885,'2026-09-11 14:57:25','2026-09-11 14:57:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1886,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1887,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1888,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1889,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1890,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1891,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1892,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1893,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1894,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1895,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1896,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1897,'2026-09-11 14:57:45','2026-09-11 14:57:45',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1898,'2026-09-11 14:57:46','2026-09-11 14:57:46',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1899,'2026-09-11 14:57:48','2026-09-11 14:57:48',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1900,'2026-09-11 14:57:48','2026-09-11 14:57:48',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1901,'2026-09-11 14:57:49','2026-09-11 14:57:49',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1902,'2026-09-11 14:57:49','2026-09-11 14:57:49',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1903,'2026-09-11 14:57:49','2026-09-11 14:57:49',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1904,'2026-09-11 14:57:50','2026-09-11 14:57:50',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1905,'2026-09-11 14:57:50','2026-09-11 14:57:50',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1906,'2026-09-11 14:57:50','2026-09-11 14:57:50',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1907,'2026-09-11 14:57:51','2026-09-11 14:57:51',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1908,'2026-09-11 14:57:52','2026-09-11 14:57:52',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1909,'2026-09-11 14:57:52','2026-09-11 14:57:52',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1910,'2026-09-11 14:57:52','2026-09-11 14:57:52',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1911,'2026-09-11 14:57:54','2026-09-11 14:57:54',NULL,NULL,'/app/community/post/detail','172.18.0.1','{\"id\": \"601\"}'),(1912,'2026-09-11 14:57:54','2026-09-11 14:57:54',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1913,'2026-09-11 14:57:55','2026-09-11 14:57:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1914,'2026-09-11 14:58:10','2026-09-11 14:58:10',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1915,'2026-09-11 14:58:10','2026-09-11 14:58:10',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1916,'2026-09-11 14:58:10','2026-09-11 14:58:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1917,'2026-09-11 14:58:17','2026-09-11 14:58:17',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1918,'2026-09-11 14:58:19','2026-09-11 14:58:19',NULL,NULL,'/app/travel/ticket/my','172.18.0.1','{}'),(1919,'2026-09-11 14:58:20','2026-09-11 14:58:20',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1920,'2026-09-11 14:58:21','2026-09-11 14:58:21',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1921,'2026-09-11 14:58:21','2026-09-11 14:58:21',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1922,'2026-09-11 14:58:21','2026-09-11 14:58:21',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1923,'2026-09-11 14:58:21','2026-09-11 14:58:21',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1924,'2026-09-11 14:58:21','2026-09-11 14:58:21',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1925,'2026-09-11 14:58:23','2026-09-11 14:58:23',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(1926,'2026-09-11 14:58:23','2026-09-11 14:58:23',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(1927,'2026-09-11 14:58:34','2026-09-11 14:58:34',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(1928,'2026-09-11 14:58:34','2026-09-11 14:58:34',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1929,'2026-09-11 14:58:34','2026-09-11 14:58:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1930,'2026-09-11 14:58:40','2026-09-11 14:58:40',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1931,'2026-09-11 14:58:40','2026-09-11 14:58:40',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1932,'2026-09-11 14:58:51','2026-09-11 14:58:51',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\", \"categoryId\": \"1\"}'),(1933,'2026-09-11 14:58:53','2026-09-11 14:58:53',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1934,'2026-09-11 14:58:55','2026-09-11 14:58:55',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1935,'2026-09-11 14:58:58','2026-09-11 14:58:58',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1936,'2026-09-11 14:58:58','2026-09-11 14:58:58',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1937,'2026-09-11 14:58:58','2026-09-11 14:58:58',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1938,'2026-09-11 14:58:59','2026-09-11 14:58:59',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1939,'2026-09-11 14:59:00','2026-09-11 14:59:00',NULL,NULL,'/app/travel/ticket/my','172.18.0.1','{}'),(1940,'2026-09-11 14:59:01','2026-09-11 14:59:01',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1941,'2026-09-11 14:59:03','2026-09-11 14:59:03',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1942,'2026-09-11 14:59:03','2026-09-11 14:59:03',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1943,'2026-09-11 14:59:03','2026-09-11 14:59:03',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1944,'2026-09-11 14:59:03','2026-09-11 14:59:03',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1945,'2026-09-11 14:59:03','2026-09-11 14:59:03',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1946,'2026-09-11 14:59:04','2026-09-11 14:59:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1947,'2026-09-11 14:59:05','2026-09-11 14:59:05',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(1948,'2026-09-11 14:59:06','2026-09-11 14:59:06',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1949,'2026-09-11 14:59:06','2026-09-11 14:59:06',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1950,'2026-09-11 14:59:34','2026-09-11 14:59:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1951,'2026-09-11 15:00:04','2026-09-11 15:00:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1952,'2026-09-11 15:00:34','2026-09-11 15:00:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1953,'2026-09-11 15:01:04','2026-09-11 15:01:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1954,'2026-09-11 15:01:34','2026-09-11 15:01:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1955,'2026-09-11 15:02:04','2026-09-11 15:02:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1956,'2026-09-11 15:02:34','2026-09-11 15:02:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1957,'2026-09-11 15:03:04','2026-09-11 15:03:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1958,'2026-09-11 15:03:05','2026-09-11 15:03:05',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1959,'2026-09-11 15:03:05','2026-09-11 15:03:05',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1960,'2026-09-11 15:03:06','2026-09-11 15:03:06',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1961,'2026-09-11 15:03:09','2026-09-11 15:03:09',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(1962,'2026-09-11 15:03:09','2026-09-11 15:03:09',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(1963,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1964,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1965,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1966,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1967,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1968,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1969,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1970,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1971,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1972,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1973,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1974,'2026-09-11 15:05:21','2026-09-11 15:05:21',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1975,'2026-09-11 15:05:25','2026-09-11 15:05:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1976,'2026-09-11 15:05:25','2026-09-11 15:05:25',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"2\"}'),(1977,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(1978,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(1979,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(1980,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(1981,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(1982,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(1983,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(1984,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(1985,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(1986,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(1987,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(1988,'2026-09-11 15:05:28','2026-09-11 15:05:28',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(1989,'2026-09-11 15:08:24','2026-09-11 15:08:24',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1990,'2026-09-11 15:08:24','2026-09-11 15:08:24',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1991,'2026-09-11 15:08:38','2026-09-11 15:08:38',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(1992,'2026-09-11 15:08:38','2026-09-11 15:08:38',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(1993,'2026-09-11 15:08:38','2026-09-11 15:08:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(1994,'2026-09-11 15:08:40','2026-09-11 15:08:40',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(1995,'2026-09-11 15:08:40','2026-09-11 15:08:40',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(1996,'2026-09-11 15:08:44','2026-09-11 15:08:44',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(1997,'2026-09-11 15:08:44','2026-09-11 15:08:44',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(1998,'2026-09-11 15:08:48','2026-09-11 15:08:48',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(1999,'2026-09-11 15:08:48','2026-09-11 15:08:48',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2000,'2026-09-11 15:08:48','2026-09-11 15:08:48',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2001,'2026-09-11 15:08:48','2026-09-11 15:08:48',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2002,'2026-09-11 15:08:49','2026-09-11 15:08:49',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2003,'2026-09-11 15:08:49','2026-09-11 15:08:49',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2004,'2026-09-11 15:08:50','2026-09-11 15:08:50',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2005,'2026-09-11 15:08:50','2026-09-11 15:08:50',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2006,'2026-09-11 15:08:52','2026-09-11 15:08:52',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2007,'2026-09-11 15:08:54','2026-09-11 15:08:54',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2008,'2026-09-11 15:08:54','2026-09-11 15:08:54',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2009,'2026-09-11 15:08:54','2026-09-11 15:08:54',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2010,'2026-09-11 15:08:54','2026-09-11 15:08:54',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2011,'2026-09-11 15:08:54','2026-09-11 15:08:54',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2012,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2013,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2014,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2015,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2016,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2017,'2026-09-11 15:08:55','2026-09-11 15:08:55',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2018,'2026-09-11 15:08:56','2026-09-11 15:08:56',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2019,'2026-09-11 15:08:56','2026-09-11 15:08:56',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2020,'2026-09-11 15:08:56','2026-09-11 15:08:56',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2021,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2022,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2023,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2024,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2025,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2026,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2027,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2028,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2029,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2030,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2031,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2032,'2026-09-11 15:10:41','2026-09-11 15:10:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2033,'2026-09-11 15:14:41','2026-09-11 15:14:42',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2034,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2035,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2036,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2037,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2038,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2039,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2040,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2041,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2042,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2043,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2044,'2026-09-11 15:14:42','2026-09-11 15:14:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2045,'2026-09-11 15:18:08','2026-09-11 15:18:08',NULL,1,'/admin/travel/route/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2046,'2026-09-11 15:18:58','2026-09-11 15:18:58',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2047,'2026-09-11 15:18:58','2026-09-11 15:18:58',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2048,'2026-09-11 15:20:43','2026-09-11 15:20:43',NULL,1,'/admin/community/topic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2049,'2026-09-11 15:20:48','2026-09-11 15:20:48',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2050,'2026-09-11 15:20:54','2026-09-11 15:20:54',NULL,1,'/admin/travel/scenic/info','172.18.0.1','{\"id\": \"5\"}'),(2051,'2026-09-11 15:21:05','2026-09-11 15:21:05',NULL,1,'/admin/travel/scenic/info','172.18.0.1','{\"id\": \"1\"}'),(2052,'2026-09-11 15:21:12','2026-09-11 15:21:12',NULL,1,'/admin/travel/scenic/update','172.18.0.1','{\"id\": 1, \"name\": \"乌东梯田\", \"type\": \"spot\", \"intro\": \"晨雾六点十分从谷底漫上来\", \"status\": 1, \"address\": \"乌东村东岭\", \"latitude\": null, \"openTime\": \"全天\", \"tenantId\": null, \"longitude\": null, \"mainImage\": \"ph1\", \"createTime\": \"2026-09-11 10:34:14\", \"updateTime\": \"2026-09-11 10:34:14\"}'),(2053,'2026-09-11 15:21:12','2026-09-11 15:21:12',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2054,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2055,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2056,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2057,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2058,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2059,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2060,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2061,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2062,'2026-09-11 15:21:47','2026-09-11 15:21:47',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2063,'2026-09-11 15:21:48','2026-09-11 15:21:48',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2064,'2026-09-11 15:21:48','2026-09-11 15:21:48',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2065,'2026-09-11 15:21:48','2026-09-11 15:21:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2066,'2026-09-11 15:21:48','2026-09-11 15:21:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2067,'2026-09-11 15:21:48','2026-09-11 15:21:48',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2068,'2026-09-11 15:21:53','2026-09-11 15:21:53',NULL,1,'/admin/product/goods/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(2069,'2026-09-11 15:22:19','2026-09-11 15:22:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2070,'2026-09-11 15:22:41','2026-09-11 15:22:41',NULL,NULL,'/app/community/post/detail','172.18.0.1','{\"id\": \"601\"}'),(2071,'2026-09-11 15:22:41','2026-09-11 15:22:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2072,'2026-09-11 15:22:49','2026-09-11 15:22:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2073,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2074,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2075,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2076,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2077,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2078,'2026-09-11 15:22:50','2026-09-11 15:22:50',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2079,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2080,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2081,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2082,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2083,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2084,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2085,'2026-09-11 15:22:51','2026-09-11 15:22:51',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2086,'2026-09-11 15:23:09','2026-09-11 15:23:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2087,'2026-09-11 15:23:11','2026-09-11 15:23:11',NULL,1,'/admin/travel/route/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2088,'2026-09-11 15:23:12','2026-09-11 15:23:12',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2089,'2026-09-11 15:23:16','2026-09-11 15:23:16',NULL,1,'/admin/travel/review/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2090,'2026-09-11 15:23:17','2026-09-11 15:23:17',NULL,1,'/admin/travel/guide/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2091,'2026-09-11 15:23:17','2026-09-11 15:23:17',NULL,1,'/admin/travel/recommend/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2092,'2026-09-11 15:23:20','2026-09-11 15:23:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2093,'2026-09-11 15:23:30','2026-09-11 15:23:30',NULL,1,'/admin/travel/recommend/info','172.18.0.1','{\"id\": \"701\"}'),(2094,'2026-09-11 15:23:34','2026-09-11 15:23:34',NULL,1,'/admin/travel/recommend/update','172.18.0.1','{\"id\": 701, \"sort\": 1, \"badge\": \"🔥 运营置顶 · 本周精选\", \"title\": \"苗寨深度两日游 · 邂逅梯田日出\", \"itemId\": 1, \"status\": 0, \"itemType\": \"route\", \"position\": \"home\", \"subtitle\": \"¥899 起 · 已售 1,284 · 平均点亮 4/5 站\", \"tenantId\": null, \"createTime\": \"2026-09-11 10:34:14\", \"updateTime\": \"2026-09-11 10:34:14\", \"rotationGroup\": 1, \"intervalSeconds\": 5}'),(2095,'2026-09-11 15:23:34','2026-09-11 15:23:34',NULL,1,'/admin/travel/recommend/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2096,'2026-09-11 15:23:38','2026-09-11 15:23:38',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2097,'2026-09-11 15:23:38','2026-09-11 15:23:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2098,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2099,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2100,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2101,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2102,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2103,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2104,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2105,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2106,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2107,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2108,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2109,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2110,'2026-09-11 15:23:39','2026-09-11 15:23:39',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2111,'2026-09-11 15:23:50','2026-09-11 15:23:50',NULL,1,'/admin/travel/recommend/info','172.18.0.1','{\"id\": \"701\"}'),(2112,'2026-09-11 15:23:52','2026-09-11 15:23:52',NULL,1,'/admin/travel/recommend/update','172.18.0.1','{\"id\": 701, \"sort\": 1, \"badge\": \"🔥 运营置顶 · 本周精选\", \"title\": \"苗寨深度两日游 · 邂逅梯田日出\", \"itemId\": 1, \"status\": 1, \"itemType\": \"route\", \"position\": \"home\", \"subtitle\": \"¥899 起 · 已售 1,284 · 平均点亮 4/5 站\", \"tenantId\": null, \"createTime\": \"2026-09-11 10:34:14\", \"updateTime\": \"2026-09-11 15:23:34\", \"rotationGroup\": 1, \"intervalSeconds\": 5}'),(2113,'2026-09-11 15:23:52','2026-09-11 15:23:52',NULL,1,'/admin/travel/recommend/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2114,'2026-09-11 15:24:11','2026-09-11 15:24:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2115,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2116,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2117,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2118,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2119,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2120,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2121,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2122,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2123,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2124,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2125,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2126,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2127,'2026-09-11 15:24:38','2026-09-11 15:24:38',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2128,'2026-09-11 15:24:41','2026-09-11 15:24:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2129,'2026-09-11 15:25:12','2026-09-11 15:25:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2130,'2026-09-11 15:25:43','2026-09-11 15:25:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2131,'2026-09-11 15:26:13','2026-09-11 15:26:13',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2132,'2026-09-11 15:26:44','2026-09-11 15:26:44',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2133,'2026-09-11 15:27:15','2026-09-11 15:27:15',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2134,'2026-09-11 15:27:46','2026-09-11 15:27:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2135,'2026-09-11 15:28:17','2026-09-11 15:28:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2136,'2026-09-11 15:28:47','2026-09-11 15:28:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2137,'2026-09-11 15:29:18','2026-09-11 15:29:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2138,'2026-09-11 15:29:49','2026-09-11 15:29:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2139,'2026-09-11 15:30:02','2026-09-11 15:30:02',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2140,'2026-09-11 15:30:02','2026-09-11 15:30:02',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2141,'2026-09-11 15:30:02','2026-09-11 15:30:02',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2142,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2143,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2144,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2145,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2146,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2147,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2148,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2149,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2150,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2151,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2152,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2153,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2154,'2026-09-11 15:30:07','2026-09-11 15:30:07',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2155,'2026-09-11 15:30:20','2026-09-11 15:30:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2156,'2026-09-11 15:30:51','2026-09-11 15:30:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2157,'2026-09-11 15:31:21','2026-09-11 15:31:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2158,'2026-09-11 15:36:18','2026-09-11 15:36:18',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(2159,'2026-09-11 15:36:19','2026-09-11 15:36:19',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2160,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2161,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(2162,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(2163,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2164,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(2165,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(2166,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2167,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2168,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(2169,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(2170,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(2171,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(2172,'2026-09-11 15:36:21','2026-09-11 15:36:21',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(2173,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2174,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2175,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2176,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2177,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2178,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2179,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2180,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2181,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2182,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2183,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2184,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2185,'2026-09-11 15:36:41','2026-09-11 15:36:41',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2186,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2187,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2188,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2189,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2190,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2191,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2192,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2193,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2194,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2195,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2196,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2197,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2198,'2026-09-11 15:38:09','2026-09-11 15:38:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2199,'2026-09-11 15:38:13','2026-09-11 15:38:13',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2200,'2026-09-11 15:38:13','2026-09-11 15:38:13',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(2201,'2026-09-11 15:38:16','2026-09-11 15:38:16',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2202,'2026-09-11 15:38:16','2026-09-11 15:38:16',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2203,'2026-09-11 15:38:17','2026-09-11 15:38:17',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(2204,'2026-09-11 15:38:18','2026-09-11 15:38:18',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2205,'2026-09-11 15:38:18','2026-09-11 15:38:18',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2206,'2026-09-11 15:38:37','2026-09-11 15:38:37',NULL,NULL,'/app/member/loginByPassword','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2207,'2026-09-11 15:39:06','2026-09-11 15:39:06',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2208,'2026-09-11 15:39:07','2026-09-11 15:39:07',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2209,'2026-09-11 15:39:07','2026-09-11 15:39:07',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2210,'2026-09-11 15:40:11','2026-09-11 15:40:11',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2211,'2026-09-11 15:40:11','2026-09-11 15:40:11',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2212,'2026-09-11 15:44:50','2026-09-11 15:44:50',NULL,NULL,'/admin/base/open/eps','172.18.0.1','{}'),(2213,'2026-09-11 15:44:51','2026-09-11 15:44:51',NULL,NULL,'/app/user/comm/config','172.18.0.1','{}'),(2214,'2026-09-11 15:45:17','2026-09-11 15:45:17',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2215,'2026-09-11 15:45:17','2026-09-11 15:45:17',NULL,NULL,'/app/user/address/page','172.18.0.1','{\"pageSize\": \"1\"}'),(2216,'2026-09-11 15:45:17','2026-09-11 15:45:17',NULL,NULL,'/app/user/address/info','172.18.0.1','{\"id\": \"1\"}'),(2217,'2026-09-11 15:45:18','2026-09-11 15:45:18',NULL,NULL,'/app/user/address/default','172.18.0.1','{}'),(2218,'2026-09-11 15:45:18','2026-09-11 15:45:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2219,'2026-09-11 15:47:20','2026-09-11 15:47:20',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2220,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/order/page','172.18.0.1','{\"page\": \"1\"}'),(2221,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/order/detail','172.18.0.1','{\"orderNo\": \"X\"}'),(2222,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/food/reservation/my','172.18.0.1','{\"page\": \"1\"}'),(2223,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/member/favorite/check','172.18.0.1','{\"targetId\": \"1\", \"targetType\": \"route\"}'),(2224,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/member/favorite/page','172.18.0.1','{\"page\": \"1\"}'),(2225,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/travel/review/list','172.18.0.1','{\"targetId\": \"1\", \"targetType\": \"route\"}'),(2226,'2026-09-11 15:47:21','2026-09-11 15:47:21',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2227,'2026-09-11 15:48:05','2026-09-11 15:48:05',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2228,'2026-09-11 15:48:05','2026-09-11 15:48:05',NULL,NULL,'/app/product/page','172.18.0.1','{\"pageSize\": \"2\"}'),(2229,'2026-09-11 15:48:05','2026-09-11 15:48:05',NULL,NULL,'/app/cart/add','172.18.0.1','{\"itemId\": 1, \"itemType\": 1, \"quantity\": 1}'),(2230,'2026-09-11 15:49:16','2026-09-11 15:49:16',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2231,'2026-09-11 15:49:16','2026-09-11 15:49:16',NULL,NULL,'/app/food/farm-product/page','172.18.0.1','{\"page\": \"1\", \"size\": \"1\"}'),(2232,'2026-09-11 15:49:16','2026-09-11 15:49:16',NULL,NULL,'/app/order/create','172.18.0.1','{\"items\": [{\"price\": 328, \"quantity\": 1, \"productId\": 1}], \"module\": \"product\", \"orderType\": 1}'),(2233,'2026-09-11 15:50:18','2026-09-11 15:50:18',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2234,'2026-09-11 15:50:19','2026-09-11 15:50:19',NULL,NULL,'/app/cart/add','172.18.0.1','{\"itemId\": 1, \"itemType\": 2, \"quantity\": 1}'),(2235,'2026-09-11 15:52:28','2026-09-11 15:52:28',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2236,'2026-09-11 15:52:28','2026-09-11 15:52:28',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2237,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2238,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2239,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2240,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2241,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2242,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2243,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2244,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2245,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2246,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2247,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2248,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2249,'2026-09-11 15:57:27','2026-09-11 15:57:27',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2250,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2251,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2252,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2253,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2254,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2255,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2256,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2257,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2258,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2259,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2260,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2261,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2262,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2263,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2264,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2265,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2266,'2026-09-11 15:57:44','2026-09-11 15:57:44',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2267,'2026-09-11 15:57:57','2026-09-11 15:57:57',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2268,'2026-09-11 15:57:57','2026-09-11 15:57:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2269,'2026-09-11 15:57:57','2026-09-11 15:57:57',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2270,'2026-09-11 15:57:58','2026-09-11 15:57:58',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2271,'2026-09-11 15:58:27','2026-09-11 15:58:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2272,'2026-09-11 15:58:57','2026-09-11 15:58:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2273,'2026-09-11 15:59:04','2026-09-11 15:59:04',NULL,1,'/admin/user/info/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2274,'2026-09-11 15:59:08','2026-09-11 15:59:08',NULL,1,'/admin/plugin/info/page','172.18.0.1','{\"size\": 1000}'),(2275,'2026-09-11 15:59:11','2026-09-11 15:59:11',NULL,1,'/admin/base/sys/param/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(2276,'2026-09-11 15:59:13','2026-09-11 15:59:13',NULL,1,'/admin/base/sys/log/getKeep','172.18.0.1','{}'),(2277,'2026-09-11 15:59:13','2026-09-11 15:59:13',NULL,1,'/admin/base/sys/log/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2278,'2026-09-11 15:59:20','2026-09-11 15:59:20',NULL,1,'/admin/operate/banner/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2279,'2026-09-11 15:59:21','2026-09-11 15:59:21',NULL,1,'/admin/operate/announcement/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2280,'2026-09-11 15:59:25','2026-09-11 15:59:25',NULL,1,'/admin/operate/finance-record/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(2281,'2026-09-11 15:59:27','2026-09-11 15:59:27',NULL,1,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2282,'2026-09-11 15:59:27','2026-09-11 15:59:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2283,'2026-09-11 15:59:29','2026-09-11 15:59:29',NULL,1,'/admin/pay/record/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2284,'2026-09-11 15:59:32','2026-09-11 15:59:32',NULL,1,'/admin/sensitive/word/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2285,'2026-09-11 15:59:34','2026-09-11 15:59:34',NULL,1,'/admin/travel/route/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2286,'2026-09-11 15:59:36','2026-09-11 15:59:36',NULL,1,'/admin/travel/scenic/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2287,'2026-09-11 15:59:39','2026-09-11 15:59:39',NULL,1,'/admin/travel/ticketType/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2288,'2026-09-11 15:59:57','2026-09-11 15:59:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2289,'2026-09-11 16:00:27','2026-09-11 16:00:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2290,'2026-09-11 16:00:57','2026-09-11 16:00:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2291,'2026-09-11 16:01:27','2026-09-11 16:01:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2292,'2026-09-11 16:01:57','2026-09-11 16:01:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2293,'2026-09-11 16:02:10','2026-09-11 16:02:10',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2294,'2026-09-11 16:02:10','2026-09-11 16:02:10',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2295,'2026-09-11 16:02:22','2026-09-11 16:02:22',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2296,'2026-09-11 16:02:22','2026-09-11 16:02:22',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2297,'2026-09-11 16:02:27','2026-09-11 16:02:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2298,'2026-09-11 16:02:57','2026-09-11 16:02:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2299,'2026-09-11 16:03:27','2026-09-11 16:03:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2300,'2026-09-11 16:03:57','2026-09-11 16:03:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2301,'2026-09-11 16:04:27','2026-09-11 16:04:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2302,'2026-09-11 16:04:35','2026-09-11 16:04:35',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2303,'2026-09-11 16:04:35','2026-09-11 16:04:35',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2304,'2026-09-11 16:04:47','2026-09-11 16:04:47',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2305,'2026-09-11 16:04:47','2026-09-11 16:04:47',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2306,'2026-09-11 16:04:57','2026-09-11 16:04:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2307,'2026-09-11 16:05:21','2026-09-11 16:05:21',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2308,'2026-09-11 16:05:21','2026-09-11 16:05:21',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2309,'2026-09-11 16:05:22','2026-09-11 16:05:22',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2310,'2026-09-11 16:05:23','2026-09-11 16:05:23',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(2311,'2026-09-11 16:05:24','2026-09-11 16:05:24',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2312,'2026-09-11 16:05:24','2026-09-11 16:05:24',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2313,'2026-09-11 16:05:27','2026-09-11 16:05:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2314,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2315,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2316,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2317,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2318,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2319,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2320,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2321,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2322,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2323,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2324,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2325,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2326,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2327,'2026-09-11 16:05:36','2026-09-11 16:05:36',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2328,'2026-09-11 16:05:57','2026-09-11 16:05:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2329,'2026-09-11 16:06:27','2026-09-11 16:06:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2330,'2026-09-11 16:06:49','2026-09-11 16:06:49',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2331,'2026-09-11 16:06:49','2026-09-11 16:06:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2332,'2026-09-11 16:06:49','2026-09-11 16:06:49',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2333,'2026-09-11 16:06:49','2026-09-11 16:06:49',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2334,'2026-09-11 16:07:19','2026-09-11 16:07:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2335,'2026-09-11 16:07:32','2026-09-11 16:07:32',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2336,'2026-09-11 16:07:49','2026-09-11 16:07:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2337,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2338,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2339,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2340,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2341,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2342,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2343,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2344,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2345,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2346,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2347,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2348,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2349,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2350,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2351,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2352,'2026-09-11 16:07:53','2026-09-11 16:07:53',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2353,'2026-09-11 16:08:23','2026-09-11 16:08:23',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2354,'2026-09-11 16:08:29','2026-09-11 16:08:29',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2355,'2026-09-11 16:08:29','2026-09-11 16:08:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2356,'2026-09-11 16:08:29','2026-09-11 16:08:29',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2357,'2026-09-11 16:08:29','2026-09-11 16:08:29',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2358,'2026-09-11 16:08:59','2026-09-11 16:08:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2359,'2026-09-11 16:09:29','2026-09-11 16:09:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2360,'2026-09-11 16:09:53','2026-09-11 16:09:53',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2361,'2026-09-11 16:09:53','2026-09-11 16:09:53',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(2362,'2026-09-11 16:09:54','2026-09-11 16:09:54',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(2363,'2026-09-11 16:09:59','2026-09-11 16:09:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2364,'2026-09-11 16:10:22','2026-09-11 16:10:22',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2365,'2026-09-11 16:10:22','2026-09-11 16:10:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2366,'2026-09-11 16:10:22','2026-09-11 16:10:22',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2367,'2026-09-11 16:10:22','2026-09-11 16:10:22',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2368,'2026-09-11 16:10:24','2026-09-11 16:10:24',NULL,NULL,'/app/product/3','172.18.0.1','{}'),(2369,'2026-09-11 16:10:24','2026-09-11 16:10:24',NULL,NULL,'/app/product/3/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(2370,'2026-09-11 16:10:26','2026-09-11 16:10:26',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2371,'2026-09-11 16:10:26','2026-09-11 16:10:26',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2372,'2026-09-11 16:10:27','2026-09-11 16:10:27',NULL,NULL,'/app/product/2','172.18.0.1','{}'),(2373,'2026-09-11 16:10:27','2026-09-11 16:10:27',NULL,NULL,'/app/product/2/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(2374,'2026-09-11 16:10:33','2026-09-11 16:10:33',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2375,'2026-09-11 16:10:33','2026-09-11 16:10:33',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2376,'2026-09-11 16:10:33','2026-09-11 16:10:33',NULL,NULL,'/app/product/1','172.18.0.1','{}'),(2377,'2026-09-11 16:10:33','2026-09-11 16:10:33',NULL,NULL,'/app/product/1/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(2378,'2026-09-11 16:10:38','2026-09-11 16:10:38',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2379,'2026-09-11 16:10:38','2026-09-11 16:10:38',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2380,'2026-09-11 16:10:40','2026-09-11 16:10:40',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2381,'2026-09-11 16:10:40','2026-09-11 16:10:40',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2382,'2026-09-11 16:10:52','2026-09-11 16:10:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2383,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2384,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2385,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2386,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2387,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2388,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2389,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2390,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2391,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2392,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2393,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2394,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2395,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2396,'2026-09-11 16:11:10','2026-09-11 16:11:10',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2397,'2026-09-11 16:11:22','2026-09-11 16:11:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2398,'2026-09-11 16:11:52','2026-09-11 16:11:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2399,'2026-09-11 16:12:22','2026-09-11 16:12:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2400,'2026-09-11 16:12:52','2026-09-11 16:12:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2401,'2026-09-11 16:13:22','2026-09-11 16:13:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2402,'2026-09-11 16:13:52','2026-09-11 16:13:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2403,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2404,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2405,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2406,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2407,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2408,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2409,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2410,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2411,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2412,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2413,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2414,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2415,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2416,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2417,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2418,'2026-09-11 16:14:09','2026-09-11 16:14:09',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2419,'2026-09-11 16:14:10','2026-09-11 16:14:10',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2420,'2026-09-11 16:14:10','2026-09-11 16:14:10',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2421,'2026-09-11 16:16:54','2026-09-11 16:16:54',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(2422,'2026-09-11 16:16:54','2026-09-11 16:16:54',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2423,'2026-09-11 16:16:55','2026-09-11 16:16:55',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(2424,'2026-09-11 16:17:27','2026-09-11 16:17:27',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2425,'2026-09-11 16:21:32','2026-09-11 16:21:32',NULL,NULL,'/admin/base/open/refreshToken','172.18.0.1','{\"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsInJvbGVJZHMiOlsxXSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MSwicGFzc3dvcmRWZXJzaW9uIjo3LCJ0ZW5hbnRJZCI6bnVsbCwiaWF0IjoxNzg5MTAyMTA1LCJleHAiOjE3OTAzOTgxMDV9.hnTDhs4XtUc6yTb1gjRJbhclNfMyZbp8Ou4UDff1bX4\"}'),(2426,'2026-09-11 16:21:32','2026-09-11 16:21:32',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(2427,'2026-09-11 16:21:32','2026-09-11 16:21:32',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2428,'2026-09-11 16:21:32','2026-09-11 16:21:32',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(2429,'2026-09-11 16:22:14','2026-09-11 16:22:14',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(2430,'2026-09-11 16:22:14','2026-09-11 16:22:14',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2431,'2026-09-11 16:22:14','2026-09-11 16:22:14',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(2432,'2026-09-11 16:22:20','2026-09-11 16:22:20',NULL,1,'/admin/accommodation/hotel/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2433,'2026-09-11 16:22:21','2026-09-11 16:22:21',NULL,1,'/admin/accommodation/hotel/list','172.18.0.1','{}'),(2434,'2026-09-11 16:22:21','2026-09-11 16:22:21',NULL,1,'/admin/accommodation/room-type/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2435,'2026-09-11 16:22:24','2026-09-11 16:22:24',NULL,1,'/admin/operate/banner/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2436,'2026-09-11 16:22:25','2026-09-11 16:22:25',NULL,1,'/admin/operate/announcement/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2437,'2026-09-11 16:22:30','2026-09-11 16:22:30',NULL,1,'/admin/operate/finance-record/page','172.18.0.1','{\"page\": 1, \"size\": 20}'),(2438,'2026-09-11 16:23:22','2026-09-11 16:23:22',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2439,'2026-09-11 16:23:56','2026-09-11 16:23:56',NULL,1,'/admin/base/comm/logout','172.18.0.1','{}'),(2440,'2026-09-11 16:23:56','2026-09-11 16:23:56',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2441,'2026-09-11 16:25:26','2026-09-11 16:25:26',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"21a46420-adba-11f1-9207-f33e455b4da1\", \"verifyCode\": \"S7Mv\"}'),(2442,'2026-09-11 16:25:26','2026-09-11 16:25:26',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2443,'2026-09-11 16:25:26','2026-09-11 16:25:26',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2444,'2026-09-11 16:25:26','2026-09-11 16:25:26',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2445,'2026-09-11 16:25:26','2026-09-11 16:25:26',NULL,2,'/admin/accommodation/hotel/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2446,'2026-09-11 16:26:12','2026-09-11 16:26:12',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2447,'2026-09-11 16:26:13','2026-09-11 16:26:13',NULL,2,'/admin/pay/record/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2448,'2026-09-11 16:26:14','2026-09-11 16:26:14',NULL,2,'/admin/accommodation/hotel/list','172.18.0.1','{}'),(2449,'2026-09-11 16:26:14','2026-09-11 16:26:14',NULL,2,'/admin/accommodation/room-type/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2450,'2026-09-11 16:26:16','2026-09-11 16:26:16',NULL,2,'/admin/accommodation/hotel/list','172.18.0.1','{}'),(2451,'2026-09-11 16:28:07','2026-09-11 16:28:07',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2452,'2026-09-11 16:28:07','2026-09-11 16:28:07',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2453,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2454,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2455,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2456,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2457,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2458,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2459,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2460,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2461,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2462,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2463,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2464,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2465,'2026-09-11 16:28:08','2026-09-11 16:28:08',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2466,'2026-09-11 16:28:09','2026-09-11 16:28:09',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2467,'2026-09-11 16:28:09','2026-09-11 16:28:09',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2468,'2026-09-11 16:28:09','2026-09-11 16:28:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2469,'2026-09-11 16:28:09','2026-09-11 16:28:09',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2470,'2026-09-11 16:28:09','2026-09-11 16:28:09',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2471,'2026-09-11 16:28:31','2026-09-11 16:28:31',NULL,2,'/admin/accommodation/room-type/add','172.18.0.1','{\"name\": \"梯田景观大床房\", \"price\": 288, \"stock\": 3, \"images\": [], \"status\": 1, \"hotelId\": 3, \"maxGuests\": 2, \"facilities\": []}'),(2472,'2026-09-11 16:28:31','2026-09-11 16:28:31',NULL,2,'/admin/accommodation/room-type/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2473,'2026-09-11 16:29:47','2026-09-11 16:29:47',NULL,2,'/admin/accommodation/room-type/page','172.18.0.1','{\"page\": 1, \"size\": 1000, \"hotelId\": 3}'),(2474,'2026-09-11 16:32:26','2026-09-11 16:32:26',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(2475,'2026-09-11 16:32:26','2026-09-11 16:32:26',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(2476,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2477,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2478,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2479,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(2480,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(2481,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2482,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(2483,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(2484,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(2485,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(2486,'2026-09-11 16:32:27','2026-09-11 16:32:27',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(2487,'2026-09-11 16:32:39','2026-09-11 16:32:39',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2488,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2489,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2490,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2491,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2492,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2493,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2494,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2495,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2496,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2497,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2498,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2499,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2500,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2501,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2502,'2026-09-11 16:32:40','2026-09-11 16:32:40',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2503,'2026-09-11 16:33:07','2026-09-11 16:33:07',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2504,'2026-09-11 16:33:09','2026-09-11 16:33:09',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2505,'2026-09-11 16:33:10','2026-09-11 16:33:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2506,'2026-09-11 16:33:12','2026-09-11 16:33:12',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2507,'2026-09-11 16:33:12','2026-09-11 16:33:12',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2508,'2026-09-11 16:33:14','2026-09-11 16:33:14',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(2509,'2026-09-11 16:33:16','2026-09-11 16:33:16',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2510,'2026-09-11 16:33:16','2026-09-11 16:33:16',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2511,'2026-09-11 16:33:19','2026-09-11 16:33:19',NULL,NULL,'/app/food/farm-product/2','172.18.0.1','{}'),(2512,'2026-09-11 16:33:20','2026-09-11 16:33:20',NULL,NULL,'/app/food/farm-product/2','172.18.0.1','{}'),(2513,'2026-09-11 16:33:21','2026-09-11 16:33:21',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2514,'2026-09-11 16:33:21','2026-09-11 16:33:21',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2515,'2026-09-11 16:33:23','2026-09-11 16:33:23',NULL,2,'/admin/accommodation/room-calendar/batch','172.18.0.1','{\"price\": 328, \"endDate\": \"2026-10-11\", \"weekDays\": [5, 6], \"startDate\": \"2026-09-11\", \"roomTypeId\": 6}'),(2516,'2026-09-11 16:33:23','2026-09-11 16:33:23',NULL,2,'/admin/accommodation/room-calendar/range','172.18.0.1','{\"endDate\": \"2026-10-11\", \"startDate\": \"2026-09-11\", \"roomTypeId\": \"6\"}'),(2517,'2026-09-11 16:33:39','2026-09-11 16:33:39',NULL,2,'/admin/accommodation/room-calendar/range','172.18.0.1','{\"endDate\": \"2026-10-11\", \"startDate\": \"2026-09-11\", \"roomTypeId\": \"6\"}'),(2518,'2026-09-11 16:33:42','2026-09-11 16:33:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2519,'2026-09-11 16:34:08','2026-09-11 16:34:08',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\"}'),(2520,'2026-09-11 16:34:12','2026-09-11 16:34:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2521,'2026-09-11 16:34:31','2026-09-11 16:34:31',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"styleTags\": \"山景\"}'),(2522,'2026-09-11 16:34:49','2026-09-11 16:34:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2523,'2026-09-11 16:34:56','2026-09-11 16:34:56',NULL,NULL,'/app/accommodation/hotel/search','172.18.0.5','{\"page\": \"1\", \"size\": \"20\", \"keyword\": \"梯田\", \"styleTags\": \"山景\"}'),(2524,'2026-09-11 16:35:19','2026-09-11 16:35:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2525,'2026-09-11 16:35:25','2026-09-11 16:35:25',NULL,NULL,'/app/accommodation/hotel/detail','172.18.0.5','{\"id\": \"3\"}'),(2526,'2026-09-11 16:35:49','2026-09-11 16:35:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2527,'2026-09-11 16:36:19','2026-09-11 16:36:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2528,'2026-09-11 16:36:32','2026-09-11 16:36:32',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2529,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2530,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2531,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2532,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2533,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2534,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2535,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2536,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2537,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2538,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2539,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2540,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2541,'2026-09-11 16:36:33','2026-09-11 16:36:33',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2542,'2026-09-11 16:36:43','2026-09-11 16:36:43',NULL,NULL,'/app/member/login/password','172.18.0.5','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2543,'2026-09-11 16:36:43','2026-09-11 16:36:43',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2544,'2026-09-11 16:36:43','2026-09-11 16:36:43',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2545,'2026-09-11 16:36:49','2026-09-11 16:36:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2546,'2026-09-11 16:37:13','2026-09-11 16:37:13',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2547,'2026-09-11 16:37:19','2026-09-11 16:37:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2548,'2026-09-11 16:37:43','2026-09-11 16:37:43',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2549,'2026-09-11 16:37:44','2026-09-11 16:37:44',NULL,NULL,'/app/accommodation/booking/create','172.18.0.5','{\"rooms\": 1, \"guestName\": \"山野小鱼\", \"guestPhone\": \"\", \"roomTypeId\": 6, \"checkInDate\": \"2026-09-18\", \"checkOutDate\": \"2026-09-20\"}'),(2550,'2026-09-11 16:37:49','2026-09-11 16:37:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2551,'2026-09-11 16:38:19','2026-09-11 16:38:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2552,'2026-09-11 16:38:50','2026-09-11 16:38:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2553,'2026-09-11 16:39:07','2026-09-11 16:39:07',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2554,'2026-09-11 16:39:07','2026-09-11 16:39:07',NULL,NULL,'/app/order/page','172.18.0.5','{\"page\": \"1\", \"size\": \"10\"}'),(2555,'2026-09-11 16:39:13','2026-09-11 16:39:13',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2556,'2026-09-11 16:39:17','2026-09-11 16:39:17',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2557,'2026-09-11 16:39:17','2026-09-11 16:39:17',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2558,'2026-09-11 16:39:17','2026-09-11 16:39:17',NULL,NULL,'/app/accommodation/hotel/detail','172.18.0.5','{\"id\": \"3\"}'),(2559,'2026-09-11 16:39:20','2026-09-11 16:39:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2560,'2026-09-11 16:39:47','2026-09-11 16:39:47',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2561,'2026-09-11 16:39:59','2026-09-11 16:39:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2562,'2026-09-11 16:40:17','2026-09-11 16:40:17',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2563,'2026-09-11 16:40:28','2026-09-11 16:40:28',NULL,NULL,'/app/accommodation/booking/create','172.18.0.5','{\"rooms\": 1, \"guestName\": \"山野小鱼\", \"guestPhone\": \"\", \"roomTypeId\": 6, \"checkInDate\": \"2026-09-19\", \"checkOutDate\": \"2026-09-21\"}'),(2564,'2026-09-11 16:40:29','2026-09-11 16:40:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2565,'2026-09-11 16:40:42','2026-09-11 16:40:42',NULL,NULL,'/app/order/page','172.18.0.5','{\"page\": \"1\", \"size\": \"10\"}'),(2566,'2026-09-11 16:40:47','2026-09-11 16:40:47',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2567,'2026-09-11 16:41:00','2026-09-11 16:41:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2568,'2026-09-11 16:41:07','2026-09-11 16:41:07',NULL,NULL,'/app/order/detail','172.18.0.5','{\"orderNo\": \"202609111640283992767\"}'),(2569,'2026-09-11 16:41:17','2026-09-11 16:41:17',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2570,'2026-09-11 16:41:30','2026-09-11 16:41:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2571,'2026-09-11 16:41:32','2026-09-11 16:41:32',NULL,NULL,'/app/pay/create','172.18.0.5','{\"channel\": \"wechat\", \"orderNo\": \"202609111640283992767\"}'),(2572,'2026-09-11 16:41:32','2026-09-11 16:41:32',NULL,NULL,'/app/pay/mock','172.18.0.5','{\"paymentNo\": \"PAY202609111641324743295\"}'),(2573,'2026-09-11 16:41:43','2026-09-11 16:41:43',NULL,NULL,'/app/order/detail','172.18.0.5','{\"orderNo\": \"202609111640283992767\"}'),(2574,'2026-09-11 16:41:47','2026-09-11 16:41:47',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2575,'2026-09-11 16:41:58','2026-09-11 16:41:58',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2576,'2026-09-11 16:41:58','2026-09-11 16:41:58',NULL,NULL,'/app/order/detail','172.18.0.5','{\"orderNo\": \"202609111640283992767\"}'),(2577,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(2578,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(2579,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2580,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2581,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2582,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(2583,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(2584,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(2585,'2026-09-11 16:42:00','2026-09-11 16:42:00',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(2586,'2026-09-11 16:41:59','2026-09-11 16:41:59',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2587,'2026-09-11 16:42:00','2026-09-11 16:42:00',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(2588,'2026-09-11 16:42:00','2026-09-11 16:42:00',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(2589,'2026-09-11 16:42:00','2026-09-11 16:42:00',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(2590,'2026-09-11 16:42:00','2026-09-11 16:42:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2591,'2026-09-11 16:42:10','2026-09-11 16:42:10',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2592,'2026-09-11 16:42:17','2026-09-11 16:42:17',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2593,'2026-09-11 16:42:30','2026-09-11 16:42:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2594,'2026-09-11 16:42:47','2026-09-11 16:42:47',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2595,'2026-09-11 16:42:50','2026-09-11 16:42:50',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2596,'2026-09-11 16:42:50','2026-09-11 16:42:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2597,'2026-09-11 16:42:50','2026-09-11 16:42:50',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2598,'2026-09-11 16:43:01','2026-09-11 16:43:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2599,'2026-09-11 16:43:12','2026-09-11 16:43:12',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2600,'2026-09-11 16:43:12','2026-09-11 16:43:12',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"3\"}'),(2601,'2026-09-11 16:43:20','2026-09-11 16:43:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2602,'2026-09-11 16:43:31','2026-09-11 16:43:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2603,'2026-09-11 16:43:50','2026-09-11 16:43:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2604,'2026-09-11 16:44:01','2026-09-11 16:44:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2605,'2026-09-11 16:44:20','2026-09-11 16:44:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2606,'2026-09-11 16:44:31','2026-09-11 16:44:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2607,'2026-09-11 16:44:50','2026-09-11 16:44:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2608,'2026-09-11 16:44:58','2026-09-11 16:44:58',NULL,NULL,'/app/travel/inventory/list','172.18.0.5','{\"itemId\": \"3\", \"itemType\": \"route\"}'),(2609,'2026-09-11 16:45:02','2026-09-11 16:45:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2610,'2026-09-11 16:45:20','2026-09-11 16:45:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2611,'2026-09-11 16:45:32','2026-09-11 16:45:32',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2612,'2026-09-11 16:45:37','2026-09-11 16:45:37',NULL,NULL,'/app/travel/booking/create','172.18.0.5','{\"itemId\": 3, \"useDate\": \"2026-09-12\", \"itemType\": \"route\", \"quantity\": 1}'),(2613,'2026-09-11 16:45:37','2026-09-11 16:45:37',NULL,NULL,'/app/pay/create','172.18.0.5','{\"channel\": \"wechat\", \"orderNo\": \"202609111645370575215\"}'),(2614,'2026-09-11 16:45:37','2026-09-11 16:45:37',NULL,NULL,'/app/pay/mock','172.18.0.5','{\"paymentNo\": \"PAY202609111645371479561\"}'),(2615,'2026-09-11 16:45:50','2026-09-11 16:45:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2616,'2026-09-11 16:46:02','2026-09-11 16:46:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2617,'2026-09-11 16:46:20','2026-09-11 16:46:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2618,'2026-09-11 16:46:33','2026-09-11 16:46:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2619,'2026-09-11 16:46:40','2026-09-11 16:46:40',NULL,2,'/admin/travel/eTicket/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2620,'2026-09-11 16:46:50','2026-09-11 16:46:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2621,'2026-09-11 16:47:03','2026-09-11 16:47:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2622,'2026-09-11 16:47:20','2026-09-11 16:47:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2623,'2026-09-11 16:47:33','2026-09-11 16:47:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2624,'2026-09-11 16:47:50','2026-09-11 16:47:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2625,'2026-09-11 16:48:05','2026-09-11 16:48:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2626,'2026-09-11 16:48:08','2026-09-11 16:48:08',NULL,NULL,'/app/food/farm-product/categories','172.18.0.1','{}'),(2627,'2026-09-11 16:48:08','2026-09-11 16:48:08',NULL,NULL,'/app/food/farm-product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2628,'2026-09-11 16:48:09','2026-09-11 16:48:09',NULL,NULL,'/app/food/restaurant/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"rating\"}'),(2629,'2026-09-11 16:48:12','2026-09-11 16:48:12',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2630,'2026-09-11 16:48:12','2026-09-11 16:48:12',NULL,NULL,'/app/product/categories','172.18.0.1','{}'),(2631,'2026-09-11 16:48:12','2026-09-11 16:48:12',NULL,NULL,'/app/product/list','172.18.0.1','{\"page\": \"1\", \"size\": \"20\", \"sort\": \"new\"}'),(2632,'2026-09-11 16:48:20','2026-09-11 16:48:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2633,'2026-09-11 16:48:24','2026-09-11 16:48:24',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2634,'2026-09-11 16:48:24','2026-09-11 16:48:24',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2635,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2636,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2637,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2638,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2639,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2640,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2641,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2642,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2643,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2644,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2645,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2646,'2026-09-11 16:48:25','2026-09-11 16:48:25',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2647,'2026-09-11 16:48:34','2026-09-11 16:48:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2648,'2026-09-11 16:48:50','2026-09-11 16:48:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2649,'2026-09-11 16:48:53','2026-09-11 16:48:53',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2650,'2026-09-11 16:48:53','2026-09-11 16:48:53',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2651,'2026-09-11 16:48:53','2026-09-11 16:48:53',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2652,'2026-09-11 16:48:53','2026-09-11 16:48:53',NULL,2,'/admin/travel/eTicket/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2653,'2026-09-11 16:49:05','2026-09-11 16:49:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2654,'2026-09-11 16:49:20','2026-09-11 16:49:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2655,'2026-09-11 16:49:35','2026-09-11 16:49:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2656,'2026-09-11 16:49:50','2026-09-11 16:49:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2657,'2026-09-11 16:49:58','2026-09-11 16:49:58',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2658,'2026-09-11 16:49:58','2026-09-11 16:49:58',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2659,'2026-09-11 16:49:58','2026-09-11 16:49:58',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2660,'2026-09-11 16:49:59','2026-09-11 16:49:59',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2661,'2026-09-11 16:50:11','2026-09-11 16:50:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2662,'2026-09-11 16:50:20','2026-09-11 16:50:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2663,'2026-09-11 16:50:42','2026-09-11 16:50:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2664,'2026-09-11 16:50:50','2026-09-11 16:50:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2665,'2026-09-11 16:51:16','2026-09-11 16:51:16',NULL,2,'/admin/base/comm/logout','172.18.0.1','{}'),(2666,'2026-09-11 16:51:16','2026-09-11 16:51:16',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2667,'2026-09-11 16:51:18','2026-09-11 16:51:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2668,'2026-09-11 16:51:20','2026-09-11 16:51:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2669,'2026-09-11 16:51:48','2026-09-11 16:51:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2670,'2026-09-11 16:51:50','2026-09-11 16:51:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2671,'2026-09-11 16:52:19','2026-09-11 16:52:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2672,'2026-09-11 16:52:20','2026-09-11 16:52:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2673,'2026-09-11 16:52:23','2026-09-11 16:52:23',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"f32b2030-adbd-11f1-9207-f33e455b4da1\", \"verifyCode\": \"aXMV\"}'),(2674,'2026-09-11 16:52:24','2026-09-11 16:52:24',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2675,'2026-09-11 16:52:49','2026-09-11 16:52:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2676,'2026-09-11 16:52:50','2026-09-11 16:52:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2677,'2026-09-11 16:53:11','2026-09-11 16:53:11',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2678,'2026-09-11 16:53:19','2026-09-11 16:53:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2679,'2026-09-11 16:53:20','2026-09-11 16:53:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2680,'2026-09-11 16:53:49','2026-09-11 16:53:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2681,'2026-09-11 16:53:50','2026-09-11 16:53:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2682,'2026-09-11 16:53:55','2026-09-11 16:53:55',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"376e6810-adbe-11f1-9207-f33e455b4da1\", \"verifyCode\": \"wz1n\"}'),(2683,'2026-09-11 16:53:55','2026-09-11 16:53:55',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2684,'2026-09-11 16:53:55','2026-09-11 16:53:55',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2685,'2026-09-11 16:53:55','2026-09-11 16:53:55',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2686,'2026-09-11 16:53:55','2026-09-11 16:53:55',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2687,'2026-09-11 16:54:07','2026-09-11 16:54:07',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2688,'2026-09-11 16:54:07','2026-09-11 16:54:07',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2689,'2026-09-11 16:54:07','2026-09-11 16:54:07',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2690,'2026-09-11 16:54:07','2026-09-11 16:54:07',NULL,2,'/admin/travel/eTicket/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2691,'2026-09-11 16:54:20','2026-09-11 16:54:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2692,'2026-09-11 16:54:20','2026-09-11 16:54:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2693,'2026-09-11 16:54:43','2026-09-11 16:54:43',NULL,2,'/admin/travel/eTicket/info','172.18.0.1','{\"id\": \"7\"}'),(2694,'2026-09-11 16:54:50','2026-09-11 16:54:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2695,'2026-09-11 16:54:50','2026-09-11 16:54:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2696,'2026-09-11 16:55:20','2026-09-11 16:55:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2697,'2026-09-11 16:55:20','2026-09-11 16:55:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2698,'2026-09-11 16:55:50','2026-09-11 16:55:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2699,'2026-09-11 16:55:51','2026-09-11 16:55:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2700,'2026-09-11 16:56:20','2026-09-11 16:56:20',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2701,'2026-09-11 16:56:21','2026-09-11 16:56:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2702,'2026-09-11 16:56:21','2026-09-11 16:56:21',NULL,2,'/admin/travel/eTicket/update','172.18.0.1','{\"id\": 7, \"itemId\": 3, \"qrCode\": \"TK20260911164537057521501\", \"status\": \"used\", \"userId\": 34, \"orderId\": 9, \"orderNo\": \"202609111645370575215\", \"useDate\": \"2026-09-12\", \"itemType\": \"route\", \"tenantId\": null, \"createTime\": \"2026-09-11 16:45:37\", \"updateTime\": \"2026-09-11 16:45:37\", \"verifyTime\": \"2026-09-11 16:45:37\", \"verifyAdminId\": null}'),(2703,'2026-09-11 16:56:21','2026-09-11 16:56:21',NULL,2,'/admin/travel/eTicket/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2704,'2026-09-11 16:56:50','2026-09-11 16:56:50',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2705,'2026-09-11 16:56:51','2026-09-11 16:56:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2706,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2707,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2708,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(2709,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2710,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(2711,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2712,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2713,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(2714,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(2715,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2716,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(2717,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(2718,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"35\"}'),(2719,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"36\"}'),(2720,'2026-09-11 16:57:03','2026-09-11 16:57:03',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"34\"}'),(2721,'2026-09-11 16:57:21','2026-09-11 16:57:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2722,'2026-09-11 16:57:33','2026-09-11 16:57:33',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2723,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2724,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2725,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2726,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2727,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2728,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2729,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2730,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2731,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2732,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2733,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2734,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2735,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2736,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2737,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"36\"}'),(2738,'2026-09-11 16:57:35','2026-09-11 16:57:35',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"35\"}'),(2739,'2026-09-11 16:57:37','2026-09-11 16:57:37',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2740,'2026-09-11 16:57:37','2026-09-11 16:57:37',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2741,'2026-09-11 16:57:48','2026-09-11 16:57:48',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2742,'2026-09-11 16:57:48','2026-09-11 16:57:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2743,'2026-09-11 16:57:48','2026-09-11 16:57:48',NULL,NULL,'/app/travel/ticket/my','172.18.0.5','{}'),(2744,'2026-09-11 16:58:07','2026-09-11 16:58:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2745,'2026-09-11 16:58:18','2026-09-11 16:58:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2746,'2026-09-11 16:58:21','2026-09-11 16:58:21',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2747,'2026-09-11 16:58:37','2026-09-11 16:58:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2748,'2026-09-11 16:58:48','2026-09-11 16:58:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2749,'2026-09-11 16:59:07','2026-09-11 16:59:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2750,'2026-09-11 16:59:17','2026-09-11 16:59:17',NULL,NULL,'/app/community/post/add','172.18.0.5','{\"title\": \"蜡染坊初体验 ：把蓝白带回家\", \"images\": [], \"content\": \"阿婆手把手教我画蜡\\n，染出来的布每一张都不一样\\n。半日游不赶\\n，成品当天带走\\n，推荐\\n！\", \"topicIds\": []}'),(2751,'2026-09-11 16:59:18','2026-09-11 16:59:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2752,'2026-09-11 16:59:18','2026-09-11 16:59:18',NULL,NULL,'/app/community/post/detail','172.18.0.5','{\"id\": \"605\"}'),(2753,'2026-09-11 16:59:38','2026-09-11 16:59:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2754,'2026-09-11 16:59:48','2026-09-11 16:59:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2755,'2026-09-11 17:00:07','2026-09-11 17:00:07',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2756,'2026-09-11 17:00:07','2026-09-11 17:00:07',NULL,NULL,'/app/user/address/add','172.18.0.1','{\"city\": \"ǭ������\", \"phone\": \"13800000001\", \"address\": \"�ڶ���һ�����¥\", \"contact\": \"ɽҰС��\", \"district\": \"��ɽ��\", \"province\": \"����ʡ\", \"isDefault\": true}'),(2757,'2026-09-11 17:00:08','2026-09-11 17:00:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2758,'2026-09-11 17:00:18','2026-09-11 17:00:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2759,'2026-09-11 17:00:21','2026-09-11 17:00:21',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2760,'2026-09-11 17:00:21','2026-09-11 17:00:21',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2761,'2026-09-11 17:00:21','2026-09-11 17:00:21',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2762,'2026-09-11 17:00:21','2026-09-11 17:00:21',NULL,2,'/admin/pay/record/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2763,'2026-09-11 17:00:38','2026-09-11 17:00:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2764,'2026-09-11 17:00:48','2026-09-11 17:00:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2765,'2026-09-11 17:01:08','2026-09-11 17:01:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2766,'2026-09-11 17:01:18','2026-09-11 17:01:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2767,'2026-09-11 17:01:29','2026-09-11 17:01:29',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2768,'2026-09-11 17:01:30','2026-09-11 17:01:30',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2769,'2026-09-11 17:01:30','2026-09-11 17:01:30',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2770,'2026-09-11 17:01:30','2026-09-11 17:01:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2771,'2026-09-11 17:01:48','2026-09-11 17:01:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2772,'2026-09-11 17:02:01','2026-09-11 17:02:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2773,'2026-09-11 17:02:18','2026-09-11 17:02:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2774,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2775,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2776,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2777,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2778,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2779,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2780,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2781,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2782,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2783,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2784,'2026-09-11 17:02:33','2026-09-11 17:02:33',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2785,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"38\"}'),(2786,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"39\"}'),(2787,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"40\"}'),(2788,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2789,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2790,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2791,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2792,'2026-09-11 17:02:34','2026-09-11 17:02:34',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2793,'2026-09-11 17:02:48','2026-09-11 17:02:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2794,'2026-09-11 17:03:03','2026-09-11 17:03:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2795,'2026-09-11 17:03:04','2026-09-11 17:03:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2796,'2026-09-11 17:03:18','2026-09-11 17:03:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2797,'2026-09-11 17:03:34','2026-09-11 17:03:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2798,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2799,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2800,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2801,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2802,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2803,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2804,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2805,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2806,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2807,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2808,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"38\"}'),(2809,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"40\"}'),(2810,'2026-09-11 17:03:47','2026-09-11 17:03:47',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"39\"}'),(2811,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2812,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2813,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2814,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2815,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2816,'2026-09-11 17:03:48','2026-09-11 17:03:48',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2817,'2026-09-11 17:04:04','2026-09-11 17:04:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2818,'2026-09-11 17:04:18','2026-09-11 17:04:18',NULL,NULL,'/app/cart/count','172.18.0.5','{}'),(2819,'2026-09-11 17:04:35','2026-09-11 17:04:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2820,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/member/info/person','172.18.0.5','{}'),(2821,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/recommend/list','172.18.0.5','{\"position\": \"home\"}'),(2822,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/route/list','172.18.0.5','{}'),(2823,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/scenic/list','172.18.0.5','{}'),(2824,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/community/post/feed','172.18.0.5','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2825,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/community/topic/list','172.18.0.5','{}'),(2826,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/guide/list','172.18.0.5','{}'),(2827,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/operate/announcement/list','172.18.0.5','{}'),(2828,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"1\"}'),(2829,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"3\"}'),(2830,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/travel/route/detail','172.18.0.5','{\"id\": \"2\"}'),(2831,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"39\"}'),(2832,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"38\"}'),(2833,'2026-09-11 17:04:40','2026-09-11 17:04:40',NULL,NULL,'/app/community/user/profile','172.18.0.5','{\"id\": \"40\"}'),(2834,'2026-09-11 17:05:05','2026-09-11 17:05:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2835,'2026-09-11 17:05:36','2026-09-11 17:05:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2836,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2837,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2838,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2839,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2840,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2841,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2842,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2843,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2844,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2845,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2846,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"38\"}'),(2847,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"40\"}'),(2848,'2026-09-11 17:05:42','2026-09-11 17:05:42',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"39\"}'),(2849,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2850,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/cart/add','172.18.0.1','{\"itemId\": 1, \"itemType\": 1, \"quantity\": 1}'),(2851,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/member/info/person','172.18.0.1','{}'),(2852,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2853,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/cart/list','172.18.0.1','{}'),(2854,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2855,'2026-09-11 17:05:44','2026-09-11 17:05:44',NULL,NULL,'/app/user/address/add','172.18.0.1','{\"city\": \"黔东南州\", \"phone\": \"13800000003\", \"address\": \"苗寨风情园 12 号\", \"contact\": \"快门手\", \"district\": \"凯里市\", \"province\": \"贵州省\", \"isDefault\": false}'),(2856,'2026-09-11 17:05:44','2026-09-11 17:05:44',NULL,NULL,'/app/user/address/list','172.18.0.1','{}'),(2857,'2026-09-11 17:06:06','2026-09-11 17:06:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2858,'2026-09-11 17:06:37','2026-09-11 17:06:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2859,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"34\"}'),(2860,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/recommend/list','172.18.0.1','{\"position\": \"home\"}'),(2861,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/route/list','172.18.0.1','{}'),(2862,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/operate/announcement/list','172.18.0.1','{}'),(2863,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/guide/list','172.18.0.1','{}'),(2864,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/topic/list','172.18.0.1','{}'),(2865,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"recommend\", \"page\": \"1\", \"size\": \"30\"}'),(2866,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/scenic/list','172.18.0.1','{}'),(2867,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2868,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"2\"}'),(2869,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"3\"}'),(2870,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"38\"}'),(2871,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"39\"}'),(2872,'2026-09-11 17:07:00','2026-09-11 17:07:00',NULL,NULL,'/app/community/user/profile','172.18.0.1','{\"id\": \"40\"}'),(2873,'2026-09-11 17:07:05','2026-09-11 17:07:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2874,'2026-09-11 17:07:37','2026-09-11 17:07:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2875,'2026-09-11 17:08:08','2026-09-11 17:08:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2876,'2026-09-11 17:08:38','2026-09-11 17:08:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2877,'2026-09-11 17:09:09','2026-09-11 17:09:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2878,'2026-09-11 17:09:40','2026-09-11 17:09:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2879,'2026-09-11 17:10:10','2026-09-11 17:10:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2880,'2026-09-11 17:10:41','2026-09-11 17:10:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2881,'2026-09-11 17:11:11','2026-09-11 17:11:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2882,'2026-09-11 17:11:42','2026-09-11 17:11:42',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2883,'2026-09-11 17:12:12','2026-09-11 17:12:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2884,'2026-09-11 17:12:43','2026-09-11 17:12:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2885,'2026-09-11 17:13:13','2026-09-11 17:13:13',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2886,'2026-09-11 17:13:44','2026-09-11 17:13:44',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2887,'2026-09-11 17:14:14','2026-09-11 17:14:14',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2888,'2026-09-11 17:14:45','2026-09-11 17:14:45',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2889,'2026-09-11 17:15:16','2026-09-11 17:15:16',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2890,'2026-09-11 17:15:46','2026-09-11 17:15:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2891,'2026-09-11 17:16:17','2026-09-11 17:16:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2892,'2026-09-11 17:16:47','2026-09-11 17:16:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2893,'2026-09-11 17:17:18','2026-09-11 17:17:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2894,'2026-09-11 17:17:48','2026-09-11 17:17:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2895,'2026-09-11 17:18:19','2026-09-11 17:18:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2896,'2026-09-11 17:18:50','2026-09-11 17:18:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2897,'2026-09-11 17:19:20','2026-09-11 17:19:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2898,'2026-09-11 17:19:51','2026-09-11 17:19:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2899,'2026-09-11 17:20:21','2026-09-11 17:20:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2900,'2026-09-11 17:20:52','2026-09-11 17:20:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2901,'2026-09-11 17:21:22','2026-09-11 17:21:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2902,'2026-09-11 17:21:53','2026-09-11 17:21:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2903,'2026-09-11 17:22:24','2026-09-11 17:22:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2904,'2026-09-11 17:22:55','2026-09-11 17:22:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2905,'2026-09-11 17:23:25','2026-09-11 17:23:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2906,'2026-09-11 17:23:56','2026-09-11 17:23:56',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2907,'2026-09-11 17:24:26','2026-09-11 17:24:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2908,'2026-09-11 17:24:57','2026-09-11 17:24:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2909,'2026-09-11 17:25:28','2026-09-11 17:25:28',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2910,'2026-09-11 17:25:58','2026-09-11 17:25:58',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2911,'2026-09-11 17:26:29','2026-09-11 17:26:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2912,'2026-09-11 17:26:59','2026-09-11 17:26:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2913,'2026-09-11 17:27:30','2026-09-11 17:27:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2914,'2026-09-11 17:28:01','2026-09-11 17:28:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2915,'2026-09-11 17:28:31','2026-09-11 17:28:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2916,'2026-09-11 17:29:02','2026-09-11 17:29:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2917,'2026-09-11 17:29:32','2026-09-11 17:29:32',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2918,'2026-09-11 17:30:03','2026-09-11 17:30:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2919,'2026-09-11 17:30:34','2026-09-11 17:30:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2920,'2026-09-11 17:31:04','2026-09-11 17:31:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2921,'2026-09-11 17:31:35','2026-09-11 17:31:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2922,'2026-09-11 17:32:06','2026-09-11 17:32:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2923,'2026-09-11 17:32:36','2026-09-11 17:32:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2924,'2026-09-11 17:33:04','2026-09-11 17:33:04',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2925,'2026-09-11 17:33:07','2026-09-11 17:33:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2926,'2026-09-11 17:33:10','2026-09-11 17:33:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2927,'2026-09-11 17:33:10','2026-09-11 17:33:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(2928,'2026-09-11 17:33:18','2026-09-11 17:33:18',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2929,'2026-09-11 17:33:37','2026-09-11 17:33:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2930,'2026-09-11 17:33:38','2026-09-11 17:33:38',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(2931,'2026-09-11 17:33:38','2026-09-11 17:33:38',NULL,NULL,'/app/accommodation/booking/create','172.18.0.1','{\"rooms\": 1, \"roomTypeId\": 5, \"checkInDate\": \"2026-09-12\", \"checkOutDate\": \"2026-09-13\"}'),(2932,'2026-09-11 17:33:38','2026-09-11 17:33:38',NULL,NULL,'/app/pay/create','172.18.0.1','{\"channel\": \"wechat\", \"orderNo\": \"202609111733386745621\"}'),(2933,'2026-09-11 17:33:39','2026-09-11 17:33:39',NULL,NULL,'/app/pay/mock','172.18.0.1','{\"paymentNo\": \"PAY202609111733389619953\"}'),(2934,'2026-09-11 17:33:56','2026-09-11 17:33:56',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2935,'2026-09-11 17:33:56','2026-09-11 17:33:56',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2936,'2026-09-11 17:33:56','2026-09-11 17:33:56',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2937,'2026-09-11 17:33:56','2026-09-11 17:33:56',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2938,'2026-09-11 17:34:08','2026-09-11 17:34:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2939,'2026-09-11 17:34:10','2026-09-11 17:34:10',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2940,'2026-09-11 17:34:10','2026-09-11 17:34:10',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(2941,'2026-09-11 17:34:33','2026-09-11 17:34:33',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2942,'2026-09-11 17:34:33','2026-09-11 17:34:33',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2943,'2026-09-11 17:34:33','2026-09-11 17:34:33',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2944,'2026-09-11 17:34:33','2026-09-11 17:34:33',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2945,'2026-09-11 17:34:38','2026-09-11 17:34:38',NULL,NULL,'/app/travel/route/detail','172.18.0.1','{\"id\": \"1\"}'),(2946,'2026-09-11 17:34:38','2026-09-11 17:34:38',NULL,NULL,'/app/community/post/feed','172.18.0.1','{\"tab\": \"latest\", \"page\": \"1\", \"size\": \"6\", \"linkedRouteId\": \"1\"}'),(2947,'2026-09-11 17:34:39','2026-09-11 17:34:39',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2948,'2026-09-11 17:35:09','2026-09-11 17:35:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2949,'2026-09-11 17:35:40','2026-09-11 17:35:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2950,'2026-09-11 17:36:03','2026-09-11 17:36:03',NULL,2,'/admin/base/comm/logout','172.18.0.1','{}'),(2951,'2026-09-11 17:36:04','2026-09-11 17:36:04',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2952,'2026-09-11 17:36:11','2026-09-11 17:36:11',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2953,'2026-09-11 17:36:41','2026-09-11 17:36:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2954,'2026-09-11 17:37:12','2026-09-11 17:37:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2955,'2026-09-11 17:37:43','2026-09-11 17:37:43',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2956,'2026-09-11 17:38:13','2026-09-11 17:38:13',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2957,'2026-09-11 17:38:15','2026-09-11 17:38:15',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"350b6310-adc4-11f1-ad17-890a667a3554\", \"verifyCode\": \"Kxmf\"}'),(2958,'2026-09-11 17:38:16','2026-09-11 17:38:16',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2959,'2026-09-11 17:38:16','2026-09-11 17:38:16',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2960,'2026-09-11 17:38:16','2026-09-11 17:38:16',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2961,'2026-09-11 17:38:16','2026-09-11 17:38:16',NULL,2,'/admin/order/page','172.18.0.1','{\"page\": 1, \"size\": 20, \"sort\": \"desc\", \"order\": \"createTime\"}'),(2962,'2026-09-11 17:38:44','2026-09-11 17:38:44',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2963,'2026-09-11 17:39:14','2026-09-11 17:39:14',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2964,'2026-09-11 17:39:45','2026-09-11 17:39:45',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2965,'2026-09-11 17:40:15','2026-09-11 17:40:15',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2966,'2026-09-11 17:40:46','2026-09-11 17:40:46',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2967,'2026-09-11 17:41:03','2026-09-11 17:41:03',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2968,'2026-09-11 17:41:03','2026-09-11 17:41:03',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2969,'2026-09-11 17:41:03','2026-09-11 17:41:03',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2970,'2026-09-11 17:41:17','2026-09-11 17:41:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2971,'2026-09-11 17:41:47','2026-09-11 17:41:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2972,'2026-09-11 17:42:17','2026-09-11 17:42:17',NULL,2,'/admin/base/comm/logout','172.18.0.1','{}'),(2973,'2026-09-11 17:42:17','2026-09-11 17:42:17',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2974,'2026-09-11 17:42:18','2026-09-11 17:42:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2975,'2026-09-11 17:42:48','2026-09-11 17:42:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2976,'2026-09-11 17:43:19','2026-09-11 17:43:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2977,'2026-09-11 17:43:50','2026-09-11 17:43:50',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2978,'2026-09-11 17:43:52','2026-09-11 17:43:52',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"13c77f80-adc5-11f1-ad17-890a667a3554\", \"verifyCode\": \"ngav\"}'),(2979,'2026-09-11 17:43:52','2026-09-11 17:43:52',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2980,'2026-09-11 17:44:20','2026-09-11 17:44:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2981,'2026-09-11 17:44:36','2026-09-11 17:44:36',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2982,'2026-09-11 17:44:51','2026-09-11 17:44:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2983,'2026-09-11 17:45:21','2026-09-11 17:45:21',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2984,'2026-09-11 17:45:26','2026-09-11 17:45:26',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"664c8750-adc5-11f1-ad17-890a667a3554\", \"verifyCode\": \"RWS0\"}'),(2985,'2026-09-11 17:45:26','2026-09-11 17:45:26',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2986,'2026-09-11 17:45:52','2026-09-11 17:45:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2987,'2026-09-11 17:46:20','2026-09-11 17:46:20',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(2988,'2026-09-11 17:46:23','2026-09-11 17:46:23',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2989,'2026-09-11 17:46:53','2026-09-11 17:46:53',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2990,'2026-09-11 17:47:09','2026-09-11 17:47:09',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"wangapo\", \"captchaId\": \"a4907850-adc5-11f1-ad17-890a667a3554\", \"verifyCode\": \"Z5ch\"}'),(2991,'2026-09-11 17:47:09','2026-09-11 17:47:09',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(2992,'2026-09-11 17:47:09','2026-09-11 17:47:09',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(2993,'2026-09-11 17:47:09','2026-09-11 17:47:09',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(2994,'2026-09-11 17:47:24','2026-09-11 17:47:24',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2995,'2026-09-11 17:47:54','2026-09-11 17:47:54',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2996,'2026-09-11 17:48:25','2026-09-11 17:48:25',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2997,'2026-09-11 17:48:56','2026-09-11 17:48:56',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2998,'2026-09-11 17:49:26','2026-09-11 17:49:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(2999,'2026-09-11 17:49:57','2026-09-11 17:49:57',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3000,'2026-09-11 17:50:28','2026-09-11 17:50:28',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3001,'2026-09-11 17:50:58','2026-09-11 17:50:58',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3002,'2026-09-11 17:51:29','2026-09-11 17:51:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3003,'2026-09-11 17:51:35','2026-09-11 17:51:35',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(3004,'2026-09-11 17:51:35','2026-09-11 17:51:35',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(3005,'2026-09-11 17:51:35','2026-09-11 17:51:35',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(3006,'2026-09-11 17:51:35','2026-09-11 17:51:35',NULL,2,'/admin/order/stats','172.18.0.1','{}'),(3007,'2026-09-11 17:52:00','2026-09-11 17:52:00',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3008,'2026-09-11 17:52:30','2026-09-11 17:52:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3009,'2026-09-11 17:53:01','2026-09-11 17:53:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3010,'2026-09-11 17:53:31','2026-09-11 17:53:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3011,'2026-09-11 17:54:02','2026-09-11 17:54:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3012,'2026-09-11 17:54:33','2026-09-11 17:54:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3013,'2026-09-11 17:55:03','2026-09-11 17:55:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3014,'2026-09-11 17:55:34','2026-09-11 17:55:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3015,'2026-09-11 17:56:05','2026-09-11 17:56:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3016,'2026-09-11 17:56:35','2026-09-11 17:56:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3017,'2026-09-11 17:57:05','2026-09-11 17:57:05',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3018,'2026-09-11 17:57:30','2026-09-11 17:57:30',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(3019,'2026-09-11 17:57:30','2026-09-11 17:57:30',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(3020,'2026-09-11 17:57:31','2026-09-11 17:57:31',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(3021,'2026-09-11 17:57:31','2026-09-11 17:57:31',NULL,2,'/admin/order/stats','172.18.0.1','{}'),(3022,'2026-09-11 17:57:36','2026-09-11 17:57:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3023,'2026-09-11 17:58:06','2026-09-11 17:58:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3024,'2026-09-11 17:58:37','2026-09-11 17:58:37',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3025,'2026-09-11 17:59:08','2026-09-11 17:59:08',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3026,'2026-09-11 17:59:32','2026-09-11 17:59:32',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(3027,'2026-09-11 17:59:32','2026-09-11 17:59:32',NULL,NULL,'/app/travel/booking/create','172.18.0.1','{\"itemId\": 3, \"useDate\": \"2026-09-12\", \"itemType\": \"route\", \"quantity\": 1}'),(3028,'2026-09-11 17:59:32','2026-09-11 17:59:32',NULL,NULL,'/app/pay/create','172.18.0.1','{\"channel\": \"wechat\", \"orderNo\": \"202609111759322788213\"}'),(3029,'2026-09-11 17:59:32','2026-09-11 17:59:32',NULL,NULL,'/app/pay/mock','172.18.0.1','{\"paymentNo\": \"PAY202609111759326092861\"}'),(3030,'2026-09-11 17:59:38','2026-09-11 17:59:38',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3031,'2026-09-11 17:59:59','2026-09-11 17:59:59',NULL,2,'/admin/order/stats','172.18.0.1','{}'),(3032,'2026-09-11 18:00:09','2026-09-11 18:00:09',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3033,'2026-09-11 18:00:39','2026-09-11 18:00:39',NULL,2,'/admin/base/comm/permmenu','172.18.0.1','{}'),(3034,'2026-09-11 18:00:39','2026-09-11 18:00:39',NULL,2,'/admin/base/comm/person','172.18.0.1','{}'),(3035,'2026-09-11 18:00:39','2026-09-11 18:00:39',NULL,2,'/admin/dict/info/data','172.18.0.1','{}'),(3036,'2026-09-11 18:00:39','2026-09-11 18:00:39',NULL,2,'/admin/order/stats','172.18.0.1','{}'),(3037,'2026-09-11 18:00:40','2026-09-11 18:00:40',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3038,'2026-09-11 18:01:10','2026-09-11 18:01:10',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3039,'2026-09-11 18:01:41','2026-09-11 18:01:41',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3040,'2026-09-11 18:02:12','2026-09-11 18:02:12',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3041,'2026-09-11 18:02:47','2026-09-11 18:02:47',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3042,'2026-09-11 18:03:00','2026-09-11 18:03:00',NULL,2,'/admin/base/comm/logout','172.18.0.1','{}'),(3043,'2026-09-11 18:03:00','2026-09-11 18:03:00',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3044,'2026-09-11 18:03:17','2026-09-11 18:03:17',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3045,'2026-09-11 18:03:48','2026-09-11 18:03:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3046,'2026-09-11 18:04:16','2026-09-11 18:04:16',NULL,NULL,'/admin/base/open/captcha','172.18.0.1','{\"color\": \"#2c3142\", \"width\": \"150\", \"height\": \"45\"}'),(3047,'2026-09-11 18:04:18','2026-09-11 18:04:18',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3048,'2026-09-11 18:04:48','2026-09-11 18:04:48',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3049,'2026-09-11 18:05:13','2026-09-11 18:05:13',NULL,NULL,'/admin/base/open/login','172.18.0.1','{\"password\": \"123456\", \"username\": \"admin\", \"captchaId\": \"25f7d760-adc8-11f1-803e-63d66ce9c86d\", \"verifyCode\": \"SDVm\"}'),(3050,'2026-09-11 18:05:13','2026-09-11 18:05:13',NULL,1,'/admin/base/comm/person','172.18.0.1','{}'),(3051,'2026-09-11 18:05:13','2026-09-11 18:05:13',NULL,1,'/admin/base/comm/permmenu','172.18.0.1','{}'),(3052,'2026-09-11 18:05:13','2026-09-11 18:05:13',NULL,1,'/admin/dict/info/data','172.18.0.1','{}'),(3053,'2026-09-11 18:05:14','2026-09-11 18:05:14',NULL,1,'/admin/order/stats','172.18.0.1','{}'),(3054,'2026-09-11 18:05:19','2026-09-11 18:05:19',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3055,'2026-09-11 18:05:49','2026-09-11 18:05:49',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3056,'2026-09-11 18:06:20','2026-09-11 18:06:20',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3057,'2026-09-11 18:06:51','2026-09-11 18:06:51',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3058,'2026-09-11 18:07:08','2026-09-11 18:07:08',NULL,NULL,'/app/travel/scenic/detail','172.18.0.1','{\"id\": \"3\"}'),(3059,'2026-09-11 18:07:11','2026-09-11 18:07:11',NULL,NULL,'/app/product/2','172.18.0.1','{}'),(3060,'2026-09-11 18:07:11','2026-09-11 18:07:11',NULL,NULL,'/app/product/2/reviews','172.18.0.1','{\"page\": \"1\", \"size\": \"10\"}'),(3061,'2026-09-11 18:07:13','2026-09-11 18:07:13',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(3062,'2026-09-11 18:07:22','2026-09-11 18:07:22',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3063,'2026-09-11 18:07:52','2026-09-11 18:07:52',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3064,'2026-09-11 18:08:23','2026-09-11 18:08:23',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3065,'2026-09-11 18:08:55','2026-09-11 18:08:55',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3066,'2026-09-11 18:09:26','2026-09-11 18:09:26',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3067,'2026-09-11 18:09:56','2026-09-11 18:09:56',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3068,'2026-09-11 18:10:27','2026-09-11 18:10:27',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3069,'2026-09-11 18:10:58','2026-09-11 18:10:58',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3070,'2026-09-11 18:11:29','2026-09-11 18:11:29',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3071,'2026-09-11 18:11:59','2026-09-11 18:11:59',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3072,'2026-09-11 18:12:30','2026-09-11 18:12:30',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3073,'2026-09-11 18:13:01','2026-09-11 18:13:01',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3074,'2026-09-11 18:13:31','2026-09-11 18:13:31',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3075,'2026-09-11 18:14:02','2026-09-11 18:14:02',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3076,'2026-09-11 18:14:33','2026-09-11 18:14:33',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3077,'2026-09-11 18:15:03','2026-09-11 18:15:03',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3078,'2026-09-11 18:15:34','2026-09-11 18:15:34',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3079,'2026-09-11 18:16:04','2026-09-11 18:16:04',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3080,'2026-09-11 18:16:35','2026-09-11 18:16:35',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3081,'2026-09-11 18:16:58','2026-09-11 18:16:58',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(3082,'2026-09-11 18:16:58','2026-09-11 18:16:58',NULL,NULL,'/app/member/login/password','172.18.0.1','{\"phone\": \"13800000001\", \"password\": \"abc123456\"}'),(3083,'2026-09-11 18:16:58','2026-09-11 18:16:58',NULL,NULL,'/app/food/farm-product/1','172.18.0.1','{}'),(3084,'2026-09-11 18:17:06','2026-09-11 18:17:06',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3085,'2026-09-11 18:17:36','2026-09-11 18:17:36',NULL,NULL,'/app/cart/count','172.18.0.1','{}'),(3086,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'/app/cart/count','172.18.0.1','{}');
/*!40000 ALTER TABLE `base_sys_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_menu`
--

DROP TABLE IF EXISTS `base_sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `router` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单地址',
  `perms` text COLLATE utf8mb4_unicode_ci COMMENT '权限标识',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-目录 1-菜单 2-按钮',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图标',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint NOT NULL DEFAULT '1' COMMENT '是否显示',
  PRIMARY KEY (`id`),
  KEY `IDX_05e3d6a56604771a6da47ebf8e` (`createTime`),
  KEY `IDX_d5203f18daaf7c3fe0ab34497f` (`updateTime`),
  KEY `IDX_2087f9610c1fc5a184bedaacef` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_menu`
--

LOCK TABLES `base_sys_menu` WRITE;
/*!40000 ALTER TABLE `base_sys_menu` DISABLE KEYS */;
INSERT INTO `base_sys_menu` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,'系统管理','/sys',NULL,0,'icon-set',2,NULL,1,1),(2,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,'权限管理',NULL,NULL,0,'icon-auth',1,NULL,0,1),(3,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,2,'菜单列表','/sys/menu',NULL,1,'icon-menu',2,'modules/base/views/menu/index.vue',1,1),(4,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,3,'新增',NULL,'base:sys:menu:add',2,NULL,1,NULL,0,1),(5,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,3,'删除',NULL,'base:sys:menu:delete',2,NULL,2,NULL,0,1),(6,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,3,'查询',NULL,'base:sys:menu:page,base:sys:menu:list,base:sys:menu:info',2,NULL,4,NULL,0,1),(7,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,3,'参数','/test/aa',NULL,1,'icon-goods',0,'modules/base/views/info.vue',1,1),(8,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,3,'编辑',NULL,'base:sys:menu:info,base:sys:menu:update',2,NULL,0,NULL,1,1),(9,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,2,'角色列表','/sys/role',NULL,1,'icon-dept',3,'cool/modules/base/views/role.vue',1,1),(10,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,9,'新增',NULL,'base:sys:role:add',2,NULL,1,NULL,0,1),(11,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,9,'删除',NULL,'base:sys:role:delete',2,NULL,2,NULL,0,1),(12,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,9,'修改',NULL,'base:sys:role:update',2,NULL,3,NULL,0,1),(13,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,9,'查询',NULL,'base:sys:role:page,base:sys:role:list,base:sys:role:info',2,NULL,4,NULL,0,1),(14,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,2,'用户列表','/sys/user',NULL,1,'icon-user',0,'modules/base/views/user/index.vue',1,1),(15,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'部门列表',NULL,'base:sys:department:list',2,NULL,0,NULL,1,1),(16,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'新增部门',NULL,'base:sys:department:add',2,NULL,0,NULL,1,1),(17,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'更新部门',NULL,'base:sys:department:update',2,NULL,0,NULL,1,1),(18,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'删除部门',NULL,'base:sys:department:delete',2,NULL,0,NULL,1,1),(19,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'部门排序',NULL,'base:sys:department:order',2,NULL,0,NULL,1,1),(20,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'用户转移',NULL,'base:sys:user:move',2,NULL,0,NULL,1,1),(21,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'新增',NULL,'base:sys:user:add',2,NULL,0,NULL,1,1),(22,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'删除',NULL,'base:sys:user:delete',2,NULL,0,NULL,1,1),(23,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'修改',NULL,'base:sys:user:delete,base:sys:user:update',2,NULL,0,NULL,1,1),(24,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,14,'查询',NULL,'base:sys:user:page,base:sys:user:list,base:sys:user:info',2,NULL,0,NULL,1,1),(25,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,'参数配置',NULL,NULL,0,'icon-params',3,NULL,1,1),(26,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,25,'参数列表','/sys/param',NULL,1,'icon-menu',0,'cool/modules/base/views/param.vue',1,1),(27,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,26,'新增',NULL,'base:sys:param:add',2,NULL,0,NULL,1,1),(28,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,26,'修改',NULL,'base:sys:param:info,base:sys:param:update',2,NULL,0,NULL,1,1),(29,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,26,'删除',NULL,'base:sys:param:delete',2,NULL,0,NULL,1,1),(30,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,26,'查看',NULL,'base:sys:param:page,base:sys:param:list,base:sys:param:info',2,NULL,0,NULL,1,1),(31,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,'监控管理',NULL,NULL,0,'icon-monitor',9,NULL,1,1),(32,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,31,'请求日志','/sys/log',NULL,1,'icon-log',1,'cool/modules/base/views/log.vue',1,1),(33,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,32,'权限',NULL,'base:sys:log:page,base:sys:log:clear,base:sys:log:getKeep,base:sys:log:setKeep',2,NULL,1,NULL,0,1),(34,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,'任务管理',NULL,NULL,0,'icon-activity',9,NULL,1,1),(35,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,34,'任务列表','/task/list',NULL,1,'icon-menu',0,'modules/task/views/list.vue',1,1),(36,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,35,'权限',NULL,'task:info:page,task:info:list,task:info:info,task:info:add,task:info:delete,task:info:update,task:info:stop,task:info:start,task:info:once,task:info:log',2,NULL,0,NULL,1,1),(37,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,'框架教程','/tutorial',NULL,0,'icon-task',98,NULL,1,1),(38,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,37,'文档官网','/tutorial/doc',NULL,1,'icon-log',0,'https://admin.cool-js.com',1,1),(39,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,37,'crud 示例','/demo/crud',NULL,1,'icon-favor',1,'modules/demo/views/crud/index.vue',1,1),(40,'2026-09-08 17:21:58','2026-09-10 08:56:51',NULL,NULL,'通用',NULL,NULL,0,'icon-radioboxfill',99,NULL,1,1),(41,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,40,'图片上传',NULL,'space:info:page,space:info:list,space:info:info,space:info:add,space:info:delete,space:info:update,space:type:page,space:type:list,space:type:info,space:type:add,space:type:delete,space:type:update',2,NULL,1,NULL,1,1),(42,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,'首页','/',NULL,1,NULL,0,'modules/demo/views/home/index.vue',1,0),(43,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,'数据管理',NULL,NULL,0,'icon-data',7,NULL,1,1),(44,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,43,'字典管理','/dict/list',NULL,1,'icon-dict',3,'modules/dict/views/list.vue',1,1),(45,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'删除',NULL,'dict:info:delete',2,NULL,0,NULL,1,1),(46,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'修改',NULL,'dict:info:update,dict:info:info',2,NULL,0,NULL,1,1),(47,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'获得字典数据',NULL,'dict:info:data',2,NULL,0,NULL,1,1),(48,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'单个信息',NULL,'dict:info:info',2,NULL,0,NULL,1,1),(49,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'列表查询',NULL,'dict:info:list',2,NULL,0,NULL,1,1),(50,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,44,'分页查询',NULL,'dict:info:page',2,NULL,0,NULL,1,1),(51,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,44,'新增',NULL,'dict:info:add',2,NULL,0,NULL,1,1),(52,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,44,'组权限',NULL,'dict:type:list,dict:type:update,dict:type:delete,dict:type:add',2,NULL,0,NULL,1,1),(53,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,44,'字典类型',NULL,'dict:type:delete,dict:type:update,dict:type:info,dict:type:list,dict:type:page,dict:type:add',2,NULL,0,NULL,1,1),(54,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,43,'数据回收站','/recycle/data',NULL,1,'icon-delete',6,'modules/recycle/views/data.vue',1,1),(55,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,54,'恢复数据',NULL,'recycle:data:restore',2,NULL,0,NULL,1,1),(56,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,54,'单个信息',NULL,'recycle:data:info',2,NULL,0,NULL,1,1),(57,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,54,'分页查询',NULL,'recycle:data:page',2,NULL,0,NULL,1,1),(58,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,43,'文件管理','/upload/list',NULL,1,'icon-log',5,'modules/space/views/list.vue',1,1),(59,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,58,'权限',NULL,'space:type:delete,space:type:update,space:type:info,space:type:list,space:type:page,space:type:add,space:info:getConfig,space:info:delete,space:info:update,space:info:info,space:info:list,space:info:page,space:info:add',2,NULL,0,NULL,1,1),(61,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,60,'用户列表','/user/list',NULL,1,'icon-menu',1,'modules/user/views/list.vue',1,1),(62,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'删除',NULL,'user:info:delete',2,NULL,0,NULL,1,1),(63,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'修改',NULL,'user:info:update,user:info:info',2,NULL,0,NULL,1,1),(64,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'单个信息',NULL,'user:info:info',2,NULL,0,NULL,1,1),(65,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'列表查询',NULL,'user:info:list',2,NULL,0,NULL,1,1),(66,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'分页查询',NULL,'user:info:page',2,NULL,0,NULL,1,1),(67,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,61,'新增',NULL,'user:info:add',2,NULL,0,NULL,1,1),(68,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,NULL,'扩展管理',NULL,NULL,0,'icon-favor',8,NULL,1,1),(69,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,68,'插件列表','/helper/plugins',NULL,1,'icon-list',1,'modules/helper/views/plugins.vue',1,1),(70,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'删除',NULL,'plugin:info:delete',2,NULL,0,NULL,1,1),(71,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'分页查询',NULL,'plugin:info:page',2,NULL,0,NULL,1,1),(72,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'单个信息',NULL,'plugin:info:info',2,NULL,0,NULL,1,1),(73,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'安装插件',NULL,'plugin:info:install',2,NULL,0,NULL,1,1),(74,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'修改',NULL,'plugin:info:update',2,NULL,0,NULL,1,1),(75,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'列表查询',NULL,'plugin:info:list',2,NULL,0,NULL,1,1),(76,'2026-09-08 17:21:59','2026-09-08 17:21:59',NULL,69,'新增',NULL,'plugin:info:add',2,NULL,0,NULL,1,1),(179,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,NULL,'住宿管理',NULL,NULL,0,'HomeFilled',12,NULL,1,1),(180,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,179,'民宿管理','/accommodation/hotel',NULL,1,'OfficeBuilding',1,'modules/accommodation/views/hotel/index.vue',1,1),(181,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,179,'房型管理','/accommodation/room-type',NULL,1,'Calendar',2,'modules/accommodation/views/room-type/index.vue',1,1),(182,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,179,'房态日历','/accommodation/room-calendar',NULL,1,'DataBoard',3,'modules/accommodation/views/room-calendar/index.vue',1,1),(183,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,NULL,'平台运营',NULL,NULL,0,'Picture',13,NULL,1,1),(184,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,183,'轮播图管理','/operate/banner',NULL,1,'Picture',1,'modules/operate/views/banner/index.vue',1,1),(185,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,183,'公告管理','/operate/announcement',NULL,1,'Bell',2,'modules/operate/views/announcement/index.vue',1,1),(186,'2026-09-11 10:34:14','2026-09-11 10:34:14',NULL,183,'财务记录','/operate/finance-record',NULL,1,'Money',3,'modules/operate/views/finance-record/index.vue',1,1),(187,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'交易中心',NULL,NULL,0,'ShoppingCart',14,NULL,1,1),(188,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,187,'订单管理','/order',NULL,1,'Tickets',1,'modules/order/views/order/index.vue',1,1),(189,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,187,'支付流水','/pay-record',NULL,1,'Currency',2,'modules/pay/views/record/index.vue',1,1),(190,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'商家管理',NULL,NULL,0,'Shop',15,NULL,1,1),(191,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,190,'商家列表','/merchant',NULL,1,'OfficeBuilding',1,'modules/merchant/views/merchant/index.vue',1,1),(192,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,190,'入驻审核','/merchant-application',NULL,1,'Stamp',2,'modules/merchant/views/application/index.vue',1,1),(193,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'消息管理','/message',NULL,1,'Bell',16,'modules/message/views/message/index.vue',1,1),(194,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'敏感词','/sensitive-word',NULL,1,'Lock',17,'modules/sensitive/views/word/index.vue',1,1),(195,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'食·餐饮管理',NULL,NULL,0,'Dish',20,NULL,1,1),(196,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,195,'餐厅管理','/food/restaurant',NULL,1,'Food',1,'modules/food/views/restaurant.vue',1,1),(197,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,195,'农产品管理','/food/farm-product',NULL,1,'Apple',2,'modules/food/views/farm-product.vue',1,1),(198,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'衣·商品管理',NULL,NULL,0,'Goods',21,NULL,1,1),(199,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,198,'商品列表','/product/list',NULL,1,'List',1,'modules/product/views/list.vue',1,1),(200,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,198,'商品分类','/product/category',NULL,1,'Menu',2,'modules/product/views/category.vue',1,1),(201,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,NULL,'用户管理',NULL,NULL,0,'User',22,NULL,1,1),(202,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,201,'C端用户','/member-user',NULL,1,'Avatar',1,'modules/member/views/user/index.vue',1,1),(203,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,175,'游记审核',NULL,'community:post:audit',2,NULL,1,NULL,1,0),(204,'2026-09-11 10:34:15','2026-09-11 10:34:15',NULL,189,'退款审批',NULL,'pay:record:refund',2,NULL,1,NULL,1,0),(205,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,188,'订单查询',NULL,'order:page',2,NULL,1,NULL,1,0),(206,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,189,'流水查询',NULL,'pay:record:page',2,NULL,1,NULL,1,0),(207,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,193,'消息模板','/message-template',NULL,1,'Tickets',2,'modules/message/views/template/index.vue',1,1),(208,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板查询',NULL,'messageTemplate:page',2,NULL,1,NULL,1,0),(209,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板列表',NULL,'messageTemplate:list',2,NULL,2,NULL,1,0),(210,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板详情',NULL,'messageTemplate:info',2,NULL,3,NULL,1,0),(211,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板新增',NULL,'messageTemplate:add',2,NULL,4,NULL,1,0),(212,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板编辑',NULL,'messageTemplate:update',2,NULL,5,NULL,1,0),(213,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,207,'模板删除',NULL,'messageTemplate:delete',2,NULL,6,NULL,1,0),(214,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,193,'按模板发送',NULL,'message:sendByTemplate',2,NULL,1,NULL,1,0),(215,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,NULL,'行·旅游管理',NULL,NULL,0,'Van',18,NULL,1,1),(216,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'路线套餐','/route-package',NULL,1,'Suitcase',1,'modules/travel/views/route/index.vue',1,1),(217,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'景区管理','/scenic',NULL,1,'Place',2,'modules/travel/views/scenic/index.vue',1,1),(218,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'票种管理','/ticket-type',NULL,1,'Ticket',3,'modules/travel/views/ticket-type/index.vue',1,1),(219,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'按日库存','/travel-inventory',NULL,1,'Box',4,'modules/travel/views/inventory/index.vue',1,1),(220,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'行程站点','/itinerary',NULL,1,'GuidePost',5,'modules/travel/views/itinerary/index.vue',1,1),(221,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'电子票','/e-ticket',NULL,1,'Postcard',6,'modules/travel/views/e-ticket/index.vue',1,1),(222,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'推荐位','/recommend-slot',NULL,1,'Star',7,'modules/travel/views/recommend/index.vue',1,1),(223,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'交通攻略','/traffic-guide',NULL,1,'MapLocation',8,'modules/travel/views/guide/index.vue',1,1),(224,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,215,'评价管理','/travel-review',NULL,1,'ChatDotRound',9,'modules/travel/views/review/index.vue',1,1),(225,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,NULL,'社区管理',NULL,NULL,0,'ChatLineSquare',19,NULL,1,1),(226,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,225,'游记帖子','/community-post',NULL,1,'Notebook',1,'modules/community/views/post/index.vue',1,1),(227,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,225,'话题管理','/community-topic',NULL,1,'CollectionTag',2,'modules/community/views/topic/index.vue',1,1),(228,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,225,'评论管理','/community-comment',NULL,1,'Comment',3,'modules/community/views/comment/index.vue',1,1),(229,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,225,'举报处理','/community-report',NULL,1,'Warning',4,'modules/community/views/report/index.vue',1,1),(230,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,180,'新增',NULL,'accommodation/hotel:add',2,NULL,99,NULL,1,1),(231,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,180,'删除',NULL,'accommodation/hotel:delete',2,NULL,99,NULL,1,1),(232,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,180,'编辑',NULL,'accommodation/hotel:update',2,NULL,99,NULL,1,1),(233,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,182,'批量操作',NULL,'accommodation/room-calendar:batch',2,NULL,99,NULL,1,1),(234,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,182,'删除',NULL,'accommodation/room-calendar:delete',2,NULL,99,NULL,1,1),(235,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,182,'价格日历',NULL,'accommodation/room-calendar:range',2,NULL,99,NULL,1,1),(236,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,181,'新增',NULL,'accommodation/room-type:add',2,NULL,99,NULL,1,1),(237,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,181,'删除',NULL,'accommodation/room-type:delete',2,NULL,99,NULL,1,1),(238,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,181,'编辑',NULL,'accommodation/room-type:update',2,NULL,99,NULL,1,1),(239,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,228,'删除',NULL,'community/comment:delete',2,NULL,99,NULL,1,1),(240,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,228,'编辑',NULL,'community/comment:update',2,NULL,99,NULL,1,1),(241,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,226,'删除',NULL,'community/post:delete',2,NULL,99,NULL,1,1),(242,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,229,'处理',NULL,'community/report:handle',2,NULL,99,NULL,1,1),(243,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,227,'新增',NULL,'community/topic:add',2,NULL,99,NULL,1,1),(244,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,227,'删除',NULL,'community/topic:delete',2,NULL,99,NULL,1,1),(245,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,227,'编辑',NULL,'community/topic:update',2,NULL,99,NULL,1,1),(246,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,221,'新增',NULL,'travel/eTicket:add',2,NULL,99,NULL,1,1),(247,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,221,'删除',NULL,'travel/eTicket:delete',2,NULL,99,NULL,1,1),(248,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,221,'编辑',NULL,'travel/eTicket:update',2,NULL,99,NULL,1,1),(249,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,221,'核销',NULL,'travel/eTicket:verify',2,NULL,99,NULL,1,1),(250,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,197,'创建',NULL,'food/farm-product:create',2,NULL,99,NULL,1,1),(251,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,197,'删除',NULL,'food/farm-product:delete',2,NULL,99,NULL,1,1),(252,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,197,'编辑',NULL,'food/farm-product:update',2,NULL,99,NULL,1,1),(253,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,197,'状态切换',NULL,'food/farm-product:updateStatus',2,NULL,99,NULL,1,1),(254,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,196,'创建',NULL,'food/restaurant:create',2,NULL,99,NULL,1,1),(255,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,196,'删除',NULL,'food/restaurant:delete',2,NULL,99,NULL,1,1),(256,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,196,'编辑',NULL,'food/restaurant:update',2,NULL,99,NULL,1,1),(257,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,220,'新增',NULL,'travel/itinerary:add',2,NULL,99,NULL,1,1),(258,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,220,'删除',NULL,'travel/itinerary:delete',2,NULL,99,NULL,1,1),(259,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,220,'编辑',NULL,'travel/itinerary:update',2,NULL,99,NULL,1,1),(260,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,202,'删除',NULL,'member/user:delete',2,NULL,99,NULL,1,1),(261,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,202,'编辑',NULL,'member/user:update',2,NULL,99,NULL,1,1),(262,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,191,'新增',NULL,'merchant:add',2,NULL,99,NULL,1,1),(263,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,191,'删除',NULL,'merchant:delete',2,NULL,99,NULL,1,1),(264,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,191,'编辑',NULL,'merchant:update',2,NULL,99,NULL,1,1),(265,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,192,'审核',NULL,'merchantApplication:audit',2,NULL,99,NULL,1,1),(266,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,193,'新增',NULL,'message:add',2,NULL,99,NULL,1,1),(267,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,193,'删除',NULL,'message:delete',2,NULL,99,NULL,1,1),(268,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,193,'编辑',NULL,'message:update',2,NULL,99,NULL,1,1),(269,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,185,'新增',NULL,'operate/announcement:add',2,NULL,99,NULL,1,1),(270,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,185,'删除',NULL,'operate/announcement:delete',2,NULL,99,NULL,1,1),(271,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,185,'编辑',NULL,'operate/announcement:update',2,NULL,99,NULL,1,1),(272,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,184,'新增',NULL,'operate/banner:add',2,NULL,99,NULL,1,1),(273,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,184,'删除',NULL,'operate/banner:delete',2,NULL,99,NULL,1,1),(274,'2026-09-11 12:42:39','2026-09-11 12:42:39',NULL,184,'编辑',NULL,'operate/banner:update',2,NULL,99,NULL,1,1),(275,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,188,'删除',NULL,'order:delete',2,NULL,99,NULL,1,1),(276,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,188,'编辑',NULL,'order:update',2,NULL,99,NULL,1,1),(277,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,200,'新增',NULL,'product/category:add',2,NULL,99,NULL,1,1),(278,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,200,'删除',NULL,'product/category:delete',2,NULL,99,NULL,1,1),(279,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,200,'分类树',NULL,'product/category:tree',2,NULL,99,NULL,1,1),(280,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,200,'编辑',NULL,'product/category:update',2,NULL,99,NULL,1,1),(281,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,199,'创建',NULL,'product/goods:create',2,NULL,99,NULL,1,1),(282,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,199,'删除',NULL,'product/goods:delete',2,NULL,99,NULL,1,1),(283,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,199,'编辑',NULL,'product/goods:update',2,NULL,99,NULL,1,1),(284,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,199,'状态切换',NULL,'product/goods:updateStatus',2,NULL,99,NULL,1,1),(285,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,222,'新增',NULL,'travel/recommend:add',2,NULL,99,NULL,1,1),(286,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,222,'删除',NULL,'travel/recommend:delete',2,NULL,99,NULL,1,1),(287,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,222,'编辑',NULL,'travel/recommend:update',2,NULL,99,NULL,1,1),(288,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,216,'新增',NULL,'travel/route:add',2,NULL,99,NULL,1,1),(289,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,216,'删除',NULL,'travel/route:delete',2,NULL,99,NULL,1,1),(290,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,216,'编辑',NULL,'travel/route:update',2,NULL,99,NULL,1,1),(291,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,217,'新增',NULL,'travel/scenic:add',2,NULL,99,NULL,1,1),(292,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,217,'删除',NULL,'travel/scenic:delete',2,NULL,99,NULL,1,1),(293,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,217,'编辑',NULL,'travel/scenic:update',2,NULL,99,NULL,1,1),(294,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,194,'新增',NULL,'sensitive/word:add',2,NULL,99,NULL,1,1),(295,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,194,'删除',NULL,'sensitive/word:delete',2,NULL,99,NULL,1,1),(296,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,194,'编辑',NULL,'sensitive/word:update',2,NULL,99,NULL,1,1),(297,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,218,'新增',NULL,'travel/ticketType:add',2,NULL,99,NULL,1,1),(298,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,218,'删除',NULL,'travel/ticketType:delete',2,NULL,99,NULL,1,1),(299,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,218,'编辑',NULL,'travel/ticketType:update',2,NULL,99,NULL,1,1),(300,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,223,'新增',NULL,'travel/guide:add',2,NULL,99,NULL,1,1),(301,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,223,'删除',NULL,'travel/guide:delete',2,NULL,99,NULL,1,1),(302,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,223,'编辑',NULL,'travel/guide:update',2,NULL,99,NULL,1,1),(303,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,219,'新增',NULL,'travel/inventory:add',2,NULL,99,NULL,1,1),(304,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,219,'删除',NULL,'travel/inventory:delete',2,NULL,99,NULL,1,1),(305,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,219,'编辑',NULL,'travel/inventory:update',2,NULL,99,NULL,1,1),(306,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,224,'新增',NULL,'travel/review:add',2,NULL,99,NULL,1,1),(307,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,224,'删除',NULL,'travel/review:delete',2,NULL,99,NULL,1,1),(308,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,224,'编辑',NULL,'travel/review:update',2,NULL,99,NULL,1,1),(309,'2026-09-11 12:42:40','2026-09-11 12:42:40',NULL,61,'编辑',NULL,'user/info:update',2,NULL,99,NULL,1,1),(310,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,180,'分页查询',NULL,'accommodation/hotel:page',2,NULL,98,NULL,1,1),(311,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,180,'列表查询',NULL,'accommodation/hotel:list',2,NULL,98,NULL,1,1),(312,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,181,'分页查询',NULL,'accommodation/room-type:page',2,NULL,98,NULL,1,1),(313,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,181,'列表查询',NULL,'accommodation/room-type:list',2,NULL,98,NULL,1,1),(314,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,182,'分页查询',NULL,'accommodation/room-calendar:page',2,NULL,98,NULL,1,1),(315,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,221,'分页查询',NULL,'travel/eTicket:page',2,NULL,98,NULL,1,1),(316,'2026-09-11 16:48:41','2026-09-11 16:48:41',NULL,221,'详情查询',NULL,'travel/eTicket:info',2,NULL,98,NULL,1,1),(317,'2026-09-11 16:48:41','2026-09-11 16:48:41',NULL,180,'详情查询',NULL,'accommodation/hotel:info',2,NULL,98,NULL,1,1),(318,'2026-09-11 16:48:41','2026-09-11 16:48:41',NULL,181,'详情查询',NULL,'accommodation/room-type:info',2,NULL,98,NULL,1,1),(319,'2026-09-11 16:48:42','2026-09-11 16:48:42',NULL,182,'详情查询',NULL,'accommodation/room-calendar:info',2,NULL,98,NULL,1,1),(320,'2026-09-11 17:29:08','2026-09-11 17:29:08',NULL,188,'看板统计',NULL,'order:stats',2,NULL,98,NULL,1,1);
/*!40000 ALTER TABLE `base_sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_param`
--

DROP TABLE IF EXISTS `base_sys_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_param` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `keyName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '键',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数据',
  `dataType` int NOT NULL DEFAULT '0' COMMENT '数据类型 0-字符串 1-富文本 2-文件 ',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cf19b5e52d8c71caa9c4534454` (`keyName`),
  KEY `IDX_7bcb57371b481d8e2d66ddeaea` (`createTime`),
  KEY `IDX_479122e3bf464112f7a7253dac` (`updateTime`),
  KEY `IDX_8a0ab598ca7d63475356ca1157` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_param`
--

LOCK TABLES `base_sys_param` WRITE;
/*!40000 ALTER TABLE `base_sys_param` DISABLE KEYS */;
INSERT INTO `base_sys_param` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'rich','富文本参数','<h3><strong>这是一个富文本</strong></h3><p>xxx</p><p>xxxxxxxxxx</p><p><br></p>',1,NULL),(2,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'json','JSON参数','{\n  \"code\": 111233\n}',0,NULL),(3,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'file','文件','',2,NULL),(4,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'text','测试','这是一段字符串',0,NULL);
/*!40000 ALTER TABLE `base_sys_param` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role`
--

DROP TABLE IF EXISTS `base_sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色标签',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `relevance` tinyint NOT NULL DEFAULT '0' COMMENT '数据权限是否关联上下级',
  `menuIdList` json NOT NULL COMMENT '菜单权限',
  `departmentIdList` json NOT NULL COMMENT '部门权限',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469d49a5998170e9550cf113da` (`name`),
  UNIQUE KEY `IDX_f3f24fbbccf00192b076e549a7` (`label`),
  KEY `IDX_6f01184441dec49207b41bfd92` (`createTime`),
  KEY `IDX_d64ca209f3fc52128d9b20e97b` (`updateTime`),
  KEY `IDX_953dc26a4e8bd5d9c989295796` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role`
--

LOCK TABLES `base_sys_role` WRITE;
/*!40000 ALTER TABLE `base_sys_role` DISABLE KEYS */;
INSERT INTO `base_sys_role` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'1','超管','admin','最高权限的角色',0,'\"null\"','\"null\"'),(4,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,'0','商家','merchant','商家端接入：仅能查看本商家订单/支付流水',0,'[42, 180, 181, 182, 188, 189, 205, 206, 221, 230, 232, 233, 235, 236, 238, 248, 249, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320]','[]');
/*!40000 ALTER TABLE `base_sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role_department`
--

DROP TABLE IF EXISTS `base_sys_role_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `departmentId` int NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`),
  KEY `IDX_e881a66f7cce83ba431cf20194` (`createTime`),
  KEY `IDX_cbf48031efee5d0de262965e53` (`updateTime`),
  KEY `IDX_055658b2de49d547635e06f160` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role_department`
--

LOCK TABLES `base_sys_role_department` WRITE;
/*!40000 ALTER TABLE `base_sys_role_department` DISABLE KEYS */;
/*!40000 ALTER TABLE `base_sys_role_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_role_menu`
--

DROP TABLE IF EXISTS `base_sys_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `menuId` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `IDX_3641f81d4201c524a57ce2aa54` (`createTime`),
  KEY `IDX_f860298298b26e7a697be36e5b` (`updateTime`),
  KEY `IDX_fd2d8bbe13949cfa56b1ed0a5d` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_role_menu`
--

LOCK TABLES `base_sys_role_menu` WRITE;
/*!40000 ALTER TABLE `base_sys_role_menu` DISABLE KEYS */;
INSERT INTO `base_sys_role_menu` VALUES (9,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,4,188),(10,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,4,189),(11,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,4,205),(12,'2026-09-11 10:34:16','2026-09-11 10:34:16',NULL,4,206),(13,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,180),(14,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,181),(15,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,182),(16,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,221),(17,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,230),(18,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,232),(19,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,233),(20,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,235),(21,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,236),(22,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,238),(23,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,248),(24,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,249),(25,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,310),(26,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,311),(27,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,312),(28,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,313),(29,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,314),(30,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,4,315),(44,'2026-09-11 16:48:42','2026-09-11 16:48:42',NULL,4,316),(45,'2026-09-11 16:48:42','2026-09-11 16:48:42',NULL,4,317),(46,'2026-09-11 16:48:42','2026-09-11 16:48:42',NULL,4,318),(47,'2026-09-11 16:48:42','2026-09-11 16:48:42',NULL,4,319),(51,'2026-09-11 17:29:08','2026-09-11 17:29:08',NULL,4,320),(52,'2026-09-11 17:40:50','2026-09-11 17:40:50',NULL,4,42);
/*!40000 ALTER TABLE `base_sys_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_user`
--

DROP TABLE IF EXISTS `base_sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `departmentId` int DEFAULT NULL COMMENT '部门ID',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '姓名',
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `passwordV` int NOT NULL DEFAULT '1' COMMENT '密码版本, 作用是改完密码，让原来的token失效',
  `nickName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `headImg` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  `socketId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'socketId',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469ad55973f5b98930f6ad627b` (`username`),
  KEY `IDX_ca8611d15a63d52aa4e292e46a` (`createTime`),
  KEY `IDX_a0f2f19cee18445998ece93ddd` (`updateTime`),
  KEY `IDX_94cb6e88070603ac6729d514fd` (`tenantId`),
  KEY `IDX_0cf944da378d70a94f5fefd803` (`departmentId`),
  KEY `IDX_40541b0502eb2422c73ae2aad1` (`userId`),
  KEY `IDX_9ec6d7ac6337eafb070e4881a8` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_user`
--

LOCK TABLES `base_sys_user` WRITE;
/*!40000 ALTER TABLE `base_sys_user` DISABLE KEYS */;
INSERT INTO `base_sys_user` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,NULL,'超级管理员','admin','e10adc3949ba59abbe56e057f20f883e',7,'管理员',NULL,'18000000000','team@cool-js.com','拥有最高权限的用户',1,NULL),(2,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,NULL,NULL,'王阿婆','wangapo','e10adc3949ba59abbe56e057f20f883e',1,'王阿婆',NULL,NULL,NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `base_sys_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_sys_user_role`
--

DROP TABLE IF EXISTS `base_sys_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_user_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  KEY `IDX_fa9555e03e42fce748c9046b1c` (`createTime`),
  KEY `IDX_3e36c0d2b1a4c659c6b4fc64b3` (`updateTime`),
  KEY `IDX_2f1dc0b6aad5604a2ddf37fba6` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_sys_user_role`
--

LOCK TABLES `base_sys_user_role` WRITE;
/*!40000 ALTER TABLE `base_sys_user_role` DISABLE KEYS */;
INSERT INTO `base_sys_user_role` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,1,1),(2,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,2,4);
/*!40000 ALTER TABLE `base_sys_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `skuId` int NOT NULL COMMENT 'SKU ID',
  `checked` int NOT NULL DEFAULT '1' COMMENT '是否选中 1是 0否',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_sku` (`userId`,`skuId`),
  KEY `IDX_52873a7f7f6d060d4f24d4fcb3` (`createTime`),
  KEY `IDX_296a70648b8c86e9b050675287` (`updateTime`),
  KEY `IDX_1906b116db4aabb57c5e68e2dc` (`tenantId`),
  KEY `IDX_756f53ab9466eb52a52619ee01` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,2,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,5,1,11,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `itemType` tinyint NOT NULL COMMENT '商品类型 1-非遗商品 2-农产品',
  `itemId` int NOT NULL COMMENT '商品ID（product.id 或 farm_product.id）',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `itemName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品名称快照',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价快照',
  `coverImage` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封面图快照',
  PRIMARY KEY (`id`),
  KEY `IDX_b3454d63680259fc38237ad355` (`createTime`),
  KEY `IDX_76ce885be16c2b3e160a69c954` (`updateTime`),
  KEY `IDX_c411ce0a5cfbf4c466ff3fc4a5` (`tenantId`),
  KEY `IDX_158f0325ccf7f68a5b395fa2f6` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (3,'2026-09-11 17:05:43','2026-09-11 17:05:43',NULL,38,1,1,1,'苗族银饰手镯',328.00,'https://dummyimage.com/200x200/eee/888.png&text=yin');
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'åˆ†ç±»åç§°',
  `parent_id` int unsigned DEFAULT '0' COMMENT 'çˆ¶åˆ†ç±»IDï¼Œ0ä¸ºä¸€çº§åˆ†ç±»',
  `icon` varchar(500) DEFAULT NULL COMMENT 'åˆ†ç±»å›¾æ ‡',
  `sort` int DEFAULT '0' COMMENT 'æŽ’åº',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1å¯ç”¨ 0ç¦ç”¨',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='å•†å“åˆ†ç±»è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'é“¶é¥°',0,NULL,1,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(2,'èœ¡æŸ“',0,NULL,2,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(3,'åˆºç»£',0,NULL,3,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(4,'è‹—æ—æœé¥°',0,NULL,4,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(5,'å…¶ä»–æ‰‹å·¥è‰º',0,NULL,5,1,'2026-09-08 09:18:32','2026-09-08 09:18:32');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int unsigned NOT NULL COMMENT 'æ¸¸è®°ID',
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `content` varchar(500) NOT NULL COMMENT 'è¯„è®ºå†…å®¹',
  `parent_id` int unsigned DEFAULT '0' COMMENT 'çˆ¶è¯„è®ºIDï¼Œ0ä¸ºä¸€çº§è¯„è®º',
  `reply_to_user_id` int unsigned DEFAULT NULL COMMENT 'å›žå¤ç»™è°ï¼ˆäºŒçº§è¯„è®ºç”¨ï¼‰',
  `like_count` int DEFAULT '0' COMMENT 'ç‚¹èµžæ•°',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1æ­£å¸¸ 0å·²åˆ é™¤',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='è¯„è®ºè¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comment`
--

DROP TABLE IF EXISTS `community_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `postId` int NOT NULL COMMENT '游记ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `content` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容（≤500字）',
  `parentId` int DEFAULT NULL COMMENT '父评论ID（二级回复）',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1显示 0隐藏',
  PRIMARY KEY (`id`),
  KEY `IDX_4136e73a3b34c8deb6e5a54a30` (`createTime`),
  KEY `IDX_105a7f2b921502f07edd6cb33f` (`updateTime`),
  KEY `IDX_2c8da8048f264274362ee09b3d` (`tenantId`),
  KEY `IDX_a5c89daa119e8e6fc64b9570ae` (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comment`
--

LOCK TABLES `community_comment` WRITE;
/*!40000 ALTER TABLE `community_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_follow`
--

DROP TABLE IF EXISTS `community_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_follow` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '关注人（发起方）',
  `followingId` int NOT NULL COMMENT '被关注人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_727277bee92937c7e6dc5c96c2` (`userId`,`followingId`),
  KEY `IDX_5054de08abc26da3f03cbeb393` (`createTime`),
  KEY `IDX_7fb5e7b98162865c03ed1f5e66` (`updateTime`),
  KEY `IDX_d69b25265577968ee3ff71026f` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_follow`
--

LOCK TABLES `community_follow` WRITE;
/*!40000 ALTER TABLE `community_follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_like`
--

DROP TABLE IF EXISTS `community_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标类型 post/comment',
  `targetId` int NOT NULL COMMENT '目标ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_599ae7ad276b9907335ff9f23e` (`userId`,`targetType`,`targetId`),
  KEY `IDX_a7ca9646c5abfcba0573523e7a` (`createTime`),
  KEY `IDX_1498fb9dd9dd2474cc6a8c5b3b` (`updateTime`),
  KEY `IDX_449bc1b17c366b3047820ffc7c` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_like`
--

LOCK TABLES `community_like` WRITE;
/*!40000 ALTER TABLE `community_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_message`
--

DROP TABLE IF EXISTS `community_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_message` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '接收者用户ID',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system' COMMENT '类型 like/comment/follow/system',
  `refType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '关联类型 post/comment/user',
  `refId` int DEFAULT NULL COMMENT '关联ID',
  `content` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `isRead` int NOT NULL DEFAULT '0' COMMENT '是否已读',
  PRIMARY KEY (`id`),
  KEY `IDX_b6fc0afd3065691af8b1598c7d` (`createTime`),
  KEY `IDX_f71a79a78874611a3fe99e00f8` (`updateTime`),
  KEY `IDX_53abe31e641ed29f43b9fcae73` (`tenantId`),
  KEY `IDX_d3fcb517965a0b64d477779033` (`userId`,`isRead`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_message`
--

LOCK TABLES `community_message` WRITE;
/*!40000 ALTER TABLE `community_message` DISABLE KEYS */;
INSERT INTO `community_message` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,42,'like','post',601,'有人赞了你的游记《晨雾还没散，就到了观景台》',0),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,42,'comment','post',601,'你的游记收到了新评论',0);
/*!40000 ALTER TABLE `community_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post`
--

DROP TABLE IF EXISTS `community_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '作者用户ID',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '正文（≤5000字）',
  `images` json DEFAULT NULL COMMENT '图片（JSON数组≤9）',
  `videoUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '视频地址',
  `videoDuration` int DEFAULT NULL COMMENT '视频时长秒（≤60）',
  `linkedRouteId` int DEFAULT NULL COMMENT '关联路线ID（模式B）',
  `topicIds` json DEFAULT NULL COMMENT '话题ID（JSON数组）',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览数',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `commentCount` int NOT NULL DEFAULT '0' COMMENT '评论数',
  `favoriteCount` int NOT NULL DEFAULT '0' COMMENT '收藏数',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT '状态 pending审核中 normal正常 offline已下架',
  `auditReason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核理由',
  `footprintTotal` int NOT NULL DEFAULT '0' COMMENT '足迹总站数（发布/关联时定格）',
  PRIMARY KEY (`id`),
  KEY `IDX_2ab26ca31ea70956085ee93f40` (`createTime`),
  KEY `IDX_f3970fa96b0b4256b97d33e5bd` (`updateTime`),
  KEY `IDX_1e05e12061e71de70c2610fe70` (`tenantId`),
  KEY `IDX_6eccd064566e027a25d034b6c8` (`status`,`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=605 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post`
--

LOCK TABLES `community_post` WRITE;
/*!40000 ALTER TABLE `community_post` DISABLE KEYS */;
INSERT INTO `community_post` VALUES (601,'2026-09-02 08:30:00','2026-09-11 18:18:07',NULL,42,'晨雾还没散，就到了观景台','五点半摸黑上山，六点十分雾从谷底漫上来，梯田一层层亮起来。银饰工坊的老师傅手真稳，吊脚楼夜里能听见虫鸣。','[1, 2, 3]',NULL,NULL,1,'[501, 502]',1204,328,41,96,'normal',NULL,5),(602,'2026-09-03 14:10:00','2026-09-11 18:18:07',NULL,43,'带娃做蜡染的一下午','蜡染坊的阿婆教得耐心，小朋友的蓝白世界。','[4]',NULL,NULL,1,'[504]',892,189,22,45,'normal',NULL,5),(603,'2026-09-04 12:00:00','2026-09-11 18:18:07',NULL,44,'长桌宴扫街指南','酸汤鱼、糯米饭、米豆腐，一碗接一碗。','[5, 6, 1]',NULL,NULL,NULL,'[503]',640,256,38,30,'normal',NULL,0),(604,'2026-09-05 17:40:00','2026-09-11 18:18:07',NULL,44,'雨后的吊脚楼','屋檐滴水，青石板发亮。','[2]',NULL,NULL,NULL,'[501]',455,87,12,18,'normal',NULL,0);
/*!40000 ALTER TABLE `community_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post_footprint`
--

DROP TABLE IF EXISTS `community_post_footprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post_footprint` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `postId` int NOT NULL COMMENT '游记ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `scenicSpotId` int NOT NULL COMMENT '景区ID',
  `routeId` int DEFAULT NULL COMMENT '路线ID（模式B骨架）',
  `orderId` int DEFAULT NULL COMMENT '订单ID（核销凭证）',
  `mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'auto' COMMENT '模式 auto自动聚合 route关联路线',
  `dayNo` int DEFAULT NULL COMMENT '第几天',
  `memo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '一句话 memo',
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '照片',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '状态 normal正常 refunded退票灰显',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_bb462d7964f12228a724086912` (`createTime`),
  KEY `IDX_80a8f474b0140bd4b7aefe7e25` (`updateTime`),
  KEY `IDX_eee9b449c2a345771e79220feb` (`tenantId`),
  KEY `IDX_6f0dbb2b99f8bb686b5abf21cb` (`userId`,`scenicSpotId`),
  KEY `IDX_e9b823651609247f234327cf09` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post_footprint`
--

LOCK TABLES `community_post_footprint` WRITE;
/*!40000 ALTER TABLE `community_post_footprint` DISABLE KEYS */;
INSERT INTO `community_post_footprint` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,601,42,1,1,NULL,'route',1,'晨雾六点十分',NULL,'normal',0),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,601,42,3,1,NULL,'route',1,'酸汤鱼两碗',NULL,'normal',1),(3,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,601,42,4,1,NULL,'route',1,'夜听虫鸣',NULL,'normal',2),(4,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,601,42,6,1,NULL,'route',2,'芦笙响起来',NULL,'normal',3),(5,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,601,42,2,1,NULL,'route',2,NULL,NULL,'refunded',4),(6,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,602,43,5,1,NULL,'route',1,'蓝白世界',NULL,'normal',0),(7,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,602,43,3,1,NULL,'route',1,'午饭后出发',NULL,'normal',1);
/*!40000 ALTER TABLE `community_post_footprint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_report`
--

DROP TABLE IF EXISTS `community_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_report` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '举报人',
  `targetType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标类型 post/comment/user',
  `targetId` int NOT NULL COMMENT '目标ID',
  `reason` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '理由',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT '状态 pending待处理 handled已处理 rejected已驳回',
  `handleResult` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理结果',
  PRIMARY KEY (`id`),
  KEY `IDX_5b8a9688245f5bbe7ea93e70e1` (`createTime`),
  KEY `IDX_03e71c50be854c677851e35064` (`updateTime`),
  KEY `IDX_2c6da954782b9897df2b852e10` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_report`
--

LOCK TABLES `community_report` WRITE;
/*!40000 ALTER TABLE `community_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_topic`
--

DROP TABLE IF EXISTS `community_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_topic` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称 #xx',
  `intro` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '简介',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览数',
  `followerCount` int NOT NULL DEFAULT '0' COMMENT '粉丝数',
  `postCount` int NOT NULL DEFAULT '0' COMMENT '帖子数',
  `isHot` int NOT NULL DEFAULT '0' COMMENT '是否热门',
  `isRecommend` int NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `bindRouteIds` json DEFAULT NULL COMMENT '绑定路线（JSON数组）',
  PRIMARY KEY (`id`),
  KEY `IDX_507dcc171f1b83a9a6f2eaf419` (`createTime`),
  KEY `IDX_b34f31d400035d781d52cec80d` (`updateTime`),
  KEY `IDX_24a80d1136201c662ae3228d69` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_topic`
--

LOCK TABLES `community_topic` WRITE;
/*!40000 ALTER TABLE `community_topic` DISABLE KEYS */;
INSERT INTO `community_topic` VALUES (501,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'#苗寨风光','分享苗寨美景',21000,12,3,1,1,1,1,'[2]'),(502,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'#徒步路线','用脚步丈量苗寨',5103,8,2,1,0,2,1,'[1]'),(503,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'#美食打卡','长桌宴与酸汤鱼',8900,15,1,1,1,3,1,'[]'),(504,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'#非遗手作','银饰与蜡染',3877,6,1,0,0,4,1,'[1]');
/*!40000 ALTER TABLE `community_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_topic_follow`
--

DROP TABLE IF EXISTS `community_topic_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_topic_follow` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `topicId` int NOT NULL COMMENT '话题ID',
  `userId` int NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7887e82462fc3a98bf1baadf16` (`topicId`,`userId`),
  KEY `IDX_a2c07ffc80314869d567dbb0a6` (`createTime`),
  KEY `IDX_32297b9b2df9a1b0b49b3787cc` (`updateTime`),
  KEY `IDX_d5b813116ad524ae2306e499c1` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_topic_follow`
--

LOCK TABLES `community_topic_follow` WRITE;
/*!40000 ALTER TABLE `community_topic_follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_topic_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demo_goods`
--

DROP TABLE IF EXISTS `demo_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demo_goods` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `price` decimal(5,2) NOT NULL COMMENT '价格',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `mainImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主图',
  `type` int NOT NULL COMMENT '分类',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `exampleImages` json DEFAULT NULL COMMENT '示例图',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  PRIMARY KEY (`id`),
  KEY `IDX_5075bf301ed9c39b5ca534231c` (`createTime`),
  KEY `IDX_82703e0477d1219261277df718` (`updateTime`),
  KEY `IDX_4773d4d34db0d601516da30bf3` (`tenantId`),
  KEY `IDX_85a70ee36c7c1b0a04bfa1ed27` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demo_goods`
--

LOCK TABLES `demo_goods` WRITE;
/*!40000 ALTER TABLE `demo_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `demo_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dict_info`
--

DROP TABLE IF EXISTS `dict_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dict_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `typeId` int NOT NULL COMMENT '类型ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '值',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `parentId` int DEFAULT NULL COMMENT '父ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5c311a4af30de1181a5d7a7cc2` (`createTime`),
  KEY `IDX_10362a62adbf120821fff209d8` (`updateTime`),
  KEY `IDX_c26dc4b1ccb26e642191995edd` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dict_info`
--

LOCK TABLES `dict_info` WRITE;
/*!40000 ALTER TABLE `dict_info` DISABLE KEYS */;
INSERT INTO `dict_info` VALUES (21,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,19,'COOL','cool',1,NULL,NULL),(22,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,19,'闪酷','https://show.cool-admin.com/api/public/uploads/20230308/c731b0cba84046268b10edbbcf36f948_315c243a448e1369fa145c5ea3f020da.gif',2,NULL,NULL),(23,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'法师','4',1,NULL,NULL),(24,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'战士','3',2,NULL,NULL),(25,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'坦克','2',3,NULL,NULL),(26,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'刺客','1',4,NULL,NULL),(27,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'射手','0',5,NULL,NULL),(30,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,20,'幻影刺客','5',1,NULL,26);
/*!40000 ALTER TABLE `dict_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dict_type`
--

DROP TABLE IF EXISTS `dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dict_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标识',
  PRIMARY KEY (`id`),
  KEY `IDX_69734e5c2d29cc2139d5078f2c` (`createTime`),
  KEY `IDX_6cccb2e33846cd354e8dc0e0ef` (`updateTime`),
  KEY `IDX_7d4f3d2336e1afdda38278a07e` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dict_type`
--

LOCK TABLES `dict_type` WRITE;
/*!40000 ALTER TABLE `dict_type` DISABLE KEYS */;
INSERT INTO `dict_type` VALUES (19,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'品牌','brand'),(20,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,'职业','occupation');
/*!40000 ALTER TABLE `dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'èœå“åç§°',
  `price` decimal(10,2) NOT NULL COMMENT 'ä»·æ ¼',
  `image` varchar(500) DEFAULT NULL COMMENT 'å›¾ç‰‡',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1åœ¨å”® 0åœå”®',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `category` varchar(20) DEFAULT NULL COMMENT '分类',
  `description` text COMMENT '菜品介绍',
  `isRecommended` int NOT NULL DEFAULT '0' COMMENT '是否推荐',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `e_ticket`
--

DROP TABLE IF EXISTS `e_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `e_ticket` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ticket_no` varchar(32) NOT NULL COMMENT 'ç”µå­ç¥¨å·',
  `order_id` int unsigned NOT NULL COMMENT 'è®¢å•ID',
  `ticket_type` tinyint NOT NULL COMMENT 'ç¥¨ç±»åž‹ï¼š1é—¨ç¥¨ 2è·¯çº¿å¥—é¤',
  `target_id` int unsigned NOT NULL COMMENT 'ç›®æ ‡IDï¼ˆæ™¯åŒºID/è·¯çº¿IDï¼‰',
  `target_name` varchar(200) NOT NULL COMMENT 'ç›®æ ‡åç§°',
  `qr_code` varchar(500) NOT NULL COMMENT 'äºŒç»´ç URL',
  `valid_date` date NOT NULL COMMENT 'æœ‰æ•ˆæ—¥æœŸ',
  `visitor_name` varchar(50) DEFAULT NULL COMMENT 'æ¸¸å®¢å§“å',
  `visitor_phone` varchar(11) DEFAULT NULL COMMENT 'æ¸¸å®¢æ‰‹æœº',
  `visitor_id_card` varchar(18) DEFAULT NULL COMMENT 'æ¸¸å®¢èº«ä»½è¯',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1æœªä½¿ç”¨ 2å·²ä½¿ç”¨ 3å·²é€€æ¬¾',
  `used_time` datetime DEFAULT NULL COMMENT 'ä½¿ç”¨æ—¶é—´',
  `used_by` varchar(50) DEFAULT NULL COMMENT 'æ ¸é”€äºº',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_no` (`ticket_no`),
  KEY `idx_ticket_no` (`ticket_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_valid_date` (`valid_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ç”µå­ç¥¨è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `e_ticket`
--

LOCK TABLES `e_ticket` WRITE;
/*!40000 ALTER TABLE `e_ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `e_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farm_product`
--

DROP TABLE IF EXISTS `farm_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farm_product` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'å•†å“åç§°',
  `price` decimal(10,2) NOT NULL COMMENT 'ä»·æ ¼',
  `stock` int DEFAULT '0' COMMENT 'åº“å­˜',
  `origin` varchar(100) DEFAULT NULL COMMENT 'äº§åœ°',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int NOT NULL COMMENT '商家ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `coverImage` varchar(500) NOT NULL COMMENT '封面图',
  `images` json DEFAULT NULL COMMENT '产品图片JSON',
  `unit` varchar(10) NOT NULL COMMENT '单位',
  `description` text COMMENT '产品描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm_product`
--

LOCK TABLES `farm_product` WRITE;
/*!40000 ALTER TABLE `farm_product` DISABLE KEYS */;
INSERT INTO `farm_product` VALUES (1,'高山云雾茶',88.00,120,'乌东村茶山',1,'2026-09-11 13:16:38','2026-09-11 13:16:38',NULL,1,1,'https://dummyimage.com/200x200/eee/888.png&text=cha',NULL,'盒',NULL),(2,'土蜂蜜',65.50,80,'乌东后山蜂场',1,'2026-09-11 13:16:38','2026-09-11 13:16:38',NULL,1,2,'https://dummyimage.com/200x200/eee/888.png&text=feng',NULL,'瓶',NULL);
/*!40000 ALTER TABLE `farm_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farm_product_category`
--

DROP TABLE IF EXISTS `farm_product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farm_product_category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'åˆ†ç±»åç§°',
  `icon` varchar(500) DEFAULT NULL COMMENT 'å›¾æ ‡',
  `sort` int DEFAULT '0' COMMENT 'æŽ’åº',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm_product_category`
--

LOCK TABLES `farm_product_category` WRITE;
/*!40000 ALTER TABLE `farm_product_category` DISABLE KEYS */;
INSERT INTO `farm_product_category` VALUES (1,'茶叶',NULL,1,1,'','',NULL),(2,'腊肉',NULL,2,1,'','',NULL),(3,'米酒',NULL,3,1,'','',NULL),(4,'酸食',NULL,4,1,'','',NULL),(5,'其他特产',NULL,5,1,'','',NULL);
/*!40000 ALTER TABLE `farm_product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `target_type` varchar(20) NOT NULL COMMENT 'ç›®æ ‡ç±»åž‹ï¼šproduct/restaurant/hotel/scenic/post',
  `target_id` int unsigned NOT NULL COMMENT 'ç›®æ ‡ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`,`target_type`,`target_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æ”¶è—è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_record`
--

DROP TABLE IF EXISTS `finance_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_record` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `merchantId` int NOT NULL COMMENT '商家ID',
  `orderAmount` decimal(10,2) NOT NULL COMMENT '订单金额',
  `commissionRate` decimal(5,2) NOT NULL COMMENT '抽佣比例%',
  `commissionAmount` decimal(10,2) NOT NULL COMMENT '平台抽佣',
  `merchantIncome` decimal(10,2) NOT NULL COMMENT '商家收入',
  `settlementStatus` int NOT NULL DEFAULT '1' COMMENT '结算状态：1待结算 2已结算',
  `settlementTime` varchar(255) DEFAULT NULL COMMENT '结算时间',
  `settlementBatch` varchar(50) DEFAULT NULL COMMENT '结算批次号',
  PRIMARY KEY (`id`),
  KEY `IDX_9089ae61724561215e9d36e2ba` (`createTime`),
  KEY `IDX_0a8e22e4e1f9c6d0cf83c781a5` (`updateTime`),
  KEY `IDX_927d1b8ed318625293281748de` (`tenantId`),
  KEY `IDX_8f87b21edc692e350351daeab8` (`orderId`),
  KEY `IDX_775eb1320accb3ea4a556dd1e8` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_record`
--

LOCK TABLES `finance_record` WRITE;
/*!40000 ALTER TABLE `finance_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'å…³æ³¨è€…ID',
  `follow_user_id` int unsigned NOT NULL COMMENT 'è¢«å…³æ³¨è€…ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_follow` (`user_id`,`follow_user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_follow_user_id` (`follow_user_id`),
  CONSTRAINT `fk_follow_target` FOREIGN KEY (`follow_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_follow_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='å…³æ³¨å…³ç³»è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_reservation`
--

DROP TABLE IF EXISTS `food_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_reservation` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `timeSlotId` int NOT NULL COMMENT '时段ID',
  `reservationDate` date NOT NULL COMMENT '预订日期',
  `peopleCount` int NOT NULL COMMENT '就餐人数',
  `contactName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人姓名',
  `contactPhone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `remark` text COLLATE utf8mb4_unicode_ci COMMENT '备注',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-待确认 1-已确认 2-已取消 3-已完成',
  `confirmTime` datetime DEFAULT NULL COMMENT '确认时间',
  `cancelTime` datetime DEFAULT NULL COMMENT '取消时间',
  `orderNo` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '关联公共订单号（order 模块）',
  PRIMARY KEY (`id`),
  KEY `IDX_532189a6ff685d6d3f5191d219` (`createTime`),
  KEY `IDX_a292792a10e78fc302ce291078` (`updateTime`),
  KEY `IDX_8fcc8e516137aeec599b0336b4` (`tenantId`),
  KEY `IDX_f5062f94d323ce516eaf99a5c8` (`userId`),
  KEY `IDX_68616ff9a04adf46beead3eb22` (`restaurantId`),
  KEY `IDX_a414cbcb38de3715b12c0b500e` (`timeSlotId`),
  KEY `IDX_3e93f860968dfb1198be494412` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_reservation`
--

LOCK TABLES `food_reservation` WRITE;
/*!40000 ALTER TABLE `food_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `food_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel`
--

DROP TABLE IF EXISTS `hotel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '民宿名称',
  `address` varchar(200) NOT NULL COMMENT '地址',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `images` json DEFAULT NULL COMMENT '图片集',
  `intro` text COMMENT '介绍',
  `deposit` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '押金',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID（归属标识）',
  `styleTags` json DEFAULT NULL COMMENT '风格标签',
  `facilityTags` json DEFAULT NULL COMMENT '设施标签',
  `mainImage` varchar(500) DEFAULT NULL COMMENT '主图',
  `checkInTime` varchar(5) NOT NULL DEFAULT '14:00' COMMENT '入住时间',
  `checkOutTime` varchar(5) NOT NULL DEFAULT '12:00' COMMENT '离店时间',
  `petPolicy` varchar(200) DEFAULT NULL COMMENT '宠物政策',
  `hasBreakfast` int NOT NULL DEFAULT '0' COMMENT '是否含早餐',
  `reviewCount` int NOT NULL DEFAULT '0' COMMENT '评价数',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态：1正常 0下架',
  PRIMARY KEY (`id`),
  KEY `IDX_f7a69cc7cd56cc8262fc4b7924` (`createTime`),
  KEY `IDX_5e80334cd6de44cb173aaeef21` (`updateTime`),
  KEY `IDX_98ac84b0b1386142ded8b25aaf` (`tenantId`),
  KEY `IDX_02c90b40a7513dd9023117f563` (`merchantId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel`
--

LOCK TABLES `hotel` WRITE;
/*!40000 ALTER TABLE `hotel` DISABLE KEYS */;
INSERT INTO `hotel` VALUES (1,'云上人家','雷山县 · 乌东村一组',108.100000,26.300000,'[\"https://picsum.photos/seed/h1/900/600\", \"https://picsum.photos/seed/h1b/900/600\"]','坐落于梯田之上的百年木楼，推窗见云雾青山。',0.00,4.80,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'[\"苗寨\", \"江景\"]','[\"WiFi\", \"空调\", \"独立卫浴\"]','https://picsum.photos/seed/h1/900/600','14:00','12:00',NULL,0,126,1),(2,'云雾观星客栈','雷山县 · 乌东村东岭',108.105000,26.305000,'[\"https://picsum.photos/seed/h2/900/600\"]','海拔最高的一家，夜里推窗就是星海。',0.00,4.60,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'[\"观星\", \"山景\"]','[\"WiFi\", \"暖气\"]','https://picsum.photos/seed/h2/900/600','14:00','12:00',NULL,0,89,1),(3,'王阿婆梯田民宿','乌东村口',108.110000,26.310000,'[\"https://picsum.photos/seed/h3/900/600\"]','阿婆家的吊脚楼就在梯田边，推开窗就是山雾与稻香。床品是阿婆自己种的蓝靛、亲手蜡染的。',0.00,4.20,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'[\"山景\", \"家庭\", \"经济\"]','[\"WiFi\"]','https://picsum.photos/seed/h3/900/600','14:00','12:00',NULL,0,57,1);
/*!40000 ALTER TABLE `hotel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inheritor`
--

DROP TABLE IF EXISTS `inheritor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inheritor` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'ä¼ æ‰¿äººå§“å',
  `level` varchar(50) DEFAULT NULL COMMENT 'çº§åˆ«ï¼ˆå›½å®¶çº§/çœçº§/å¸‚çº§ï¼‰',
  `skill` varchar(100) DEFAULT NULL COMMENT 'æŠ€è‰º',
  `intro` text COMMENT 'ç®€ä»‹',
  `avatar` varchar(500) DEFAULT NULL COMMENT 'å¤´åƒ',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ä¼ æ‰¿äººè¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inheritor`
--

LOCK TABLES `inheritor` WRITE;
/*!40000 ALTER TABLE `inheritor` DISABLE KEYS */;
/*!40000 ALTER TABLE `inheritor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_sms_code`
--

DROP TABLE IF EXISTS `member_sms_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_sms_code` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '验证码',
  `expireTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '过期时间',
  `used` int NOT NULL DEFAULT '0' COMMENT '是否已使用 0未使用 1已使用',
  PRIMARY KEY (`id`),
  KEY `IDX_8a63c7d4fe859148f8c67b650b` (`createTime`),
  KEY `IDX_f343478746db8c28541ff8c2e6` (`updateTime`),
  KEY `IDX_92616de1cf059a3346d2a382bf` (`tenantId`),
  KEY `IDX_93d64e41af42be831b56f59102` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_sms_code`
--

LOCK TABLES `member_sms_code` WRITE;
/*!40000 ALTER TABLE `member_sms_code` DISABLE KEYS */;
INSERT INTO `member_sms_code` VALUES (1,'2026-09-09 18:48:13','2026-09-09 18:48:13',NULL,'13811112222','191735','2026-09-09 18:53:13',1),(2,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,'13800001111','717288','2026-09-09 20:20:23',1),(3,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,'13800002222','970395','2026-09-09 20:23:53',1),(4,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,'13800003333','239933','2026-09-09 20:51:22',1),(5,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,'13800004444','948420','2026-09-09 21:17:10',1),(6,'2026-09-09 22:45:08','2026-09-09 22:45:08',NULL,'13800000001','244060','2026-09-09 22:50:08',1),(7,'2026-09-10 16:05:39','2026-09-10 16:05:39',NULL,'13800000001','260163','2026-09-10 16:10:39',0);
/*!40000 ALTER TABLE `member_sms_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_user`
--

DROP TABLE IF EXISTS `member_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码（bcrypt）',
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别',
  `bio` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '个人简介',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `lastLoginTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登录时间',
  `role` int NOT NULL DEFAULT '1' COMMENT '角色 1游客 2商家',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_77dfa36d16ae1f79fa54f09488` (`phone`),
  KEY `IDX_27a1efbeca2e6e5c61d081e57d` (`createTime`),
  KEY `IDX_45b7f43ab656001600a8b33bc9` (`updateTime`),
  KEY `IDX_537e0352c9182b59c4e8d3a0bc` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_user`
--

LOCK TABLES `member_user` WRITE;
/*!40000 ALTER TABLE `member_user` DISABLE KEYS */;
INSERT INTO `member_user` VALUES (1,'2026-09-09 18:48:44','2026-09-09 18:48:44',NULL,'13811112222','$2a$10$35xttYldJ1Yhl.54WygxiuwnQCOce0neGC6RsQDA4xScp/jygA7WC','游客2222',NULL,0,NULL,1,'2026-09-09 18:48:58',1),(2,'2026-09-09 20:15:23','2026-09-09 20:15:23',NULL,'13800001111','$2a$10$v.z96dM/FFwavX58Ajs.iemkqEPKD2b5YsRbWXqwG5fY2GOxhIrHK','游客1111',NULL,0,NULL,1,'2026-09-09 20:15:23',1),(3,'2026-09-09 20:18:53','2026-09-09 20:18:53',NULL,'13800002222','$2a$10$GoJ.jNgTc.fcvVxJSoVpzOx4xazusODK2KxbTBCdhwEj3VRCx7y46','游客2222',NULL,0,NULL,1,'2026-09-09 20:18:53',1),(4,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,'13800003333','$2a$10$ZZVUGv92NAHuebXanCcNhOUPBOnvNBNjckrPQgYWJ4C3Yxfezkvcy','游客3333',NULL,0,NULL,1,'2026-09-09 20:46:22',1),(5,'2026-09-09 21:12:10','2026-09-09 21:12:10',NULL,'13800004444','$2a$10$E7BKF3ahMVVofowVFF8XDeNPXKKNcBDql6r5mqaAw1n0aOf1xjsLC','游客4444',NULL,0,NULL,1,'2026-09-09 21:12:10',1),(42,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'13800000001','$2a$10$4igh.czHNcf5Qj6ILkXR2eI46FlIRPP9gKBegHzZ/t9D/04wNYeXS','山野小鱼','🧑‍🌾',1,'山野与烟火气都爱',1,NULL,1),(43,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'13800000002','$2a$10$4igh.czHNcf5Qj6ILkXR2eI46FlIRPP9gKBegHzZ/t9D/04wNYeXS','奶爸游记','👨',1,'带娃看世界',1,NULL,1),(44,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'13800000003','$2a$10$4igh.czHNcf5Qj6ILkXR2eI46FlIRPP9gKBegHzZ/t9D/04wNYeXS','快门手','📷',1,'只拍晨雾和夜晚',1,NULL,1),(45,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'13800000004','$2a$10$4igh.czHNcf5Qj6ILkXR2eI46FlIRPP9gKBegHzZ/t9D/04wNYeXS','干饭人小王','🍚',1,'为吃而行',1,NULL,1);
/*!40000 ALTER TABLE `member_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchant`
--

DROP TABLE IF EXISTS `merchant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `merchant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '关联用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商家账号',
  `shopName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名称',
  `module` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属模块 product/food/accommodation/travel',
  `contactName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contactPhone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `idCard` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号',
  `businessLicense` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '营业执照URL',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1正常 0禁用',
  `joinedAt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '入驻时间',
  `adminUserId` int DEFAULT NULL COMMENT '绑定的管理端用户ID（商家角色数据权限，空为未绑定）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0369e7853b1a4d8e366c7b3b79` (`username`),
  KEY `IDX_afd1adcd2d9973c3eff3004546` (`createTime`),
  KEY `IDX_c8c141977b6c36497f766d5ebb` (`updateTime`),
  KEY `IDX_533144d7ae94180235ea456625` (`tenantId`),
  KEY `IDX_4973a7acae8e2f6bfac7a781ce` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchant`
--

LOCK TABLES `merchant` WRITE;
/*!40000 ALTER TABLE `merchant` DISABLE KEYS */;
INSERT INTO `merchant` VALUES (1,'2026-09-11 16:21:00','2026-09-11 16:21:00',NULL,0,'wangapo','王阿婆梯田民宿','accommodation','王阿婆','13800000099',NULL,NULL,1,'2026-09-11',2);
/*!40000 ALTER TABLE `merchant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchant_application`
--

DROP TABLE IF EXISTS `merchant_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `merchant_application` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `shopName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名称',
  `module` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '申请模块 product/food/accommodation/travel',
  `contactName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contactPhone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `idCard` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份证号',
  `idCardFront` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份证正面',
  `idCardBack` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份证反面',
  `businessLicense` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '营业执照',
  `otherMaterials` json DEFAULT NULL COMMENT '其他材料（JSON数组）',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1待审核 2已通过 3已驳回',
  `auditResult` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核意见',
  `auditBy` int DEFAULT NULL COMMENT '审核人ID',
  `auditTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核时间',
  PRIMARY KEY (`id`),
  KEY `IDX_0072ca9e819dcf80a37c2853dd` (`createTime`),
  KEY `IDX_416e05c635684059594b2dbb69` (`updateTime`),
  KEY `IDX_6770c18ad4d2b680f421f1c206` (`tenantId`),
  KEY `IDX_60a3fcac4773ea103ecb03dcb4` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchant_application`
--

LOCK TABLES `merchant_application` WRITE;
/*!40000 ALTER TABLE `merchant_application` DISABLE KEYS */;
INSERT INTO `merchant_application` VALUES (1,'2026-09-09 20:46:22','2026-09-09 20:46:22',NULL,4,'演示商铺（蜡染坊）','product','����','13800003333','522301199001010011','f','b','l',NULL,1,NULL,NULL,'2026-09-09 20:46:22');
/*!40000 ALTER TABLE `merchant_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_template`
--

DROP TABLE IF EXISTS `message_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_template` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模板编码',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模板名称',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system' COMMENT '消息类型 order/system/activity/interact',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题模板（支持 {nickname} 等占位）',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容模板（支持占位）',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0停用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_768307c76ffdff02a8a4a2562d` (`code`),
  KEY `IDX_647e57d98534c8f3877edd3c5e` (`createTime`),
  KEY `IDX_b886d65b855defa073c2ebff11` (`updateTime`),
  KEY `IDX_11039f8d39bd442b3e91047247` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_template`
--

LOCK TABLES `message_template` WRITE;
/*!40000 ALTER TABLE `message_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `message_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation_log`
--

DROP TABLE IF EXISTS `operation_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int unsigned NOT NULL COMMENT 'æ“ä½œäººID',
  `admin_name` varchar(50) NOT NULL COMMENT 'æ“ä½œäººå§“å',
  `module` varchar(50) NOT NULL COMMENT 'æ“ä½œæ¨¡å—',
  `action` varchar(50) NOT NULL COMMENT 'æ“ä½œç±»åž‹ï¼ˆcreate/update/deleteï¼‰',
  `target_type` varchar(50) DEFAULT NULL COMMENT 'æ“ä½œå¯¹è±¡ç±»åž‹',
  `target_id` int unsigned DEFAULT NULL COMMENT 'æ“ä½œå¯¹è±¡ID',
  `description` varchar(500) DEFAULT NULL COMMENT 'æ“ä½œæè¿°',
  `request_data` json DEFAULT NULL COMMENT 'è¯·æ±‚æ•°æ®',
  `ip` varchar(45) NOT NULL COMMENT 'IPåœ°å€',
  `user_agent` varchar(500) DEFAULT NULL COMMENT 'User-Agent',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æ“ä½œæ—¥å¿—è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation_log`
--

LOCK TABLES `operation_log` WRITE;
/*!40000 ALTER TABLE `operation_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `operation_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `userId` int NOT NULL COMMENT '用户ID',
  `orderType` int NOT NULL DEFAULT '1' COMMENT '订单类型 1商品 2餐位 3住宿 4门票 5路线',
  `module` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属模块 product/food/accommodation/travel',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单总额',
  `payAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1待支付 2已支付 3已完成 4已取消 5已退款',
  `payTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付时间',
  `completeTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '完成时间',
  `cancelTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消时间',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '订单备注',
  `merchantId` int DEFAULT NULL COMMENT '商家ID（归属标识，由下单调用模块解析传入，无商家归属为空）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_2fa775b82a212c5fc3bb4074c6` (`orderNo`),
  KEY `IDX_99a5dd229861d593ffa8095b4a` (`createTime`),
  KEY `IDX_0e4b93fe2bf6bf8a7ec7c9e25b` (`updateTime`),
  KEY `IDX_7853202400ba8726242baa7a91` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `skuId` int NOT NULL COMMENT 'SKU ID',
  `productName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品名称',
  `skuName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SKU名称',
  `productImage` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '商品图片',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '小计',
  `addressId` int DEFAULT NULL COMMENT '收货地址ID',
  `expressCompany` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '快递公司',
  `expressNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '快递单号',
  `shipTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发货时间',
  `receiveTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '收货时间',
  PRIMARY KEY (`id`),
  KEY `IDX_9c20697e5236674f9e4fd29253` (`createTime`),
  KEY `IDX_10dc5e42557f7635287283f70d` (`updateTime`),
  KEY `IDX_a0950581f3fe4909745a3089bb` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_reservation`
--

DROP TABLE IF EXISTS `order_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_reservation` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `reservationType` int NOT NULL DEFAULT '1' COMMENT '预订类型 1餐位 2住宿',
  `targetId` int NOT NULL COMMENT '目标ID（餐厅ID/民宿ID）',
  `targetName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标名称',
  `checkInDate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '入住/就餐日期',
  `checkOutDate` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '离店日期（住宿用）',
  `guestName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '入住人/就餐人姓名',
  `guestPhone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `guestCount` int NOT NULL DEFAULT '1' COMMENT '人数',
  `idCard` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号（住宿必填）',
  `timeSlot` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '时段（餐位用）',
  `roomTypeId` int DEFAULT NULL COMMENT '房型ID（住宿用）',
  `specialRequest` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '特殊要求',
  `checkInCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '入住码/核销码',
  PRIMARY KEY (`id`),
  KEY `IDX_722d2405c4b97738d6664701c1` (`createTime`),
  KEY `IDX_07e048832ecf38c2542e8e3499` (`updateTime`),
  KEY `IDX_5b020ff339c8aadff58553238e` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_reservation`
--

LOCK TABLES `order_reservation` WRITE;
/*!40000 ALTER TABLE `order_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_ticket`
--

DROP TABLE IF EXISTS `order_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_ticket` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `ticketType` int NOT NULL DEFAULT '1' COMMENT '票类型 1门票 2路线套餐',
  `targetId` int NOT NULL COMMENT '目标ID（景区ID/路线ID）',
  `targetName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标名称',
  `ticketName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票种名称',
  `useDate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用日期',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总价',
  `visitorInfo` json DEFAULT NULL COMMENT '游客信息（JSON数组）',
  PRIMARY KEY (`id`),
  KEY `IDX_5cf307623725c7ea15deb2eff4` (`createTime`),
  KEY `IDX_54e94121f2f7d14b3d5cd5ed1d` (`updateTime`),
  KEY `IDX_8d21f18f1dbc57d739edc126e0` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_ticket`
--

LOCK TABLES `order_ticket` WRITE;
/*!40000 ALTER TABLE `order_ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_record`
--

DROP TABLE IF EXISTS `payment_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_record` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `paymentNo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '支付流水号',
  `payChannel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '支付渠道 wechat/alipay',
  `payAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `payStatus` int NOT NULL DEFAULT '1' COMMENT '支付状态 1待支付 2已支付 3已退款',
  `transactionId` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '第三方交易号',
  `payTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付时间',
  `refundTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '退款时间',
  `refundAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '退款金额',
  `callbackData` json DEFAULT NULL COMMENT '支付回调数据',
  `merchantId` int DEFAULT NULL COMMENT '商家ID（归属标识，冗余自主单，无商家归属为空）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1d5abbb81e4fbdaaaaf02c3d2a` (`paymentNo`),
  KEY `IDX_c3e7f4d7795db1497b6b93f569` (`createTime`),
  KEY `IDX_4a29bd59e6c2f44a6221ccda88` (`updateTime`),
  KEY `IDX_3fcf9850e4641bfde7b293192d` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_record`
--

LOCK TABLES `payment_record` WRITE;
/*!40000 ALTER TABLE `payment_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'æƒé™åç§°',
  `code` varchar(100) NOT NULL COMMENT 'æƒé™ä»£ç ï¼ˆå¦‚ï¼šproduct:createï¼‰',
  `type` tinyint NOT NULL COMMENT 'æƒé™ç±»åž‹ï¼š1èœå• 2æŒ‰é’® 3æŽ¥å£',
  `parent_id` int unsigned DEFAULT '0' COMMENT 'çˆ¶æƒé™ID',
  `path` varchar(200) DEFAULT NULL COMMENT 'è·¯ç”±è·¯å¾„',
  `icon` varchar(50) DEFAULT NULL COMMENT 'å›¾æ ‡',
  `sort` int DEFAULT '0' COMMENT 'æŽ’åº',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æƒé™è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugin_info`
--

DROP TABLE IF EXISTS `plugin_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugin_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '简介',
  `keyName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Key名',
  `hook` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hook',
  `readme` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '描述',
  `version` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '版本',
  `logo` text COLLATE utf8mb4_unicode_ci COMMENT 'Logo(base64)',
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '作者',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-禁用 1-启用',
  `content` json NOT NULL COMMENT '内容',
  `tsContent` json NOT NULL COMMENT 'ts内容',
  `pluginJson` json DEFAULT NULL COMMENT '插件的plugin.json',
  `config` json DEFAULT NULL COMMENT '配置',
  PRIMARY KEY (`id`),
  KEY `IDX_071da0804576df95363c24357c` (`createTime`),
  KEY `IDX_d94d7c2437aca9f1b183979b07` (`updateTime`),
  KEY `IDX_89a39daf328b50686755795546` (`tenantId`),
  KEY `IDX_95719662507de0fbf70ad1b5ee` (`keyName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugin_info`
--

LOCK TABLES `plugin_info` WRITE;
/*!40000 ALTER TABLE `plugin_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugin_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `title` varchar(200) DEFAULT NULL COMMENT 'æ ‡é¢˜',
  `content` text NOT NULL COMMENT 'æ–‡å­—å†…å®¹',
  `images` json DEFAULT NULL COMMENT 'å›¾ç‰‡åˆ—è¡¨ï¼ˆJSONæ•°ç»„ï¼Œæœ€å¤š9å¼ ï¼‰',
  `video_url` varchar(500) DEFAULT NULL COMMENT 'è§†é¢‘URL',
  `video_cover` varchar(500) DEFAULT NULL COMMENT 'è§†é¢‘å°é¢',
  `location_type` varchar(20) DEFAULT NULL COMMENT 'å…³è”åœ°ç‚¹ç±»åž‹ï¼ˆrestaurant/hotel/scenicï¼‰',
  `location_id` int unsigned DEFAULT NULL COMMENT 'å…³è”åœ°ç‚¹ID',
  `location_name` varchar(200) DEFAULT NULL COMMENT 'å…³è”åœ°ç‚¹åç§°',
  `topic_ids` json DEFAULT NULL COMMENT 'è¯é¢˜IDåˆ—è¡¨ï¼ˆJSONæ•°ç»„ï¼‰',
  `like_count` int DEFAULT '0' COMMENT 'ç‚¹èµžæ•°',
  `comment_count` int DEFAULT '0' COMMENT 'è¯„è®ºæ•°',
  `favorite_count` int DEFAULT '0' COMMENT 'æ”¶è—æ•°',
  `view_count` int DEFAULT '0' COMMENT 'æµè§ˆæ•°',
  `status` tinyint DEFAULT '2' COMMENT 'çŠ¶æ€ï¼š1æ­£å¸¸ 2å®¡æ ¸ä¸­ 3å·²ä¸‹æž¶',
  `audit_result` varchar(500) DEFAULT NULL COMMENT 'å®¡æ ¸ç»“æžœ',
  `audit_time` datetime DEFAULT NULL COMMENT 'å®¡æ ¸æ—¶é—´',
  `is_featured` tinyint DEFAULT '0' COMMENT 'æ˜¯å¦ç²¾é€‰ï¼š1æ˜¯ 0å¦',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æ¸¸è®°è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_favorite`
--

DROP TABLE IF EXISTS `post_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_favorite` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `post_id` int unsigned NOT NULL COMMENT 'æ¸¸è®°ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_post` (`user_id`,`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `fk_post_favorite_post` (`post_id`),
  CONSTRAINT `fk_post_favorite_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æ¸¸è®°æ”¶è—è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_favorite`
--

LOCK TABLES `post_favorite` WRITE;
/*!40000 ALTER TABLE `post_favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_like`
--

DROP TABLE IF EXISTS `post_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_like` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `target_type` varchar(20) NOT NULL COMMENT 'ç›®æ ‡ç±»åž‹ï¼špost/comment',
  `target_id` int unsigned NOT NULL COMMENT 'ç›®æ ‡ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`,`target_type`,`target_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ç‚¹èµžè¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_like`
--

LOCK TABLES `post_like` WRITE;
/*!40000 ALTER TABLE `post_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'å•†å“ID',
  `price` decimal(10,2) NOT NULL COMMENT 'ä»·æ ¼',
  `stock` int DEFAULT '0' COMMENT 'æ€»åº“å­˜',
  `sales` int DEFAULT '0' COMMENT 'é”€é‡',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1ä¸Šæž¶ 0ä¸‹æž¶',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT 'è¯„åˆ†',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int NOT NULL COMMENT '商家ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `coverImage` varchar(500) NOT NULL COMMENT '封面图',
  `reviewCount` int NOT NULL DEFAULT '0' COMMENT '评价数',
  `craftIntro` text COMMENT '工艺介绍',
  `inheritorId` int DEFAULT NULL COMMENT '传承人ID',
  `description` text COMMENT '商品详情',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,328.00,50,12,1,5.00,'2026-09-11 13:16:38','2026-09-11 13:16:38',NULL,1,1,'苗族银饰手镯','https://dummyimage.com/200x200/eee/888.png&text=yin',0,NULL,NULL,NULL),(2,68.00,200,45,1,5.00,'2026-09-11 13:16:38','2026-09-11 13:16:38',NULL,1,1,'蜡染方巾','https://dummyimage.com/200x200/eee/888.png&text=ran',0,NULL,NULL,NULL),(3,128.00,30,8,1,5.00,'2026-09-11 13:16:38','2026-09-11 13:16:38',NULL,1,2,'手工竹编果篮','https://dummyimage.com/200x200/eee/888.png&text=zhu',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `icon` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分类图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `IDX_efb46307d87701bdd660ea36f1` (`createTime`),
  KEY `IDX_0d9b50aca4adf3411e7f434d9a` (`updateTime`),
  KEY `IDX_0a0cf25cd8232a154d1cce2641` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'2026-09-11 13:21:25','2026-09-11 13:21:25',NULL,0,'织染绣品',NULL,0,1);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_favorite`
--

DROP TABLE IF EXISTS `product_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_favorite` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6dc55d8be40c8c971d6a24decc` (`createTime`),
  KEY `IDX_5dc8df6c69b4d06a92a7ae10a6` (`updateTime`),
  KEY `IDX_d102d76388b3c149a07fdb17d8` (`tenantId`),
  KEY `IDX_fe333c42575527e1e9e2978a14` (`userId`),
  KEY `IDX_69e5f6a640707ee3f5d6eab20c` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_favorite`
--

LOCK TABLES `product_favorite` WRITE;
/*!40000 ALTER TABLE `product_favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sort` int DEFAULT '0' COMMENT 'æŽ’åº',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `imageUrl` varchar(500) NOT NULL COMMENT '图片URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_review`
--

DROP TABLE IF EXISTS `product_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `orderId` int DEFAULT NULL COMMENT '订单ID',
  `rating` tinyint NOT NULL COMMENT '评分（1-5）',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评价内容',
  `images` text COLLATE utf8mb4_unicode_ci COMMENT '评价图片（JSON数组）',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-隐藏 1-显示',
  PRIMARY KEY (`id`),
  KEY `IDX_d2bf3bf7d4176c196e2f360d0c` (`createTime`),
  KEY `IDX_721035f45dde81af1280a92472` (`updateTime`),
  KEY `IDX_586e6b1273ba2732ec0ee41a80` (`tenantId`),
  KEY `IDX_db21a1dc776b455ee83eb7ff88` (`userId`),
  KEY `IDX_06e7335708b5e7870f1eaa608d` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_review`
--

LOCK TABLES `product_review` WRITE;
/*!40000 ALTER TABLE `product_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sku`
--

DROP TABLE IF EXISTS `product_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sku` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `attributes` json NOT NULL COMMENT '规格属性JSON',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'SKU价格',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'SKU库存',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `skuCode` varchar(50) DEFAULT NULL COMMENT 'SKU编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sku`
--

LOCK TABLES `product_sku` WRITE;
/*!40000 ALTER TABLE `product_sku` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_sku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query-result-cache`
--

DROP TABLE IF EXISTS `query-result-cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `query-result-cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` bigint NOT NULL,
  `duration` int NOT NULL,
  `query` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query-result-cache`
--

LOCK TABLES `query-result-cache` WRITE;
/*!40000 ALTER TABLE `query-result-cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `query-result-cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recycle_data`
--

DROP TABLE IF EXISTS `recycle_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recycle_data` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `entityInfo` json NOT NULL COMMENT '表',
  `userId` int DEFAULT NULL COMMENT '操作人',
  `data` json NOT NULL COMMENT '被删除的数据',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求的接口',
  `params` json DEFAULT NULL COMMENT '请求参数',
  `count` int NOT NULL DEFAULT '1' COMMENT '删除数据条数',
  PRIMARY KEY (`id`),
  KEY `IDX_59fc783673f4a322e9c83e0599` (`createTime`),
  KEY `IDX_c6a499c4a4fcd37f2930d27816` (`updateTime`),
  KEY `IDX_6659453338145e11d9b5103f38` (`tenantId`),
  KEY `IDX_f3ed09ba7090f3eb378cb83b5b` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recycle_data`
--

LOCK TABLES `recycle_data` WRITE;
/*!40000 ALTER TABLE `recycle_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `recycle_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT 'ä¸¾æŠ¥ç”¨æˆ·ID',
  `target_type` varchar(20) NOT NULL COMMENT 'ç›®æ ‡ç±»åž‹ï¼špost/comment/user',
  `target_id` int unsigned NOT NULL COMMENT 'ç›®æ ‡ID',
  `reason` varchar(500) NOT NULL COMMENT 'ä¸¾æŠ¥åŽŸå› ',
  `status` tinyint DEFAULT '1' COMMENT 'å¤„ç†çŠ¶æ€ï¼š1å¾…å¤„ç† 2å·²å¤„ç† 3å·²é©³å›ž',
  `handle_result` varchar(500) DEFAULT NULL COMMENT 'å¤„ç†ç»“æžœ',
  `handle_by` int unsigned DEFAULT NULL COMMENT 'å¤„ç†äººID',
  `handle_time` datetime DEFAULT NULL COMMENT 'å¤„ç†æ—¶é—´',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ä¸¾æŠ¥è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'é¤åŽ…åç§°',
  `address` varchar(200) NOT NULL COMMENT 'åœ°å€',
  `longitude` decimal(10,6) NOT NULL COMMENT 'ç»åº¦',
  `latitude` decimal(10,6) NOT NULL COMMENT 'çº¬åº¦',
  `images` json DEFAULT NULL COMMENT 'é¤åŽ…å›¾ç‰‡ï¼ˆJSONæ•°ç»„ï¼‰',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1è¥ä¸š 0å…³é—­',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `merchantId` int NOT NULL COMMENT '商家ID',
  `coverImage` varchar(500) NOT NULL COMMENT '封面图',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `businessHours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `avgPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '人均消费',
  `specialty` text COMMENT '特色菜品',
  `description` text COMMENT '餐厅介绍',
  `rating` decimal(3,1) NOT NULL DEFAULT '0.0' COMMENT '评分',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES (3,'长桌宴','乌东村广场',108.102000,26.302000,NULL,1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'https://picsum.photos/seed/r3/900/600','13800000003','11:00-21:00',84.00,'酸汤鱼、糯米饭、米豆腐','苗家长桌宴，逢节开席，敬酒歌不断。',4.7);
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL COMMENT 'è®¢å•ID',
  `product_id` int unsigned NOT NULL COMMENT 'å•†å“ID',
  `user_id` int unsigned NOT NULL COMMENT 'ç”¨æˆ·ID',
  `rating` tinyint NOT NULL COMMENT 'è¯„åˆ†ï¼š1-5æ˜Ÿ',
  `content` varchar(1000) NOT NULL COMMENT 'è¯„ä»·å†…å®¹',
  `images` json DEFAULT NULL COMMENT 'è¯„ä»·å›¾ç‰‡ï¼ˆJSONæ•°ç»„ï¼‰',
  `merchant_reply` varchar(500) DEFAULT NULL COMMENT 'å•†å®¶å›žå¤',
  `reply_time` datetime DEFAULT NULL COMMENT 'å›žå¤æ—¶é—´',
  `append_content` varchar(500) DEFAULT NULL COMMENT 'è¿½è¯„å†…å®¹',
  `append_time` datetime DEFAULT NULL COMMENT 'è¿½è¯„æ—¶é—´',
  `is_anonymous` tinyint DEFAULT '0' COMMENT 'æ˜¯å¦åŒ¿åï¼š1æ˜¯ 0å¦',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1æ­£å¸¸ 0éšè—',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='å•†å“è¯„ä»·è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'è§’è‰²åç§°',
  `code` varchar(50) NOT NULL COMMENT 'è§’è‰²ä»£ç ï¼ˆå¦‚ï¼šsuper_admin/admin/operatorï¼‰',
  `description` varchar(200) DEFAULT NULL COMMENT 'è§’è‰²æè¿°',
  `permission_ids` json DEFAULT NULL COMMENT 'æƒé™IDåˆ—è¡¨ï¼ˆJSONæ•°ç»„ï¼‰',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='è§’è‰²è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'è¶…çº§ç®¡ç†å‘˜','super_admin','æ‹¥æœ‰æ‰€æœ‰æƒé™',NULL,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(2,'å¹³å°ç®¡ç†å‘˜','platform_admin','ç®¡ç†å¹³å°å†…å®¹å’Œç”¨æˆ·',NULL,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(3,'å•†å®¶','merchant','ç®¡ç†è‡ªå®¶å•†å“å’Œè®¢å•',NULL,1,'2026-09-08 09:18:32','2026-09-08 09:18:32');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_calendar`
--

DROP TABLE IF EXISTS `room_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_calendar` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `date` date NOT NULL COMMENT '日期',
  `price` decimal(10,2) NOT NULL COMMENT '当日价格（动态定价）',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roomTypeId` int NOT NULL COMMENT '房型ID',
  `availableStock` int NOT NULL DEFAULT '0' COMMENT '当日可售间数',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态：1可订 0不可订',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_calendar_roomTypeId_date` (`roomTypeId`,`date`),
  KEY `IDX_d307a8b98b580d848758ace729` (`createTime`),
  KEY `IDX_013230ac6b4a3f2661cbef772e` (`updateTime`),
  KEY `IDX_31b563f3204e0a441fae54d065` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_calendar`
--

LOCK TABLES `room_calendar` WRITE;
/*!40000 ALTER TABLE `room_calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_type`
--

DROP TABLE IF EXISTS `room_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '房型名称',
  `area` int DEFAULT NULL COMMENT '面积(㎡)',
  `facilities` json DEFAULT NULL COMMENT '设施列表',
  `price` decimal(10,2) NOT NULL COMMENT '基础价格',
  `stock` int NOT NULL DEFAULT '1' COMMENT '房间数量',
  `images` json DEFAULT NULL COMMENT '房型图片',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `hotelId` int NOT NULL COMMENT '民宿ID',
  `bedType` varchar(50) DEFAULT NULL COMMENT '床型',
  `maxGuests` int NOT NULL DEFAULT '2' COMMENT '最多入住人数',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态：1正常 0停用',
  PRIMARY KEY (`id`),
  KEY `IDX_5b706687506b1bff566365e2a2` (`createTime`),
  KEY `IDX_21466b390609e8a1dfb792a28e` (`updateTime`),
  KEY `IDX_0be4bb95eef7c8e3648d8f21c6` (`tenantId`),
  KEY `IDX_c3ab73f6a48e49d013972a7d93` (`hotelId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_type`
--

LOCK TABLES `room_type` WRITE;
/*!40000 ALTER TABLE `room_type` DISABLE KEYS */;
INSERT INTO `room_type` VALUES (1,'木屋大床房',28,'[\"WiFi\", \"空调\"]',380.00,3,NULL,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'大床',2,1),(2,'吊脚楼双床房',32,'[\"WiFi\", \"空调\", \"江景\"]',316.00,2,NULL,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'双床',2,1),(3,'阁楼家庭房',40,'[\"WiFi\", \"空调\"]',680.00,1,NULL,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'大床+单床',4,1),(4,'星空标间',26,'[\"WiFi\", \"暖气\"]',420.00,4,NULL,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,2,'双床',2,1),(5,'经济单人间',16,'[\"WiFi\"]',120.00,5,NULL,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,3,'单床',1,1);
/*!40000 ALTER TABLE `room_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route_itinerary`
--

DROP TABLE IF EXISTS `route_itinerary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route_itinerary` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `route_id` int unsigned NOT NULL COMMENT 'è·¯çº¿ID',
  `day_number` tinyint NOT NULL COMMENT 'ç¬¬å‡ å¤©',
  `title` varchar(200) DEFAULT NULL COMMENT 'å½“æ—¥æ ‡é¢˜',
  `description` text COMMENT 'è¡Œç¨‹æè¿°',
  `scenic_spots` varchar(500) DEFAULT NULL COMMENT 'æ™¯ç‚¹åˆ—è¡¨',
  `meals` varchar(100) DEFAULT NULL COMMENT 'ç”¨é¤å®‰æŽ’ï¼ˆæ—©/ä¸­/æ™šï¼‰',
  `accommodation` varchar(200) DEFAULT NULL COMMENT 'ä½å®¿å®‰æŽ’',
  `transportation` varchar(200) DEFAULT NULL COMMENT 'äº¤é€šæ–¹å¼',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_route_id` (`route_id`),
  CONSTRAINT `fk_itinerary_route` FOREIGN KEY (`route_id`) REFERENCES `route_package` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='è·¯çº¿è¡Œç¨‹è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route_itinerary`
--

LOCK TABLES `route_itinerary` WRITE;
/*!40000 ALTER TABLE `route_itinerary` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_itinerary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route_package`
--

DROP TABLE IF EXISTS `route_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route_package` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT 'å¥—é¤æ ‡é¢˜',
  `days` tinyint NOT NULL COMMENT 'è¡Œç¨‹å¤©æ•°ï¼ˆ1/2/3å¤©ï¼‰',
  `price` decimal(10,2) NOT NULL COMMENT 'ä»·æ ¼',
  `include_items` json DEFAULT NULL COMMENT 'åŒ…å«é¡¹ç›®ï¼ˆJSONæ•°ç»„ï¼‰',
  `departure` varchar(100) DEFAULT NULL COMMENT 'å‡ºå‘åœ°',
  `destination` varchar(100) DEFAULT NULL COMMENT 'ç›®çš„åœ°',
  `accommodation_standard` varchar(200) DEFAULT NULL COMMENT 'ä½å®¿æ ‡å‡†',
  `meal_standard` varchar(200) DEFAULT NULL COMMENT 'é¤é¥®æ ‡å‡†',
  `notice` text COMMENT 'æ³¨æ„äº‹é¡¹',
  `main_image` varchar(500) DEFAULT NULL COMMENT 'ä¸»å›¾',
  `images` json DEFAULT NULL COMMENT 'å›¾ç‰‡é›†ï¼ˆJSONæ•°ç»„ï¼‰',
  `detail` text COMMENT 'è¯¦æƒ…',
  `stock` int DEFAULT '9999' COMMENT 'åº“å­˜',
  `sales` int DEFAULT '0' COMMENT 'é”€é‡',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT 'è¯„åˆ†',
  `review_count` int DEFAULT '0' COMMENT 'è¯„ä»·æ•°',
  `theme_tags` json DEFAULT NULL COMMENT 'ä¸»é¢˜æ ‡ç­¾ï¼ˆäº²å­/æ‘„å½±/ç ”å­¦/èŠ‚åº†ï¼‰',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1ä¸Šæž¶ 0ä¸‹æž¶',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_days` (`days`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='è·¯çº¿å¥—é¤è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route_package`
--

LOCK TABLES `route_package` WRITE;
/*!40000 ALTER TABLE `route_package` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scenic_spot`
--

DROP TABLE IF EXISTS `scenic_spot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scenic_spot` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'æ™¯åŒºåç§°',
  `address` varchar(200) NOT NULL COMMENT 'åœ°å€',
  `longitude` decimal(10,6) NOT NULL COMMENT 'ç»åº¦',
  `latitude` decimal(10,6) NOT NULL COMMENT 'çº¬åº¦',
  `open_time` varchar(100) DEFAULT NULL COMMENT 'å¼€æ”¾æ—¶é—´',
  `intro` text COMMENT 'æ™¯åŒºä»‹ç»',
  `main_image` varchar(500) DEFAULT NULL COMMENT 'ä¸»å›¾',
  `images` json DEFAULT NULL COMMENT 'å›¾ç‰‡é›†ï¼ˆJSONæ•°ç»„ï¼‰',
  `rating` decimal(3,2) DEFAULT '5.00' COMMENT 'è¯„åˆ†',
  `review_count` int DEFAULT '0' COMMENT 'è¯„ä»·æ•°',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1å¼€æ”¾ 0å…³é—­',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_location` (`longitude`,`latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='æ™¯åŒºè¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scenic_spot`
--

LOCK TABLES `scenic_spot` WRITE;
/*!40000 ALTER TABLE `scenic_spot` DISABLE KEYS */;
/*!40000 ALTER TABLE `scenic_spot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensitive_word`
--

DROP TABLE IF EXISTS `sensitive_word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensitive_word` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `word` varchar(50) NOT NULL COMMENT '敏感词',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4769a287fc92eb7f26a1f593ef` (`word`),
  KEY `IDX_fbe2f72a0e61b8c7d3fc986609` (`createTime`),
  KEY `IDX_5f11f6fc622273f275fbb80d74` (`updateTime`),
  KEY `IDX_69390b9fdd4636f84ed30d4db6` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensitive_word`
--

LOCK TABLES `sensitive_word` WRITE;
/*!40000 ALTER TABLE `sensitive_word` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensitive_word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_info`
--

DROP TABLE IF EXISTS `space_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型',
  `classifyId` int DEFAULT NULL COMMENT '分类ID',
  `fileId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件id',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件名',
  `size` int NOT NULL COMMENT '文件大小',
  `version` int NOT NULL DEFAULT '1' COMMENT '文档版本',
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件位置',
  PRIMARY KEY (`id`),
  KEY `IDX_eb1da2f304c760846b5add09b3` (`createTime`),
  KEY `IDX_d7a2539961e9aacba8b353f3c9` (`updateTime`),
  KEY `IDX_6001c5ed2088b893c0d69bb244` (`tenantId`),
  KEY `IDX_0975633032bfe6574468b3a4ae` (`fileId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_info`
--

LOCK TABLES `space_info` WRITE;
/*!40000 ALTER TABLE `space_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `space_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_type`
--

DROP TABLE IF EXISTS `space_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类别名称',
  `parentId` int DEFAULT NULL COMMENT '父分类ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6669449501d275f367ca295472` (`createTime`),
  KEY `IDX_0749b509b68488caecd4cc2bbc` (`updateTime`),
  KEY `IDX_5e7f846b8cdabbceba95ed3314` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_type`
--

LOCK TABLES `space_type` WRITE;
/*!40000 ALTER TABLE `space_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `space_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_message`
--

DROP TABLE IF EXISTS `system_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_message` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(200) NOT NULL COMMENT '消息标题',
  `content` text NOT NULL COMMENT '消息内容',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '用户ID（NULL表示全员消息）',
  `linkType` varchar(20) DEFAULT NULL COMMENT '跳转类型',
  `linkValue` varchar(500) DEFAULT NULL COMMENT '跳转地址',
  `isRead` int NOT NULL DEFAULT '0' COMMENT '是否已读 0未读 1已读',
  `type` varchar(255) NOT NULL DEFAULT 'system' COMMENT '消息类型 order/system/activity/interact',
  PRIMARY KEY (`id`),
  KEY `IDX_4f09822cb456a6fcf0279ce493` (`createTime`),
  KEY `IDX_c9d35f460f6ee6d6bc9279cc12` (`updateTime`),
  KEY `IDX_96169d04a9720c165547b48ee4` (`tenantId`),
  KEY `IDX_f4192b31a3733c3b90ce9dfad9` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_message`
--

LOCK TABLES `system_message` WRITE;
/*!40000 ALTER TABLE `system_message` DISABLE KEYS */;
INSERT INTO `system_message` VALUES (1,'支付成功','订单 202609101747400171087 支付成功','2026-09-10 17:47:40','2026-09-10 17:47:40',NULL,14,NULL,NULL,0,'order'),(2,'支付成功','订单 202609111005086549164 支付成功','2026-09-11 10:05:08','2026-09-11 10:05:08',NULL,26,NULL,NULL,0,'order'),(3,'支付成功','订单 202609111640283992767 支付成功','2026-09-11 16:41:32','2026-09-11 16:41:32',NULL,34,NULL,NULL,0,'order'),(4,'支付成功','订单 202609111645370575215 支付成功','2026-09-11 16:45:37','2026-09-11 16:45:37',NULL,34,NULL,NULL,0,'order'),(5,'支付成功','订单 202609111733386745621 支付成功','2026-09-11 17:33:39','2026-09-11 17:33:39',NULL,38,NULL,NULL,0,'order'),(6,'支付成功','订单 202609111759322788213 支付成功','2026-09-11 17:59:32','2026-09-11 17:59:32',NULL,38,NULL,NULL,0,'order');
/*!40000 ALTER TABLE `system_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_info`
--

DROP TABLE IF EXISTS `task_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `jobId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务ID',
  `repeatConf` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务配置',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `cron` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'cron',
  `limit` int DEFAULT NULL COMMENT '最大执行次数 不传为无限次',
  `every` int DEFAULT NULL COMMENT '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-停止 1-运行',
  `startDate` datetime DEFAULT NULL COMMENT '开始时间',
  `endDate` datetime DEFAULT NULL COMMENT '结束时间',
  `data` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '数据',
  `service` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '执行的service实例ID',
  `type` int NOT NULL DEFAULT '0' COMMENT '状态 0-系统 1-用户',
  `nextRunTime` datetime DEFAULT NULL COMMENT '下一次执行时间',
  `taskType` int NOT NULL DEFAULT '0' COMMENT '状态 0-cron 1-时间间隔',
  `lastExecuteTime` datetime DEFAULT NULL,
  `lockExpireTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6ced02f467e59bd6306b549bb0` (`createTime`),
  KEY `IDX_2adc6f9c241391126f27dac145` (`updateTime`),
  KEY `IDX_11b991dc4a7a5585c636008d3a` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_info`
--

LOCK TABLES `task_info` WRITE;
/*!40000 ALTER TABLE `task_info` DISABLE KEYS */;
INSERT INTO `task_info` VALUES (1,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,NULL,'每秒执行一次',NULL,NULL,1000,NULL,0,NULL,NULL,NULL,'taskDemoService.test(1,2)',1,NULL,1,NULL,NULL),(2,'2026-09-08 17:21:58','2026-09-08 17:21:58',NULL,NULL,NULL,'cron任务，5秒执行一次','0/5 * * * * * ',NULL,NULL,NULL,0,NULL,NULL,NULL,'taskDemoService.test()',1,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `task_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_log`
--

DROP TABLE IF EXISTS `task_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `taskId` int DEFAULT NULL COMMENT '任务ID',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-失败 1-成功',
  `detail` text COLLATE utf8mb4_unicode_ci COMMENT '详情描述',
  PRIMARY KEY (`id`),
  KEY `IDX_b9af0e100be034924b270aab31` (`createTime`),
  KEY `IDX_8857d8d43d38bebd7159af1fa6` (`updateTime`),
  KEY `IDX_fa4cb94036d961600c0f22ed91` (`tenantId`),
  KEY `IDX_1142dfec452e924b346f060fda` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_log`
--

LOCK TABLES `task_log` WRITE;
/*!40000 ALTER TABLE `task_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_type`
--

DROP TABLE IF EXISTS `ticket_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_type` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `scenic_spot_id` int unsigned NOT NULL COMMENT 'æ™¯åŒºID',
  `name` varchar(100) NOT NULL COMMENT 'ç¥¨ç§åç§°ï¼ˆæˆäººç¥¨/å„¿ç«¥ç¥¨/å­¦ç”Ÿç¥¨/å®¶åº­å¥—ç¥¨ï¼‰',
  `price` decimal(10,2) NOT NULL COMMENT 'ä»·æ ¼',
  `stock` int DEFAULT '9999' COMMENT 'åº“å­˜ï¼ˆ-1è¡¨ç¤ºä¸é™é‡ï¼‰',
  `valid_days` int DEFAULT '1' COMMENT 'æœ‰æ•ˆå¤©æ•°',
  `intro` varchar(500) DEFAULT NULL COMMENT 'ç¥¨ç§è¯´æ˜Ž',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1åœ¨å”® 0åœå”®',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_scenic_spot_id` (`scenic_spot_id`),
  CONSTRAINT `fk_ticket_scenic` FOREIGN KEY (`scenic_spot_id`) REFERENCES `scenic_spot` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='ç¥¨ç§è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_type`
--

LOCK TABLES `ticket_type` WRITE;
/*!40000 ALTER TABLE `ticket_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_slot`
--

DROP TABLE IF EXISTS `time_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slot` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1å¯ç”¨ 0ç¦ç”¨',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `date` date NOT NULL COMMENT '日期',
  `timePeriod` varchar(20) NOT NULL COMMENT '时段',
  `startTime` varchar(10) NOT NULL COMMENT '开始时间',
  `endTime` varchar(10) NOT NULL COMMENT '结束时间',
  `maxReservations` int NOT NULL DEFAULT '10' COMMENT '最大预订数',
  `currentReservations` int NOT NULL DEFAULT '0' COMMENT '当前预订数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_slot`
--

LOCK TABLES `time_slot` WRITE;
/*!40000 ALTER TABLE `time_slot` DISABLE KEYS */;
INSERT INTO `time_slot` VALUES (301,1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,3,'2026-10-01','午市 11:00-13:00','11:00','13:00',20,0),(302,1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,3,'2026-10-01','晚市 17:00-20:00','17:00','20:00',20,0);
/*!40000 ALTER TABLE `time_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'è¯é¢˜åç§°ï¼ˆå¦‚ï¼š#è‹—å¯¨é£Žå…‰#ï¼‰',
  `intro` varchar(500) DEFAULT NULL COMMENT 'è¯é¢˜ç®€ä»‹',
  `cover_image` varchar(500) DEFAULT NULL COMMENT 'å°é¢å›¾',
  `follow_count` int DEFAULT '0' COMMENT 'å…³æ³¨æ•°',
  `post_count` int DEFAULT '0' COMMENT 'æ¸¸è®°æ•°',
  `is_hot` tinyint DEFAULT '0' COMMENT 'æ˜¯å¦çƒ­é—¨ï¼š1æ˜¯ 0å¦',
  `is_recommended` tinyint DEFAULT '0' COMMENT 'æ˜¯å¦æŽ¨èï¼š1æ˜¯ 0å¦',
  `sort` int DEFAULT '0' COMMENT 'æŽ’åº',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='è¯é¢˜è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,'#è‹—å¯¨é£Žå…‰#','åˆ†äº«è‹—å¯¨ç¾Žæ™¯',NULL,0,0,1,0,0,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(2,'#ç¾Žé£Ÿæ‰“å¡#','å‘çŽ°åœ°é“ç¾Žé£Ÿ',NULL,0,0,1,0,0,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(3,'#éžé—æ–‡åŒ–#','ä¼ æ‰¿éžé—æŠ€è‰º',NULL,0,0,1,0,0,1,'2026-09-08 09:18:32','2026-09-08 09:18:32'),(4,'#æ°‘å®¿ä½“éªŒ#','ç‰¹è‰²ä½å®¿åˆ†äº«',NULL,0,0,0,0,0,1,'2026-09-08 09:18:32','2026-09-08 09:18:32');
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traffic_guide`
--

DROP TABLE IF EXISTS `traffic_guide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traffic_guide` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT 'æ”»ç•¥æ ‡é¢˜',
  `departure` varchar(100) NOT NULL COMMENT 'å‡ºå‘åœ°',
  `destination` varchar(100) NOT NULL COMMENT 'ç›®çš„åœ°',
  `transport_mode` varchar(50) NOT NULL COMMENT 'äº¤é€šæ–¹å¼ï¼ˆé£žæœº/é«˜é“/æ±½è½¦/è‡ªé©¾ï¼‰',
  `duration` varchar(50) DEFAULT NULL COMMENT 'æ—¶é•¿',
  `cost` varchar(100) DEFAULT NULL COMMENT 'è´¹ç”¨',
  `description` text COMMENT 'è¯¦ç»†è¯´æ˜Ž',
  `images` json DEFAULT NULL COMMENT 'æ”»ç•¥å›¾ç‰‡ï¼ˆJSONæ•°ç»„ï¼‰',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_departure` (`departure`),
  KEY `idx_destination` (`destination`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='äº¤é€šæ”»ç•¥è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traffic_guide`
--

LOCK TABLES `traffic_guide` WRITE;
/*!40000 ALTER TABLE `traffic_guide` DISABLE KEYS */;
/*!40000 ALTER TABLE `traffic_guide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_e_ticket`
--

DROP TABLE IF EXISTS `travel_e_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_e_ticket` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int DEFAULT NULL COMMENT '订单ID',
  `orderNo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `userId` int NOT NULL COMMENT '用户ID',
  `itemType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目类型 ticket/route',
  `itemId` int NOT NULL COMMENT '项目ID',
  `useDate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用日期',
  `qrCode` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '核销码',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unused' COMMENT '状态 unused未使用 used已核销 refunded已退款',
  `verifyTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '核销时间',
  `verifyAdminId` int DEFAULT NULL COMMENT '核销管理员ID',
  PRIMARY KEY (`id`),
  KEY `IDX_bc5e19810feb0a4d8b73d161e0` (`createTime`),
  KEY `IDX_4d7f77183a7552095605573044` (`updateTime`),
  KEY `IDX_274db85ad3ea68c5933ed93203` (`tenantId`),
  KEY `IDX_8ea074519479871acec229e8ce` (`orderNo`),
  KEY `IDX_a8585a180594e4af7ff793c727` (`userId`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_e_ticket`
--

LOCK TABLES `travel_e_ticket` WRITE;
/*!40000 ALTER TABLE `travel_e_ticket` DISABLE KEYS */;
INSERT INTO `travel_e_ticket` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260901-0001',42,'route',1,'2026-09-01','TK20260901-0001-01','used','2026-09-11 18:18:07',NULL),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260913-0003',42,'route',1,'2026-09-13','TK20260913-0003-01','unused',NULL,NULL),(3,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260901-0002',42,'ticket',11,'2026-09-01','TK20260901-0002-01','used','2026-09-11 18:18:07',NULL),(4,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260902-0004',43,'route',1,'2026-09-02','TK20260902-0004-01','used','2026-09-11 18:18:07',NULL),(5,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260903-0005',44,'route',2,'2026-09-03','TK20260903-0005-01','used','2026-09-11 18:18:07',NULL),(6,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'WD20260820-0006',43,'ticket',13,'2026-08-20','TK20260820-0006-01','refunded',NULL,NULL);
/*!40000 ALTER TABLE `travel_e_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_inventory`
--

DROP TABLE IF EXISTS `travel_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_inventory` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `itemType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目类型 ticket/route',
  `itemId` int NOT NULL COMMENT '项目ID',
  `useDate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用日期',
  `total` int NOT NULL DEFAULT '0' COMMENT '总库存',
  `sold` int NOT NULL DEFAULT '0' COMMENT '已售',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_adf406929e3855597a656deab0` (`itemType`,`itemId`,`useDate`),
  KEY `IDX_95d8929075db9b393135db2816` (`createTime`),
  KEY `IDX_d6a34b4058f892f43eec676224` (`updateTime`),
  KEY `IDX_16c3ea69b98192c81f5416f4dd` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_inventory`
--

LOCK TABLES `travel_inventory` WRITE;
/*!40000 ALTER TABLE `travel_inventory` DISABLE KEYS */;
INSERT INTO `travel_inventory` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',1,'2026-09-12',30,7),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',1,'2026-09-13',30,22),(3,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',1,'2026-09-14',30,30),(4,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',2,'2026-09-12',20,3),(5,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',2,'2026-09-13',20,12),(6,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',3,'2026-09-12',12,0),(7,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',3,'2026-09-13',12,1),(8,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'ticket',11,'2026-09-12',200,45),(9,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'ticket',13,'2026-09-12',300,120),(10,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'route',2,'2026-10-01',20,3);
/*!40000 ALTER TABLE `travel_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_recommend_slot`
--

DROP TABLE IF EXISTS `travel_recommend_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_recommend_slot` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `position` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'home' COMMENT '位置 home焦点轮播等',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `subtitle` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '副标题',
  `badge` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角标',
  `itemType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目类型 route/scenic/post',
  `itemId` int NOT NULL COMMENT '项目ID',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `rotationGroup` int NOT NULL DEFAULT '1' COMMENT '轮播分组',
  `intervalSeconds` int NOT NULL DEFAULT '5' COMMENT '轮播间隔秒',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  PRIMARY KEY (`id`),
  KEY `IDX_ecc5a4926203c1629e80965218` (`createTime`),
  KEY `IDX_6327843d3a9ef22004b5c1c8cc` (`updateTime`),
  KEY `IDX_41cb4276c4635c7062ddf6c4db` (`tenantId`),
  KEY `IDX_648f236425fb9da0ff1d80e5db` (`position`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=704 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_recommend_slot`
--

LOCK TABLES `travel_recommend_slot` WRITE;
/*!40000 ALTER TABLE `travel_recommend_slot` DISABLE KEYS */;
INSERT INTO `travel_recommend_slot` VALUES (701,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'home','苗寨深度两日游 · 邂逅梯田日出','¥899 起 · 已售 1,284 · 平均点亮 4/5 站','🔥 运营置顶 · 本周精选','route',1,1,1,5,1),(702,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'home','晨雾梯田摄影一日游','¥299 起 · 本周 +89 人成行','📷 摄影主题 · 热度上升','route',2,2,1,5,1),(703,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'home','芦笙广场 · 节庆进行时','成人票 ¥40 · 家庭套票 ¥100','👪 亲子优选 · 好评率 98%','scenic',6,3,1,5,1);
/*!40000 ALTER TABLE `travel_recommend_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_review`
--

DROP TABLE IF EXISTS `travel_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int DEFAULT NULL COMMENT '订单ID',
  `targetType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评价目标类型 scenic/route',
  `targetId` int NOT NULL COMMENT '评价目标ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` int NOT NULL DEFAULT '5' COMMENT '评分 1-5',
  `content` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '内容',
  `images` json DEFAULT NULL COMMENT '图片（JSON数组）',
  `merchantReply` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '商家回复',
  `replyTime` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '回复时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1显示 0隐藏',
  PRIMARY KEY (`id`),
  KEY `IDX_3717c790633656eb63d6b60264` (`createTime`),
  KEY `IDX_caf20e996d7c18e198115f674e` (`updateTime`),
  KEY `IDX_bf6fa4fe186bc46fd999552914` (`tenantId`),
  KEY `IDX_cd3c900c41959a24e1ac7c2114` (`targetType`,`targetId`)
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_review`
--

LOCK TABLES `travel_review` WRITE;
/*!40000 ALTER TABLE `travel_review` DISABLE KEYS */;
INSERT INTO `travel_review` VALUES (401,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'route',1,45,5,'长桌宴的酸汤鱼绝了，导游很会讲苗族故事。',NULL,NULL,NULL,1),(402,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'route',1,43,5,'带孩子体验银饰锻造，值回票价。',NULL,NULL,NULL,1),(403,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,NULL,'scenic',1,44,5,'晨雾六点十分准时从谷底漫上来，机位在东侧亭子。',NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `travel_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_route_itinerary`
--

DROP TABLE IF EXISTS `travel_route_itinerary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_route_itinerary` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `routeId` int NOT NULL COMMENT '路线ID',
  `dayNo` int NOT NULL DEFAULT '1' COMMENT '第几天',
  `sort` int NOT NULL DEFAULT '1' COMMENT '当天顺序',
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '行程描述',
  `scenicSpotId` int NOT NULL COMMENT '景区ID（站点）',
  `meal` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '餐饮安排',
  `stay` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '住宿安排',
  `transport` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '交通方式',
  PRIMARY KEY (`id`),
  KEY `IDX_2a416b7f70a1e07df61d872abe` (`createTime`),
  KEY `IDX_78bea54ab96e29e479aef7dcb6` (`updateTime`),
  KEY `IDX_3de9b27afad7035f3a8849174c` (`tenantId`),
  KEY `IDX_b9d8aecf9642a0ffcd1fb48ed1` (`routeId`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_route_itinerary`
--

LOCK TABLES `travel_route_itinerary` WRITE;
/*!40000 ALTER TABLE `travel_route_itinerary` DISABLE KEYS */;
INSERT INTO `travel_route_itinerary` VALUES (101,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,1,1,'梯田日出观景',1,NULL,NULL,NULL),(102,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,1,2,'长桌宴午餐',3,NULL,NULL,NULL),(103,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,1,3,'入住吊脚楼',4,NULL,NULL,NULL),(104,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,2,1,'银饰锻造体验',2,NULL,NULL,NULL),(105,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,2,2,'芦笙舞广场',6,NULL,NULL,NULL),(106,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,2,1,1,'晨雾拍摄',1,NULL,NULL,NULL),(107,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,2,1,2,'工坊人文扫街',2,NULL,NULL,NULL),(108,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,3,1,1,'蜡染手作体验',5,NULL,NULL,NULL);
/*!40000 ALTER TABLE `travel_route_itinerary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_route_package`
--

DROP TABLE IF EXISTS `travel_route_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_route_package` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `days` int NOT NULL DEFAULT '1' COMMENT '天数',
  `theme` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主题 亲子/摄影/研学/节庆/经典',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `includes` json DEFAULT NULL COMMENT '包含项目（JSON数组）',
  `departure` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '出发地',
  `destination` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的地',
  `hotelStandard` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '住宿标准',
  `mealStandard` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '餐饮标准',
  `notice` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '预订须知',
  `mainImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主图',
  `detail` text COLLATE utf8mb4_unicode_ci COMMENT '富文本详情',
  `sales` int NOT NULL DEFAULT '0' COMMENT '已售',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1上架 0下架',
  PRIMARY KEY (`id`),
  KEY `IDX_11793b7b2611ab36656e571882` (`createTime`),
  KEY `IDX_9dd599c68ca3c9acf70d437be1` (`updateTime`),
  KEY `IDX_44371909679014a2cc76be1f09` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_route_package`
--

LOCK TABLES `travel_route_package` WRITE;
/*!40000 ALTER TABLE `travel_route_package` DISABLE KEYS */;
INSERT INTO `travel_route_package` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'苗寨深度两日游',2,'经典',899.00,'[\"门票\", \"长桌宴\", \"民宿一晚\", \"导游\"]','凯里南站','乌东村','吊脚楼特色民宿','长桌宴 + 苗家早餐','使用日期前24小时可退（扣10%手续费）；最少提前1天预订','ph1',NULL,1284,1),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'晨雾梯田摄影一日游',1,'摄影',299.00,'[\"门票\", \"跟拍摄影点\"]','凯里南站','乌东村','无住宿','苗家午餐','含早出发，请自备保暖','ph2',NULL,487,1),(3,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'蜡染体验半日游',1,'体验',199.00,'[\"门票\", \"蜡染手作材料\", \"匠人指导\"]','乌东村口','蜡染坊','无住宿','不含餐','上新路线，成团即行；成品当日带走','ph3',NULL,0,1);
/*!40000 ALTER TABLE `travel_route_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_scenic_spot`
--

DROP TABLE IF EXISTS `travel_scenic_spot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_scenic_spot` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'spot' COMMENT '类型 spot景点 dining餐饮 stay住宿 experience体验',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '地址',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `openTime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '开放时间',
  `intro` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '简介',
  `mainImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主图',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  PRIMARY KEY (`id`),
  KEY `IDX_28e3dbfefcc5a1e00e3375578a` (`createTime`),
  KEY `IDX_edecff2c9a1b14b18421398df7` (`updateTime`),
  KEY `IDX_670e2519729735be149db050fc` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_scenic_spot`
--

LOCK TABLES `travel_scenic_spot` WRITE;
/*!40000 ALTER TABLE `travel_scenic_spot` DISABLE KEYS */;
INSERT INTO `travel_scenic_spot` VALUES (1,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'乌东梯田','spot','乌东村东岭',NULL,NULL,'全天','晨雾六点十分从谷底漫上来','ph1',1),(2,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'银饰工坊','experience','乌东村中街',NULL,NULL,'9:00-17:00','非遗银饰锻造体验','ph2',1),(3,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'长桌宴','dining','乌东村广场',NULL,NULL,'11:00-21:00','苗家长桌宴 酸汤鱼','ph3',1),(4,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'吊脚楼民宿','stay','乌东村北巷',NULL,NULL,'全天','特色吊脚楼住宿','ph4',1),(5,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'蜡染坊','experience','乌东村南巷',NULL,NULL,'9:00-17:00','蜡染手作体验','ph5',1),(6,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'芦笙广场','spot','乌东村中心',NULL,NULL,'全天','节庆芦笙舞主场','ph6',1);
/*!40000 ALTER TABLE `travel_scenic_spot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_ticket_type`
--

DROP TABLE IF EXISTS `travel_ticket_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_ticket_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `scenicSpotId` int NOT NULL COMMENT '景区ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票种名称',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '票价',
  `totalStock` int NOT NULL DEFAULT '0' COMMENT '总库存',
  `validityRule` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '有效期规则',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1在售 0下架',
  PRIMARY KEY (`id`),
  KEY `IDX_431ad19ebce97268de1a3278e8` (`createTime`),
  KEY `IDX_14a8536e61035563f0f16bd1d6` (`updateTime`),
  KEY `IDX_59a5648e489dfd8aa09ddc7d12` (`tenantId`),
  KEY `IDX_df44702660efb80b7559b1232b` (`scenicSpotId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_ticket_type`
--

LOCK TABLES `travel_ticket_type` WRITE;
/*!40000 ALTER TABLE `travel_ticket_type` DISABLE KEYS */;
INSERT INTO `travel_ticket_type` VALUES (11,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'成人票',40.00,200,'当日有效',1),(12,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,2,'体验票',60.00,50,'预约日有效',1),(13,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,1,'家庭套票',100.00,300,'当日有效',1);
/*!40000 ALTER TABLE `travel_ticket_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_traffic_guide`
--

DROP TABLE IF EXISTS `travel_traffic_guide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_traffic_guide` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `departure` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '出发地',
  `destination` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的地',
  `transportType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '交通方式',
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '耗时',
  `cost` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '费用',
  `detail` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详情',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图片',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  PRIMARY KEY (`id`),
  KEY `IDX_d1330dac9930ee3102bbc2c027` (`createTime`),
  KEY `IDX_9438c0cc777431dfe3fd658a88` (`updateTime`),
  KEY `IDX_8e6d776b67d6dc61a291fe93e9` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_traffic_guide`
--

LOCK TABLES `travel_traffic_guide` WRITE;
/*!40000 ALTER TABLE `travel_traffic_guide` DISABLE KEYS */;
INSERT INTO `travel_traffic_guide` VALUES (301,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'贵阳→乌东','贵阳北','乌东村','高铁+班车','约2.5小时',180.00,'贵阳北→凯里南高铁约1.5小时，凯里客车站班车1小时直达乌东村口。',NULL,1,1),(302,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'凯里→乌东','凯里','乌东村','班车直达','约1小时',35.00,'凯里客车站每日 8:00/13:00 两班直达乌东。',NULL,2,1),(303,'2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,'广州→乌东','广州南','乌东村','高铁+包车','约5.5小时',480.00,'广州南→凯里南约4小时，出站包车1.5小时进村。',NULL,3,1);
/*!40000 ALTER TABLE `travel_traffic_guide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ç”¨æˆ·ID',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'æ‰‹æœºå·',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'å¯†ç ï¼ˆbcryptåŠ å¯†ï¼‰',
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'æ¸¸å®¢' COMMENT 'æ˜µç§°',
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'å¤´åƒURL',
  `gender` tinyint DEFAULT '0' COMMENT 'æ€§åˆ«ï¼š0æœªçŸ¥ 1ç”· 2å¥³',
  `birthday` date DEFAULT NULL COMMENT 'ç”Ÿæ—¥',
  `region` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'åœ°åŒº',
  `bio` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ä¸ªäººç®€ä»‹',
  `role` tinyint DEFAULT '1' COMMENT 'è§’è‰²ï¼š1æ¸¸å®¢ 2å•†å®¶ 3ç®¡ç†å‘˜',
  `status` tinyint DEFAULT '1' COMMENT 'çŠ¶æ€ï¼š1æ­£å¸¸ 0ç¦ç”¨',
  `last_login_at` datetime DEFAULT NULL COMMENT 'æœ€åŽç™»å½•æ—¶é—´',
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'æœ€åŽç™»å½•IP',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'åˆ›å»ºæ—¶é—´',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'æ›´æ–°æ—¶é—´',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `idx_phone` (`phone`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ç”¨æˆ·è¡¨';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `phone` varchar(11) NOT NULL COMMENT '手机号',
  `createTime` varchar(255) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `contact` varchar(255) NOT NULL COMMENT '联系人',
  `isDefault` tinyint NOT NULL DEFAULT '0' COMMENT '是否默认',
  `province` varchar(255) NOT NULL COMMENT '省',
  `city` varchar(255) NOT NULL COMMENT '市',
  `district` varchar(255) NOT NULL COMMENT '区',
  `address` varchar(255) NOT NULL COMMENT '地址',
  PRIMARY KEY (`id`),
  KEY `IDX_144621f4f7bf21e72ed6972d85` (`createTime`),
  KEY `IDX_de647797f6286697bfe9527955` (`updateTime`),
  KEY `IDX_d93103979d4be73c3192163996` (`tenantId`),
  KEY `IDX_1abd8badc4a127b0f357d9ecbc` (`userId`),
  KEY `IDX_905be3a22a4dfda68da8e4200a` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (2,'13800000001','2026-09-11 17:04:54','2026-09-11 17:04:54',NULL,38,'山野小鱼',1,'贵州省','黔东南苗族侗族自治州','雷山县','乌东村一组吊脚楼'),(3,'13800000001','2026-09-11 17:04:54','2026-09-11 17:04:54',NULL,38,'山野小鱼',0,'贵州省','黔东南苗族侗族自治州','雷山县','贵阳北站东广场'),(4,'13800000003','2026-09-11 17:05:44','2026-09-11 17:05:44',NULL,38,'快门手',0,'贵州省','黔东南州','凯里市','苗寨风情园 12 号'),(5,'13800000001','2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,42,'山野小鱼',1,'贵州省','黔东南苗族侗族自治州','雷山县','乌东村一组吊脚楼'),(6,'13800000001','2026-09-11 18:18:07','2026-09-11 18:18:07',NULL,42,'山野小鱼',0,'贵州省','贵阳市','观山湖区','贵阳北站东广场');
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorite`
--

DROP TABLE IF EXISTS `user_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorite` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标类型',
  `targetId` int NOT NULL COMMENT '目标ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`userId`,`targetType`,`targetId`),
  KEY `IDX_256ea52d00cd1266861cf76462` (`createTime`),
  KEY `IDX_30bc0999482f4155cc164e30d9` (`updateTime`),
  KEY `IDX_df2d4ed5767ab49ef1bcc12713` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorite`
--

LOCK TABLES `user_favorite` WRITE;
/*!40000 ALTER TABLE `user_favorite` DISABLE KEYS */;
INSERT INTO `user_favorite` VALUES (1,'2026-09-09 18:48:58','2026-09-09 18:48:58',NULL,1,'scenic',1);
/*!40000 ALTER TABLE `user_favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录唯一ID',
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `loginType` int NOT NULL DEFAULT '0' COMMENT '登录方式',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '介绍',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6edeceee578056a2c1e493563a` (`unionid`),
  UNIQUE KEY `IDX_9234e7bac72991a93b172618e2` (`phone`),
  KEY `IDX_e6386e92c288d85dbc43ac53f7` (`createTime`),
  KEY `IDX_5271afbb87138d688b6220b589` (`updateTime`),
  KEY `IDX_7c8ea8d68808b77734df54ce32` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_wx`
--

DROP TABLE IF EXISTS `user_wx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_wx` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信unionid',
  `openid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '微信openid',
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别 0-未知 1-男 2-女',
  `language` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '语言',
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市',
  `province` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '省份',
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-小程序 1-公众号 2-H5 3-APP',
  PRIMARY KEY (`id`),
  KEY `IDX_e23b473abf5a6b00e44f3fd842` (`createTime`),
  KEY `IDX_049adb91204e94c1ede5e6dd23` (`updateTime`),
  KEY `IDX_f39f7e2dd63c906fcee61c50ad` (`tenantId`),
  KEY `IDX_d22b5fa040a01ec1b09e1e181e` (`unionid`),
  KEY `IDX_7946849febadd93cf81fc2b53f` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_wx`
--

LOCK TABLES `user_wx` WRITE;
/*!40000 ALTER TABLE `user_wx` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_wx` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11 18:18:33
