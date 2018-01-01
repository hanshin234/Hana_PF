var isLogin = function(req, res, callback) {
  var database = req.app.get('database');

  if (req.session.owner) {
    console.log("사장님 로그인했다 쿼리 돌린다.");
    var paramId = req.session.owner.name;
    database.pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release();
        }
        callback(err, null);
        return;
      }
      console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
      var tablename = 'owner';
      //물음표가 두개 연속으로 붙으면 컬럼이나 테이블 이름을 뜻한다
      var exec = conn.query('select r_num,o_num from owner natural join restaurant where o_id=?', paramId, function(err, rows) {
        //select의 결과물은 배열로 들어온다. rows 변수...
        if (rows.length > 0) {
          console.log('아이디[%s] ', paramId);

        }
      });
      conn.on('error', function(err) {
        console.log('데이터베이스 연결 시 에러 발생함');
        console.dir(err);
        callback(err, null);
      });
    });
  } //if
  console.log('/main/호출됨');
  var isUser = -1;
  if (req.session.user) {
    isUser = true;
    var context = {
      isUser: isUser
    };
    console.log('유저 세션 있음');
    req.app.render('main', context, function(err, html) {
      if (err) {
        throw err;
      }
      console.log(html);
      res.end(html);
    });
  } else if (req.session.owner) {
    isUser = false;
    var context = {
      isUser: isUser,
      ownerId: paramId,
      rows: rows
    };
    console.log('사업자 세션 있음');
    req.app.render('main', context, function(err, html) {
      if (err) {
        throw err;
      }
      console.log(html);
      res.end(html);
    });

  } else {
    console.log('세션 없음');
    var context = {
      isUser: isUser
    };
    req.app.render('main', context, function(err, html) {
      if (err) {
        throw err;
      }
      console.log(html);
      res.end(html);
    });
  }



};
module.exports.isLogin = isLogin;
