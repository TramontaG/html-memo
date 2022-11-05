# HTML-Memo

### A simple memoization library for getting websites using webscrapers

## Example usage

```typescript
import HTMLMemo from 'html-memo';
import HTMLParser from 'some-random-html-parser'; //for example, JSDOM;

const expirationTime = 30 * 1000; //30 seconds

const memo = new HTMLMemo(htmlAsString => HTMLParser(htmlAsString), expirationTime);

// Memoized website getter. It will fetch the html once and every subsequent call
// will return the cached result. Only when the expiration time passes it will
// override the website cache with a new request.
const myWebsite = memo.getWebsite('website key', fetch('htpps://website.com/'));
```
