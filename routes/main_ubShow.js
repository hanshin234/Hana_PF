var show_user_board_list = function (database, callback) {
    console.log('show board list 호출');
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
        var sql = 'select * from user_board natural join ub_picture';

//        var columns = ['post_num', 'title', 'contents', 'o_num', 'r_num', 'like_count', 'date', 'view_count'];
//        var tablename = 'owner_board';
        var exec = conn.query(sql, function (err, rows) {
            //select의 결과물은 배열로 들어온다. -rows 변수..
            if (rows.length > 0) {
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
var mainShowlist = function (req, res) {
    //아이디와 패스워드 받고 dB에 접근
    //database --> true : DB에 접근 할 수 있는 상태
    
    var result = {};
    var database = req.app.get('database');
    console.dir(database);
    if (database) {
        show_user_board_list(database, function (err, rows) {
            if (err) {
               
            }
            if (rows) {
                //데이터베이스 접속이 성공 했을 경우
                result.rows = rows;
                console.dir(result);
                res.send(result);
                
            } else {
               
            }
        });
    } else {
       
    }
}
module.exports.mainShowlist = mainShowlist;