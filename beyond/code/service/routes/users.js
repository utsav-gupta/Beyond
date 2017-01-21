// sub category file
var PGSql = require('../routes/server').PGSql;
var pgsql = new PGSql();
var MAILER = require('../routes/helper/mailer.js').sysAlert;
var mailer= new MAILER();

var response = function (res, status){
 var body = JSON.stringify(status);
    res.setHeader('Content-Type', 'text/plain');
    //res.setHeader('Content-Length', body.length);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials' , true);
    res.setHeader('Access-Control-Allow-Methods' ,'POST');
    res.setHeader('Access-Control-Allow-Headers' , 'Content-Type');
    res.send(body);

}

var express = require('express');
var router = express.Router();

var bigInt = require("big-integer");

router.post('/register',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var userFirstName,userLastName,username,password,mobile,emailId,telephones,address;
	if(values!==null){
		userFirstName = values["userFirstName"]?values["userFirstName"]:null;
		userLastName = values["userLastName"]?values["userLastName"]:null;
		username = values["username"]?values["username"]:null;
		password = values["password"]?values["password"]:null;
		mobile = values["mobile"]?values["mobile"]:null;
		emailId = values["emailId"]?values["emailId"]:null;
		telephones = values["telephones"]?values["telephones"]:null;
		address = values["address"]?values["address"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select registerUser($1,$2,$3,$4,$5,$6,$7,$8)',
				[userFirstName,userLastName,username,password,mobile,emailId,telephones,address],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["registeruser"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}
});

router.post('/login',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var username,password,aRole;
	if(values!==null){
		username = values["username"]?values["username"]:null;
		password = values["password"]?values["password"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select loginUser($1,$2)',
				[username,password],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["loginuser"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["loginuser"];
								delete d["state"];
								delete d["message"];
								status["docs"].push(d);
							}
						}
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}
});

router.post('/resetPassword',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;

	var username,password;
	if(values!==null){
		newPassword = values["newPassword"]?values["newPassword"]:null;
	}

	var elementFlag = false;
		elementFlag = (newPassword && sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select userResetPassword($1,$2)',
				[sessionId,newPassword],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["userresetpassword"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});

router.post('/forgotPassword',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var username,mobile,email;
	if(values!==null){
		username = values["username"]?values["username"]:null;
		mobile = values["mobile"]?values["mobile"]:null;
		email = values["email"]?values["email"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select userForgotPasswordRequest($1,$2,$3)',
				[username,mobile,email],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["userforgotpasswordrequest"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});

router.post('/updateProfile',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var sessionId,userFirstName,userLastName,mobile,emailId,telephones,address;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
		userFirstName = values["userFirstName"]?values["userFirstName"]:null;
		userLastName = values["userLastName"]?values["userLastName"]:null;
		mobile = values["mobile"]?JSON.parse(values["mobile"]):null;
		emailId = values["emailId"]?JSON.parse(values["emailId"]):null;
		telephones = values["telephones"]?JSON.parse(values["telephones"]):null;
		address = values["address"]?JSON.parse(values["address"]):null;
	
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select updateProfile($1,$2,$3,$4,$5,$6,$7)',
				[sessionId,userFirstName,userLastName,mobile,emailId,telephones,address],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["updateprofile"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});


router.post('/updateAddress',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var uaId,sessionId,pincode,block,apartment,street,area,city,state,country,aStatus,addressKey;
	if(values!==null){
		uaId = values["uaId"]?values["userId"]:null;
		sessionId = values["sessionId"]?values["sessionId"]:null;
		pincode = values["pincode"]?values["pincode"]:null;
		block = values["block"]?values["block"]:null;
		apartment = values["apartment"]?(values["apartment"]):null;
		street = values["street"]?(values["street"]):null;
		area = values["area"]?(values["area"]):null;
		city = values["city"]?(values["city"]):null;
		state = values["state"]?(values["state"]):null;
		country = values["country"]?values["country"]:null;
		aStatus = values["aStatus"]?JSON.parse(values["aStatus"]):null;
		addressKey = values["addressKey"]?values["addressKey"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select updateUserAddress($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
				[uaId,sessionId,pincode,block,apartment,street,area,city,state,country,aStatus,addressKey],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["updateuseraddress"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						console.log(status);
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});

router.post('/list/userDetails',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var	sessionId = (req.body.sessionId)?(req.body.sessionId):null;
	

	var elementFlag = false;
		elementFlag = (sessionId)?true:false;

	if(elementFlag){
		console.log(sessionId);
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select listUserDetails($1)',
				[sessionId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listuserdetails"];
						console.log(resp);
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						status["docs"]=[];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listuserdetails"];
								delete d["state"];
								delete d["message"];
								status["docs"].push(d);
							}
						}
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});

router.post('/list/userItems',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var sessionId,userId;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
		userId = values["userId"]?values["userId"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select listUserItems($1,$2)',
				[sessionId,userId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listUserItems"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});


router.post('/logout',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;

	var elementFlag = false;
		elementFlag = (sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select logoutUser($1)',
				[sessionId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["logoutuser"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});


router.post('/list/userItemDetails',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var sessionId,userId;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
		uiId = values["uiId"]?values["uiId"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select listuseritemdetails($1,$2)',
				[sessionId,uiId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listuseritemdetails"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listuseritemdetails"];
								delete d["state"];
								delete d["message"];
								status["docs"].push(d);
							}
						}
						response(res,status);
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});


router.post('/offerGrabbed',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;
	var itemId;
	if(values!==null){
		itemId = values["itemId"]?values["itemId"]:null;
	}

	var elementFlag = false;
		elementFlag = (itemId && sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select offergrabbed($1,$2)',
				[itemId,sessionId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["offergrabbed"]?result.rows[0]["offergrabbed"]:null:null;
						if(resp){
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							status["docs"]=[];
							if(status["state"]){
								for(var i=0;i<result["rows"].length;i++){
									var d = result["rows"][i]["offergrabbed"];
									delete d["state"];
									delete d["message"];
									status["docs"].push(d);
								}
							}
							response(res,status);
						}
						else{
							status["message"]="Something went wrong.Please try again later";
							response(res,status);
						}
					}
				});
			}
		});
	}
	else{
		status["message"]="Please send values";
		response(res,status);
	}
});


router.post('/rateItem',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;
	var itemId,ratingCount,type;
	if(values!==null){
		itemId = values["itemId"]?values["itemId"]:null;
		ratingCount = values["ratingCount"]?parseInt(values["ratingCount"]):null;
		type = values["type"]?values["type"]:null;
	}

	var elementFlag = false;
		elementFlag = (itemId && sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select rateitem($1,$2,$3,$4)',
				[itemId,sessionId,ratingCount,type],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["rateitem"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						status["docs"]=[];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["rateitem"];
								delete d["state"];
								delete d["message"];
								status["docs"].push(d);
							}
						}
						response(res,status);
					}
				});
			}
		});
	}
	else{
		status["message"]="Please send values";
		response(res,status);
	}
});


