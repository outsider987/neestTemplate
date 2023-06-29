export const sumObjectValues = (obj: Record<string | number, string | number>): number => {
    return <number>(
        Object.values(obj).reduce((a: string | number, b: string | number) => Number(a) + Number(b))
    );
};
