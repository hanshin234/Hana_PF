var replylist = function(req, res) {
  // 글 보는 부분. 글 내용을 출력하고 조회수를 늘려줘야함
  // 댓글 페이지 추가 해줌, 5개씩 출력함
  var database = req.app.get('database');
  var result = {}; //클라이언트에게 전송할 객체
  database.pool.getConnection(function(err, conn) {
    if (err) {
      if (conn) {
        conn.release();
      }
      callback(err, null);
      return;
    }
    var tmp_post_num = req.body.post_num;
    console.log(tmp_post_num);
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
    var exec = conn.query('select * from ub_comment where post_num = ?',tmp_post_num, function(err, rows) {
      //select의 결과물은 배열로 들어온다. rows 변수...
      if (rows.length > 0) {
        console.log('댓글이!!!!!!!!!!!!존재합니다.');
        result = rows;
        res.send(result);
        return;
      } else {
        console.log('존재하지않습니다.');
      }
    });
    conn.on('error', function(err) {
      console.log('데이터베이스 연결 시 에러 발생함');
      console.dir(err);
      callback(err, null);
    });
  });

};

module.exports.replylist = replylist;