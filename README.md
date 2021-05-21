# NEWS

### copy code below then run code in your phpMyAdmin

``` sql
create table posts(
    id varchar(40) not null primary key,
    category_id varchar(40) not null,
    title varchar(100) not null,
    url varchar(120) not null,
    description varchar(150) not null,
    image varchar(200) not null,
    content text not null,
    user_id varchar(40) not null, 
    activated varchar(5) not null,
    view int(8) not null,
    dateCreated varchar(13)
);

create table categories(
    id varchar(40) not null primary key,
    name varchar(50) not null,
    url varchar(60) not null,
    color varchar(10) not null,
    dateCreated varchar(13)
);

create table users(
    id varchar(40) not null primary key,
    username varchar(40) not null,
    fullName varchar(50) not null,
    password varchar(40) not null,
    manager_id varchar(40)not null,
    permission int(1) not null,
    avatar varchar(200) not null,
    position varchar(10) not null,
    dateCreated varchar(13)
);

create table reports(
    id varchar(40) not null primary key,
    post_id varchar(40) not null,
    title varchar(100) not null,
    email varchar(100) not null,
    content text not null,
    dateCreated varchar(13)
);

create table messages(
    id varchar(40) not null primary key,
    receive_id varchar(40) not null,
    sender_id varchar(40) not null,
    content text,
    image varchar(200),
    dateCreated varchar(13)
);

create table comments (
    id varchar(40) not null primary key,
    post_id varchar(40) not null,
    user_id varchar(40) not null,
    reaction INT(5) not null,         
    reply_id_comment varchar(40) not null, 
    position INT(1) not null,         
    amount_child_comment Int(5) not null,  
    content text,
    dateCreated varchar(13)
);

create table statistics (
    id varchar(40) not null primary key,
    post_id varchar(40) not null,
    view INT(8),
    dateCreated varchar(13)
);

CREATE VIEW `total_posts` AS select COUNT(id) as 'sum' from posts;
CREATE VIEW `top_categories` AS SELECT categories.id, categories.color, categories.name, categories.url, COUNT(posts.id) as total_posts FROM posts INNER JOIN categories ON categories.id = posts.category_id GROUP BY categories.name ORDER BY total_posts DESC;
CREATE VIEW `top_view_categories` AS SELECT categories.id, SUM(posts.view) as total_views FROM posts INNER JOIN categories ON categories.id = posts.category_id GROUP BY categories.name ORDER BY total_views DESC limit 0,2;

ALTER TABLE posts ADD FOREIGN KEY (category_id) REFERENCES categories (id);
ALTER TABLE posts ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE reports ADD FOREIGN KEY (post_id) REFERENCES posts (id);

ALTER TABLE statistics ADD FOREIGN KEY (post_id) REFERENCES posts (id);
ALTER TABLE comments ADD FOREIGN KEY (post_id) REFERENCES posts (id);
ALTER TABLE comments ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE messages ADD FOREIGN KEY (receive_id) REFERENCES users (id);
ALTER TABLE messages ADD FOREIGN KEY (sender_id) REFERENCES users (id);
```
