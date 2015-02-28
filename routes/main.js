var fs = require('fs');
var querystring = require('querystring');
var secrets = require('../secrets.js');
var https = require('https');
var sparkpost = require('sparkpost')({key: secrets.key});

exports.home = function(req, res) {
  handle(req, res);
}

exports.main = function(req, res) {
  handle(req, res);
};

exports.request_interview = function(req, res) {
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_manager@gointerview.club';
  trans.subject = 'Someone wants to pay you to interview';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{company}} would like to pay you ${{price}} to conduct a technical interview!  Click to accept: http://gointerview.club/accept.html?id={{requestId}}.\r\n\r\nYou\'ll coordinate the interview times with the company.';
  trans.substitutionData = {
    company: req.query.company,
    price: req.query.price,
    requestId: req.query.requestId
  };

  // Pick someone to receive your email
  trans.recipients = [{ address: { name: 'gointerview.club', email: querystring.unescape(req.query.email) } }];

  // Send it off into the world!
  sparkpost.transmission.send(trans, function(err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You just sent your first mailing!');
    }
  });

  res.send('ok');
};

exports.accepted_interview = function(req, res) {
  // TODO accepted interview email to company
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_manager@gointerview.club';
  trans.subject = 'Someone wants to pay you to interview';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{company}} would like to pay you {{price}} to conduct a technical interview.  Click to accept: http://gointerview.club/accept.html?id={{requestId}}.  You\'ll coordinate the interview times with the company.';
  trans.substitutionData = {
    company: req.query.company,
    price: req.query.price,
    requestId: req.query.requestId
  };

  // Pick someone to receive your email
  trans.recipients = [{ address: { name: 'gointerview.club', email: querystring.unescape(req.query.email) } }];

  // Send it off into the world!
  sparkpost.transmission.send(trans, function(err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You just sent your first mailing!');
    }
  });

  res.send('ok');
}

exports.signup = function(req, res) {
  if (!req.query.email) {
    res.send('');
    return;
  }
  var trans = {};

  // Set some metadata for your email
  trans.campaign = 'interview-mail';
  trans.from = 'interview_club_signup@gointerview.club';
  trans.subject = 'Interview club signup';

  // Add some content to your email
  //trans.html = '<html><body><h1>Congratulations, {{name}}!</h1><p>You just sent your very first mailing!</p></body></html>';
  trans.text = '{{emailto}} - {{type}}';
  trans.substitutionData = {emailto: req.query.email, type: req.query.type};

  // Pick someone to receive your email
  trans.recipients = [{ address: { name: 'gointerview.club', email: 'ianw_interviewclubsignup@ianww.com' } }];

  // Send it off into the world!
  sparkpost.transmission.send(trans, function(err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You just sent your first mailing!');
    }
  });

  res.send('ok');

  fs.appendFile('emails.txt', req.query.email + '-' + req.query.type + '\n', function(err) {

  });
};

var endpoint = 'api.fullcontact.com';
var apiKey = '&apiKey=2385a160a9dad8bd';
exports.creepyInfo = function(req, res) {
  if (!req.query.email) {
    res.send('');
    return;
  }
  var path = '/v2/person.json?email=' + req.query.email + apiKey;
  var options = {
    host: endpoint,
    path: path,
    port: 443,
    method: 'POST'
  };

  console.log(options);
  var request = https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      res.send(chunk);
    });
  });
  request.end();
  request.on('error', function(e) {
    console.log(e);
  });
};

function handle(req, res) {
  res.render('index', {});
}
