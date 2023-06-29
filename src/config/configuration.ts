export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        expirationTime: parseInt(process.env.JWT_EXPIRATION_TIME, 10) || 86400000,
    },
    okta: {
        base_url: process.env.OKTA_BASE_URL,
        client_id: process.env.OKTA_CLIENT_ID,
    },
    hmg: {
        api_root: process.env.HMG_API_ROOT,
        api_key: process.env.HMG_API_KEY,
        group_id: process.env.HMG_GROUP_ID,
        test_token: process.env.HMG_TEST_TOKEN,
        cloud_mersive_api_key: process.env.CLOUDMERSIVE_API_KEY,
    },
    encryptedBlockchainBearerToken: process.env.ENCRYPTED_BLOCKCHAIN_BEARER_TOKEN,
    s3Config: {
        AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
        AWS_S3_KEY_SECRET: process.env.AWS_S3_KEY_SECRET,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        AWS_S3_PREFIX: process.env.AWS_S3_PREFIX,
    },
    defaultConnection: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        migrations: ['dist/migrations/*.js'],
        entities: ['dist/entities/**/*.js'],
        synchronize: false,
    },
    cache: {
        driver: process.env.CACHE_DRIVER ?? 'memory',
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: parseInt(process.env.CACHE_TTL),
    },
});
