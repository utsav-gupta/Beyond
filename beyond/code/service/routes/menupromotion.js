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

var bigInt = require("big-integer");

router.post('/update',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var menuId,promotionId,itemId;
	if(values!==null){
		menuId = values["menuId"]?values["menuId"]:null;
		promotionId = values["promotionId"]?values["promotionId"]:null;
		itemId = values["itemId"]?values["itemId"]:null
		pStatus = values["pStatus"]?JSON.parse(values["pStatus"]):null;
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
				client.query('select updatetempmenupromotion($1,$2,$3,$4)',
				[promotionId,menuId,itemId,pStatus],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["updatetempmenupromotion"];
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
				client.query('select listMenuPromotion($1)',
				[menuId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listmenupromotion"];
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


router.post('/listDetails',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var menuPromotionId;
	if(values!==null){
		menuPromotionId = values["menuPromotionId"]?values["menuPromotionId"]:null;
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
				client.query('select listmenupromotiondetails($1)',
				[menuPromotionId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listmenupromotiondetails"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listscattributesdetail"];
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
module.exports = router;