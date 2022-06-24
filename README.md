# Base Telegram Bot
A pretty simple and flexible boilerplate for making Telegram bot

## Configuration
* BOT_TOKEN
* RULES
* DATABASE_HOST
* DATABASE_PORT
* DATABASE_USERNAME
* DATABASE_PASSWORD
* DATABASE_NAME

## Rules
The Telegram bot allows you to flexibly configure handlers. Rules must be stored as json with the following structure.

```json
{
  "handlerName": {
    "type": "private" | "group" | "on" | "off",
    "ids": number[],
    "admins": number[], 
  }
}
```

## How to install
* npm install
* npm run build

## Available handlers
### Greetings

### Squid Game

## Integrations
### With Yandex Cloud
As Cloud Function