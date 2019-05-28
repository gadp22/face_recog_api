# Face Recognition API

### Installation

Required dependencies :
 - [Node.js](https://nodejs.org/): v4+,
 - @tensorflow/tfjs-node: ^1.1.2,
 - @types/express: ^4.16.1,
 - canvas: ^2.5.0,
 - cors: ^2.8.5,
 - dotenv: ^8.0.0,
 - express: "^4.17.0,
 - face-api.js: ^0.20.0,
 - mongodb: ^3.2.5,
 - node-fetch: ^2.6.0,
 - nodemon: ^1.19.0,
 - typescript: ^3.4.5

Required devDependencies :
 - @babel/core: ^7.4.4,
 - @babel/node: ^7.2.2,
 - @babel/preset-env: ^7.4.4

Install the dependencies and devDependencies.

```sh
$ cd face_recog_api
$ npm install -d
```

To setup database, edit .env config file.

```sh
$ cd face_recog_api
$ mv .env.example .env
$ nano .env
```
```
PORT=3000
DBHOST=[DATABASE HOST]
DBPORT=[DATABASE PORT]
WEIGHTS=src/public/models
```

Start the server.

```sh
$ cd face_recog_api
$ npm run tsc
$ npm start
```
