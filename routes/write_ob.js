var write_ob = function (req, res, callback) {

    console.log('write_ob 호출');
    var database = req.app.get('database');
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
    
    
    
    //o_id 받았다고 가정
    var o_num = 32;
    //o_id 받았다고 가정
    var r_num = 4;
    
    var title = req.body.title;
    var content = req.body.content;

    
    var cate_num = req.body.cate_num;
    var pic_filename = filename;
    
    
    //  var paramId = req.body.id || req.query.id;
    //  var paramPw = req.body.pw || req.query.pw;
    database.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        //    var columns = ['u_id', 'u_name'];
        //    var tablename = 'user';
        //물음표가 두개 연속으로 붙으면 컬럼이나 테이블 이름을 뜻한다
        // select post_num, title, o.o_id, ob.date, view_count from owner_board ob join owner o using(o_num)

        var sql = "insert into owner_board(title, contents, r_num, o_num) values(?,?,?,?)";

        var columns = [title, content, r_num, o_num];


        //        var tablename = 'owner_board';
        var exec = conn.query(sql, columns, function (err, rows) {
            //select의 결과물은 배열로 들어온다. -rows 변수..
  
            if (rows.affectedRows > 0) {
                var sql1 = "select max(post_num) post_num from owner_board";
                        console.log(rows);
                //        var tablename = 'owner_board';
                var exec = conn.query(sql1, function (err, rows) {
                    //select의 결과물은 배열로 들어온다. -rows 변수..
                    if (rows.length > 0) {
                        console.log(rows);
                            var post_num = rows[0].post_num;
                            var sql2 = "insert into ob_picture(post_num, pic_filename) values(?,?)";
                            columns = [post_num, filename];

                            //        var tablename = 'owner_board';
                            var exec = conn.query(sql2, columns, function (err, rows) {
                                //select의 결과물은 배열로 들어온다. -rows 변수..
                                if (rows.affectedRows > 0) {
                                    
                                    var sql3 = `select *, DATE_FORMAT(date, "%Y %c/%e %r") date from owner_board join owner using(o_num) join restaurant using (r_num) where post_num = ?`;
                                    columns = [post_num];

                                    //        var tablename = 'owner_board';
                                    var exec = conn.query(sql3, columns, function (err, rows) {
                                        //select의 결과물은 배열로 들어온다. -rows 변수..
                                        if (rows.length > 0) {
                                            
//                                            sendInfo(req, res, rows);
                                            res.redirect('../ownerboard/showlist');
                                            res.end();
                                            callback(null, rows);
                                        } else {
                                            console.log('일치하는 사용자 없음');
                                            callback(null, null);
                                        }
                                    });
                                } else {
                                    console.log('일치하는 사용자 없음');
                                    callback(null, null);
                                }
                            });

                    } else {
                        console.log('일치하는 사용자 없음');
                        callback(null, null);
                    }
                });
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


var sendInfo = function (req, res, rows) {

    var context = {
        rows: rows
    };
    req.app.render('owner_post', context, function (err, html) {
        if (err) {
            console.log('뷰 렌더링 중 오류 발생 : ' + err.stack);
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf8"
            });
            res.write('<h1>뷰 렌더링 중 오류 발생 :<h1/>');
            res.write('<div><p>' + err.stack + '</p></div>');
            res.end();
            return;
        }
        console.log('렌더링 성공 : ');
        res.end(html);
    });
}

module.exports.write_ob = write_ob;
// module.exports.signup = signup;