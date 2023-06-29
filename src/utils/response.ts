export const successResponse = (response: [] | any) => {
    // we could make resposne format at here insteand of pararm of key in object
    const datas = Array.isArray(response) ? 'items' : 'data';
    return {
        success: true,
        requestId: global.requestId,
        [datas]: response,
    };
};

export const failureResponse = (message: string, code: string, remarks?) => {
    return {
        success: false,
        requestId: global.requestId,
        error: {
            message,
            code,
        },
        remarks,
    };
};
