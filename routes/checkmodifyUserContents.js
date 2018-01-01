var checkmodifyContents = function (req, res) {
    var paramPostNum = req.query.post_num;
    var paramUserId = req.query.u_id;

    //session compare
    console.log('체크하고 수정하러 ㄱㄱ');
    var context = {
        post_num: paramPostNum
    };
    req.app.render('modify_user', context, function (err, html) {
        if (err){ throw err;}
        else{
            res.end(html);
        }
        
    });

}


module.exports.checkmodifyContents = checkmodifyContents;