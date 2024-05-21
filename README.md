# PolyChat

This is a chat app ~~that automatically translates messages in your language~~, where people can send each other direct messages, or text in group chats

## Local set-up

- First you need to clone this Github repository

#### Frontend

- Install npm dependencies:

```
npm install
```

- Start the app in dev mode

```
npm run dev
```

#### Backend

- Create a file called `.env` inside the `backend/` directory, where you need the following environment variables:

```
// password of root user for mysql
MYSQL_ROOT_PASSWORD=

// usually root, but you can have any other user name
MYSQL_USERNAME=

// password of the above mysql user
MYSQL_PASSWORD=

// name of the database
MYSQL_DATABASE=polychat

// host of the database (usually localhost)
DB_HOST=

// should have the format mysql://username:password@host:port/db_name
DB_URL=

// secret for generating the JWTs (a random sequence of 64 bytes in hex)
JWT_SECRET=

// email credentials
EMAIL_USER=
EMAIL_PASS=
```

- Install npm dependencies:

```
npm install
```

- Start the docker container:

```
docker-compose up
```

- Start the app

```
npm start
```

## Database Diagram

![database](db-diagram.png)
