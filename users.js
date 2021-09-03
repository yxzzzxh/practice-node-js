const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'yxzzzxh',
    password: '123',
    database: 'sample'
};

// 사용자 관리의 각 기능별로 분기를 태움
exports.onRequest = function (res, method, pathname, params, cb) {
    /*
    switch (method) {
        case "POST":
            return createUser(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
        case "GET":
            return getAddress(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
        case "PUT":
            if ( pathname == '/users/updatePassword') {
                return updatePassword(method, pathname, params, (response) => {
                    process.nextTick(cb, res, response);});
            } else {
                return updateAddress(method, pathname, params, (response) => {
                    process.nextTick(cb, res, response);});
            } 
    }
    */
    switch (pathname) {
        case "/users/register-user":
            return createUser(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
        case "/users/get-address":
            console.log(params);
            return getAddress(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
        case "/users/update-password":
            return updatePassword(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
        case "/users/update-address":
            return updateAddress(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);});
    }
}

function createUser(method, pathname, params, cb) { // 사용자 등록
    console.log("Start to register user...");
    var response = {
        errorcode: 0,
        errormessage: "success"
    }

    if( params.userId == "" || params.userPasswd == "" || params.userAddress == "" ) { // 유효성 검사
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("insert into users(id, password, address) values('" + params.userId +"' , '" + params.userPasswd +"' ,'" + params.userAddress +"')"
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = "Query Error";
                }
                cb(response);
            });
        connection.end();
    }
}

function getAddress(method, pathname, params, cb) { // 사용자 주소 조회
    console.log("Start to get user's address..."); 
    var response = {
        errorcode: 0,
        errormessage: "success"
    }

    if (params.userId == "") {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select address from users where id='" + params.userId + "';", 
            (error, results, fields) => {
                if (error || results.length == 0) {
                    response.errorcode = 1;
                    response.errormessage = "Query Error";
                } else {
                    console.log(results); // 왜 자꾸 undefined가 뜰까?
                    response.address = results[0].address;
                }

                cb(response);
            }
        );
        connection.end();
    }
}

function updatePassword(method, pathname, params, cb) { // 사용자 비밀번호 변경 - 인증하고 변경
    var response = {
        errorcode: 0,
        errormessage: "success"
    }

    if( params.userId == "" || params.userPasswd == "" || params.newPasswd == "" ) { // 유효성 검사
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        // 사용자 인증 후 새 비밀번호로 변경
        connection.query("select index from users where id = '" + params.userId +"' and password = '" + params.userPasswd +"' ;"
            , (error, results, fields) => {
                if (error || results.length == 0) {
                    response.errorcode = 1;
                    response.errormessage = error ? error : "Invalid id or password";
                    
                    cb(response);
                } else {
                    connection.query("update users set password = '" + params.newPasswd +"' where id = '" + params.userId +"';"
                    , (error, results, fields) => {
                        if (error) {
                            response.errorcode = 1;
                            response.errormessage = "Query Error";
                        }
                        cb(response);
                    });
                }
            });
        connection.end();
    }
}

function updateAddress(method, pathname, params, cb) { // 사용자 주소 변경
    var response = {
        errorcode: 0,
        errormessage: "success"
    }

    if( params.userId == "" || params.userPasswd == "" || params.newAddress == "" ) { // 유효성 검사
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        // 사용자 인증 후 새 주소로 변경
        connection.query("select index from users where id = '" + params.userId +"' and password = '" + params.userPasswd +"' ;"
            , (error, results, fields) => {
                if (error || results.length == 0) {
                    response.errorcode = 1;
                    response.errormessage = error ? error : "Invalid id or password";
                    
                    cb(response);
                } else {
                    connection.query("update users set address = '" + params.newAddress +"' where id = '" + params.userId +"';"
                    , (error, results, fields) => {
                        if (error) {
                            response.errorcode = 1;
                            response.errormessage = "Query Error";
                        }
                        cb(response);
                    });
                }
            });
        connection.end();
    }
}