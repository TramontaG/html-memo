import type { WebSiteGetter } from './models';
declare type HtmlParser<T = unknown> = (html: string) => T;
/**
 * Memoization service for web site getter. It accepts an optional
 * argument that parses the html into an object. You can leave it
 * empty if it's important for you to have the html in plain text.
 */
declare class WebSiteCacheService<T = string> {
    private cached;
    private htmlParser?;
    private expirationTime;
    constructor(parser?: HtmlParser<T>, expiration?: number);
    /**
     * Memoized website getter. It remembers the HTML from the key
     * provided as the first parameter.
     * @param key
     * @param webSiteGetter
     * @returns
     */
    getWebsite(key: string, webSiteGetter: WebSiteGetter): Promise<T | undefined>;
    private returnCache;
    private addToCache;
    private checkExpiration;
    /**
     * Use this if the cached website must be overriten for any reason
     * @param key
     * @param webSiteGetter
     */
    overrideCache(key: string, webSiteGetter: WebSiteGetter): Promise<void>;
    /**
     * Use this if the cached website must be deleted for any reason
     * @param key
     * @param webSiteGetter
     */
    deleteFromCache(key: string): void;
}
export default WebSiteCacheService;
