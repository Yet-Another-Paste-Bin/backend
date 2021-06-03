<h1 align="center">
Yet Another Paste Bin 
<br>
(RESTful API)
</h1>

<p>

  <img src="https://img.shields.io/badge/npm-%3E%3D6.5.0-blue.svg" />
  <a href="Yet-Another-Paste-Bin/yapb_backend_server#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Tejasvp25/Yet-Another-Paste-Bin/yapb_backend_server/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/Yet-Another-Paste-Bin/yapb_backend_server/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Tejasvp25/Api-mocker" />
  </a>
</p>

## clone or download
```terminal
$ git clone https://github.com/Yet-Another-Paste-Bin/yapb_backend_server
$ npm i
```

## project structure
```terminal
LICENSE
package.json
config.js [ENV Vairables]
controllers/
    auth.controller.js
    bin.controller.js
routes/
    auth.route.js
    bin.route.js
middlewares/
    bin_checker.js
    error_handler.js
    jwt_auth.js
    ratelimit_middleware.js
    signup_middleware.js
models/
    bin.model.js
    user.model.js

```

# Usage

## Prerequirements
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Node](https://nodejs.org/en/download/) ^10.0.0
- [npm](https://nodejs.org/en/download/package-manager/)
- [RedisDB](https://redis.io/download)



### Prepare Enviornment variables
```terminal
// in the root level
$ export SECRET=YOUR_JWT_AUTH_SECRET
$ export DB_URL=YOUR_MONGODB_CONNECTION_URI
$ export NODE_ENV=YOUR_NODE_ENVIORNMENT
$ export REDIS_DB_URI=YOUR_REDIS_DB_CONNECTION_URI
```

### Start (Development)

```terminal
$ npm i       // npm install pacakges
$ npm run dev // run it in development mode locally
```

### Start (Production)

```terminal
$ npm i       // npm install pacakges
$ npm run start // run it in production mode
```

# Dependencies
-   bcryptjs: ^2.4.3
-   body-parser: ^1.19.0
-   cors: ^2.8.5
-   cross-env: ^7.0.3
-   express: ^4.17.1
-   express-rate-limit: ^5.2.6
-   helmet: ^4.6.0
-   jsonwebtoken: ^8.5.1
-   mongoose: ^5.12.2
-   morgan: ^1.10.0
-   rate-limit-redis: ^2.1.0
-   redis : 3.0.2

## Author

👤 **Tejasvp25**

- Website: http://thetejasvp25.tech
- Github: [@Tejasvp25](https://github.com/Tejasvp25)
- Gmail ID: tejasvp25@gmail.com

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Yet-Another-Paste-Bin/yapb_backend_server/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## TODO ✓

- ~Add Support for Bin Sharing~

## 📝 License

Copyright © 2021 [Tejasvp25](https://github.com/Tejasvp25).<br />
This project is [MIT](https://github.com/Yet-Another-Paste-Bin/yapb_backend_server/blob/master/LICENSE) licensed.
