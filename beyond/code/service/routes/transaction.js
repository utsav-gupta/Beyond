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

var rsToNum=function(str){
	return str.replace(/[^\d\.]/g, '');
}

function salonAppointmentMailBody(doc,paymentMode,txnId,callback){
	var html = ""
	html += '<div style="width:600px;margin:auto">';
		html += '<div><img src="http://api.beyondenough.in/images/logo.png"></div>';
		html += '<h2>User Details</h2>';
		html += '<div>';
			html += doc["userDetails"]["userfirstname"] +" "+ doc["userDetails"]["lastName"]+'<br>'
			html += doc["userDetails"]["addresses"]["block"]+" "+doc["userDetails"]["addresses"]["streetDetails"]+" "+doc["userDetails"]["addresses"]["area"]+" "+doc["userDetails"]["addresses"]["city"]+" "+doc["userDetails"]["addresses"]["pincode"]+" "+doc["userDetails"]["addresses"]["landmark"]+'<br>';
			html += doc["userDetails"]["phone"] +'<br>'
			html += doc["userDetails"]["email"] +'<br>'
			// html += doc["cartProducts"][0]["title"].split("~")[0]; 
		html += '</div>';
		html += '<h3>Appointment Details</h3>'
		html += '<div>';
			html += doc["appointmentDetails"]["date"]+" "+doc["appointmentDetails"]["time"]+'<br>';
		html += '</div>';
		html += '<h3>Service Requested</h3>';
		html += '<div style="width:100%">';
			html += '<div style="width:60%;float:left"><b>Service Name</b></div>';
			html += '<div style="width:40%;float:right"><b>Service Amount</b></div>';
		html += '</div>';
		for (var i = 0; i < doc["cartProducts"].length; i++) {
			
			html += '<div style="width:100%;margin-bottom:60px">';
				html += '<div style="width:60%;float:left">'+doc["cartProducts"][i]["title"]+'</div>';
				html += '<div style="width:40%;float:right">'+doc["cartProducts"][i]["bePrice"].replace(/[^\d\.]/g, '')+'</div>';
			html += '</div>';
			html += '<br>';
		}
			html += '<div style="width:100%">';
				html += '<div style="width:60%;float:left">Gross Value</div>';
				html += '<div style="width:40%;float:right">'+doc["orderJSon"]["orderTotal"]+'</div>';
			html += '</div>';
			html += '<div style="width:100%">';
				html += '<div style="width:60%;float:left">Discount Value</div>';
				html += '<div style="width:40%;float:right">'+doc["discount"]+'</div>';
			html += '</div>';
			html += '<div style="width:100%">';
				html += '<div style="width:60%;float:left">Actual Value</div>';
				html += '<div style="width:40%;float:right">'+(doc["orderJSon"]["orderTotal"] + doc["discount"]) +'</div>';
			html += '</div>';
			html += '<div style="width:100%">';
				html += '<div style="width:60%;float:left">Payment Mode</div>';
				html += '<div style="width:40%;float:right">'+paymentMode+'</div>';
			html += '</div>';
			html += '<div style="width:100%">';
				html += '<div style="width:60%;float:left">Transaction ID</div>';
				html += '<div style="width:40%;float:right">'+txnId+'</div>';
			html += '</div>';
	html += '</div> ';
	callback(html);
}

var insertTransactionDetail=function(transactionId,orderJson,data,callback){
	var datalen=data.length;
	var resp=[];
	var async = require("async");
	async.each(data,
		// 2nd param is the function that each item is passed to
		function(d, callback){
			var itemid=d["itemId"];
		   	var qty=parseInt(d["orderQty"]);
		   	console.log(d["bePrice"]);
			var rate=parseFloat(rsToNum(d["bePrice"]));
		   	console.log(transactionId);
		   	console.log(itemid);
		   	console.log(qty);
		   	console.log(rate);
		// Call an asynchronous function, often a save() to DB
			pgsql.connect(function(err,client,done){
				if(err){
					resp.push(err);
					callback();
				}
				else{
					client.query('select inserttransactiondetail($1,$2,$3,$4)',
						[transactionId,itemid,qty,rate],
						function(err,result){
						if(err){
							resp.push(err);
							callback();
						}
						else{
							resp.push(result);
							callback();
						}
					})
				}
			});
		},
	function(err){
		// finfished iterating through the array for clients
		// and get array of all agents for all clients
		callback(err,resp);
	});

}


