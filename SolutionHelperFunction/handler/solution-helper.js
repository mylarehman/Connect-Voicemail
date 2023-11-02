!function(e,t){for(var n in t)e[n]=t[n]}(exports,function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1205)}({1205:function(e,t,n){"use strict";console.log("Loading function");const o=n(8),r=n(15),s=n(19);let i=n(3),l=new i.S3;const u=n(16);let c=new i.APIGateway;t.handler=(e,t,n)=>{let o="FAILED",r={};console.log("Request type: "+e.RequestType),"Create"===e.RequestType?"createUuid"===e.ResourceProperties.customAction?(o="SUCCESS",r={UUID:s.v4()},a(e,n,t.logStreamName,o,r)):"copyWebAssets"===e.ResourceProperties.customAction&&f(e.ResourceProperties,(function(s,i){s?(r={Error:"Copy of website assets failed"},console.log([r.Error,":\n",s].join(""))):(o="SUCCESS",r={}),a(e,n,t.logStreamName,o,r)})):"Delete"===e.RequestType?(o="SUCCESS",a(e,n,t.logStreamName,o,r)):"copyWebAssets"===e.ResourceProperties.customAction&&f(e.ResourceProperties,(function(s,i){s?(r={Error:"Copy of website assets failed"},console.log([r.Error,":\n",s].join(""))):(o="SUCCESS",r={}),a(e,n,t.logStreamName,o,r)}))};let a=function(e,t,n,s,i){const l=JSON.stringify({Status:s,Reason:"See the details in CloudWatch Log Stream: "+n,PhysicalResourceId:n,StackId:e.StackId,RequestId:e.RequestId,LogicalResourceId:e.LogicalResourceId,Data:i}),u=r.parse(e.ResponseURL),c={hostname:u.hostname,port:443,path:u.path,method:"PUT",headers:{"Content-Type":"","Content-Length":l.length}},a=o.request(c,e=>{t(null,"Successfully sent stack response!")});a.on("error",e=>{console.log("sendResponse Error:\n",e),t(e)}),a.write(l),a.end()},f=function(e,t){let n=e.SourceBucket,o=e.SourcePrefixKey,r=e.DestBucket,s=e.BaseApi,i=e.ApiGatewayKey,l=e.CognitoDomain,a=e.ClientId,f=e.UserPoolId,m=e.RedirDomain;p(n,o+"asset-manifest.json",(function(e,p){if(e)return console.log(e),t(e,null);u.readFile("/tmp/web-site-manifest.json","utf8",(function(e,u){if(e)return console.log(e),t(e,null);let p=d(u);if(!p)return t("Unable to validate downloaded manifest file JSON",null);c.getApiKey({apiKey:i,includeValue:!0},(function(e,i){let u=y(p.files);g(u,0,r,n,o,s,i,l,a,f,m,(function(e,n){return e?t(e,null):t(null,"success")}))}))}))}))},p=function(e,t,o){let r={Bucket:e,Key:t};l.headObject(r,(function(e,t){if(e&&console.log(e),e&&"NotFound"===e.code)return o("Manifest file was not found.",null);{let e=n(16).createWriteStream("/tmp/web-site-manifest.json");l.getObject(r).on("httpData",(function(t){e.write(t)})).on("httpDone",(function(){return e.end(),console.log("website manifest downloaded for processing..."),o(null,"success")})).send()}}))},d=function(e){try{return JSON.parse(e)}catch(e){return console.log("Manifest file contains invalid JSON."),null}},g=function(e,t,n,o,r,s,i,u,c,a,f,p){if(e.length>t)if(e[t].startsWith("static")&&(e[t].endsWith("js")||e[t].endsWith("map"))){let d={Bucket:o,Key:r+e[t]};l.getObject(d,(function(d,y){let m=y.Body.toString("utf-8");m=m.replace(/__BASE_API__/g,s).replace(/__API_KEY__/g,i.value).replace(/__C_DOMAIN__/g,u).replace(/__C_POOL__/g,a).replace(/__C_CLIENT_ID__/g,c).replace(/__C_REDIR__/g,f);let _={Body:m,Bucket:n,Key:e[t],ContentType:"application/javascript"};l.putObject(_,(function(e,t){e&&console.log("Error putting: "+e)})),g(e,t+1,n,o,r,s,i,u,c,a,f,(function(e,t){if(e)return p(e,null);p(null,t)}))}))}else{let d={Bucket:n,Key:e[t],CopySource:o+"/"+r+e[t],MetadataDirective:"REPLACE"};e[t].endsWith(".htm")||e[t].endsWith(".html")?d.ContentType="text/html":e[t].endsWith(".css")?d.ContentType="text/css":e[t].endsWith(".js")?d.ContentType="application/javascript":e[t].endsWith(".png")&&(d.ContentType="image/png"),l.copyObject(d,(function(l,d){if(l)console.log(["error copying ",[r,e[t]].join(""),"\n",l].join(""));else{console.log([[r,e[t]].join("/"),"uploaded successfully"].join(" ")),g(e,t+1,n,o,r,s,i,u,c,a,f,(function(e,t){if(e)return p(e,null);p(null,t)}))}}))}else p(null,[t,"files copied"].join(" "))},y=function(e){let t=["asset-manifest.json","manifest.json","favicon.ico","robots.txt","images/ContactFlowIcon.png","images/ContactFlowIcon_2x.png","images/ContactFlowIcon_3x.png","images/logo80.png","images/logo80_2x.png"];for(var n in e)t.push(e[n].substring(1));return t}},15:function(e,t){e.exports=require("url")},16:function(e,t){e.exports=require("fs")},19:function(e,t){e.exports=require("uuid")},3:function(e,t){e.exports=require("aws-sdk")},8:function(e,t){e.exports=require("https")}}));
//# sourceMappingURL=solution-helper.js.map