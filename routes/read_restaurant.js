var read_restaurant = function (req, res, callback) {
    console.log('read_board 호출');
    var database = req.app.get('database');
    var post_num = req.query.tmp_post_num;
    //    var paramPostNumber = 1;
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
        
        var sql = 'update owner_board set view_count = view_count+1 where post_num = ?';
        var columns = [post_num];
        
        conn.query(sql, columns, function(err, rows) {
            if( rows.affectedRows >0 ) {
                console.log('count up success');
            }else{
                return;
            }
        });

        sql = 'update owner_board set like_count = like_count+1 where post_num = ?';
        
        conn.query(sql, columns, function(err, rows) {
            if( rows.affectedRows >0 ) {
                console.log('thumbs up success');
//                res.redirect('read_restaurant?tmp_post_num=1');
                
            }else{
                return;
            }
        });
        
        

        var qr1 = ' select *, DATE_FORMAT(date, "%Y %c/%e %r") date from restaurant join owner_board using (r_num) join ob_picture using (post_num) join category using (cate_num) where post_num = ? order by pic_num desc';

        
        var exec1 = conn.query(qr1, columns, function (err, rows) {
            //select의 결과물은 배열로 들어온다. rows 변수...
            if (rows.length > 0) {
                console.log('사진 불러오기 성공');
                sendInfo(req, res, rows);                
                callback(null, rows);
        
            } else {
                console.log('사진 로드 실패');
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
    // 뷰 템플릿과 text 합쳐서 html만들고 전송
    req.app.render('restaurant', context, function (err, html) {
        if (err) {
            console.log('뷰 렌더링 중 오류 발생 : ' + err.stack);
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf8"
            });
            res.write('<h1>뷰 렌더링 중 오류 발생 :<h1/>');
            res.write('<div><p>' + err.stack + '</p></div>');
            res.end();
            return;
        } else {
        console.log('렌더링 성공 : ' + html);
        res.end(html);
        }
    }); 
}



module.exports.read_restaurant = read_restaurant;

// module.exports.signup = signup;