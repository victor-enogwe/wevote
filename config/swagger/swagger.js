const { API_URL } = process.env;

export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'We Vote Api',
    description: 'A CITIZENS MOBILISATION PLATFORM FOR THE 2019 ELECTIONS',
    license: {
      name: 'MIT',
      url: API_URL
    }
  },
  host: API_URL.match(/\w+:\d+/gi)[0],
  basePath: '/api/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/': {
      get: {
        summary: 'Api Home',
        tags: ['home'],
        description: 'Welcome Message For the We Vote Api',
        responses: {
          200: {
            description: 'The welcome message',
            schema: '#/definitions/Home'
          }
        }
      }
    },
    '/auth': {
      post: {
        tags: ['authentication'],
        paths: {
          '/basic': {
            summary: 'Basic Login',
            description: 'Basic username and passwprd login'
          }
        }
      }
    }
  },
  definitions: {
    Home: {
      required: ['status', 'message'],
      properties: {
        status: {
          type: 'string'
        },
        message: {
          type: 'string'
        }
      }
    }
  }
};

