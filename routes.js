var GitHubApi = require("github");
var github = new GitHubApi({version: "3.0.0"});

module.exports = function(app, config) {

  /*
    Expects a GitHub personal OAuth token that has been authorized
    for `repo` and `private_repo` scopes.
  */
  github.authenticate({
    type: "oauth",
    token: config.github.token
  });

  /*
    Receives webhooks from Mandrill, expecting the format documented:
    http://help.mandrill.com/entries/22092308-What-is-the-format-of-inbound-email-webhooks-
  */

  app.post('/post', function(req, res) {
    // There can be multiple aggregated events (should be rare).
    var events = JSON.parse(req.body.mandrill_events);
    if (config.debug) console.log(events);

    // For now: only care about the first one.
    // TODO: use `async` to handle all of them before finishing.
    var mandrill = events[0];

    // ignore events other than "inbound"
    if (mandrill.event != "inbound") {
      console.log(mandrill.event);
      return res.status(400).send("Nope.");
    }

    // TODO: reject event if DKIM signature is invalid.

    // TODO: implement whitelist by email, domain

    // Parse relevant pieces and assemble email.
    var to = mandrill.msg.email;
    var from_email = mandrill.msg.from_email;
    var from_name = mandrill.msg.from_name;
    var text = mandrill.msg.text;

    var title = mandrill.msg.subject;
    var body = "";
    body += "From: " + from_name + " <" + from_email + ">";
    body += "\nTo " + to;
    body += "\n\n" + text;

    // Open a GitHub issue in the associated repository.
    github.issues.create({
      user: config.github.user,
      repo: config.github.repo,
      labels: config.github.labels,
      title: title,
      body: body
    }, function(err, data) {
      if (err)
        message = ("Error!\n\n" + err);
      else
        message = "Opened issue #" + data.number;

      console.log(message);
      res.send(message);
    })
  });

  // Little helper/debug endpoints.
  app.get('/', function(req, res) {
    res.send("I'm awake!")
  });

  app.get('/post', function(req, res) {
    res.send("Oh, hey.")
  });

}
