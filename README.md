# PolyChat

This is a chat app that automatically translates messages in your preferred language, where people can send each other direct messages, or text in group chats

For translation it makes use of 2 public, free APIs:

- [DetectLanguage](https://detectlanguage.com/) for language detection
- [MyMemory](https://mymemory.translated.net/) for actual translation

## Local set-up

- First you need to clone this GitHub repository

#### Frontend

- Install NPM dependencies:

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

// API key for DetectLanguage
DETECTLANGUAGE_API_KEY=
```

- Install NPM dependencies:

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
