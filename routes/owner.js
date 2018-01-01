
var addOwner = function (req, res, callback) {
    console.log('/owner/add_owner 호출됨');

    var database = req.app.get('database');
    var files = req.files;
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramPhoneNum = req.body.phoneNumber || req.query.phoneNumber;
    var paramGender = req.body.gender || req.query.gender;
    var crypto = require('crypto');
    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashpass = crypto.createHash("sha512").update(paramPw + salt).digest("hex");
    //  var paramProfilePic = req.body.profilePicture || req.query.profilePicture || 0;

    var originalname = '', //파일 원본 이름
        filename = '', //바뀐 이름
        mimetype = '', //파일 타입
        size = 0;

    if (Array.isArray(files)) { //업로드된 파일의 형태가 배열이라면
        for (var index = 0; index < files.length; index++) {
            originalname = files[index].originalname;
            filename = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;

            console.log('원본 파일명 : %s', originalname);
            console.log('현재 파일명 : %s', filename);
            console.log('MIME TYPE : %s', mimetype);
            console.log('FILE SIZE : %s', size);
        }
    } else {
        console.log('사진없어');
        filename = 'owner_default_picture.jpg';
    }


    console.log('parameter : %s %s %s %s %s %s', paramId, paramPw, paramName, paramPhoneNum, paramGender, filename);


    //pool에서 커넥션 객체 가져오기
    database.pool.getConnection(function (err, conn) {
        if (err) {
            console.log('풀 에러');

            //커넥션을 pool에 반환하기
            if (conn) {
                console.log('풀 에러1');

                conn.release();
            }
            callback(err, null);

            return;
        }

        console.log('데이터베이스 연결 Thread' + conn.threadId);

        //삽입할 데이터를 객체로 만들기 앞: DB컬럼명, 뒤: 파라미터로 받아온 컬럼명
        var data = {
            o_num: null,
            o_id: paramId,
            o_pw: hashpass,
            o_salt: salt,
            o_name: paramName,
            o_gender: paramGender,
            o_phone_num: paramPhoneNum,
            o_picture: filename
        };

        //conn 객체를 사용해서 sql 실행
        //set 모든 컬럼에 집어넣는 문법
        var exec = conn.query('insert into owner set ?', data, function (err, result) {
            //쿼리 작업 수행 후 반드시 연결을 해제 해야 한다.
            conn.release();
            console.log('실행 sql : %s', exec.sql);

            if (err) {
                console.log('sql 수행 중 에러발생.');
                console.dir(err);

                callback(err, null);
                return;
            }
            callback(null, result);
            var o_id = result.insertId;
            console.log(o_id);
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf8'
            });
            var context = {
                ownerId: o_id
            };
            req.app.render('add_res_info', context, function (err, html) {
                if (err) {
                    throw err;
                }
                console.log(html);
                res.end(html);
            });
            //            res.redirect('/public/add_res_info.html');
            //            res.end();
        });

        conn.on('error', function (err) {
            console.log('데이터베이스 연결 시 에러 발생함');
            console.dir(err);
            callback(err, null);
        });
    });
};
var addResInfo = function (req, res, callback) {
    console.log('/owner/res_info 호출됨');
    var database = req.app.get('database');
    var param_o_id = req.body.o_id || req.query.o_id;
    var paramResName = req.body.resName || req.query.resName;
    var paramAddress = req.body.address || req.query.address;
    var paramTel = req.body.tel || req.query.tel;
    var paramOpenTime = req.body.openTime || req.query.openTime;
    var paramHolyDay = req.body.holyDay || req.query.holyDay;
    var paramCateNum = req.body.cateNum || req.query.cateNum;


    console.log('parameter : %s %s %s %s %s %s %s', param_o_id, paramResName, paramAddress, paramTel, paramOpenTime, paramHolyDay, paramCateNum);


    //pool에서 커넥션 객체 가져오기
    database.pool.getConnection(function (err, conn) {
        if (err) {
            console.log('풀 에러');

            //커넥션을 pool에 반환하기
            if (conn) {
                console.log('풀 에러1');

                conn.release();
            }
            callback(err, null);

            return;
        }

        console.log('데이터베이스 연결 Thread' + conn.threadId);

        //삽입할 데이터를 객체로 만들기 앞: DB컬럼명, 뒤: 파라미터로 받아온 컬럼명
        var data = {
            r_num: null,
            r_name: paramResName,
            r_tel: paramTel,
            r_address: paramAddress,
            r_time: paramOpenTime,
            cate_num: paramCateNum,
            o_num: param_o_id,
            r_holyday: paramHolyDay
        };

        //conn 객체를 사용해서 sql 실행
        //set 모든 컬럼에 집어넣는 문법
        var exec = conn.query('insert into restaurant set ?', data, function (err, result) {
            //쿼리 작업 수행 후 반드시 연결을 해제 해야 한다.
            conn.release();
            console.log('실행 sql : %s', exec.sql);

            if (err) {
                console.log('sql 수행 중 에러발생.');
                console.dir(err);

                callback(err, null);
                return;
            }
            callback(null, result);

            res.redirect('/public/index');
            res.end();
        });

        conn.on('error', function (err) {
            console.log('데이터베이스 연결 시 에러 발생함');
            console.dir(err);
            callback(err, null);
        });
    });
};


