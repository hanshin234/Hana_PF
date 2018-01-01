var delete_user_board = function (req, res, database, post_num, paramUserId, callback) {
    console.log('delete board 호출');


    console.dir(database);
    database.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터 베이스 연결 스레드 아이디 : ' + conn.threadID);
        //칼럼명을 배열로 만들기
        var sql = 'delete from user_board where post_num = ?';

        var columns = [post_num];
        //        var tablename = 'owner_board';
        var exec = conn.query(sql, columns, function (err, rows) {
            //select의 결과물은 배열로 들어온다. -rows 변수..
            if (rows.affectedRows > 0) {
                console.log('삭제성공!!!!!!!!!!!!!!!!!!!!!');
                callback(null, rows);
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
}
var deleteContents = function (req, res) {
    //아이디와 패스워드 받고 dB에 접근
    //database --> true : DB에 접근 할 수 있는 상태
    var database = req.app.get('database');
    console.dir(database);
    var paramPostNum = req.query.post_num;
    var paramUserId = req.query.u_id;
    if (req.session.user) {
        console.log('=============세션있다================');
        console.log('====================================');
        console.log('====================================');
        console.log('====================================');

        var sessionId = req.session.user.name;
        if (paramUserId == sessionId) {

            if (database) {
                delete_user_board(req, res, database, paramPostNum, paramUserId, function (err, rows) {
                    if (err) {
                        console.error('delete board 중 에러발생 ' + err.stack);
                        res.writeHead(200, {
                            "Content-Type": 'text/html;charset=utf8'
                        });
                        res.write('<h2>delete board 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '<p>');
                        res.end();
                    }
                    if (rows) {
                        //데이터베이스 접속이 성공 했을 경우
                        console.dir(rows);
                        if (err) {
                            throw err;
                        }
                        res.redirect('/api/userboard/showlist');

                    } else {
                        //데이터베이스 접속이 실패 했을 경우
                        res.writeHead(200, {
                            'Content-Type': 'text/html;charset=utf8'
                        });
                        res.write('<h1>delete board 실패</h1>');
                        res.write('<div><p>확인하세요.</p></div>');
                        res.end();
                    }
                });
            } else {
                //데이터베이스 접속이 실패 했을 경우
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1>데이터베이스 연결 실패</h1>');
                res.write('<div><p>DB에 연결 하지 못했습니다.</p></div>');
                res.write('<br/> <a href="/public/login2.html">다시 로그인 </a>');
                res.end();
            }
        }else{
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
            console.log('=========사용자 불일치===============');
        }
    }else {
    console.log('=============세션없다================');
    console.log('=============세션없다================');
    console.log('=============세션없다================');
    console.log('=============세션없다================');
    console.log('=============세션없다================');
    console.log('=============세션없다================');
    }

}


module.exports.deleteContents = deleteContents;
