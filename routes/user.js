var authUser = function (database, id, password, callback) {
    console.log('authUser 호출');
    var crypto = require('crypto');
    database.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        var columns = ['u_id', 'u_pw', 'u_salt'];
        var tablename = 'user';
        //물음표가 두개 연속으로 붙으면 컬럼이나 테이블 이름을 뜻한다
        var exec = conn.query('select ?? from ?? where u_id=?', [columns, tablename, id], function (err, rows) {
            //select의 결과물은 배열로 들어온다. rows 변수...
            if (rows.length > 0) {
                console.log('아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음, 패스워드 비교 시작하겠음', id, password);
                var userHashPass = crypto.createHash("sha512").update(password + rows[0].u_salt).digest("hex");
                if (userHashPassrows === [0].u_pw) {
                    callback(null, rows);
                    console.log(rows[0].u_id);
                } else {
                    console.log('비번틀림');
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

var addUser = function (database, id, password, name, gender, phone_num, filename, callback) {
    console.log('addUser 호출됨');
    var crypto = require('crypto');
    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashpass = crypto.createHash('sha512').update(password + salt).digest('hex');
    //pool에서 커넥션 객체 가져오기
    database.pool.getConnection(function (err, conn) {
        if (err) {
            //커넥션을 pool에 반환하기
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 Thread' + conn.threadId);
        //삽입할 데이터를 객체로 만들기 앞: DB컬럼명, 뒤: 파라미터로 받아온 컬럼명
        var data = {
            u_id: id,
            u_pw: hashpass,
            u_salt: salt,
            u_name: name,
            u_gender: gender,
            u_phone_num: phone_num,
            u_picture: filename
        };
        //conn 객체를 사용해서 sql 실행
        //set 모든 컬럼에 집어넣는 문법
        var exec = conn.query('insert into user set ?', data, function (err, result) {
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
            res.redirect('/public/main.html');
            res.end();

        });
        conn.on('error', function (err) {
            console.log('데이터베이스 연결 시 에러 발생함');
            console.dir(err);
            callback(err, null);
        });
    });
};

var login = function (req, res, callback) {
    console.log('login 호출');
    var database = req.app.get('database');
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.pw || req.query.pw;

    if (database) {
        //1)사용자 인증 함수 호출 authUser
        authUser(database, paramId, paramPw, function (err, rows) {
            if (err) {
                console.error('로그인 중 에러 발생' + err.stack);
                res.writeHead(200, {
                    "Content-Type": 'text/html;charset=utf8'
                });
                res.write('<h2>로그인 도중 데이터베이스 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
            } // 에러 처리
            if (rows) {
                //doc가 존재하면 로그인 성공
                req.session.user = {
                    name: paramId,
                    authorized: true
                };
                console.log("==유저 세션 생성==");

                res.writeHead(200, {
                    "Content-Type": 'text/html;charset=utf8'
                });
                var isUser = {
                    isUser: true
                }
                if (req.session.user) {
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


            } else {
                //docs가 존재하지 않으면 로그인 실패
                res.writeHead(200, {
                    "Content-Type": 'text/html;charset=utf8'
                });
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 확인하세요</p></div>');
                res.write("<br/><a href='/public/login_select.html'>다시 로그인</a>");
                res.end();
            }

        });
    } else {
        //DB접속에 실패 했을 경우
        res.writeHead(200, {
            "Content-Type": 'text/html;charset=utf8'
        });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.write('<div><p>DB에 연결 하지 못했습니다</p></div>');
        res.write("<br/><a href='/public/login2.html'>다시 로그인</a>");
        res.end();
    }
};

var logout = function (req, res, callback) {
    if (req.session.user) {
        console.log('로그아웃!');
        //세션 삭제 시에는 destroy 메소드 활용
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            } //오류 발생시 처리
            console.log('세션 삭제 성공. 로그아웃 되었습니다.');
            res.redirect('/public/index');

        });
    } else {
        console.log('세션 없음.');
    }
};

var signup = function (req, res, callback) {
    var database = req.app.get('database');
    console.log('/process/adduser 호출됨');
    var files = req.files;
    var originalname = '', //파일 원본 이름
        filename = '', //바뀐 이름
        mimetype = '', //파일 타입
        size = 0;
    //업로드된 파일의 형태가 배열이라면
    if (Array.isArray(files)) {
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
        //files.filename;
    }
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramGender = req.body.gender;
    var paramPhone_num = req.body.phone_num;
    files = filename;
    //아이디와 패스워드 받고 DB에 접근
    //database --> true : DB에 접근할 수 있는 상태
    if (database) {
        addUser(database, paramId, paramPassword, paramName, paramGender, paramPhone_num, files, function (err, result) {
            if (err) {
                throw err;
            } // 에러 처리
            if (result) {
                console.dir(result);
                req.app.render('main', paramId, function (err, html) {
                    if (err) {
                        throw err;
                    }
                    console.log(html);
                    res.end(html);
                });

            } else {
                res.writeHead(200, {
                    "Content-Type": 'text/html;charset=utf8'
                });
                res.write('<h1>사용자 추가 실패</h1>');
                res.write("<br/><a href='/public/adduser.html'>다시 가입하기</a>");
                res.end();
            }
        });
    } else {
        //DB접속에 실패 했을 경우
        res.writeHead(200, {
            "Content-Type": 'text/html;charset=utf8'
        });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.write('<div><p>DB에 연결 하지 못했습니다</p></div>');
        res.write("<br/><a href='/public/adduser.html'>다시 가입하기</a>");
        res.end();
    }
};
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
