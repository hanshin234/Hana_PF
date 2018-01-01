var modify_user_board = function (database, post_num, title, content, pic_filename, callback) {
    console.log('modify board 호출');


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
        var sql = 'update user_board set title = ?, contents=? where post_num = ?';

        var columns = [title, content, post_num];
        //        var tablename = 'owner_board';
        console.log(sql);
        var exec = conn.query(sql, columns, function (err, rows) {
            //select의 결과물은 배열로 들어온다. -rows 변수..
            if (rows.affectedRows > 0) {
                console.log('수정성공!!!!!!!!!!!!!!!!!!!!!');

                sql = 'update ub_picture set pic_filename = ? where post_num = ?';
                columns = [pic_filename, post_num];

                conn.query(sql, columns, function (err, rows) {
                    if (rows.affectedRows > 0) {
                        console.log('수정완료');
                        callback(null, rows);
                    }

                })

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
var modifyContents = function (req, res) {
    //아이디와 패스워드 받고 dB에 접근
    //database --> true : DB에 접근 할 수 있는 상태
    var database = req.app.get('database');
    console.dir(database);
 
    console.dir(req);
    var files = req.files;
    var paramPostNum = req.body.post_num || req.query.post_num;
    var paramTitle = req.body.title|| req.query.title;
    var paramContent = req.body.content|| req.query.content;

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



 

    if (database) {
        modify_user_board(database, paramPostNum, paramTitle, paramContent, filename, function (err, rows) {
            if (err) {
                console.error('modify board 중 에러발생 ' + err.stack);
                res.writeHead(200, {
                    "Content-Type": 'text/html;charset=utf8'
                });
                res.write('<h2>modify board 중 에러 발생</h2>');
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
                res.write('<h1>modify board 실패</h1>');
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


}


module.exports.modifyContents = modifyContents;