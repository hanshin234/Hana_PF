var mysql = require('mysql'); //mysql 모듈
var database = {};
var pool = {};
database.init = function(app, config) {
  console.log('database.init 호출됨');
  connect(app, config);
};
function connect(app, config) {
  pool = mysql.createPool({ //connection poll 생성
    connectionLimit: 500, //500개의 커넥션
    host: 'hanshin.cbxngtzvdqs1.ap-northeast-2.rds.amazonaws.com', //다른 사람의 IP를 입력할 수도 있음
    user: 'master',
    password: 'wjsgkstls',
    database: 'hana_pf',
    debug: 'false'
  });
  console.log('풀 생성');
  database.pool = pool;
  app.set('database', database);
}
module.exports = database;
