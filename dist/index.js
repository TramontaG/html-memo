"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_EXPIRATION_TIME = 1000 * 60 * 60 * 24; //1 day in ms;
/**
 * Memoization service for web site getter. It accepts an optional
 * argument that parses the html into an object. You can leave it
 * empty if it's important for you to have the html in plain text.
 */
class WebSiteCacheService {
    constructor(parser, expiration) {
        this.cached = {};
        this.htmlParser = parser;
        this.expirationTime = expiration || DEFAULT_EXPIRATION_TIME;
    }
    /**
     * Memoized website getter. It remembers the HTML from the key
     * provided as the first parameter.
     * @param key
     * @param webSiteGetter
     * @returns
     */
    getWebsite(key, webSiteGetter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.cached[key] || this.checkExpiration(this.cached[key])) {
                    const html = yield webSiteGetter();
                    this.addToCache(key, html);
                }
                return this.returnCache(key, this.htmlParser);
            }
            catch (e) {
                return undefined;
            }
        });
    }
    returnCache(key, parser) {
        if (parser) {
            return parser(this.cached[key].html);
        }
        return this.cached[key].html;
    }
    addToCache(key, html) {
        this.cached[key] = {
            creationDate: new Date(),
            expiresIn: this.expirationTime,
            html,
        };
    }
    checkExpiration(cache) {
        if (!cache)
            return false;
        return cache.creationDate.getTime() + cache.expiresIn < new Date().getTime();
    }
    /**
     * Use this if the cached website must be overriten for any reason
     * @param key
     * @param webSiteGetter
     */
    overrideCache(key, webSiteGetter) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield webSiteGetter();
            this.addToCache(key, html);
        });
    }
    /**
     * Use this if the cached website must be deleted for any reason
     * @param key
     * @param webSiteGetter
     */
    deleteFromCache(key) {
        if (this.cached[key]) {
            delete this.cached[key];
        }
    }
}
exports.default = WebSiteCacheService;
