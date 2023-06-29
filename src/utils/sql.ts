export const getTableName = (query: string) => {
    const findTableName = query.match(/(?<=[from\s`]|[into\s`])(\w+)(?=`)/im);
    return findTableName[0];
};

export type Order = typeof order[number];

export const order = ['ASC', 'DESC'] as const;
