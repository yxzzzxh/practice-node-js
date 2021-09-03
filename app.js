const http = require('http');
const url = require('url');
const queryString = require('querystring')

const users = require('./users.js') // '사용자 관리' 모듈 로드

var server = http.createServer((req, res) => { // Http 서버 생성 및 요청 처리
        var method = req.method;
        var uri = url.parse(req.url, true);
        var pathname = uri.pathname;

        if(method === "POST" || method === "PUT") { // POST와 PUT이면 params을 위한 데이터를 읽음 >>>>> 뭔소리지
            var body = "";

            req.on('data', function (data) {
                body += data;
            })

            req.on('end', function (){
                var params;
                // 헤더 정보가 json이면 처리
                if (req.headers['content-type'] == "application/json") {
                    params = JSON.parse(body);
                } else {
                    params = queryString.parse(body);
                }
                onRequest(res, method, pathname, params);
            });
        } else {
            // GET와 DELETE면 query 정보를 읽음
            onRequest(res, method, pathname, uri.query);
        }
}).listen(8000);

function onRequest(res, method, pathname, params) { // 기능별 호출
    switch (pathname) {
        case "/users/register-user":
        case "/users/get-address":
        case "/users/update-password":
        case "/users/update-address":
            users.onRequest(res, method, pathname, params, response);
            break;
        default:
            res.writeHead(404); // 정의되지 않은 요청이면, 404 에러 리턴
            return res.end();
    }
}

function response(res, packet) {  // JSON 형식의 응답
    res.writeHead(200, { 'Content-Type' : 'application/json'});
    res.end(JSON.stringify(packet));
}