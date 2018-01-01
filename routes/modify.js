var checkmodifyContents = function (req, res, parm ) {
    var paramPostNum = req.query.post_num;
    var paramUserId = req.query.u_id;
//    console.log('paramPostNum' + paramPostNum);
    var context = {
        post_num: paramPostNum
    };
    req.app.render('addPic_ob', context, function (err, html) {
        if (err){ throw err;}
        else{
            res.end(html);
        }
        
    });

}


module.exports.checkmodifyContents = checkmodifyContents;