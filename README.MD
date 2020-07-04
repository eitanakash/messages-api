**Table of Contencts**

- [Description](#description)
- [Endpoints](#endpoints)
- [Setup Requirements](#setup-requirements)
- [Installation](#Installation)
- [Workflows](#workflows)
- [TODOs](#todos)

## Description

REST api for messaging using express js and mongoDB

## Endpoints

1. See messenger.postman_collection-server.json file
2. Import to postman

## Setup Requirements
- Mongo DB
  - using docker:
    - run$ sudo mkdir -p /mongodata
    - run$ sudo docker run -it -v /data/db:/mongodata -p 27017:27017 --name mongodb -d mongo
- nodejs and npm


## Installation and Running the app locally
- fork and clone repository from https://github.com/eitanakash/messages-api
- npm install
- Create the .env file on the project root folder: for sample refer to .env.example
- npm run start
- import postman file and Edit the host and port to localhost and port 3000 or edit env file

## Workflows

1. sign up two users with suited signup endpoint.
2. Login the two users with suited login endpoint.
3. Sign up two users with suited signup endpoint,
   Copy the token and add it to Authorization header of all /message/ endpoints.
   example: http://localhost:3000/message/write.
4. Use message/write api with suited body.
5. Use /message/read api.
6. Use /message/all to get all messages for the user of the token used.
7. Use /message/all-unread to get all unread messages for the user of the token used.

## TODOs

- Clean
- Check complexity and improve
- Add validation for post body
- Add enum to more organized and robust code
- add comments



