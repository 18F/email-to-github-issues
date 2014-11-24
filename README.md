## Email -> GitHub Issues

A webhook to receive inbound email POSTs from Mandrill, that then opens GitHub Issues with the details.

Great for approving TLS certificates.

Currently accepts any emails from anyone and opens issues with them. A bit dangerous!

TODO:

- [ ] Allow whitelisting of email addresses and domains.
- [ ] Allow whitelisting of email subject lines.
- [ ] Allow enforcement of valid DKIM signatures.
- [ ] Allow validation that webhook POSTs are signed by Mandrill.
- [ ] Handle more than one event in a single POST. (Currently looks at only the first one.)

### Setup

Make sure dependencies are up to date:

```bash
npm install
```

Start a config file from the template:

```bash
cp config.js.example config.js
```

Fill out the config file. Ours looks kind of like this:

```javascript
module.exports = {
  github: {
    user: "18f",
    repo: "tls-approvals", // private repo
    token: "XXXXXXXXXXXXXXXXXXXXXX",
    labels: []
  },

  debug: true
}
```

### Running it

Pretty straightforward:

```bash
node app.js
```

By default, this will run at `http://localhost:3000`. Use `node app.js [port]` to provide a different port number.

In development, you may wish to use [`ngrok`](https://ngrok.com) to test it out.

In production, you may wish to stick nginx in front of it and `proxy_pass` HTTP traffic.

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
