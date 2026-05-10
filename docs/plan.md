# Accessibility testing framework

[repo](https://github.com/ericmikkelsen/a11y-web-testing)

We need automated and guided accesibility tests to weed out whatever we can to correctly detect issues ahead of time, so we can reduce screen reader testers time.

## Framework

Library or Function should take this params object

```
{
    ready:              function        	// async function that returns a promise with true when you're ready to start testing, or reject if it doesn't happen;
    imageHandler:       function        	// async function that returns a promise with a string of the image url or rejects if failed to load
    additionalTests:    function[]      	// additional tests you want to perform
    url:                dom,				// html dom to test
}
```

And return a set of objects that look like this:

```
{
    violation: boolean|'check',     // true if it's detectably true, false if it's false, and 'check' if it needs human check
    wcagVersion: 2.0|2.1|2.2|false, // version of wcag or false if it's customized rule
    url: '',                        // link to offending markup using text fragment: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments
    wcagURL: string,                // link to wcag rule definition,
	rule: string					// text of the rule
	element: HTMLElement|string,	// the dom element in a browser, or the html as a string

}
```

### config params

#### ready

This is an async function that returns a promise that completes when the dom is ready

#### imageHandler

A function to handle screenshots of offending elements or elements to check. It should be an async function that returns a promise when the image is successfully loaded, which is a string.

#### additionalTests

These are tests that receive the document as a dom, and do their own tests, that return error objects mentioned above. a

#### url

A url to test

## platforms served

### Server backend

We'll need an rest endpoint that does the scans using a playwrite or jsdom test. It should have 2 modes, 1 that fires off a set of tests using a a11y.config.ts/js file, and another that sets up a server, that prefills out all the params except for url, which is then provided at the api endpoint.

### Drupal/Wordpress plugins

Since we're just using web technologies this should run in cms preview modes

### Browser extension

Same here as for browser extensions.

### Bookmarklet

Same here as for browser extensions.

### generate gist or some saved data for test

## Thoughts on implementations

I think once we have the core library working, we can build a few web components to run the test and present the results

1. `page-test-runner` - runs the test and if `data-broadcast="true"` sends out results using post.message
2. `pages-test-runner` - opens up iframes and waits for post message to return results and compiles them, helpful if you're running multiple tests in a cms environment
3. `test-results` - a viwer for the test results.
