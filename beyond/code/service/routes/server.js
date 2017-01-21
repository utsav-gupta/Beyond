var MAILER = require('../routes/helper/mailer.js').sysAlert;
var mailer= new MAILER();
// Srv = function Srv() {};
// Srv.prototype.response = function(res, status) {
//     var body = JSON.stringify(status);
//     res.setHeader('Content-Type', 'text/plain');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Methods', 'POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.send(body);
// }


// var sendErrorMailtoAdmins=function(title,message,body,callback){
//     console.log(title + " "+ message)
//      mailer.sendMails(["bhushan@ditscentre.in", "ritesh@ditscentre.in", "rashmi@ditscentre.in", "priyanka@rgbvistas.com"], title+" Error Message from UMS " + new Date(),body + "<br>"+message  , function(err, info) {
//         if (err) {
//             // status["message"]="Please check your mailAgent username and password";
//             // response(res,status);
//             callback(err,null)
//         } else {
//             // status["state"]=true;
//             // status["message"]="Mail Send Update "+file;
//             // response(res,status);     
//             callback(null,info)   
//         }
//     });
// }
// Srv.prototype.sendErrorMailtoAdmins=function(title,message,body,callback){
//     sendErrorMailtoAdmins(title,message,body ,function(err,info){                
//          callback(err,info)   
//     })
// }
// Srv.prototype.errlog = function(page, section, error) {
//     var srv = new Connection();
//     srv.connect(function(err, db) {
//         if (err) console.log(err);
//         var errors = db.collection("errlog");
//         errors.insert({
//                 ts: new Date(),
//                 "page": page,
//                 "section": section,
//                 "error": error
//             },
//             function(err, docs) {
//                 if (err) console.log(err);
//                 console.log(JSON.stringify(docs));

//             });
//     });
// };

// Srv.prototype.getSession = function(sessionId, callback) {
//     var srv = new Connection();
//     srv.connect(function(err, db) {
//         if (err) callback(err);
//         var loginSession = db.collection('loginSession');
//         loginSession.findOne({
//             "_id": new ObjectId(sessionId)
//         }, function(err, doc) {
//             if (err) callback(err);
//             else {
//                 callback(null, doc);
//             }
//         });
//     });
// };
// Srv.prototype.createSession = function(username, domain, role, callback) {
//     var srv = new Connection();

//     srv.connect(function(err, db) {

//         if (err) callback(err);
//         var loginSession = db.collection("loginSession");
//         loginSession.insert({
//                 "username": username,
//                 "domain": domain,
//                 "startTime": new Date(),
//                 state: "active",
//                 "role": role
//             },
//             function(err, result) {
//                 if (err) callback(err);
//                 callback(null, result);

//             });
//     });
// };
// endSession = function(sessionId, callback) {
//     var srv = new Connection();
//     srv.connect(function(err, db) {
//         if (err) callback(err);
//         db.loginSession.update({
//                 "_id": new ObjectId(sessionId)
//             }, {
//                 state: "inactive",
//                 endTime: new Date()
//             },
//             function(err, doc) {}
//         );
//     });
// };




// exports.Srv = Srv;

/* creating a pool with the connectionlimit of 10 and 
accessing distributer table from iamhungry database*/
var pg = require('pg');

