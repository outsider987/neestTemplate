export default {
    default: {
        locale: 'tc',
        listItemLimit: 20,
    },
    encryptedBlockchainBearerToken: process.env.ENCRYPTED_BLOCKCHAIN_BEARER_TOKEN,
    qrBlockchainLoginInfo: {
        userId: process.env.QR_BLOCKCHAIN_USER_ID,
        password: process.env.QR_BLOCKCHAIN_PASSWORD,
    },
    cache: {
        minutes: {
            promotions: 5,
            resources: 5,
            news: 5,
            doctors: 5,
            clinics: 5,
            insurers: 5,
            settings: 5,
            diagnosis: 60,
            authorities: 60,
            advertisements: 60,
            specialities: 60,
            banks: 60,
            benefits: 60,
        },
    },
    insurers: {
        order: process.env.INSURERS_ORDER ?? '24,5,4,1,2,6,7,23,3,8,20,25',
    },
    INSURER: {
        BLUE_CROSS: 'BC',
        BOWTIE: 'BT',
        HKL: 'HKL',
        CHINA_LIFE_GROUP_MEDICAL: 'CL-GM',
        CHINA_LIFE: 'CL',
        BANK_OF_CHINA: 'BOC',
        TAIPANG: 'CTP',
        AVO: 'AVO',
        FWD: 'FWD',
        ZA: 'ZA',
        MCC: 'MCC',
        AI: 'AI',
    },
    timeoutPeriod: {
        TRANSACTION: 20000,
    },
    verifyTypeId: {
        qr: 1,
        card: 2,
    },
    verifyType: {
        1: 'QR',
        2: 'Card',
    },
};