router.post('/removeWishList',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;
	var itemId,type;
	if(values!==null){
		itemId = values["itemId"]?values["itemId"]:null;
		type = values["type"]?values["type"]:null;
	}

	var elementFlag = false;
		elementFlag = (itemId && sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select removeWishlist($1,$2,$3)',
				[sessionId,itemId,type],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["removewishlist"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						response(res,status);
					}
				});
			}
		});
	}
	else{
		status["message"]="Please send values";
		response(res,status);
	}
});


var leadMail = function(firstName,lastName,email,phone,houseNoAndDetails,streetDetails,landmark,area,city,pincode,callback){
	var name = (firstName?firstName:"")+(lastName?lastName:"");
	var address = (houseNoAndDetails?houseNoAndDetails+", ":"");
		address += (streetDetails?streetDetails+", ":"");
		address += (landmark?landmark+", ":"");
		address += (area?area+", ":"");
		address += (city?city+", ":"");
		address += (pincode?pincode:"");
	var html = '<div style="width:600px;margin:auto">';
	html += '<div><img src="http://api.beyondenough.in/images/logo.png"></div>';
	html += '<h2>User Details</h2>';
	html += '<div>';
		html += '<div><span> Name : </span> <span>'+name+'</span></div>';
		html += '<div><span> Email : </span> <span>'+email+'</span></div>'
		html += '<div><span> Phone : </span> <span>' +phone+'</span></div>'
		html += '<div><span> Address : </span> <span>'+address+'</span></div>'
	html += '</div>';
	callback(html);
}

router.post("/lead",function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var firstName,lastName,email,phone,area,city,pincode,landmark,houseNoAndDetails,streetDetails;
	if(values!==null){
		firstName = values["firstName"]?values["firstName"]:null;
		lastName = values["lastName"]?values["lastName"]:null;
		email = values["email"]?values["email"]:null;
		phone = values["phone"]?values["phone"]:null;
		area = values["area"]?values["area"]:null;
		city = values["city"]?values["city"]:null;
		pincode = values["pincode"]?values["pincode"]:null;
		landmark = values["landmark"]?values["landmark"]:null;
		houseNoAndDetails = values["houseNoAndDetails"]?values["houseNoAndDetails"]:null;
		streetDetails = values["streetDetails"]?values["streetDetails"]:null;
	}
	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		// send mail for lead.
		leadMail(firstName,lastName,email,phone,houseNoAndDetails,streetDetails,landmark,area,city,pincode,function(html){
			mailer.sendMails(["guhan@ditscentre.in","brijesh@itailing.in","asha@itailing.in"],"Beyond Enough Salon Lead Notifier",html, function(err, info) {
		        if (err) {
					status["message"]=err;
					response(res,status);											            
		        } 
		        else {
		           	status["state"]=true;
		           	status["message"]="Lead mail sent";
		           	response(res,status);
		        }
    		});	
		});
	}	
	else{
		status["message"]="Please send message in values";
		response(res,status);
	}

});

module.exports = router;
