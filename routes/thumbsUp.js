var thumbsUp = function (req, res, callback) {

    console.log('thumbsUp 호출');
    var database = req.app.get('database');

    var post_num = req.query.post_num;
    console.log('post_num : ' + post_num);

    database.pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
        
        
        var sql = 'update owner_board set view_count = view_count - 1 where post_num = ?';
        var columns = [post_num];
        conn.query(sql, columns, function(err, rows) {
            if( rows.affectedRows > 0 ) {
                var sql1 = 'update owner_board set like_count = like_count+1 where post_num = ?';

                conn.query(sql1, columns, function(err, rows) {
                    if( rows.affectedRows >0 ) {
                        console.log('thumbs up success');
                        res.redirect('../loading/read_restaurant?tmp_post_num=' + post_num);
                        res.end();
                    }else{
                        return;
                    }
                });                
            }else{
                return;
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

module.exports.thumbsUp = thumbsUp;