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

	var templateId,menuId,templateName,templateType,status;
	if(values!==null){
		menuId = values["menuId"]?values["menuId"]:null;
		templateId = values["templateId"]?values["templateId"]:null;
		templateName = values["templateName"]?values["templateName"]:null;
		templateType = values["templateType"]?values["templateType"]:null;
		tStatus = values["tStatus"]?JSON.parse(values["tStatus"]):null;
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
				client.query('select tempupdatetemplatedata($1,$2,$3,$4,$5)',
				[templateId,menuId,templateName,templateType,tStatus],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["tempupdatetemplatedata"];
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
				client.query('select listTemplateData($1)',
				[menuId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listtemplatedata"];
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