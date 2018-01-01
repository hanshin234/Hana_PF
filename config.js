//설정값을 가지고 있는 모듈
module.exports = {
    server_port: 3000,
    route_info: [{
            file: './user',
            path: '/user/login',
            method: 'login',
            type: 'post'
    },
        {
            file: './user',
            path: '/user/logout',
            method: 'logout',
            type: 'post'
    },
        {
            file: './user',
            path: '/user/signup',
            method: 'signup',
            type: 'post'
    },

        {
            file: './owner',
            path: '/owner/add_owner',
            method: 'addOwner',
            type: 'post'
    },
        {
            file: './owner',
            path: '/owner/add_res_info',
            method: 'addResInfo',
            type: 'post'
    },
        {
            file: './owner',
            path: '/owner/login',
            method: 'ownerLogin',
            type: 'post'
    },
        {
            file: './owner',
            path: '/owner/logout',
            method: 'ownerLogout',
            type: 'post'
    },
        {
            file: './ajax_user',
            path: '/api/user/dup-check',
            method: 'user_dup_check',
            type: 'get'
    },
        {
            file: './ajax_owner',
            path: '/api/owner/dup-check',
            method: 'owner_dup_check',
            type: 'get'
    },
        {
            file: './showUserBoard',
            path: '/api/userboard/showlist',
            method: 'showlist',
            type: 'get'
    },
        {
            file: './readUserContents',
            path: '/loading/read_review',
            method: 'loadContents',
            type: 'get'
    },
        {
            file: './deleteUserContents',
            path: '/delete/UserContents',
            method: 'deleteContents',
            type: 'get'
        },
        {
            file: './showOwnerBoard',
            path: '/ownerboard/showlist',
            method: 'obShowList',
            type: 'get'
        },
        {
            file: './main',
            path: '/public/index',
            method: 'isLogin',
            type: 'get'
        },
        {
            file: './read_restaurant',
            path: '/loading/read_restaurant',
            method: 'read_restaurant',
            type: 'get'
        },
        {
            file: './write_ob',
            path: '/sending/write_ob',
            method: 'write_ob',
            type: 'post'
        },
        {
            file: './main_ubShow',
            path: '/api/ajax/ubList',
            method: 'mainShowlist',
            type: 'get'
        },
        {
            file: './main_obShow',
            path: '/api/ajax/obList',
            method: 'mainShowlist',
            type: 'get'
        },
        {
            file: './modify',
            path: '/sending/modify',
            method: 'checkmodifyContents',
            type: 'get'
        },
        {
            file: './addPic_ob',
            path: '/sending/addPic_ob',
            method: 'addPic_ob',
            type: 'post'
        },
        {
            file: './checkmodifyUserContents',
            path: '/check/modify/UserContents',
            method: 'checkmodifyContents',
            type: 'get'
        },
        {
            file: './modifyUserContents',
            path: '/modify/UserContents',
            method: 'modifyContents',
            type: 'post'
        },
        {
            file: './thumbsUp',
            path: '/sending/thumbsUp',
            method: 'thumbsUp',
            type: 'get'
        },
        {
            file: './ajax_reply',
            path: "/reply",
            method: 'reply',
            type: 'post'
    },
        {
            file: './ajax_replylist',
            path: "/api/replylist",
            method: 'replylist',
            type: 'post'
    }


  ],
    jsonrpc_api_path: '/api'

};