router.post('/insert',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;
	var others,billingaddress,deliveryaddress,taxes,discount,bname,ipAddress,paymentMode;
	if(values!==null){

		billingaddress = values["userDetails"]["addresses"]?values["userDetails"]["addresses"]:null;	
		deliveryaddress = values["deliveryAddress"]?values["deliveryAddress"]:billingaddress;
		bname = values["userfirstname"]?values["userfirstname"]:null;	
		bname = bname+= (values["lastName"]?values["lastName"]:"");
		buyerEmail = values["userDetails"]["email"]?values["userDetails"]["email"]:null;
		buyerMobile = values["userDetails"]["mobile"]?values["userDetails"]["mobile"]:null;
		netAmount = values["orderJSon"]["orderTotal"]?parseFloat(values["orderJSon"]["orderTotal"]):0;
		discount = (values["discount"])?parseFloat(values["discount"]):0;
		others = values["others"]?values["others"]:{};
		taxes = values["taxes"]?values["taxes"]:{};
		ipAddress = (req.connection.remoteAddress).substr(7);
		paymentMode = values["others"]?values["others"]["paymentMode"]?values["others"]["paymentMode"]:null:null;
	
	}

	var elementFlag = false;
		elementFlag = (values && sessionId)?true:false;

	if(elementFlag){
		console.log("inside elemFlag");
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				console.log(JSON.stringify(status));
				response(res,status);
			}
			else{				
				client.query('select inserttransaction($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
				[sessionId,others,bname,buyerEmail,buyerMobile,netAmount,billingaddress,deliveryaddress,taxes,discount,ipAddress],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						console.log(JSON.stringify(status));
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["inserttransaction"]?result.rows[0]["inserttransaction"]:null:null;
						var tid = result.rows[1]?result.rows[1]["inserttransaction"]?result.rows[1]["inserttransaction"]:null:null;
						
						if(false){
							status["state"]=resp["status"];
							status["message"]=resp["message"];
							console.log(JSON.stringify(status));
							response(res,status);
						}
						else{
							if(tid){
								insertTransactionDetail(tid["txnId"],values["orderJSon"],values["cartProducts"],function(err,data){
									salonAppointmentMailBody(values,paymentMode,tid["txnId"],function(html){
										mailer.sendMails(["priyanka@rgbvistas.com","brijesh@itailing.in","asha@itailing.in"],"Beyond Enough Salon Booking",html, function(err, info) {
									        if (err) {
											console.log(err);											            
									        } else {
									           	console.log("Mail sent");
									        }
								    		});	
									});
									status["message"]="Transaction details inserted successfully"
									status["state"]=true;
									status["docs"]=data;
									console.log(JSON.stringify(status));
									response(res,status);	
								});
							}
							else{
								status["state"]=resp["status"];
								status["message"]=resp["message"];
								response(res,status)
							}
								
						}
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send values";
		console.log(JSON.stringify(status));
		response(res,status);
	}	
});


router.post('/update',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var sessionId = (req.body.sessionId)?(req.body.sessionId):null;

	var txnId,firstname,lastname,buyerEmail,buyerMobile,billingAddress,deliveryAddress
	var sessionId,itemList,cartPrice;
	
	if(values!==null){
		txnId = values["txnId"]?values["txnId"]:null;
		billingaddress = values["userDetails"]["addresses"]?values["userDetails"]["addresses"]:null;	
		deliveryaddress = values["deliveryAddress"]?values["deliveryAddress"]:billingaddress;
		bname = values["userfirstname"]?values["userfirstname"]:null;	
		bname = bname+= (values["lastName"]?values["lastName"]:"");
		buyerEmail = values["userDetails"]["email"]?values["userDetails"]["email"]:null;
		buyerMobile = values["userDetails"]["mobile"]?values["userDetails"]["mobile"]:null;
		discount = (values["discount"])?parseFloat(values["discount"]):0;
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
				client.query('select updatetransaction($1,$2,$3,$4,$5,$6,$7,$8)',
				[txnId,sessionId,bname,buyerEmail,buyerMobile,billingAddress,deliveryAddress,discount],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["updatetransaction"]?result.rows[0]["updatetransaction"]:null:null;
						if(resp){
							status["state"]=resp["status"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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


router.post('/list',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	var limit,offset;
	if(values!==null){
		limit = values["limit"]?parseInt(values["limit"]):10;
		offset = (values["offset"])?parseInt(values["offset"]):0;
	}

	var sessionId;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
	}

	var elementFlag = false;
		elementFlag = (values && sessionId)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select listTransaction($1,$2,$3)',
				[sessionId,limit,offset],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						// console.log(result);
						var resp = result.rows[0]?result.rows[0]["listtransaction"]?result.rows[0]["listtransaction"]:null:null;
						if(resp){
							// console.log(resp);
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							status["docs"]=[];
							// console.log(status);
							if(status["state"]){
								for(var i=0;i<result["rows"].length;i++){
									var d = result["rows"][i]["listtransaction"];
									delete d["state"];
									delete d["message"];
									status["docs"].push(d);
								}
							}
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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


router.post('/list/details',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var sessionId,transactionId;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
		transactionId = values["transactionId"]?values["transactionId"]:null;
	}

	var elementFlag = false;
		elementFlag = (transactionId && sessionId)?true:false;

	if(elementFlag){
		console.log(values)
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select listTransactionDetail($1,$2)',
				[sessionId,transactionId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						console.log(result);
						var resp = result.rows[0]?result.rows[0]["listtransactiondetail"]?result.rows[0]["listtransactiondetail"]:null:null;
						if(resp){
							// console.log(resp);
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							status["docs"]=[];
							// console.log(status);
							if(status["state"]){
								for(var i=0;i<result["rows"].length;i++){
									var d = result["rows"][i]["listtransactiondetail"];
									console.log(d);
									delete d["state"];
									delete d["message"];
									status["docs"].push(d);
								}
							}
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
							response(res,status);
						}
					}
				});
			}
		});
	}	
	else{
		status["message"]="Please send sessionId and transactionId";
		response(res,status);
	}	
});



