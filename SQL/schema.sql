CREATE DATABASE chat;

USE chat;

CREATE TABLE Messages (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(20),
  message varchar(255),
  roomname varchar(20),
  created_at TIMESTAMP default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);