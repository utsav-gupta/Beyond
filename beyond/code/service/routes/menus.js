// Menus File
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

// 
router.post('/update',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	var values = (req.body.values)?JSON.parse(req.body.values):null;

	var menuId,menuName,parentId,menuType,displayStatus;
	if(values!==null){
		menuId = values["menuId"]?values["menuId"]:null;
		menuName = values["menuName"]?values["menuName"]:null;
		parentId = (values["parentId"] || values["parentId"]==0)?values["parentId"]:null;
		menuType = values["menuType"]?values["menuType"]:null;
		displayStatus = values["displayStatus"]?JSON.parse(values["displayStatus"]):null;
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
				client.query('select tempupdatemenu($1,$2,$3,$4,$5)',
				[menuId,menuName,parentId,menuType,displayStatus],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
						pgsql.sendErrorMail("PGSql Error",JSON.stringify(err),JSON.stringify(values),function(err,doc){

						});
					}
					else{
						var resp = result.rows[0]["tempupdatemenu"];
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
				client.query('select listMenu()',
				[],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						var resp = result.rows[0]["listmenu"];
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						status["docs"]=[];
						if(status["state"]){
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listmenu"];
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

router.post('/list/MenuDetails',function(req,res){
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
				client.query('select listMenuDetails($1)',
				[menuId],
				function(err,result){
					// release the client back to the pool.
					done();
					if(err){
						status["message"]=err;
						response(res,status);
					}
					else{
						if(result.rows[0]){
							var resp = result.rows[0]["listmenudetails"];
							status["state"]=resp["state"];
							status["message"]=resp["message"];
							response(res,status);
						}
						else{
							status["state"]=false;
							status["message"]="Please check your menuId";
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

