var owner_dup_check = function(req, res) {
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
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
    console.log('아이디 중복 검사 데이터베이스 접속');
    var paramId = req.body.id || req.query.id;
    console.log(paramId);
    var exec = conn.query('select o_id from owner where o_id = ?', paramId, function(err, rows) {
      //select의 결과물은 배열로 들어온다. rows 변수...
      if (rows.length > 0) {
        console.log('이미 존재합니다.');
        result.msg = 'dup';
      } else {
        console.log('존재하지않습니다 owner.');
        result.msg = 'ok';
      }
      res.send(result);
    });
    conn.on('error', function(err) {
      console.log('데이터베이스 연결 시 에러 발생함');
      console.dir(err);
      callback(err, null);
    });
  });
};

module.exports.owner_dup_check = owner_dup_check;