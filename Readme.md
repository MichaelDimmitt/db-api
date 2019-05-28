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