router.post('/pgResponse',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var transactionId,pgResponse;
	if(values!==null){
		transactionId = values["transactionId"]?values["transactionId"]:null;
		pgResponse = values["pgResponse"]?values["pgResponse"]:null;
	}

	var elementFlag = false;
		elementFlag = (transactionId && pgResponse)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select updatePgResponse($1,$2)',
				[transactionId,pgResponse],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["updatepgreponse"]?result.rows[0]["updatepgreponse"]:null:null;
						if(resp){
							status["state"]=resp["status"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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

router.post('/insert/transactionDetail',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var itemId,qty,rate,amount;
	if(values!==null){
		itemId = values["itemId"]?values["itemId"]:null;
		qty = values["qty"]?parseInt(values["qty"]):null;
		rate = values["rate"]?parseFloat(values["rate"]):null;
		amount = values["amount"]?parseFloat(values["amount"]):null;
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
				client.query('select insertTransactionDetail($1,$2,$3,$4)',
				[itemId,qty,rate,amount],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["inserttransactiondetail"]?result.rows[0]["inserttransactiondetail"]:null:null;
						if(resp){
							status["state"]=resp["status"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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


var updateTransactionDetail=function(sessionId,txnId,data,callback){
	
	var datalen=data.length;
	var resp=[];
	var async = require("async");
	async.each(data,
		// 2nd param is the function that each item is passed to
		function(d, callback){
			var itemId=d["itemId"];
		   	var qty=d["qty"];
		   	var rate=d["bePrice"]?parseInt(d["bePrice"]):d["bePrice"];
		   	var type = d["type"];
			console.log(txnId);
		   	if(type){
			// Call an asynchronous function, often a save() to DB
				pgsql.connect(function(err,client,done){
					if(err){
						resp.push(err);
						callback();
					}
					else{				
						client.query('select updatetransactiondetail($1,$2,$3,$4,$5,$6)',
							[sessionId,txnId,itemId,qty,rate,type],
							function(err,result){
							if(err){
								resp.push(err);
								callback();
							}
							else{
								resp.push(result);
								callback();
							}
						})
					}
				});
			}
			else{
				callback();
			}
		},
	function(err){
		// finfished iterating through the array for clients
		// and get array of all agents for all clients
		callback(err,resp);
	});

}

router.post('/update/transactionDetail',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var txnId,sessionId,itemList;
	if(values!==null){
		sessionId = values["sessionId"]?values["sessionId"]:null;
		txnId = values["txnId"]?values["txnId"]:null;
		itemList = values["itemList"]?values["itemList"]:null;
	}

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		updateTransactionDetail(sessionId,txnId,itemList,function(err,resp){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				status["state"]=resp[0]["rows"][0]["updatetransactiondetail"]["state"]
				status["message"]=resp[0]["rows"][0]["updatetransactiondetail"]["message"]
				status["docs"]=resp;
				response(res,status);
			}
		});	
	}	
	else{
		status["message"]="Please send values";
		response(res,status);
	}	
});


router.post('/view/transactionDetail',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var txnId;
	if(values!==null){
		txnId = values["txnId"]?values["txnId"]:null;
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
				client.query('select viewTransactionDetails($1)',
				[txnId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["viewtransactiondetails"]?result.rows[0]["viewtransactiondetails"]:null:null;
						if(resp){
							status["state"]=resp["status"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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


router.post("/updateCardDetails",function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var txnId,cardDetails,netAmount,discount;
	if(values!==null){
		txnId = values["txnId"]?values["txnId"]:null;
		cardDetails = values["cardDetails"]?values["cardDetails"]:null;
		netAmount = values["netAmount"]?values["netAmount"]:null;
		discount = values["discount"]?values["discount"]:null;
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
				client.query('select updatecardDetails($1,$2,$3,$4)',
				[txnId,cardDetails,netAmount,discount],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]["updatecarddetails"]?result.rows[0]["updatecarddetails"]:null:null;
						if(resp){
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["message"]="Sorry! Something went wrong."
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

module.exports = router;
