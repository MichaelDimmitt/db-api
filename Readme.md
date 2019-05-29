## db-api (setup for a postgres db on aws RDS

## Setup Information
```bash
git clone &&
cd &&
npm install &&
npm start;
```

## Create the config file from the config example
```bash
cp .example.config.js config.js
```

## Relavent psql commands:
```psql
CREATE database project1;
\c project1;

DELETE from users;

CREATE TABLE users(
firstName text,
lastName text,
npiNumber text,
businessAddress text,
telephoneNumber text,
emailAddress text
);

INSERT INTO users VALUES ('michael', 'dimmitt', '82138','2312 baymeadows way, jacksonville, fl','9022006567','michaelgdimmitt@gmail.com');
```

## Relavent mongo commands:
use project1
db.createCollection("users")


## Deploy express with mongo to Ec2:
https://www.youtube.com/watch?v=fIeIzHMC4BQ
https://medium.com/@rksmith369/how-to-deploy-mern-stack-app-on-aws-ec2-with-ssl-nginx-the-right-way-e76c1a8cd6c6

cd /var/www
pm2 start express.js
