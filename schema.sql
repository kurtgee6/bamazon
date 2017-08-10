drop database if exists bamazon_db;
create database bamazon_db;

use bamazon_db;

create table products (
	item_id integer(50) auto_increment not null, 
    product_name varchar(80) not null, 
    department_name varchar(80) not null, 
    price integer(50) not null, 
    stock_quantity integer(50) not null,
    primary key (item_id)
);

select * from products;

