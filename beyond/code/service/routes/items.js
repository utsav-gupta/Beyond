// items file
// sub category file
var PGSql = require('../routes/server').PGSql;
var pgsql = new PGSql();

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

/*
public.tempupdateitems(
  _menuid bigint,
  _itemid bigint,
  _sku character varying,
  _itemname character varying,
  _displaypic character varying,
  _title character varying,
  _subtitle character varying,
  _shortdescription character varying,
  _overview text,
  _inthebox text,
  _shippingdetails character varying,
  _mrp numeric,
  _beprice numeric,
  _discountrate integer,
  _bedealdescription character varying,
  _otherdetails json,
  _specialdealtype character varying,
  _specialdealvalue integer,
  _tags json,
  _displaystatus boolean,
  _qty integer,
  _ratingcount numeric,
  _likecount numeric,
  _sequence integer,
  _viewcount integer)
*/

router.post('/update',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?(JSON.parse(req.body.values)):null;
	var menuId,itemId,sku,itemName,displayPic,title,subTitle,shortDescription,overview,inTheBox,shippingDetails,mrp,bePrice,discountRate,beDealDescription,otherDetails,specialDealType,specialDealValue,tags,displayStatus,qty,ratingCount,likeCount,sequence,viewCount;
	var validityFrom,validityTo,brand;
	if(values!==null){

		menuId = values["menuId"]?values["menuId"]:null;
		itemId = values["itemId"]?values["itemId"]:null;
		sku = values["sku"]?values["sku"]:null;
		itemName = values["itemName"]?values["itemName"]:null;
		displayPic = values["displayPic"]?values["displayPic"]:null;
		title = values["title"]?values["title"]:null;
		subTitle = values["subTitle"]?values["subTitle"]:null;
		shortDescription = values["shortDescription"]?values["shortDescription"]:null;
		overview = values["overview"]?values["overview"]:null;
		inTheBox = values["inTheBox"]?values["inTheBox"]:null;
		shippingDetails = values["shippingDetails"]?values["shippingDetails"]:null;
		mrp = values["mrp"]?parseFloat(values["mrp"]):null;
		bePrice = values["bePrice"]?parseFloat(values["bePrice"]):null;
		discountRate = values["discountRate"]?parseInt(values["discountRate"]):null;
		beDealDescription = values["beDealDescription"]?values["beDealDescription"]:null;
		otherDetails = values["otherDetails"]?JSON.parse(values["otherDetails"]):null;
		specialDealType = values["specialDealType"]?(values["specialDealType"]):null;
		specialDealValue = values["specialDealValue"]?parseInt(values["specialDealValue"]):null;
		tags = values["tags"]?values["tags"]:null;
		displayStatus = values["displayStatus"]?JSON.parse(values["displayStatus"]):null;
		qty = values["qty"]?parseInt(values["qty"]):null;
		ratingCount = values["ratingCount"]?parseInt(values["ratingCount"]):null;
		likeCount = values["likeCount"]?parseInt(values["likeCount"]):null;
		sequence = values["sequence"]?parseInt(values["sequence"]):null;
		viewCount = values["viewCount"]?parseInt(values["viewCount"]):null;	
		validityFrom = values["validityFrom"]?values["validityFrom"]:null;
		validityTo = values["validityTo"]?values["validityTo"]:null;
		brand = values["brand"]?values["brand"]:null;
	}

	console.log(values);

	var elementFlag = false;
		elementFlag = (values)?true:false;

	if(elementFlag){
		pgsql.connect(function(err,client,done){
			if(err){
				status["message"]=err;
				response(res,status);
			}
			else{
				client.query('select tempupdateitems($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)',
				[menuId,itemId,sku,itemName,displayPic,title,subTitle,shortDescription,overview,inTheBox,shippingDetails,mrp,bePrice,discountRate,beDealDescription,otherDetails,specialDealType,specialDealValue,tags,displayStatus,qty,ratingCount,likeCount,sequence,viewCount,validityTo,validityFrom,brand],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
						// send mail
						pgsql.sendErrorMail("PGSql Error",JSON.stringify(err),JSON.stringify(values),function(err,doc){

						});
					}
					else{
						var resp = result.rows[0]["tempupdateitems"];
						//console.log(resp);
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

router.post('/list',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var menuId;

	if(values!==null){
		menuId = values["menuId"]?values["menuId"]:null;
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
				client.query('select listItems($1)',
				[menuId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]?result.rows[0]['listitems']?result.rows[0]['listitems']:null:null;
						if(resp){
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						status["docs"]=[];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listitems"];
								delete d["state"];
								delete d["message"];
								status["docs"].push(d);
							}
						}
						response(res,status);
						}
						else{
							status["message"]="No records returned";
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

router.post('/listDetails',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var menuId,itemId;

	if(values!==null){
		menuId = values["menuId"]?values["menuId"]:null;
		itemId = values["itemId"]?values["itemId"]:null;
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
				client.query('select listItemDetails($1,$2)',
				[menuId,itemId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						if(result.rows.length>0){
							var resp = result.rows[0]["listitemdetails"];
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							status["docs"]=[];
							if(status["state"]){
								for(var i=0;i<result["rows"].length;i++){
									var d = result["rows"][i]["listitemdetails"];
									delete d["state"];
									delete d["message"];
									status["docs"].push(d);
								}
							}
							response(res,status);
						}
						else{
							status["message"]="Please check your itemId and menuId";
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



router.post('/list/attributeValueDetails',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var iavId;
	if(values!==null){
		iavId = values["iavId"]?values["iavId"]:null;
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
				client.query('select listitemattributevaluesdetails($1)',
				[iavId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						if(result.rows.length>0){
							var resp = result.rows[0]["listitemattributevaluesdetails"];
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							status["docs"]=[];
							if(status["state"]){
								for(var i=0;i<result["rows"].length;i++){
									var d = result["rows"][i]["listitemattributevaluesdetails"];
									delete d["state"];
									delete d["message"];
									status["docs"].push(d);
								}
							}
							response(res,status);
						}
						else{
							status["message"]="Please check your itemId and menuId";
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


router.post('/update/attributeValue',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var itemId,iavId,scaId,iavValues;
	if(values!==null){
		itemId = values["itemId"]?values["itemId"]:null;
		iavId = values["iavId"]?values["iavId"]:null;
		scaId = values["scaId"]?values["scaId"]:null;
		iavValues = values["iavValues"]?JSON.parse(values["iavValues"]):null;
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
				client.query('select updatetempitemattributevalues($1,$2,$3,$4)',
				[itemId,iavId,scaId,iavValues],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["updatetempitemattributevalues"];
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

module.exports = router;