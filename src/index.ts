import type { Cached, WebSiteCache, WebSiteGetter } from './models';

type HtmlParser<T = unknown> = (html: string) => T;

const DEFAULT_EXPIRATION_TIME = 1000 * 60 * 60 * 24; //1 day in ms;

/**
 * Memoization service for web site getter. It accepts an optional
 * argument that parses the html into an object. You can leave it
 * empty if it's important for you to have the html in plain text.
 */
class WebSiteCacheService<T = string> {
	private cached: Cached = {};
	private htmlParser?: (html: string) => T;
	private expirationTime: number;

	/**
	 *
	 * @param parser
	 * @param expiration
	 */
	constructor(parser?: HtmlParser<T>, expiration?: number) {
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
	async getWebsite(key: string, webSiteGetter: WebSiteGetter) {
		try {
			if (!this.cached[key] || this.checkExpiration(this.cached[key])) {
				const html = await webSiteGetter();
				this.addToCache(key, html);
			}

			return this.returnCache(key, this.htmlParser);
		} catch (e) {
			return undefined;
		}
	}

	private returnCache(key: string, parser?: HtmlParser) {
		if (parser) {
			return parser(this.cached[key].html) as T;
		}
		return this.cached[key].html as T;
	}

	private addToCache(key: string, html: string) {
		this.cached[key] = {
			creationDate: new Date(),
			expiresIn: this.expirationTime,
			html,
		};
	}

	private checkExpiration(cache?: WebSiteCache) {
		if (!cache) return false;
		return cache.creationDate.getTime() + cache.expiresIn < new Date().getTime();
	}

	/**
	 * Use this if the cached website must be overriten for any reason
	 * @param key
	 * @param webSiteGetter
	 */
	async overrideCache(key: string, webSiteGetter: WebSiteGetter) {
		const html = await webSiteGetter();
		this.addToCache(key, html);
	}

	/**
	 * Use this if the cached website must be deleted for any reason
	 * @param key
	 * @param webSiteGetter
	 */
	deleteFromCache(key: string) {
		if (this.cached[key]) {
			delete this.cached[key];
		}
	}
}

export default WebSiteCacheService;
