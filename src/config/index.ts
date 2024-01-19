import 'dotenv/config';

export const config = {
  database: {
    uri: process.env.MONGO_URI as string,
    connectionName: {
      connectionName: 'blogger' as string,
    },
  },
};
