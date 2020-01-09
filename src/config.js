module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL ||  "postgres://jlsuqrboovqavs:eef53303544f07eb5123022f6d53773da3b9d2a9d38498ebaf3940f91f63600d@ec2-174-129-32-215.compute-1.amazonaws.com:5432/de0g6vaq5k7egs",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL ||  "postgres://jlsuqrboovqavs:eef53303544f07eb5123022f6d53773da3b9d2a9d38498ebaf3940f91f63600d@ec2-174-129-32-215.compute-1.amazonaws.com:5432/de0g6vaq5k7egs",
    NODE_ENV: process.env.NODE_ENV || 'development',
  }