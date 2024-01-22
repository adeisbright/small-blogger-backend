import 'dotenv/config';

export const config = {
  jwtSecret: process.env.JWT_SECRET as string,
  appName: process.env.APP_NAME as string,
  database: {
    uri: process.env.MONGO_URI as string,
    connectionName: {
      connectionName: 'blogger' as string,
    },
  },
};
