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


router.get('/todayTransactions',function(req,res){
	var status = {"state":false,"message":"","docs":[]};
	pgsql.connect(function(err,client,done){
		if(err){
			status["message"]=err;
			response(res,status);
		}
		else{
			client.query('select listtransactionToday($1)',
			['test'],
			function(err,result){
				// release the client back to the pool.
				done();
				if(err){
					status["message"]=err;
					response(res,status);
				}
				else{
					var resp = result.rows[0]?result.rows[0]["listtransactiontoday"]?result.rows[0]["listtransactiontoday"]:null:null;
					if(resp){
						status["state"]=resp["state"];
						status["message"]=resp["message"];
						
						if(status["state"]){
							status["message"]="Mail sent";
							for(var i=0;i<result["rows"].length;i++){
								var d = result["rows"][i]["listtransactiontoday"];
								status["docs"].push(d);
								if(i==result["rows"].length-1){
									purifyData(status["docs"],function(mergeDocs){
										transactions(mergeDocs,function(html){
											mailer.sendMails(["priyanka@rgbvistas.com","brijesh@itailing.in","asha@itailing.in"],"Beyond Enough Today's Transaction",html, function(err, info) {
										        if (err) {
												console.log(err);											            
										        } else {
										           	console.log("Mail sent");
										        }
									    	});	
										});
									});
								}
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
});

var mailBody = function(data,callback){
	var html = '';
	var keys = Object.keys(data[0]);
		html += '<div style="margin:auto;width:600px;background-color:#f8f8f8;color:#636363">';
			html+='<table>';
			html+= '<thead>';
				html+='<tr>';
				html+='<th>Transaction Details</th>';
				html+='<th>User Details</th>';
				html+='</tr>';
			html+='</thead>';
				html+='<tbody>';
				
				html+='</tbody>';
			html+='</table>';
		html += '</div>';

	callback(html);	
}

var a = [{
		"state": true,
		"message": "List  transaction Records",
		"txnId": "1352901084292580524",
		"timestamp": "2016-10-03T12:39:58.810927",
		"txnValue": "₹ 1,599.00",
		"netamount": "₹ 1,599.00",
		"discount": "₹ 0.00",
		"status": "true",
		"taxes": {},
		"taxesValue": null,
		"others": {},
		"otherValue": null,
		"userId": 1325972063927666200,
		"netAmount": "₹ 1,599.00",
		"pgResponse": null,
		"buyername": "null",
		"buyer_email": "piya12",
		"buyer_mobile": "9022922069",
		"billing_address": {
			"block": "c5",
			"apartment": "Hill top society",
			"City": "Thane"
		},
		"delivery_address": {
			"block": "c5",
			"apartment": "Hill top society",
			"City": "Thane"
		}
	
}, {
		"state": true,
		"message": "List  transaction Records",
		"txnId": "1352907982421099699",
		"timestamp": "2016-10-03T12:53:41.129817",
		"txnValue": "₹ 4,797.00",
		"netamount": "₹ 4,797.00",
		"discount": "₹ 0.00",
		"status": "true",
		"taxes": {},
		"taxesValue": null,
		"others": {},
		"otherValue": null,
		"userId": 1325972063927666200,
		"netAmount": "₹ 4,797.00",
		"pgResponse": null,
		"buyername": "null",
		"buyer_email": "piya12",
		"buyer_mobile": "9022922069",
		"billing_address": {
			"block": "c5",
			"apartment": "Hill top society",
			"City": "Thane"
		},
		"delivery_address": {
			"block": "c5",
			"apartment": "Hill top society",
			"City": "Thane"
		}
	
}, {
		"txnId": "1352901084292580524",
		"txndetId": "1352901084393243821",
		"itemId": "1338923544351868425",
		"quantity": 1,
		"rate": "₹ 1,599.00",
		"amount": "₹ 1,599.00"
	
}, {
		"txnId": "1352907982421099699",
		"txndetId": "1352907982504985780",
		"itemId": "1338923544351868425",
		"quantity": 3,
		"rate": "₹ 1,599.00",
		"amount": "₹ 4,797.00"
}]

var purifyData = function(data,callback){
	var transactions = [];
	var transactionDetails;
	for( var i = 0 ; i < data.length; i++){
		if(data[i]["message"]){
			delete data[i]["state"];
			delete data[i]["message"];
			transactions.push(data[i])
			data.splice(i,1);
			i--;
		}
		else{
			transactionDetails=data;
			break;
		}
	}	
	var doc={
		transactions:transactions,
		transactionDetails:transactionDetails
	}
	mergeTransactionDetails(doc,function(mergeDocs){
		callback(mergeDocs)
	});
	
}

function mergeTransactionDetails(doc, callback){
	var mc=[];
	var t= doc["transactions"]
	var td = doc["transactionDetails"]
	t.forEach(function(d){
		var tda= [];
		for (var i = 0; i < td.length; i++){
			if (td[i]["txnId"]==d["txnId"]){
				tda.push(td[i]);
				td.splice(i,1);
				i--;
			}
		} // end of td iteration
		d["transactionDetails"]=tda;
		mc.push(d);
	}); // end of t iteration
	callback(mc);
}

function transactionDetails(tds,callback){
	var hh = ""
	for (var i=0; i<tds.length;i++){
		
		hh+='<div style="width:600px;">';
			hh+='<div style="width:150px;float:left">'+tds[i]['itemId']+'</div>';
			hh+='<div style="width:240px;float:left">'+tds[i]['itemName']+'</div>';
			hh+='<div style="width:40px;float:left">'+tds[i]['quantity']+'</div>';
			hh+='<div style="width:80px;float:left">'+tds[i]['rate']+'</div>';
			hh+='<div style="width:80px;float:left">'+tds[i]['amount']+'</div>';
		hh+='</div>';
	}
	callback(hh);
}



function transactions(ts, callback){
	var h = '';
	for ( var i = 0; i < ts.length; i++){
		h += '<div style="width:600px; min-height:200px">'
		h+='<div style="width:290px; float:left">'
			h+='<div style="width:100px;float:left">Txn No</div><div style="width:180px;float:left">'+ts[i]["txnId"]+'</div></br>'
			h+='<div style="width:100px;float:left">Txn Date</div><div style="width:180px;float:left">'+new Date(ts[i]["timestamp"])+'</div></br>'
		h+='</div>'
		h+='<div style="width:290px;float:left">'
			h+='<div style="width:100px;float:left">Buyer Name</div>'
			h+='<div style="width:180px;float:left">'+ts[i]['buyername']+'</div></br>'
			h+='<div style="width:100px;float:left">Buyer Mobile</div><div style="width:180px;float:left">'+ts[i]['buyer_mobile']+'</div></br>'
			h+='<div style="width:100px;float:left">Buyer Email</div><div style="width:180px;float:left">'+ts[i]['buyer_email']+'</div> </br>'	
		h+='</div>'
		h+='<div>'
		var billAddr = ts[i]['billing_address']['block']?ts[i]['billing_address']['block']+',':'';
			billAddr += ts[i]['billing_address']['apartment']?ts[i]['billing_address']['apartment']+',':'';
			billAddr += ts[i]['billing_address']['area']?ts[i]['billing_address']['area']+',':'';
			billAddr += ts[i]['billing_address']['City']?ts[i]['billing_address']['City']+',':'';
			billAddr += ts[i]['billing_address']['pincode']?ts[i]['billing_address']['pincode']+',':'';
			billAddr += ts[i]['billing_address']['landmark']?ts[i]['billing_address']['landmark']:'';
		
		h+='<div style="width:150px;float:left">Billing Address</div><div style="width:440px;float:left">'+billAddr+'</div></br>'
		var delAddr = ts[i]['delivery_address']['block']?ts[i]['delivery_address']['block']+',':'';
			delAddr += ts[i]['delivery_address']['apartment']?ts[i]['delivery_address']['apartment']+',':'';
			delAddr += ts[i]['delivery_address']['area']?ts[i]['delivery_address']['area']+',':'';
			delAddr += ts[i]['delivery_address']['City']?ts[i]['delivery_address']['City']+',':'';
			delAddr += ts[i]['delivery_address']['pincode']?ts[i]['delivery_address']['pincode']+',':'';
			delAddr += ts[i]['delivery_address']['landmark']?ts[i]['delivery_address']['landmark']:'';
		
		h+='<div style="width:150px;float:left">Delivery Address</div><div style="width:440px;float:left">'+delAddr+'</div></br>';
		h+='</div>';
		h+='<div>';
			h+='<h2>Item Details</h2>';
			h+='<div style="width:600px;">';
				h+='<div style="width:150px;float:left">Item Id</div>';
				h+='<div style="width:240px;float:left">Item Name</div>';
				h+='<div style="width:40px;float:left">Qty</div>';
				h+='<div style="width:80px;float:left">Price</div>';
				h+='<div style="width:80px;float:left">Amount</div>';
			h+='</div>'

			transactionDetails(ts[i]["transactionDetails"], function(d){
				
				h+=d;
				//h+='\r\n';
				h+='<div style="width:190px; float:left;">Amount</div>';
				h+='<div style="width:370px;float:left;text-align:right;">'+ts[i]['txnValue']+'</div>';
				h+='<div style="width:190px; float:left;">Discount</div>';
				h+='<div style="width:370px;float:left;text-align:right;">'+ts[i]['discount']+'</div>';
				h+='<div style="width:190px; float:left;">Net Amount</div>';
				h+='<div style="width:370px;float:left;text-align:right;">'+ts[i]['netamount']+'</div>';
				h+='</div>';
				// h+='\r\n';
				// h+='<hr>';
			})
		h+='</div>'
	}
	callback(h);
}

module.exports = router;
