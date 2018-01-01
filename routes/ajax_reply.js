var reply = function(req, res, callback) {
  var database = req.app.get('database');
  database.pool.getConnection(function(err, conn) {
    if (err) {
      if (conn) {
        conn.release();
      }
      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
    var comm_num = null;
    var post_num = req.body.post_num;
    var reply_comment = req.body.replyAdd || req.query.replyAdd;
    var u_num = 1;
    var date = null;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + reply_comment);
    var data = {
      comm_num: comm_num,
      post_num: post_num,
      contents: reply_comment,
      u_num: u_num,
      date: date
    };
    var exec = conn.query('insert into ub_comment set ?', data, function(err, results) {
      conn.release();
      console.log('실행 sql : %s', exec.sql);
      res.redirect('/loading/read_review?tmp_post_num=' + post_num);
      if (err) {
        console.log('sql 수행 중 에러발생.');
        console.dir(err);
        callback(err, null);
        res.send(result);
        return;
      }
    });
    conn.on('error', function(err) {
      console.log('데이터베이스 연결 시 에러 발생함');
      console.dir(err);
      callback(err, null);
    });
  });
};


module.exports.reply = reply;