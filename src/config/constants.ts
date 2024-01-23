// src/config/config.ts

import dotenv from 'dotenv';

dotenv.config();

interface Config {
    appPort: number;
    clusterMode: boolean;
    logDir: string;
    logLevel: string;
    nodeEnv: string;
    jwtSecret: string;
    redisHost: string;
    redisPort: number;
    mongoHost: string;
    mongoPort: number;
    mongoDb: string;
    mailserverHost: string;
    mailserverPort: number;
    mailserverUser: string;
    mailserverPassword: string;
    mailserverFrom: string;
    validationLink: string;
}

const config: Config = {
    appPort: parseInt(process.env.APP_PORT || '3000'),
    clusterMode: process.env.CLUSTER_MODE === 'true',
    logDir: process.env.LOG_DIR || 'logs',
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || '',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379'),
    mongoHost: process.env.MONGO_HOST || 'localhost',
    mongoPort: parseInt(process.env.MONGO_PORT || '27017'),
    mongoDb: process.env.MONGO_DB || '',
    mailserverHost: process.env.MAILSERVER_HOST || '',
    mailserverPort: parseInt(process.env.MAILSERVER_PORT || '587'),
    mailserverUser: process.env.MAILSERVER_USER || '',
    mailserverPassword: process.env.MAILSERVER_PWD || '',
    mailserverFrom: process.env.MAILSERVER_FROM || '',
    validationLink: process.env.VALIDATION_LINK || '',
};

export default config;
