# JavaScript fetch()

## Overview

We'll use `fetch()` and describe the problems that it helps solve.

## Objectives

1.  Explain how to use `fetch()` in modern browsers
2.  Describe the differences between `fetch()`, `jquery.ajax()` and `XMLHttpRequest`
3.  Get data from a remote endpoint using `fetch()`

## Introduction

Getting remote data in JavaScript has classically required a fair amount of
plumbing to make things happen.

It's not that it's _hard_ to get data out of `XMLHttpRequest`, but it does take
quite a bit of setup. Let's make a simple request of the GitHub repository
commits API.

```js
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.github.com/repos/jquery/jquery/commits');
xhr.responseType = 'json';

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log('Booo');
};

xhr.send();
```

Sure, it works, but that's a lot of setup to just say "give me some JSON from
this URL".

I mean, you could just crack an egg and start cooking it, you know? Similarly,
I'll never understand why we have to call `open` and then call `send`. Or why we
can only set headers _after_ we call `open`. Or any number of other clunky ways
we have to use XHR.

Things get a little better with jQuery's `$.ajax`, except then we have to
tightly couple ourselves to jQuery, and ultimately, it's just syntactic sugar
over `XMLHttpRequest`.

XHR also abstracts away our ability to work directly with the request and
response objects, limiting our ability to do more advanced things on an internet
that's evolved far beyond just XML and HTTP.

**Note:** To be fair to XHR, it can handle more protocols than HTTP and more
formats than XML, but it was never designed with the level of interconnectedness
of today's programs in mind. For instance, streaming, a staple of the modern
web, isn't possible when you can only access `responseText` after the request
has completed.

Wouldn't it be nice if there were a sleek new API designed from the ground up to
handle the needs of the modern web?

## fetch()

The `fetch()` function is a new API for fetching resources. It's a global
function, which means no creating new XHR objects, and it vastly streamlines
simple resource requests. Let's try that call to the GitHub commits API again.

```js
fetch('https://api.github.com/repos/jquery/jquery/commits')
  .then(res => res.json())
  .then(json => console.log(json));
```

![kimmy wow](http://i.giphy.com/3osxYwZm9WZwnt1Zja.gif)

I know, right? Let's break it down.

Since we're making a simple `GET` request, we can just pass the URL directly to
`fetch`. But what's happening next?

### Promises and then

In JavaScript, a `Promise` object represents a value that may not be available
yet, but will be resolved at some point in the future. Essentially, the promise
is an object that represents the result of an operation, whenever it occurs.
This allows us to write more flexible asynchronous code than simply passing
callback functions to asynchronous functions.

All promises implement a `then` function that is called when the promise is
_fulfilled_, or completed successfully. So this is very similar to the idea of a
callback on success that we'd use with `XMLHttpRequest` or `$.ajax`.

The interesting thing about this `fetch` code is that it highlights a powerful
feature of a `thenable` object — we can chain each `then` call, and the next one
receives the result of the previous one as its argument.

So, in this code:

```js
fetch('https://api.github.com/repos/jquery/jquery/commits')
  .then(res => res.json())
  .then(json => console.log(json));
```

the line `then(res => res.json())` is getting the response `res` from `fetch`
and using the `json` method (more on this in a bit) to turn it into JSON. Then
it's passing the JSON to the next line, `then(json => console.log(json))`, to be
handled by that function.

### Body Mixin

The `fetch` API includes a _mixin_, or additional code, called
[Body][body],
which has functions that specialize in transforming the `body` of a request or
response.

In an `XMLHttpRequest`, you would potentially have to `JSON.parse` the
`responseText` data to turn it into JSON. The `Body` mixin takes that a step
further, giving us handy ways to parse many formats, including JSON, plain text,
and even blobs for binary or image data.

So calling `res.json()` in our `fetch` is just a nice shorthand for saying "give
me the `body` of the response parsed as JSON".

## Authenticated Fetching

So far, we've been making our requests against the public API functions that
GitHub provides, but there are more powerful toys available to us if we can
prove to the API who we are when we make requests.

### OAuth

GitHub's API uses [OAuth2][oauth2] for
authorization. In a production setting, you would register an application with
GitHub and receive an application ID and secret. This allows GitHub to track and
monitor API access, and ensure that its users are protected by only granting
authorization through registered apps.

From there, a user would make a request via your app, which would kick off the
workflow to issue an authorization code that your app would then exchange for an
access token. The access token is ultimately what your application includes in
GitHub API requests to identify and authorize the user.

Setting up the full OAuth2 authorization code grant workflow is beyond the scope
of this lesson, but it is described well in the GitHub
[docs](https://developer.github.com/v3/oauth/).

Fortunately for us, GitHub also allows you to generate your own personal
authorization token that we can use to give us authorized access to the API. And
`fetch` makes it super easy to implement.

To start, go to
[https://github.com/settings/tokens][tokens] and
click "Generate new token." Name it "Learn.co" and check `repo` scope. Once you
generate the token, make sure to copy and paste it somewhere, because once you
leave that page, you won't be able to see it again. This is for your security —
even if someone were to gain access to this page on your account, they still
couldn't see your tokens.

Using the token to [access the
API](https://developer.github.com/v3/oauth/#3-use-the-access-token-to-access-the-api)
is a simple matter of creating an `Authorization` header with our request. Let's
try it out by listing our repos.

```js
fetch('https://api.github.com/user/repos')
  .then(res => res.json())
  .then(json => console.log(json));
```

If we run that code, we'll get a `401 (Unauthorized)` response. We need to
provide our authorization token in order to list our own repositories with this
API, so let's add our `Authorization` header (don't forget to assign your token
to `const token`).

```js
const token = 'YOUR_TOKEN_HERE';
fetch('https://api.github.com/user/repos', {
  headers: {
    Authorization: `token ${token}`
  }
})
  .then(res => res.json())
  .then(json => console.log(json));
```

We just pass the desired headers as part of a second options argument to `fetch`
and we are in business. Easy as that!

![so fetch](http://i.giphy.com/SUgOYsXqmexxe.gif)

**Top-Tip:** Don't ever give out your access token or store it in a publicly
accessible place or a shared GitHub repository. We're just using these for
learning purposes. In a production setting, users' access tokens would be stored
securely in a database and not exposed to other people.

## Resources

- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTML5 Rocks Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)

[body]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Body
[tokens]: https://github.com/settings/tokens
[oauth2]: https://developer.github.com/v3/oauth/

<p class='util--hide'>View <a href='https://learn.co/lessons/javascript-fetch'>Getting Data from the Web</a> on Learn.co and start learning to code for free.</p>
