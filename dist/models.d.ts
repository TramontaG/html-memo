export declare type WebSiteCache = {
    creationDate: Date;
    expiresIn: number;
    html: string;
};
export declare type Cached = {
    [key: string]: WebSiteCache;
};
export declare type WebSiteGetter = () => Promise<string>;
