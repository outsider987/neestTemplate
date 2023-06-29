export const locales = {
    en: 'En',
    tc: 'Cn',
} as const;

export type LocaleKeys = keyof typeof locales;
export type Locales = typeof locales[LocaleKeys];

export const getLocaleKey = (locale: string): Locales => {
    return locales[locale] || locales['tc'];
};