var ownerLogin = function (req, res, callback) {
    console.log('ownerLogin 호출');
    var crypto = require('crypto');
    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.pw || req.query.pw;
    database.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        var columns = ['o_id', 'o_name', 'o_pw', 'o_salt'];
        var tablename = 'owner';
        //물음표가 두개 연속으로 붙으면 컬럼이나 테이블 이름을 뜻한다
        var exec = conn.query('select ?? from ?? where o_id=?', [columns, tablename, paramId],
            function (err, rows) {
                //select의 결과물은 배열로 들어온다. rows 변수...
                if (rows.length > 0) {
                    console.log('아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음', paramId, paramPw);
                    var userHashPass = crypto.createHash("sha512").update(paramPw + rows[0].o_salt).digest("hex");
                    if (rows[0].o_pw == userHashPass) {
                        callback(null, rows);
                        console.log(rows[0].o_id);
                        //세션 생성
                        req.session.owner = {
                            name: paramId,
                            authorized: true
                        };
                        console.log('세션 생성 완료');

                        res.writeHead(200, {
                            'Content-Type': 'text/html;charset=utf8'
                        });
                        var isUser = {
                            isUser : false
                        };
                        if (req.session.owner) {
                            console.log('세션있다');
                            req.app.render('main', isUser, function (err, html) {
                                if (err) {
                                    throw err;
                                }
                                console.log(html);
                                res.end(html);
                            });
                        } else {
                            console.log('세션없다');
                        }
                        //                res.redirect('/public/main.html');
                    }
                } else {
                    console.log('일치하는 사용자 없음');
                    callback(null, null);
                }

            });
        conn.on('error', function (err) {
            console.log('데이터베이스 연결 시 에러 발생함');
            console.dir(err);
            callback(err, null);
        });
    });
};


var ownerLogout = function (req, res, callback) {
    if (req.session.owner) {
        console.log('로그아웃!');

        //세션 삭제 시에는 destroy 메소드 활용
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            } //오류 발생시 처리
            console.log('세션 삭제 성공. 로그아웃 되었습니다.');
            //로그아웃 처리 후 다시 로그인 페이지로 이동시키기
            res.redirect('/public/index');
        });

    } else {
        console.log('세션 없음.');
        res.redirect('/public/404.html');
    }
};


module.exports.addOwner = addOwner;
module.exports.addResInfo = addResInfo;
module.exports.ownerLogin = ownerLogin;
module.exports.ownerLogout = ownerLogout;