var config = {
  host:'127.0.0.1',
  user: 'postgres', //env var: PGUSER 
  database: 'postgres', //env var: PGDATABASE 
  password: 'postgres', //env var: PGPASSWORD 
  port: 5432, //env var: PGPORT 
  max: 100, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

var pool = new pg.Pool(config);

var PGSql = function() {};
// var pgsqlv = new PGSql();
PGSql.prototype.connect = function(callback) {
    pool.connect(function(err,client,done){
        callback(err,client,done);
    });

    pool.on('error',function(err,client){
        callback(err,null,null);
    });

};

PGSql.prototype.sendErrorMail = function(title,message,body,callback){
     mailer.sendMails(["rashmi@ditscentre.in","guhan@ditscentre.in"], title+" Error Message from Beyond Enough " + new Date(),body + "<br>"+message  , function(err, info) {

        if (err) {
            // status["message"]="Please check your mailAgent username and password";
            // response(res,status);
            callback(err,null)
        } else {
            // status["state"]=true;
            // status["message"]="Mail Send Update "+file;
            // response(res,status);     
            callback(null,info)   
        }
    });
}

// PGSql.prototype.release = function(callback) {
//     // body...
    
// };

exports.PGSql = PGSql;



// var _mysqlconnection = null;
// var mysql = require('mysql');
// var pool = mysql.createPool({

//     connectionLimit: 100,
//     // host     : '192.168.2.250',
//     host: '103.61.197.18',
//     port: '3306',
//     user: 'ums',
//     password: 'umsfreeradius',
//     database: 'radius',
//     multipleStatements: true

// });

// var mysql = function() {};
// mysql.prototype.connect = function(callback) {
//     // body...
//     if (!_mysqlconnection) {
//         pool.getConnection(function(err, connection) {
//             if (err) {
//                 callback(err, null);
//             } else {
//                 _mysqlconnection = connection;
//                 callback(null, _mysqlconnection);
//             }
//         });
//     } else {
//         callback(null, _mysqlconnection);
//     }

// };

// mysql.prototype.release = function(callback) {
//     // body...
//     if (_mysqlconnection) {
//         _mysqlconnection.release();
//         _mysqlconnection = null;
//         callback(1);
//     }
//     callback(-1);
// };

// mysql.prototype.execute = function(query, callback) {
//     this.connect(function(err, db) {
//         if (err) {
            
//              var title="MySql Connection ";
//             sendErrorMailtoAdmins(title,err,query ,function(err,info){
//                 console.log(err);
//                 console.log(info);
//             })
//             if (_mysqlconnection) {
//                 _mysqlconnection.release();                
//             }

//             _mysqlconnection = null;
//             callback(err, null)
//         } else {
//             db.query(query, function(err, data) {
//                 if (err) {;
//                      var title="MySql Query ";
//                     sendErrorMailtoAdmins(title,err,query ,function(err,info){
//                         console.log(err);
//                         console.log(info);
//                     })
//                 	if (_mysqlconnection) {
//                         _mysqlconnection.release();
//                     }

//                     _mysqlconnection = null;
			
//                     callback(err, null)
//                 } else {
//                     callback(null, data)
//                 }
//             });
//         }
//     })
// }

// mysql.prototype.secureexecute = function(query,sessionId, callback) {
//     this.connect(function(err, db) {
//         if (err) {
            
//              var title="MySql Connection ";
//             sendErrorMailtoAdmins(title,err,query ,function(err,info){
//                 console.log(err);
//                 console.log(info);
//             })
//             if (_mysqlconnection) {
//                 _mysqlconnection.release();                
//             }

//             _mysqlconnection = null;
//             callback(err, null)
//         } else {
//             var verify_query='call verify_session("'+sessionId+'")';
//             db.query(verify_query, function(err, sessiondata) {
//                 if (err) {;
//                      var title="MySql Query ";
//                     sendErrorMailtoAdmins(title,err,verify_query ,function(err,info){
//                         console.log(err);
//                         console.log(info);
//                     })
//                     if (_mysqlconnection) {
//                         _mysqlconnection.release();
//                     }

//                     _mysqlconnection = null;
            
//                     callback(err, null)
//                 } else {
//                     // console.log(sessiondata);
//                     // callback(null, data); 
//                     if(!sessiondata[0][0]){
// 			            sessiondata[0]=[{}];	
//                         var title="MySql Query Alert ";
//                         var err= "This not returning @state in first row, Please check and confirm"
//                         sendErrorMailtoAdmins(title,err,verify_query ,function(err,info){
//                             console.log(err);
//                             console.log(info);
//                         })
//                         sessiondata[0][0]["@state"]=0;
//                     }                   
//                     if(sessiondata[0][0]["@state"]==1){
//                         db.query(query, function(err, data) {
//                             if (err) {;
//                                  var title="MySql Query ";
//                                 sendErrorMailtoAdmins(title,err,query ,function(err,info){
//                                     console.log(err);
//                                     console.log(info);
//                                 })
//                                 if (_mysqlconnection) {
//                                     _mysqlconnection.release();
//                                 }

//                                 _mysqlconnection = null;
                        
//                                 callback(err, null)
//                             } else {
//                                 if(data[0]){
//                                     if(!(data[0][0]["@state"] || data[0][0]["@state"]==0)){                                        
//                                         var title="MySql Query Alert ";                                  
//                                         var err= "This not returning @state in first row, Please check and confirm (318)"+data
//                                         sendErrorMailtoAdmins(title,err,query ,function(err,info){
//                                             console.log(err);
//                                             console.log(info);
//                                         });
//                                     }
//                                 }
//                                 callback(null, data)
//                             }
//                         });
//                     }
//                     else{                                             
//                         sessiondata[0][0]["session"]={"ip":sessiondata[0][0]["ipaddress"],"browser":sessiondata[0][0]["browser"]};
//                         callback(null,sessiondata);
//                     }
                    
                   
//                 }
//             });
//         }
//     })
// }

// exports.MySql = mysql;




// var serverConfig = {};
// serverConfig["ip"] = "api.spacewhiz.com",
//     // serverConfig ["ip"] = "192.168.2.250" , 
//     serverConfig["port"] = 27017;
// serverConfig["database"] = "spacewhiz";
// var ObjectId = require("mongodb").ObjectID;
// var mongo = require('mongodb');
// var _db;
// var op = 0;
// var gcm = require('node-gcm');
// var sender = new gcm.Sender("AIzaSyBm_vbxyvow47tfO4aSmqAa2mowcv7Mz7s");


// var ccc = function ccc() {};
// ccc.prototype.sendGCM = function(messageJson, registrationIds, callback) {
//     var message = new gcm.Message();
//     message["collapseKey"] = 'demo'; // check what can go there
//     message["delayWhileIdle"] = true;
//     message["timeToLive"] = 3;

//     message["data"] = messageJson; //  as per the send request
//     message["hasData"] = true;
//     console.log(registrationIds);
//     sender.send(message, registrationIds, 4, function(err, status) {
//         if (err) {
//             callback(err);
//         } else {
//             console.log(status);
//             callback(null, status);

//         }
//     });
// };

// ccc.prototype.sendSms = function(message, mobileNumber, callback) {
//     var request = require('request');

//     request.get("http://nimbusit.co.in/api/swsend.asp?username=t1ditscentre&password=41324403&sender=MMCUMS&sendto=" + mobileNumber + "&message=" + message, function(error, response, body) {
//         if (error) {
//             var title="SMS Error";
//             sendErrorMailtoAdmins(title,error,mobileNumber + " "+message ,function(err,info){
//                 console.log(err);
//                 console.log(info);
//             })
//             callback(error, null);
//         } else {
//             callback(null, body);
//         }
//     });

// }

// exports.ccc = ccc;


// GridFs = function GridFs() {};
// GridFs.prototype.upload = function(fileBuffer, fileData, callback) {
//     var conn = new Connection();
//     conn.connect(function(err, db) {
//         if (err) {
//             callback(err);
//         } else {

//             var grid = new mongo.Grid(db, 'fs');
//             grid.put(fileBuffer, fileData, function(err, fileInfo) {
//                 callback(err, fileInfo);
//             });
//         }
//     });
// }
// GridFs.prototype.update = function(fileId, fileBuffer, fileData, callback) {

// }
// GridFs.prototype.view = function(fileId, callback) {
//     var conn = new Connection();
//     console.log('now Connection');
//     conn.connect(function(err, db) {
//         if (err) {
//             callback(err);
//         } else {
//             console.log(fileId);
//             var grid = new mongo.Grid(db, 'fs');
//             grid.get(fileId, function(err, fileBuffer) {
//                 callback(err, fileBuffer);
//             });
//         }
//     });
// }
// GridFs.prototype.remove = function(fileId, callback) {

// }
// exports.GridFs = GridFs;

// Connection = function Connection() {};
// Connection.prototype.connect = function(callback) {
//     try {
//         if (_db) {
//             callback(null, _db);
//         } else {
//             var MongoClient = require('mongodb').MongoClient;
//             MongoClient.connect("mongodb://" + serverConfig.ip + ":" + serverConfig.port + "/" + serverConfig.database + "?replicaSet=rgbMongo",
//                 function(err, db) {
//                     if (err) {
//                         var title="Mongo Connection ";
//                         sendErrorMailtoAdmins(title,err,new Date() ,function(err,info){
//                             console.log(err);
//                             console.log(info);
//                         })
//                         callback(err);
//                     } else {
//                         _db = db;
//                         callback(null, _db);
//                         op++;
//                         console.log(op);
//                         _db.on('close', function() {
//                             _db = null;

//                         });
//                         _db.on('error', function() {

//                             _db = null;
//                         });
//                     }
//                 }
//             );
//         }
//     } catch (ex) {
//         console.log(ex);
//     }
// };




// exports.Connection = Connection;
