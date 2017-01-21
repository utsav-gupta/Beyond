
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
       user: 'beyondenoughtech@gmail.com',
       pass: '$admin1234'
   }
});

var sysAlert = function(){};
sysAlert.prototype.sendMails = function(to,subject, body, callback) {
// body...


var mailOptions = {
   from: 'UMS ✔ <>', // sender address
   to: to, // list of receivers
   subject:subject, // Subject line
   //text: 'Hello world ✔', // plaintext body
   html: body // html body
};


transporter.sendMail(mailOptions, function(error, info){
   callback(error, info);
});
};

sysAlert.prototype.sendMailAgent = function(username,password,to,subject,type, body, callback) { 
// body...

// body... 
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
       user: username,
       pass: password
   }
});

var mailOptions = { from: type+' ✔ <info@ditscentre.in>', // sender address 
to: to, // list of receivers 
subject: subject, // Subject line
//text: 'Hello world ✔', // plaintext body 
html: body, // html body 
}; 

transporter.sendMail(mailOptions, function(error, info){ 
callback(error, info); 
}); 
};

sysAlert.prototype.sendAttachMails = function(username,password,to,subject,type, body,attachment, callback) { 
// body... 
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
       user: username,
       pass: password
   }
});

var mailOptions = { from: type+' ✔ <info@ditscentre.in>', // sender address 
to: to, // list of receivers 
subject: subject, // Subject line
//text: 'Hello world ✔', // plaintext body 
html: body, // html body 
attachments: attachment }; 

transporter.sendMail(mailOptions, function(error, info){ 
callback(error, info); 
}); 
};
exports.sysAlert = sysAlert;
