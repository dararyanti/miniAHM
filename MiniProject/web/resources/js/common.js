var url = window.location.href; 
var arr = url.split("/");
var domain = arr[0] + "//" + arr[2];
var form_path = "/jx01/ahmipuam000-pst/forms/";
var form_ext = ".htm";
var form_change_password = "change_pass";
var timeout;
var username;
var token;
var baseURLRedirect = "/ahmdsmun000-rest-ui";
var updateData = [];
var lastRequest;
var contentAnnouncement = [];
var appsProblemIndex = 1;
 
var baseColorBookmark = new Array('#00C0EF', '#04A65A', '#F29C13', '#465C74', '#9d5ab9');
var bookmarkSameBaseColor = 4;
var bookmarkedApps = [];
 
 
$(document).ajaxSend(function (event, request, settings) {
    $('#loading-indicator').show();
});
$(document).ajaxComplete(
    function (event, request, settings) {
        $('#loading-indicator').hide();
        var responseText = request.responseJSON;
        if (responseText !== undefined) {
            if ((responseText.status == '0') && (responseText.message.authentication == "Invalid Request")) {
                openLoginForm();
                lastRequest = settings;
            }
        }
    }
);
 
$(document).mouseup(
        function (e) {
            _fw_setMouseUpLov(e);
    _fw_setMouseUpBtnClear();
}
        );
 
// $(function () {
//     $.ajax({
//         type: "POST",
//         url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/validate-token",
//         contentType: "application/json",
//         dataType: 'json',
//         //headers: {
//            // "JXID": getJxid()
// //        },
//         async: false//,
//     }).done(function (data) {
//         if (data.status == "1") {
//             setMenuSidebar();
//             setProfileInfo();
//             search_prepare();
//             addBookmarkMenu();
//             getFormFromHash();
//             _fw_activeTabAction();
//             _fw_getAnnouncement();
//             _fw_getAppsProblem();
//             _fw_startTime();
            
//             //setFaqList();
//             //sendVote();
//             //getCategoryTicket();
//             //setFaqTree();
            
//         } else {
//             var hash = document.location.hash;
//             var winloc = hash ? 'login.htm?ReturnUrl=' + hash : 'login.htm';
//             window.location = winloc;
//         }
//     });
// });
 
function _fw_getLicenseKeyDynamsoft(){
    return 'f0068NQAAAEzqMov+4MOtd+hMgNSqOhBof1pufUHeQPYoNo9Tz+9p78kAGAhk13vo2bRpBbSp2UE/MNFkG/KtoTpoCgTWkpc=';
}
 
function _fw_startTime() {
    var today = new Date();
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dd = today.getDate();
    var mmm = month[today.getMonth()];
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = _fw_checkTime(m);
    s = _fw_checkTime(s);
    $('#fw_clock').html(dd + "-" + mmm + "-" + yyyy + " " + h + ":" + m + ":" + s);
    var t = setTimeout(_fw_startTime, 500);
}
 
function _fw_checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    ;  // add zero in front of numbers < 10
    return i;
}
 
function _fw_activeTabAction(){
    $('#active-tab > a').click(function () {
        var idmenu = $(this).data('formid');
        $('#ahmdsh1_menu_ul a[data-appid="' + idmenu + '"]').click();
        setTimeout(function () {
            _fw_slideMenuNav($('#tablink_' + idmenu));
        }, 300);
        $('button', $('#active-tab').parent()).click();
        return false;
    });
}
 
function _fw_setMouseUpLov(e){
    var slideUp = true;
    var lookupVisible = $('.lookup-form:visible');
    var lookupTable = $('table', lookupVisible);
    var lookupWrapperVisible = $('.lookup-wrapper:has(.lookup-form:visible)');
    if ($(e.target).closest('.lookup-form').hasClass('lookup-form')) {
        if (lookupVisible.length > 0) {
            if ($(e.target).closest('.lookup-form').is(lookupVisible)) {
                slideUp = false;
            }
            
        }
    }
    if ($(e.target).hasClass('input-lookup')) {
        if (lookupWrapperVisible.length > 0) {
            if ($(e.target).is($('.input-lookup', lookupWrapperVisible))) {
                slideUp = false;
            }
        }
    }
    if (slideUp) {
        $('.lookup-form').slideUp();
        if($('.lookup-multiple',lookupWrapperVisible).length > 0){
            $('.input-lookup', lookupWrapperVisible).val('');
        }
        lookupTable.bootstrapTable('refresh');
    }
}
 
function _fw_setMouseUpBtnClear(){
    $('input').keyup(function () {
        var objform = $(this).closest('div');
        if (this.value !== '') {
            $('.btn-clear', objform).css('color', '#ccc');
        } else {
            $('.btn-clear', objform).css('color', '#fff');
        }
    });
    $('.btn-clear').click(function () {
        var objform = $(this).closest('div');
        $(this).css('color', '#fff');
        $('input', objform).val('');
    });
}
 
function setMenuSidebar() {
    $.ajax({
        type: "POST",
        url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/menu",
        contentType: "application/json",
        dataType: 'json',
        //headers: {
           // "JXID": getJxid()
//        },
        async: false
    }).done(function (data) {
        if (data.status == "1") {
            var menu_root = new Array();
            var htmlMenu = '';
            $('#username_profile').html('<i class="glyphicon glyphicon-user fg-white"></i>&nbsp;&nbsp; ' + data.message.username);
            $('#username').val(data.message.username);
            $('#username').attr("readonly", "readonly");
            $.each(data.data, function (key, value) {
                if (value.parent == null) {
                    var rootObj = new Object();
                    rootObj.internalid = value.internalid;
                    rootObj.title = value.title;
                    
                    htmlMenu += '<li class="treeview transition"><a href="#">' +
                            '<i class="' + value.icon + '"></i> <span style="display:none;">' + value.menuid + '</span> <span>' + value.title + '</span>' +
                            '<i class="glyphicon glyphicon-chevron-down icon-menu-expand" style="float:right; margin-right: 10px; font-size:9"></i>' +
                            '</a>';
                    htmlMenu = recursive_menu(rootObj, data.data, htmlMenu);
                    htmlMenu += '</li>';
                    menu_root.push(rootObj);
                }
            });
            $('#ahmdsh1_menu_ul').html(htmlMenu);
            _fw_parentMenuAction();
            _fw_setMenuAction();
        }
    });
}
 
function _fw_parentMenuAction(){
    $('.treeview > a').click(function () {
        var curTreeview = $(this).parent().toggleClass('active');
        $(this).children('.icon-menu-expand').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
        $(this).next().slideToggle();
        $.each($('ul', curTreeview), function () {
            $('ul', $(this)).slideUp();
        });
        $('ul .treeview', curTreeview).removeClass('active');
        $('ul .treeview a', curTreeview).children('.icon-menu-expand').removeClass('glyphicon-chevron-up');
        $('ul .treeview a', curTreeview).children('.icon-menu-expand').addClass('glyphicon-chevron-down');
        var curTreeviewSiblings = curTreeview.siblings('li').removeClass('active');
        $('a .icon-menu-expand', curTreeviewSiblings).removeClass('glyphicon-chevron-up');
        $('a .icon-menu-expand', curTreeviewSiblings).addClass('glyphicon-chevron-down');
        $('ul', curTreeviewSiblings).slideUp();
        setLocationHash();
        return false;
    });
}
 
function _fw_setMenuAction(){
    $('li.menu:not(.treeview) > a').click(function (e) {
        e.preventDefault();
        var appid = $(this).data('appid');
        var apptarget = $(this).data('apptarget');
        var formid = $(this).data('formid');
        var vjxid = getJxid();
        var appurl = '';
        var username = $('#username').val();
        
        if (apptarget == 'Tab Browser' || apptarget == 'Tab Browser - Swing' || apptarget == 'Tab Browser - AHMAS') {
            if(apptarget == 'Tab Browser - AHMAS'){
                var vurl = '/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/get-url-11g';
                _fw_post(vurl, {"menuId":$(this).data('appid')}, function (data) {
                    $.each(data.data, function (i, v) {
                        appurl = v;
                    });
                });
            }else if (formid.substr(0, 4).indexOf("http") >= 0) {
                appurl = apptarget == 'Tab Browser' ? formid : formid + '?JXID=' + vjxid;
                appurl = appurl + "&username=" + username;
            } else {
                appurl = apptarget == 'Tab Browser' ? domain + '/' + formid : domain + '/' + formid + '?JXID=' + vjxid;
            }
            window.open(appurl);
        } else {
            var form_obj = $('#tablink_' + appid);
            if (form_obj.html() == undefined ) {
                get_form(this);
            } else {
                form_obj.tab('show');
                $('[role="tabpanel"].tab-pane').removeClass('active');
                $('#tabpanel_' + appid).addClass('active');
            }
        }
        
        setLocationHash();
        return false;
    });
}
 
function setProfileInfo() {
    $.ajax({
        type: "POST",
        url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/profile",
        contentType: "application/json",
        dataType: 'json',
        //headers: {
           // "JXID": getJxid()
//        },
        async: false
    }).done(function (data) {
        if (data.status == "1") {
            $(".profile-info-wrap").empty();
            $.each(data.data, function (key, value) {
                var contmd = '';
                $('#dsh_changepass').empty();
                if (value.partnerid != 'AHM') {
                    contmd = '<tr><td style="padding: 5px 50px 5px 0;"><b>Main Dealer H1</b></td><td style="padding-right: padding: 5px 50px 5px 0;">' + value.mdH1.join() + '</td></tr>' +
                            '<tr><td style="padding: 5px 50px 5px 0;"><b>Main Dealer H2</b></td><td style="padding-right: padding: 5px 50px 5px 0;">' + value.mdH2.join() + '</td></tr>' +
                            '<tr><td style="padding: 5px 50px 5px 0;"><b>Main Dealer H3</b></td><td style="padding-right: padding: 5px 50px 5px 0;">' + value.mdH3.join() + '</td></tr>';
                    $('#dsh_changepass').append('<a class="profile-btn" href="#" onclick="getFormChangePassword()">Change Password</a>');
                } 
                $(".profile-info-wrap").append('<b>' + value.fullname + '</b><br/>' + value.email + '<hr style="margin: 5px 0 !important;"/>' +
                        '<table><tbody>' +
                        '<tr><td style="padding: 5px 50px 5px 0;"><b>User ID</b></td><td style="padding: 5px 50px 5px 0;">' + value.userid + '</td></tr>' +
                        '<tr><td style="padding: 5px 50px 5px 0;"><b>Partner ID</b></td><td style="padding-right: padding: 5px 50px 5px 0;">' + value.partnerid + '</td></tr>' +
                        '<tr><td style="padding: 5px 50px 5px 0;"><b>Area</b></td><td style="padding-right: padding: 5px 50px 5px 0;">' + value.area + '</td></tr>' +
                        contmd + '</tbody></table>');
            });
            
        }
    }).fail(function () { });
}
 
var _vloadhash_state = true;
function setLocationHash() {
    var tabs = $('.nav-tabs-container .tablink');
    var th = '';
    if (_vloadhash_state && (document.location.hash !== '')) {
        var ah = document.location.hash.split(',');
        if (tabs.length >= ah.length - 1) {
            _vloadhash_state = false;
        }
        return;
    }
    tabs.each(function () {
        if ($(this).parent().hasClass('active')) {
            th += $(this).attr('href').replace('#', '').replace('tabpanel_', '') + ':1,';
        } else {
            th += $(this).attr('href').replace('#', '').replace('tabpanel_', '') + ',';
        }
    });
    document.location.hash = th;
}
 
function getFormChangePassword() {
    var id = form_change_password;
    var ctab = $('#tabpanel_' + id);
    var title = 'Change Password';
    if (ctab.length <= 0) {
        ctab = $('<div role="tabpanel" class="tab-pane" data-formid="' + id + '" id="tabpanel_' + id + '">Loading...</div>').appendTo($('.maincontent_containers.tab-content'));
        $('<li role="presentation" data-formid="' + id + '" id="tablink_' + id + '" ><a href="#tabpanel_' + id + '" class="tablink" aria-controls="' + title + '" role="tab" data-toggle="tab">' + title + ' </a><a href="#" class="closetabLink" onclick="removeTab(this);"><span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span></a></li>').appendTo($('.nav-tabs-container .nav-tabs'));
    }
    $('#tablink_' + id + ' a.tablink').click();
    listener_tabNav();
    
    $.get(id + form_ext, {
        'cb': (new Date).getTime()
    }, function (data) {
        var tabPanel = $('#tabpanel_' + id);
        var appVer = $('#' + id).data('version');
        $('#tabpanel_' + id).html('<div class="main-app">' + data + '</div>');
        $('.btn-lookup', tabPanel).addClass('btn-primary').html('<span class="glyphicon glyphicon-search"></span>');
        $('#tabpanel_' + id).prepend('<div class="app-info"><div class="app-button"></div><ol class="nav-step"><li class="active"><span>' + title + '</span></li></ol></div>');
        $('#tabpanel_' + id).append('<div class="page-footer">' + id + ' - Ver. ' + appVer + '</div>');
    });
}
 
function logout() {
    $.ajax({
        type: "POST",
        url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/logout",
        contentType: "application/json",
        dataType: 'json',
        async: false
    }).done(function (data) {
        if (data.status == "1") {
            localStorage.clear();
            if($("#dolphin-chat-icon").length != 0) {
              Chat.resetToLogin(true); 
            }
            window.location = "login.htm";
        }
    }).fail(function () { });
}
 
function help(obj) {
    get_form(obj, false);
}
 
function search_prepare() {
    $('.mainmenu > ul li').each(function () {
        $(this).data('keys', $(this).text().toLowerCase().replace(/[\s\r\n]+/g, '|'));
    });
    $('.mainmenu-search input.form-control').keyup(search_crawl);
}
 
function search_crawl() {
    var key = $('.mainmenu-search input.form-control').val().toLowerCase();
    if (key == '') {
        $('.mainmenu li.treeview').removeClass('active');
        $('.mainmenu li.treeview a').children('.icon-menu-expand').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        $('.mainmenu li.treeview').show();
        $('.mainmenu ul.treeview-menu').hide();
        $('.mainmenu > ul li').show();
    } else {
        $('.mainmenu li.treeview').addClass('active');
        $('.mainmenu li.treeview a').children('.icon-menu-expand').addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        $('.mainmenu > ul li').hide();
        $('.mainmenu > ul li:contains("' + key + '"), .mainmenu ul.treeview-menu').children('.icon-menu-expand').addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        $('.mainmenu > ul li:contains("' + key + '"), .mainmenu ul.treeview-menu').show();
    }
}
 
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
 
function listener_tabNav() {
    if ($('.nav-tabs-container .nav-tabs')[0] !== undefined) {
        var ww = $('.nav-tabs-container .nav-tabs')[0].scrollWidth;
        if (ww > $('.nav-tabs-container .nav-tabs').width()) {
            $('.nav-tabs-scroller').show();
        } else {
            $('.nav-tabs-scroller').hide();
        }
    }
}
 
function scrollTabNav(dir) {
    var obj = $('.nav-tabs-container .nav-tabs');
    obj.animate({
        scrollLeft: (dir == 'left' ? '-=100' : '+=100')
    });
}
 
function removeTab(obj) {
    var li = $(obj).closest('li');
    var id = li.data('formid');
    var prevli = li.prev();
    var siblingli = li.siblings();
    var hasActive = false;
    $.each(siblingli, function () {
        if ($(this).hasClass('active')) {
            hasActive = true;
        }
    });
    var acttab = $('li', '#active-tab');
    
    $.each(acttab, function () {
        if ($(this).data('formid') == id)
            $(this).remove();
    });
    if (!hasActive) {
        prevli.addClass('active');
        var prevFormId = prevli.data('formid');
        if (prevFormId != null) {
            $('#tabpanel_' + prevFormId).addClass('active');
        } else {
            $('#default_home').addClass('active');
        }
    }
    var id = li.data('formid');
    $('#tabpanel_' + id + ', #tablink_' + id).remove();
    setLocationHash();
    listener_tabNav();
}
 
function menu_collapse(obj) {
    $('body').toggleClass('collapsed');
    $('.icon-toolbar', obj).toggleClass('flipX');
    return false;
}
 
function edit_custom_action(obj) {
    var hasEdit = false;
    var editAction;
    if ($(obj).data("custom-action") !== undefined) {
        var cusAction = $(obj).data("custom-action").split(",");
        for (i = 0; i < cusAction.length; i++) {
            if (cusAction[i].trim() == 'edit') {
                editAction = $(obj).data("edit-func");
                if (editAction !== undefined) {
                    hasEdit = true;
                }
            }
        }
    }
    if (hasEdit) {
        $('thead tr', obj).first().append('<th rowspan="2" data-field="action" data-formatter="actionEditFormatter" data-events="actionEvents">Action</th>');
    }
}
 
function add_custom_action(obj) {
    var tableObj = $(obj).closest('.bootstrap-table');
    var hasAdd = false;
    var hasDel = false;
    var addAction;
    var delAction;
    if ($(obj).data("custom-action") !== undefined) {
        var cusAction = $(obj).data("custom-action").split(",");
        for (i = 0; i < cusAction.length; i++) {
            if (cusAction[i].trim() == 'add') {
                addAction = $(obj).data("add-func");
                if (addAction !== undefined) {
                    hasAdd = true;
                }
            }
            if (cusAction[i].trim() == 'delete') {
                delAction = $(obj).data("delete-func");
                if (delAction !== undefined) {
                    hasDel = true;
                }
            }
            
        }
    }
    if (hasDel) {
        $('.fixed-table-toolbar', tableObj).append('<div class="columns columns-right btn-group pull-right"><button class="btn btn-default small-button" onclick="' + delAction + '">Delete Selected Items</button></div>');
    }
    if (hasAdd) {
        $('.fixed-table-toolbar', tableObj).append('<div class="columns columns-right btn-group pull-right"><button class="btn btn-default small-button" onclick="' + addAction + '">Add</button></div>');
    }
}
function actionEditFormatter(value, row, index) {
    return [
        '<center><a class="edit ml10" href="javascript:;" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i>',
        '</a></center>'
    ].join('');
}
function actionRemoveFormatter(value, row, index) {
    return [
        '<center><a class="remove ml10" href="javascript:;" title="Remove">',
        '<i class="glyphicon glyphicon-remove" style="color:red"></i>',
        '</a></center>'
    ].join('');
}
 
window.actionEvents = {
    'click .edit': function (e, value, row, index) {
        var editAction = $(e.target).closest('table').data('edit-func');
        var args = new Array();
        args.push(e.target);
        args.push(row);
        args.push(index);
        window[editAction](e.target, row, index);
    },
    'click .remove': function (e, value, row, index) {
        var sourceId = $(e.target).closest('table').data('source-id');
        var obj = $(e.target).closest('table');
        var sourceObj = $('#' + sourceId);
        var objUniqueId = sourceObj.data('unique-id');
        var tblTempUniqueId = obj.data('unique-id');
        sourceObj.bootstrapTable('uncheckBy', {
            field: objUniqueId,
            values: [row[objUniqueId]]
        });
        obj.bootstrapTable('remove', {
            field: tblTempUniqueId,
            values: [row[tblTempUniqueId]]
        });
    }
};
 
function _fw_setInputDatePicker(objParent) {
    $.each($('.date', objParent), function () {
        $(this).datetimepicker({
            format: 'DD-MMM-YYYY',
            locale: 'en'
        });
    });
}
 
 
 
//updated 17-nov-2021
// add loadFirstTime parameter
function _fw_setLookup(objParent) {
    $('.lookup', objParent).each(function () {
        $(this).lovtable({
            url: $(this).data("url"),
            queryParams: $(this).data("lookup-pre-func"),
            changeFunction: $(this).data("lookup-change-func"),
            bindFunction: $(this).data('lookup-bind-func'),
            nextFocus: $(this).data('lookup-next-focus'),
            nextFunction: $(this).data("lookup-next-func"),
            tableId: generateUUID(),
            columns: $(this).data("columns"),
            callbacks: $(this).data("callback"),
            multiple: $(this).data("multiple"),
            multipleValue: $(this).data("multiple-value"),
            multipleText: $(this).data("multiple-text"),
            loadFirstTime: $(this).data("load-first-time"),
            otherValue: $(this).data("lookup-other-value")
        });
    });
}
 
//added by nurani 22-oct-18
var inputLookupModalVal;
function _fw_LookupParams(params) {
    params.search = {
        "any": inputLookupModalVal
    };
    if (params.sort == undefined) {
        return{
            limit: params.limit,
            offset: params.offset,
            search: params.search
        };
    }
    return params;
}
 
//modified by nurani 22-10-18
function _fw_setLookupModal(objParent) {
    $('.modal-lookup', objParent).remove();
    $('.lookup-modal', objParent).each(function () {
        var objparent = $(this).parent();
        var isBindFunc = false;
        var thisLookup = $(this);
        var lookupUrl = $(this).data("url");
        var lookupTitle = $(this).data("title");
        var lookupPreFunc = $(this).data("lookup-pre-func");
        var lookupChangeFunc = $(this).data("lookup-change-func");
        var lookupInputClass = $(this).data("input-class");
        var lookupNextFocus = $(this).data('lookup-next-focus');
        var lookupNextFunc = $(this).data("lookup-next-func");
        var lookupDataCallback = $(this).data("callback");
        var lookupSearchParamId = $(this).data("search-param");
        var lookupColumns = $(this).data("columns");
        var lookupOtherValue = false;
        var lookupTableId = generateUUID();
        var firstTime = true;
        var fromButton = false;
        var onBlur = false;
        var valueValid = false;
        
        var htmlVal = '<div class="modal fade modal-lookup" id="modal-' + lookupTableId + '" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + lookupTitle + '</h4></div><div class="modal-body"><div class="form-group large-font"><label>Search</label><input placeholder="type here" class="form-control ' + lookupInputClass + ' " id="' + lookupSearchParamId + '"></div>' +
                '<table id="' + lookupTableId + '" data-method="post" data-url="' + lookupUrl + '" data-content-type="application/json" data-data-type="json" data-query-params-type="limit" data-query-params="_fw_LookupParams" data-response-handler="loadData" data-side-pagination="server" data-pagination="true"><thead><tr>';
        $.each(lookupColumns, function (index, element) {
            htmlVal += "<th data-field='" + element.id + "' data-sortable='" + element.sortable + "' data-visible='" + element.visible + "'>" + element.name + "</th>";
        });
        
        htmlVal += '</tr></thead></table></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div>';
        objParent.append(htmlVal);
        
        $(this).find('.input-lookup-modal').keyup(function (e) {
            if (e.keyCode == 13) {
                $('#' + lookupSearchParamId).val($(this).val());
                if ($(this).val() == '' || $(this).val() == null) {
                    $.each(lookupDataCallback, function (key, val) {
                        $('#' + key).val('');
                    });
                } else {
                    inputLookupModalVal = $(this).val();
                    $('#' + lookupSearchParamId).val(thisLookup.find('.input-lookup-modal').val());
                    $('#' + lookupTableId).bootstrapTable();
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        firstTime = false;
                        fromButton = false;
                        onBlur = false;
                        $('#' + lookupTableId).bootstrapTable('refresh');
                        
                    }, 500);
                }
            }
        });
        
        
        $(this).find('.input-lookup-modal').on("blur", this, (function () {
            $('#' + lookupSearchParamId).val($(this).val());
            if ($(this).val() == '' || $(this).val() == null) {
                $.each(lookupDataCallback, function (key, val) {
                    $('#' + key).val('');
                });
            } else {
                inputLookupModalVal = $(this).val();
                $('#' + lookupSearchParamId).val($(this).val());
                $('#' + lookupTableId).bootstrapTable();
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    firstTime = false;
                    fromButton = false;
                    onBlur = true;
                    $('#' + lookupTableId).bootstrapTable('refresh');
                    
                }, 500);
            }
        }));
        
        $('#' + lookupSearchParamId).keyup(function (e) {
            if (e.keyCode == 13) {
                inputLookupModalVal = $(this).val();
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    firstTime = false;
                    fromButton = false;
                    onBlur = false;
                    $('#' + lookupTableId).bootstrapTable('refresh');
                    
                }, 500);
            }
        });
        
        $(this).find('.btn-lookup').click(function () {
            clearTimeout(timeout);
            firstTime = false;
            fromButton = true;
            onBlur = false;
            $('#' + lookupSearchParamId).val(thisLookup.find('.input-lookup-modal').val());
            inputLookupModalVal = thisLookup.find('.input-lookup-modal').val();
            $('#' + lookupSearchParamId).focus();
            $('#modal-' + lookupTableId).modal('show');
            $('#' + lookupTableId).bootstrapTable();
            timeout = setTimeout(function () {
                $('#' + lookupTableId).bootstrapTable('refresh');
            }, 500);
        });
        
        $('#' + lookupTableId).on('post-body.bs.table', function (e) {
            valueValid = false;
            if (!isBindFunc) {
                var value_changed = false;
                var data = $(this).bootstrapTable('getData', 'useCurrentPage');
                if (!firstTime && !fromButton) {
                    
                    if (thisLookup.find('.input-lookup-modal').val() == '' || thisLookup.find('.input-lookup-modal').val() == null) {
                        $.each(lookupDataCallback, function (key, val) {
                            $('#' + key).val('');
                        });
                    } else {
                        if (data.length == 1) {
                            valueValid = true;
                            $.each(lookupDataCallback, function (key, val) {
                                if ($(':input[name="' + key + '"]').length > 1) {
                                    $.each($(':input[name="' + key + '"]'), function (i, v) {
                                        if ($(this).val() == data[0][val]) {
                                            $(this).attr('checked', true);
                                        }
                                    });
                                } else {
                                    if ($('#' + key).val() !== data[0][val]) {
                                        value_changed = true;
                                    }
                                    $('#' + key).val(data[0][val]);
                                }
                            });
                            
                            if (lookupNextFocus !== undefined && lookupNextFocus !== '') {
                                $('#' + lookupNextFocus).focus();
                            }
                            
                            var lookupNextFunc_f = window[lookupNextFunc];
                            if (typeof (lookupNextFunc_f) == 'function') {
                                $.each(lookupDataCallback, function (key, val) {
                                    lookupNextFunc_f($('#' + key));
                                });
                            }
                            
                        } else if (data.length > 1) {
                            //                            if(onBlur){
                            //                                $.each(lookupDataCallback, function (key, val) {
                            //                                    value_changed = true;
                            //                                    $('#' + key).val('');
                            //                                });
                            //                            } else {
                            $('#modal-' + lookupTableId).modal('show');
                            $('#' + lookupSearchParamId).focus();
                            //                            }
                        } else if (data.length == 0) {
                            $.each(lookupDataCallback, function (key, val) {
                                value_changed = true;
                                $('#' + key).val('');
                            });
                        }
                    }
                } else {
                    if (data.length == 1) {
                        valueValid = true;
                    }
                }
                if (value_changed) {
                    var lookupChangeFunc_f = window[lookupChangeFunc];
                    if (typeof (lookupChangeFunc_f) == 'function') {
                        lookupChangeFunc_f();
                    }
                }
            } else {
                if (!firstTime && !fromButton && !onBlur) {
                    $('#modal-' + lookupTableId).modal('show');
                    $('#' + lookupSearchParamId).focus();
                }
            }
        });
        
        $('#' + lookupTableId).on('dbl-click-row.bs.table', function (e, row, $element) {
            if (!isBindFunc) {
                var value_changed = false;
                valueValid = true;
                $.each(lookupDataCallback, function (key, val) {
                    if ($('input[name="' + key + '"]').length > 1) {
                        $.each($('input[name="' + key + '"]'), function (i, v) {
                            if ($(this).val() == row[val]) {
                                $(this).attr('checked', true);
                            }
                        });
                    } else {
                        if ($('#' + key).val() !== row[val]) {
                            value_changed = true;
                        }
                        
                        $('#' + key).val(row[val]);
                    }
                });
                if (value_changed) {
                    var data_func_change_f = window[lookupChangeFunc];
                    if (typeof (data_func_change_f) == 'function') {
                        data_func_change_f();
                    }
                }
            } else {
                data_bind_func_f(row);
                var inputLookup = thisLookup.find('.input-lookup-modal');
                var valLength = inputLookup.val().length * 2;
                inputLookup[0].setSelectionRange(valLength, valLength);
            }
            
            if (lookupNextFocus !== undefined && lookupNextFocus !== '') {
                $('#' + lookupNextFocus).focus();
            }
            
            var data_next_func_f = window[lookupNextFunc];
            if (typeof (data_next_func_f) == 'function') {
                $.each(lookupDataCallback, function (key, val) {
                    data_next_func_f($('#' + key));
                });
            }
            $('#modal-' + lookupTableId).modal('toggle');
        });
        $('#modal-' + lookupTableId).on('hidden.bs.modal', function (e) {
            if (!valueValid) {
                $.each(lookupDataCallback, function (key, val) {
                    $('#' + key).val('');
                });
            }
        });
    });
}
 
function _fw_setValueLookupMultiple(listVal, dataValue, dataText, objLov){
    var lookupWrapper = objLov.closest('.lookup-wrapper');
    var lookupForm = lookupWrapper.find('.lookup-form');
    var lookupTable = $('.fixed-table-body table', lookupForm);
    var tblTempId = lookupTable.data('checkbox-table');
    var objTblTemp = $('#' + tblTempId);
    var tblTempUniqueId = objTblTemp.data('unique-id');
    var objUniqueId = lookupTable.data('unique-id');
    var selctedDiv = lookupWrapper.find('.lookup-multiple');
    selctedDiv.html('<span class="lookup-multiple-span"><i class="lookup-no-selected" style="color: #b1b1b1;font-weight: 400;">No Item Selected</i></div>');
    objTblTemp.bootstrapTable('destroy');
    objTblTemp.bootstrapTable();
    
    var removeSelected = function (idField, idVal) {
        objTblTemp.bootstrapTable('remove', {
            field: idField,
            values: [idVal]
        });
    };
    $.each(listVal, function (i, v) {
        var duplicate = false;
        $.each(objTblTemp.bootstrapTable('getData'), function (index, val) {
            if (v !== undefined && val !== undefined) {
                if (v[objUniqueId] == val[tblTempUniqueId]) {
                    duplicate = true;
                }
            }
        });
        if (!duplicate) {
            var dataDel = objTblTemp.bootstrapTable('getData');
            
            objTblTemp.bootstrapTable('insertRow', {
                index: dataDel.length,
                row: v
            });
            var vselected = $('<span class="lookup-multiple-selected-label" data-uniqueid="' + v[dataValue] + '">' + v[dataText] + '</span>');
            var removeSel = $('<i class="fa fa-times remove-selected" style="margin-left: 5px;" data-value="' + v[dataValue] +'"></i>');
            vselected.append(removeSel);
            $('.lookup-multiple-span', selctedDiv).append(vselected);
            removeSel.click(function() {
                removeSelected(dataValue, v[dataValue]);
                vselected.remove();
                if($('.lookup-multiple-selected-label',selctedDiv).length == 0) $('.lookup-no-selected',selctedDiv).show();
            });
            if($('.lookup-multiple-selected-label',selctedDiv).length > 0) $('.lookup-no-selected',selctedDiv).hide();
        }
    });
}
 
function _fw_setDropDownList(objParent) {
    $('.dropdown', objParent).each(function () {
        var dropDownUrl = $(this).data('url');
        var vvalue = $(this).data('value');
        var vtext = $(this).data('text');
        var params = $(this).data('params');
        var withNoBlank = $(this).data('noblank');
        var objDrop = $(this).find('select');
        //        params.search = {
        //            'any': '',
        //            'status': 'Enabled',
        //            'parent': 'parent'
        //        };
        if (typeof withNoBlank == 'undefined' || withNoBlank == null) {
            objDrop.append($('<option>', {
                value: '',
                text: ''
            }));
        }
        
        _fw_post(dropDownUrl, params, function (data) {
            var option = document.createElement('option');
            $.each(data.data, function (i, v) {
                if (typeof vvalue !== 'undefined' && vvalue !== null) {
                    objDrop.append($('<option>', {
                        value: v['' + vvalue + ''],
                        text: v['' + vtext + '']
                    }));
                } else {
                    objDrop.append($('<option>', {
                        value: v,
                        text: v
                    }));
                }
            });
        });
    });
}
 
function _fw_slideMenuNav(obj){
    var childPos = obj.offset();
    var parentPos = obj.parent().offset();
    var childOffset = {
        top: childPos.top - parentPos.top,
        left: childPos.left - parentPos.left
    };
    var parentminchild = obj.parent().outerWidth()-childOffset.left;
    var geser = 0;
    
    if(childOffset.left<0){
        geser = childOffset.left;
    }else{
        geser = obj.outerWidth()-parentminchild;
    }
    if(childOffset.left + obj.outerWidth() > obj.parent().outerWidth() || childOffset.left < 0){
        var objParent = $('.nav-tabs-container .nav-tabs');
        objParent.animate({
            scrollLeft:'+='+ (geser+20)
        });
    }
}
 
function _fw_setQueryStringParam(location, key, value) {
    if (key == 'undefined') return location;
    var nqs = {};
    if (location && (location.indexOf('?') > -1)) {
        var afloc = location.split('?');
        var qs = afloc[1].split('&');
        var kv;
        for (var i = 0; i < qs.length; i++) {
            kv = qs[i].split('=');
            nqs[kv[0]] = typeof kv[1]!='undefined'? kv[1] : '';
        }
        location = afloc[0];
    }
    nqs[key] = encodeURIComponent(value);
    var snqs = '';
    for (var k in nqs) {
        if (nqs.hasOwnProperty(k) && (k != 'undefined') && (nqs[k] != '')) {
            snqs += snqs == '' ? k + '=' + nqs[k] : '&' + k + '=' + nqs[k];
        }
    }
    if (snqs != '') snqs = '?' + snqs;
    return location + snqs;
}
 
function _fw_openPage(idpage, objparams){
    var obj = $('a[data-appid="'+idpage+'"]', $('#ahmdsh1_menu_ul'));
    get_form(obj, false, objparams);
}
 
function get_form(obj, isappinfoneeded, objparams) {
    var appid = $(obj).data('appid');//fullformid[fullformid.length - 1];
    var menuid = $(obj).data("menuid");
    var menuicon = $(obj).data("form-icon");
    var ctab = $('#tabpanel_' + appid);
    var title = $('.menu-title', obj).text();//$(obj).text();
    
    localStorage.clear();
    
    if (ctab.length <= 0) {
        ctab = $('<div role="tabpanel" class="tab-pane" data-formid="' + appid + '" id="tabpanel_' + appid + '">Loading...</div>').appendTo($('.maincontent_containers.tab-content'));
        $('<li role="presentation" data-formid="' + appid + '" id="tablink_' + appid + '" ><a href="#tabpanel_' + appid + '" class="tablink" aria-controls="' + title + '" role="tab" onclick="window.setTimeout(setLocationHash,10);" data-toggle="tab"><span class="' + menuicon + '" style="margin-right: 10px;"></span>' + title + ' </a><a class="closetabLink" onclick="removeTab(this);"><span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span></a></li>').appendTo($('.nav-tabs-container .nav-tabs'));
        var newmenu = $('<li data-formid="' + appid + '"><a style="margin-right: 35px;" class="dropdown-item" href="#" data-formid="' + appid + '"><i class="' + menuicon + '" style="margin-right: 10px;"></i> ' + title + '</a>' + 
                '<a class="closetabLink" onclick="removeTab($(\'#tablink_' + appid + '\'));" style=""><span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                '</li>').appendTo($('#active-tab'));
        newmenu.click(function () {
            var idmenu = $(this).data('formid');
            $('#ahmdsh1_menu_ul a[data-appid*="' + idmenu + '"]').click();
            setTimeout(function () {
                _fw_slideMenuNav($('#tablink_' + idmenu));
            }, 300);
            $('button', $('#active-tab').parent()).click();
            return false;
        });
    }
    $('#tablink_' + appid + ' a.tablink').click();
    _fw_slideMenuNav($('#tablink_' + appid));
    listener_tabNav();
    var postData = new Object();
    postData.menuvid = '' + menuid;
    postData.appid = appid;
    
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/appinfo', postData, function (data) {
        if (data.status == '1' || !isappinfoneeded) {
            $('li[data-formid="' + $(this).data('formid') + '"]').click(function(){
                _fw_slideMenuNav($('#tablink_' + $(this).data('formid')));
            });
            if($(obj).data('apptarget') == 'Tab Internal - PASTI'){
                var iframe = '<iframe style="height:480px!important; margin-top:20px;" src="' + $(obj).data('formid') + '"></iframe>';
                $('#tabpanel_' + appid).html('<div class="main-app">' + iframe + '</div>');
                $('#tabpanel_' + appid).append('<div class="page-footer">' + appid + ' - Ver. 1.0</div>');
            }else{
                if(isappinfoneeded != false) localStorage.setItem("CR_" + appid, data.data.join());
                var prms = { 'cb': (new Date).getTime() }
                Object.assign(prms, objparams);
                $.get(domain + '/' + $(obj).data('formid') + form_ext, prms, function (data) {
                    var tabPanel = $('#tabpanel_' + appid);
                    $('#tabpanel_' + appid).html('<div class="main-app">' +
                            '<!--convert this part to json first to get the value--><div class="' + appid + '_storedParams" style="display:none;">' + JSON.stringify(prms) + '</div>' + data + '</div>');
                    $('input:text', $('#tabpanel_' + appid)).attr('autocomplete', 'off');
                    $('.btn-lookup', tabPanel).addClass('btn-primary').html('<span class="glyphicon glyphicon-search"></span>');
                    $('.app-title', tabPanel).html(title);
                    var urldi = domain + '/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/download-di?appID=' + appid + "&JXID=" + encodeURIComponent(getJxid());
                    if ($.inArray(appid, bookmarkedApps) == -1) {
                        $('#tabpanel_' + appid).prepend('<div class="app-info-title" style="display: none;">' + title + '</div><div class="app-info">' +
                                '<button class="btn btn-back btn-default bg-grey" style="display: none;float:left;height:32px" ><span class="glyphicon glyphicon-menu-left fg-white"></span></button>' +
                                '<div class="app-button"><button class="btn btn-default bg-orange" onclick="refreshForm(this, event)"><span class="glyphicon glyphicon-refresh"></span></button><button class="btn btn-default bg-purple" name="buttonBookmark" onclick="bookmarkApps(this, event)"><span class="glyphicon glyphicon-pushpin"></span></button><button class="btn btn-primary" onclick="window.open(\'' + urldi + '\' , \'_blank\');"><span class="glyphicon glyphicon-question-sign"></span></button></div><ol class="nav-step"><li class="active"><span>' + title + '</span></li></ol></div>');
                    } else {
                        $('#tabpanel_' + appid).prepend('<div class="app-info-title" style="display: none;">' + title + '</div><div class="app-info">' +
                                '<button class="btn btn-back btn-default bg-grey" style="display: none;float:left;height:32px" ><span class="glyphicon glyphicon-menu-left fg-white"></span></button>' +
                                '<div class="app-button"><button class="btn btn-default bg-orange" onclick="refreshForm(this, event)"><span class="glyphicon glyphicon-refresh"></span></button><button class="btn btn-danger dislike" name="buttonBookmark" onclick="unbookmarkApps(this, event)"><span class="glyphicon glyphicon-pushpin"></span></button><button class="btn btn-primary" onclick="window.open(\'' + urldi + '\', \'_blank\');"><span class="glyphicon glyphicon-question-sign"></span></button></div><ol class="nav-step"><li class="active"><span>' + title + '</span></li></ol></div>');
                    }
                    
                    $('#datetimepicker1').datetimepicker({
                        locale: 'id'
                    });
                    $('.panel-control .panel-button', tabPanel).prepend('<a class="panel-control-button" href="#" onclick="toggleMonitoring(this)"><span class="glyphicon glyphicon-chevron-left trasition"></span></a>');
                    $('table', tabPanel).each(function () {
                        edit_custom_action(this);
                    });
                    $('table', tabPanel).bootstrapTable();
                    $('table', tabPanel).each(function () {
                        add_custom_action(this);
                    });
                    var elementVer = $('#' + appid);
                    var appVer = '';
                    if (elementVer.length > 0) {
                        appVer = $('#' + appid).data('version');
                    } else {
                        appVer = $('#' + appid.toLowerCase()).data('version');
                    }
                    $('#tabpanel_' + appid).append('<div class="page-footer">' + appid + ' - Ver. ' + appVer + '</div>');
                    $(':input:not([type="button"],[type="submit"],button)', tabPanel).keydown(function (e) {
                        if (e.keyCode == 13) {
                            $('.btn.default:first', tabPanel).click();
                        }
                    });
                    
                    $(':input[data-onenter]', tabPanel).each(function () {
                        $(this).keydown(function (e) {
                            if (e.keyCode == 13) {
                                try {
                                    var fn = new Function("___this", $(this).data('onenter').replace(/this/g, '___this'));
                                    fn($(this));
                                } catch (e) {
                                }
                            }
                        });
                    });
                    
                    _fw_setInputDatePicker(tabPanel);
                    _fw_setDropDownList(tabPanel);
                    
                    $.each($('table', tabPanel), function () {
                        //checkbox table event oncheck all
                        $(this).on('check-all.bs.table', function (e, rows) {
                            var tblTempId = $(e.target).data('checkbox-table');
                            var objTblTemp = $('#' + tblTempId);
                            var tblTempUniqueId = objTblTemp.data('unique-id');
                            var objUniqueId = $(e.target).data('unique-id');
                            
                            if (objTblTemp !== undefined && tblTempId !== undefined && objUniqueId !== undefined) {
                                $.each(rows, function (i, v) {
                                    var duplicate = false;
                                    $.each(objTblTemp.bootstrapTable('getData'), function (index, val) {
                                        if (v !== undefined && val !== undefined) {
                                            if (v[objUniqueId] == val[tblTempUniqueId]) {
                                                duplicate = true;
                                            }
                                        }
                                    });
                                    if (!duplicate) {
                                        var dataDel = objTblTemp.bootstrapTable('getData');
                                        
                                        objTblTemp.bootstrapTable('insertRow', {
                                            index: dataDel.length,
                                            row: v
                                        });
                                    }
                                });
                            }
                        });
                        
                        //checkbox table event oncheck
                        $(this).on('check.bs.table ', function (e, row) {
                            var tblTempId = $(e.target).data('checkbox-table');
                            var objTblTemp = $('#' + tblTempId);
                            var tblTempUniqueId = objTblTemp.data('unique-id');
                            var objUniqueId = $(e.target).data('unique-id');
                            if (objTblTemp !== undefined) {
                                var duplicate = false;
                                $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                                    if (v !== undefined && row !== undefined) {
                                        if (v[objUniqueId] == row[tblTempUniqueId]) {
                                            duplicate = true;
                                        }
                                    }
                                });
                                if (!duplicate) {
                                    var dataDel = objTblTemp.bootstrapTable('getData');
                                    objTblTemp.bootstrapTable('insertRow', {
                                        index: dataDel.length,
                                        row: row
                                    });
                                }
                            }
                        });
                        
                        //checkbox table event uncheck
                        $(this).on('uncheck.bs.table', function (e, row) {
                            var tblTempId = $(e.target).data('checkbox-table');
                            var objTblTemp = $('#' + tblTempId);
                            var tblTempUniqueId = objTblTemp.data('unique-id');
                            var objUniqueId = $(e.target).data('unique-id');
                            $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                                if (v !== undefined && row !== undefined) {
                                    if (v[objUniqueId] == row[tblTempUniqueId]) {
                                        objTblTemp.bootstrapTable('remove', {
                                            field: tblTempUniqueId,
                                            values: [v[tblTempUniqueId]]
                                        });
                                    }
                                }
                            });
                        });
                        
                        //checkbox table event uncheck all
                        $(this).on('uncheck-all.bs.table', function (e, rows) {
                            var tblTempId = $(e.target).data('checkbox-table');
                            var objTblTemp = $('#' + tblTempId);
                            var tblTempUniqueId = objTblTemp.data('unique-id');
                            var objUniqueId = $(e.target).data('unique-id');
                            $.each(rows, function (i, v) {
                                var delFound = false;
                                $.each(objTblTemp.bootstrapTable('getData'), function (index, val) {
                                    if (v !== undefined && val !== undefined) {
                                        if (v[objUniqueId] == val[tblTempUniqueId]) {
                                            delFound = true;
                                        }
                                    }
                                });
                                if (delFound) {
                                    objTblTemp.bootstrapTable('remove', {
                                        field: tblTempUniqueId,
                                        values: [v[tblTempUniqueId]]
                                    });
                                }
                            });
                        });
                        
                        //checkbox table event preserve checkbox
                        $(this).on('post-body.bs.table', function (e) {
                            var tblTempId = $(e.target).data('checkbox-table');
                            var objTblTemp = $('#' + tblTempId);
                            var tblTempUniqueId = objTblTemp.data('unique-id');
                            var objUniqueId = $(e.target).data('unique-id');
                            var data = $(e.target).bootstrapTable('getData');
                            $.each(data, function (index, val) {
                                $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                                    if (v !== undefined) {
                                        if (v[objUniqueId] == val[tblTempUniqueId]) {
                                            $(e.target).bootstrapTable('check', index);
                                        }
                                    }
                                });
                            });
                        });
                    });
                    
                    _fw_setUploadFile(tabPanel);
                    _fw_setLookupModal(tabPanel);
                    _fw_setDecimalOnly(tabPanel);
                    _fw_setLookup(tabPanel);
                    _fw_setDataRole(tabPanel, appid);
                    _fw_setDateTimePicker(tabPanel);
                    
                    if ((typeof _vloadhash_initAction[appid.toLowerCase()] != 'undefined') && (typeof window[appid.toLowerCase() + '_initAction'] == 'function') 
                            && (_vloadhash_initAction[appid.toLowerCase()] != '')) {
                        window[appid.toLowerCase() + '_initAction'](_vloadhash_initAction[appid.toLowerCase()]);
                        _vloadhash_initAction[appid.toLowerCase()] = '';
                        delete _vloadhash_initAction[appid.toLowerCase()];
                    }
                });
            }
        }
    });
}
 
function _fw_setUploadFile(objParent){
    $('.upload-file', objParent).each(function () {
        var maxsize = $(this).data("maxsize");
        var exts = $(this).data('allowedext');
        $(this).find('.input-upload').change(function () {
            var vo = $(this)[0], v = $(this).val(), e = '', valid = true, msg = '';
            if (exts !== null) {
                exts = decodeURIComponent(exts);
                e = v.split('.');
            }
            if (e.length > 1) {
                var xt = e[e.length - 1].toLowerCase();
                if ((',' + exts + ',').indexOf(xt) == -1) {
                    msg = 'Allowed file extension' + (exts.indexOf(',') > -1 ? 's are : ' : ' is : ') + '<b>' + exts.replace(',', '</b>, <b>') + '</b>';
                    valid = false;
                }
            }
            if (valid && (maxsize !== null) && (maxsize > 0) && (typeof vo.files !== 'undefined') && (typeof vo.files[0] !== 'undefined') && (typeof vo.files[0].size !== 'undefined') && (vo.files[0].size > parseInt(maxsize, 10))) {
                msg = 'Max file size allowed is : <b>' + _fw_humanFileSize(maxsize, true) + '</b>, your file size is <b>' + _fw_humanFileSize(vo.files[0].size, true) + '</b>';
                valid = false;
            }
            if (!valid) {
                _fw_setMessage(this, 0, msg);
                $(this).val('');
            } else {
                var obj = $(this);
                if (obj.length > 0) {
                    var prt = obj.parent();
                    var inf = $('.file-info', prt);
                    if (inf.length <= 0)
                        inf = $('<div class="file-info" id="info-file" style="display: none;"><button style="float:right" class="btn small bg-red" onclick="_fw_upload_delete(this)"><i class="glyphicon glyphicon-remove fg-white"></i></button><div class="file-displayName"><i class="glyphicon glyphicon-file"></i> ' + $(this).val() + '</div><input type="hidden" name="item-file" class="file-uploaded-item"></div>').appendTo(prt);
                    obj.hide();
                    inf.show();
                }
            }
        });
    });
}
 
function _fw_setNumberOnly(objParent){
    $('input.numberonly', objParent).keypress(function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        var isShift37 = false;
        if (charCode == 37) { isShift37 = evt.shiftKey ? true : false; }
        
        if (charCode !== 8 // backspace
                && charCode !== 9  // tab
                && (charCode <= 36 || charCode >= 39 || isShift37 || charCode == 38)
                && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });
}
 
function _fw_setDecimalOnly(objParent){
    $('input.decimalonly', objParent).keypress(function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode !== 8 // backspace
                && charCode !== 46 // titik
                && charCode !== 9  // tab
                && (charCode <= 38 // arrow keys
                || charCode >= 40)
                && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });
}
 
function _fw_setDataRole(objParent, appid){
    $.each($('[data-role]', objParent), function () {
        var attrrole = $(this).attr('data-role').split(',');
        var lclstrg = localStorage.getItem('CR_' + appid).split(',');
        var found = false;
        
        for (var i = 0; i < lclstrg.length; i++) {
            if (attrrole.indexOf(lclstrg[i]) > -1) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            $(this).css('display', 'none');
        } else {
            $(this).css('display', '');
        }
    });
}
 
function _fw_setDateTimePicker(objParent){
    $.each($('.date', objParent), function () {
        $(this).datetimepicker({
            format: 'DD-MMM-YYYY',
            locale: 'en'
        });
    });
}
 
function _fw_subpage(obj, id, row) {
    _fw_setMessage(obj);
    var parent = $(obj).closest('.div-app');
    if (parent.html() == undefined) {
        parent = $(obj).closest('.tab-pane');
    }
    $('.subpage.subpage-default', parent).removeClass('subpage-default');
    var targetSubpage = $('#' + id);
    //    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //        $('.btn-back').show();
    //    }
    _fw_validation_clear(targetSubpage);
    $(targetSubpage).addClass('subpage-default');
    
    //----------------control breadcrumb-----------------------
    var tpath = targetSubpage.data('path').split('/');
    var tback = targetSubpage.data('back-action');
    
    var tabObj = $(obj).closest('.main-app').prev();
    var breadcrumb = $('ol.nav-step', tabObj);
    var listLI = $('li', breadcrumb);
    var lastLi = listLI.last();
    
    if (tback !== undefined) {
        if (tback !== '') {
            var tback_f = window[tback];
            if (typeof (tback_f) == 'function') {
                $.each(lastLi, function (i, v) {
                    $(this).attr("onclick", tback + "(this)");
                });
            }
        }
    }
    
    var lengthListLI = listLI.length;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && lengthListLI >= 2) {
        $('.btn-back').show();
    }else{
        $('.btn-back').hide();
    }
    while (lengthListLI < tpath.length) {
        breadcrumb.append('<li><span><a href="#"></a></span></li>');
        lengthListLI++;
    }
    
    lengthListLI = $('li', breadcrumb).length;
    while (lengthListLI > tpath.length) {
        listLI[listLI.length - 1].remove();
        lengthListLI--;
    }
    
    var path = '';
    listLI = $('li', breadcrumb);
    $.each(listLI, function (i, v) {
        $(this).removeClass('active');
        if (i == 0) {
            path += tpath[i];
        } else {
            path += '/' + tpath[i];
        }
        
        if (i < listLI.length - 1) {
            var apptitle = '';
            if (i == 0) {
                apptitle = _fw_getActiveAppTitle();
            } else {
                apptitle = $.trim(tpath[i]);
            }
            $(this).html('<span><a href="#" style="color:#fff" onclick="_fw_breadcrumb(this, \'' + $.trim(path) + '\');return false">' + apptitle + '</a></span>');
        } else if (i == listLI.length - 1) {
            $(this).addClass('active');
            $(this).html('<span>' + $.trim(tpath[i]) + '</span>');
        }
        
        if (i == listLI.length - 2) {
            $('.btn-back').attr("onclick", '_fw_breadcrumb(this, \'' + $.trim(path) + '\')');
        } 
    });
    //-----------end breadcrumb-------------
    automaticFill(row, targetSubpage);
    
    
}
 
function ahmmomst293p01_LookupCs(params) {
    params.search = {
        "any": $('#ahmmomst293p01_cs').val()
        , "status": "Enabled"
        , "parent": "parent"
        , "gateid": $('#ahmmomst293p01_gateid').val()
    };
    if (params.sort == undefined) {
        return{
            limit: params.limit,
            offset: params.offset,
            search: params.search
        };
    }
    return params;
}
 
function automaticFill(row, targetSubpage) {
    if (row !== undefined && row !== null) {
        $.each($(':input', targetSubpage).not('input[type="radio"]', targetSubpage), function () {
            var inputObj = $(this);
            var datafield = $(this).data("field");
            $.each(row, function (key, value) {
                if (datafield == key) {
                    inputObj.val(value);
                }
            });
        });
        
        $.each($('input[type="radio"]', targetSubpage), function () {
            var inputObj = $(this);
            var datafield = $(this).data("field");
            $.each(row, function (key, value) {
                if (datafield == key) {
                    if (inputObj.val() !== undefined && value !== undefined) {
                        if (inputObj.val().toLowerCase() == value.toLowerCase()) {
                            inputObj.prop('checked', true);
                        }
                    }
                }
            });
        });
    }
}
 
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
 
function recursive_menu(menu_obj, array_data, html_string) {
    var menu_childs = new Array();
    html_string += '<ul class="treeview-menu" style="display: none;">';
    var menuGroup = [];
    var appGroup = [];
    
    $.each(array_data, function (key, value) {
        if (value.url == "null") {
            menuGroup.push(this);
        } else {
            appGroup.push(this);
        }
    });
    
    $.each(menuGroup, function (key, value) {
        if (value.parent == menu_obj.internalid) {
            var menu_child_obj = new Object();
            menu_child_obj.internalid = value.internalid;
            menu_child_obj.title = value.title;
            
            html_string += '<li class="menu treeview transition">' +
                    '<a href="#">' +
                    '<i class="' + value.icon + '"></i> <span style="display:none;">' + value.menuid + '</span><span>' + value.title + '</span>' +
                    '<i class="glyphicon glyphicon-chevron-down icon-menu-expand" style="float:right; margin-right: 10px; font-size:9;"></i>' +
                    '</a>';
            html_string = recursive_menu(menu_child_obj, array_data, html_string);
            html_string += '</li>';
            menu_childs.push(menu_child_obj);
        }
    });
    
    $.each(appGroup, function (key, value) {
        if (value.parent == menu_obj.internalid) {
            var menu_child_obj = new Object();
            menu_child_obj.internalid = value.internalid;
            menu_child_obj.title = value.title;
            
            html_string += '<li class="menu transition">' +
                    '<a data-apptarget="' + value.target + '" data-appid="' + value.menuid + '" data-menuid="' + value.internalid + '" data-formid="' + value.url + '" href="#" data-form-icon="' + value.icon + '">' +
                    '<i class="glyphicon glyphicon-circle-o">' +
                    '</i><span style="display:none;">' + value.menuid + '</span><div class="menu-title">' + value.title + '</div>' +
                    '</a>' +
                    '</li>';
            
            menu_childs.push(menu_child_obj);
            
        }
    });
    
    if (menu_childs.length > 0) {
        menu_obj.menuChilds = menu_childs;
    }
    html_string += '</ul>';
    return html_string;
}
 
function _fw_post(postUrl, postData, callback) {
    $.ajax({
        type: "POST",
        url: postUrl,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        //headers: {
           // "JXID": getJxid()
//        },
        data: JSON.stringify(postData),
        success: function (data) {
            if (data.status == '0' && (data.message.authentication == "Invalid Request")) {
                openLoginForm();
            } else if (data.stat != '401') {
                if (typeof (callback) == 'function') {
                    callback(data);
                }
            }
        },
        error : function(xhr, textStatus, errorThrown ) {
            var errorCallbackData = {
                "status":"0",
                "data":null,
                "message":{
                    "message": textStatus.charAt(0).toUpperCase()+textStatus.slice(1)+" "+xhr.status+" "+xhr.statusText
                }
            };
            if (typeof (callback) == 'function') {
                callback(errorCallbackData);
            }
        }
    });
}
 
function _fw_reset_subpage(obj) {
    _fw_validation_clear(obj);
    var subpage;
    if ($(obj).hasClass('subpage')) {
        subpage = $(obj);
    } else {
        subpage = $(obj).closest('.subpage');
    }
    $(subpage).find('input').not('input[type="radio"],.unresetable').val('');
    $(subpage).find('select').each(function () {
        $(this).val($(this).find('option:first').val());
    });
    $(subpage).find('textarea').val('');
}
 
function _fw_setMessage(obj, status, msg, errorCallback) {
    var subpageId = $(obj).closest('.subpage').attr('id');
    var appObj = $(obj).closest('.div-app');
    if (typeof (msg) == 'string') {
        if ($('.global_message', appObj).html() !== '') {
            $('.global_message', appObj).slideUp(200);
        }
        if (status == 1 && msg == '') {
            $('.global_message', appObj).html('');
        } else if (status == 1 && msg !== '') {
            $('.global_message', appObj)
                    .html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msg + '</div>');
        } else if (status == 0) {
            $('.global_message', appObj)
                    .html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msg + '</div>');
        } else {
            $('.global_message', appObj).html('');
        }
        if ($('.global_message', appObj).html() !== '') {
            $('.global_message', appObj).slideDown(200);
        }
    } else if (typeof (msg) == 'object') {
        if (status == '0') {
            if ($('.global_message', appObj).html() !== '') {
                $('.global_message', appObj).slideUp(200);
            }
            var generateDataId = generateUUID();
            var msgArray = '';
            if (msg.length > 1) {
                msgArray = '<ul class="errorList">';
                $.each(msg, function (i, val) {
                    msgArray += '<li>' + val + '</li>';
                });
                msgArray += '</ul>';
            } else if (msg.length == 1) {
                msgArray = msg[0];
            }
            $('.global_message', appObj)
                    .html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msgArray + '<ul><li style="list-style-type: none;"></li></ul></div>');
            if ($('.global_message', appObj).html() !== '') {
                $('.global_message', appObj).slideDown(200);
            }
            updateData[generateDataId] = msg;
        } else if (status == '1') {
            if ($('.global_message', appObj).html() !== '') {
                $('.global_message', appObj).slideUp(200);
            }
            
            var generateDataId = generateUUID();
            
            var msgArray = '';
            if (msg.length > 1) {
                msgArray = '<ul class="errorList">';
                $.each(msg, function (i, val) {
                    msgArray += '<li>' + val + '</li>';
                });
                msgArray += '</ul>';
            } else if (msg.length == 1) {
                msgArray = msg[0];
            }
            $('.global_message', appObj)
                    .html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msgArray + '<ul><li style="list-style-type: none;"></li></ul></div>');
            if ($('.global_message', appObj).html() !== '') {
                $('.global_message', appObj).slideDown(200);
            }
            updateData[generateDataId] = msg;
        }
    }
}
 
function reloadForUpdate(obj, pageId, id, errorCallback) {
    _fw_setMessage(obj, -1, '');
    if (errorCallback == undefined) {
        automaticFill(updateData[id].rows[0], $('#' + pageId));
    } else {
        var errorCallbackf = window[errorCallback];
        if (typeof (errorCallbackf) == 'function') {
            errorCallbackf(updateData[id].rows[0]);
        } else {
            automaticFill(updateData[id].rows[0], $('#' + pageId));
        }
    }
    
}
 
/* Validation */
var _vvalObjs = [];
function _fw_validation_clear(obj) {
    _vvalObjs = [];
    var ofrm;
    if ($(obj).hasClass('subpage')) {
        ofrm = $(obj);
    } else {
        ofrm = $(obj).closest('.subpage');
    }
    _fw_setMessage(obj, -1, '');
    ofrm.find('.form-group').removeClass('has-error has-feedback');
    ofrm.find('.form-group').find('.form-control-feedback').remove();
}
 
function _fw_validation_add(obj, fieldName, validation) {
    var ofrm = $(obj).closest('.subpage').length > 0 ? $(obj).closest('.subpage') : $(obj).closest('.div-app');
    var fieldLabel = $('label[for="' + fieldName + '"]', ofrm) !== undefined ? $('label[for="' + fieldName + '"]', ofrm).text() : '';
    _vvalObjs[_vvalObjs.length] = {
        obj: $(':input[name="' + fieldName + '"]').attr('type') == 'radio' || $(':input[name="' + fieldName + '"]').attr('type') == 'checkbox'
        ? $(':input[name="' + fieldName + '"]') : $('#' + fieldName, ofrm),
        name: fieldLabel,
        val: validation,
        msg: '',
        fieldname: fieldName
    };
}
 
function _fw_validation_validate(obj) {
    var msg = '<ul class="errorList">';
    for (var i = 0; i < _vvalObjs.length; i++) {
        switch (_vvalObjs[i].val.toLowerCase()) {
            case 'required':
                if (_vvalObjs[i].obj.attr('type') == 'radio' || _vvalObjs[i].obj.attr('type') == 'checkbox') {
                    if (typeof $(':input[name="' + _vvalObjs[i].fieldname + '"]:checked').val() !== 'undefined') {
                        if ((_vvalObjs[i].msg == '') && ($(':input[name="' + _vvalObjs[i].fieldname + '"]:checked').val() == null || $(':input[name="' + _vvalObjs[i].fieldname + '"]:checked').val().replace(/\s+/, '') == ''))
                            _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                    } else {
                        _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                    }
                } else if(_vvalObjs[i].obj.hasClass( "input-lookup" )){
                    var lookupWrapper = _vvalObjs[i].obj.closest('.lookup-wrapper');
                    var lookupMultiple = $('.lookup-multiple', lookupWrapper).length;
                    var lookupSelected = $('.lookup-multiple-selected-label', lookupWrapper).length;
                    if ((_vvalObjs[i].msg == '') && (lookupSelected == 0) && lookupMultiple > 0)
                        _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                    else if ((_vvalObjs[i].msg == '') && (_vvalObjs[i].obj.val() == null || _vvalObjs[i].obj.val().replace(/\s+/, '') == ''))
                        _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                } else {
                    if ((_vvalObjs[i].msg == '') && (_vvalObjs[i].obj.val() == null || _vvalObjs[i].obj.val().replace(/\s+/, '') == ''))
                        _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                }
                break;
            case 'number':
                if ((_vvalObjs[i].msg == '') && isNaN(_vvalObjs[i].obj.val()))
                    _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' must be numeric.';
                break;
            case 'date':
                if ((_vvalObjs[i].msg == '') && isValidDate(_vvalObjs[i].obj.val()))
                    _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is not valid date. Date format: dd-mmm-yyyy.';
                break;
            case 'email':
                if ((_vvalObjs[i].msg == '') && isValidEmail(_vvalObjs[i].obj.val()))
                    _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is not valid email.';
                break;
        }
    }
    var dmsg = '';
    for (var i = 0; i < _vvalObjs.length; i++) {
        if (_vvalObjs[i].msg !== '') {
            dmsg += '<li>' + _vvalObjs[i].msg + '</li>';
            _vvalObjs[i].obj.closest('.form-group').addClass('has-error has-feedback');
        }
    }
    if (dmsg !== '') {
        msg += dmsg + '</ul>';
        _fw_setMessage(obj, 0, msg);
        return false;
    }
    return true;
}
 
function isValidDate(currVal) {
    if (currVal == '')
        return false;
    
    //Declare Regex  
    var rxDatePattern = /^(\d{1,2})(\/|-)([a-zA-Z]{3})(\/|-)(\d{4})$/;
    
    var dtArray = currVal.match(rxDatePattern); // is format OK?
    
    if (dtArray == null)
        return false;
    
    var dtDay = parseInt(dtArray[1]);
    var dtMonth = dtArray[3];
    var dtYear = parseInt(dtArray[4]);
    
    // need to change to lowerCase because switch is
    // case sensitive
    switch (dtMonth.toLowerCase()) {
        case 'jan':
            dtMonth = '01';
            break;
        case 'feb':
            dtMonth = '02';
            break;
        case 'mar':
            dtMonth = '03';
            break;
        case 'apr':
            dtMonth = '04';
            break;
        case 'may':
            dtMonth = '05';
            break;
        case 'jun':
            dtMonth = '06';
            break;
        case 'jul':
            dtMonth = '07';
            break;
        case 'aug':
            dtMonth = '08';
            break;
        case 'sep':
            dtMonth = '09';
            break;
        case 'oct':
            dtMonth = '10';
            break;
        case 'nov':
            dtMonth = '11';
            break;
        case 'dec':
            dtMonth = '12';
            break;
    }
    
    // convert date to number
    dtMonth = parseInt(dtMonth);
    
    if (isNaN(dtMonth))
        return false;
    else if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 !== 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    
    return true;
}
 
function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
 
function loadData(resps) {
    if (resps.status !== '0') {
        return {
            rows: resps.data,
            total: resps.total
        };
    } else {
        return {
            rows: [],
            total: 0
        };
    }
}
 
function _fw_getSysdate(obj) {
    var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");
    
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    $(obj).val(curr_date + "-" + m_names[curr_month]
            + "-" + curr_year);
}
 
function _fw_relogin(user, pass) {
    var vo = new Object();
    $.ajax({
        type: "POST",
        url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/login",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify(vo)
    }) 
    .done(function (data) {
        if (data.status == "1") {
            $('.ahm .login-outer').slideUp();
            showIcon();
            setMenuSidebar();
            setProfileInfo();
            listener_tabNav();
            $(window).resize(listener_tabNav);
            search_prepare();
            addBookmarkMenu();
            getFormFromHash();
            setLocationHash();
            lastRequest.headers = {
                "JXID": getJxid()
            };
            $.ajax(lastRequest);
        } else {
            $('#error-login').slideDown();
        }
    })
            .fail(function () {
    });
}
 
function _rt_initTable(tblSelector, limiter) {
    var tbl = $(tblSelector).addClass('responsiveTable');
    $('.hiddenCell', tbl).removeClass('hiddenCell');
    $('.detailBlock', tbl).remove();
    var rlimit = !limiter ? tbl.closest('.div-app') : limiter;
    var maxw = rlimit.width();
    
    if (tbl.outerWidth() > maxw) {
        var rw = 0, rc = 0;
        $('th', tbl).each(function () {
            rw += $(this).outerWidth();
            if (rw < maxw) {
                rc++;
            } else
                return false;
        });
        rc = rc - 2;
        tbl.data('hiddenIdx', rc);
        $('th:gt(' + rc + ')', tbl).addClass('hiddenCell');
        $(' > tbody > tr', tbl).each(function () {
            if ($('table', this).length <= 0) {
                var firstTd;
                if ($('td:first', this).hasClass('bs-checkbox')) {
                    firstTd = $('td:nth-child(2)', this);
                } else {
                    firstTd = $('td:first', this);
                }
                firstTd.addClass('mainCell');
                if ($('a.moreLink', firstTd).length <= 0)
                    firstTd.prepend('<a href="#" class="moreLink" onclick="_rt_populate(this);return false;"></a>');
                
                $('td:gt(' + rc + ')', this).addClass('hiddenCell');
            }
        });
    }
}
 
function _rt_populate(obj) {
    var obj = $(obj);
    var tbl = obj.closest('table');
    var row = obj.closest('tr');
    var td = obj.parent();
    var tgt = $('.detailBlock', td);
    if (tgt.length <= 0) {
        tgt = $('<div class="detailBlock"></div>').appendTo(td);
        var headers = Array();
        var celldata = Array();
        $('th.hiddenCell', tbl).each(function () {
            headers[headers.length] = $(this).text();
        });
        $('td.hiddenCell', row).each(function () {
            celldata[celldata.length] = $(this).html();
        });
        for (var x = 0; x < headers.length; x++) {
            $('<div class="itemLbl">' + headers[x] + '</div><div class="itemVal">' + celldata[x] + '</div>').appendTo(tgt);
        }
    }
    tgt.slideToggle();
}
 
function numberFormatter(value, row, index) {
    return addCommas(value);
}
 
function addCommas(nStr) {
    if (nStr !== undefined && nStr !== "") {
        //nStr = parseFloat(nStr).toFixed(2);
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return (x1 + '' + x2);
    } else {
        return nStr;
    }
}
 
function removeCommas(nStr) {
    if (nStr !== undefined && nStr !== "") {
        return nStr.replace(/,/g, '');
    } else {
        return nStr;
    }
}
 
function toggleMonitoring(obj) {
    $(obj).closest('.panel-control').toggleClass('collapsed');
    $('.glyphicon', $(obj)).toggleClass('flipX');
    return false;
}
 
function _fw_breadcrumb(obj, path) {
    var parent = $(obj).closest('.tab-pane');
    var pageId = $('.subpage[data-path="' + path + '"]', parent).attr('id');
    
    _fw_subpage(obj, pageId);
    
    var parent_li = $(obj).closest('li').addClass('active');
    $(parent_li).nextAll().remove();
    
}
 
var indexBaseColor = -1;
function addBookmarkMenu() {
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/get-bookmark', '', function (data) {
//        if(data.data.length > 0){
            $('#bookmarkList').show();
            $('#bookmarkList').html('');
            indexBaseColor = -1;
            var bookmarkBySystem = [];
            var bookmarkByUser = [];
            bookmarkedApps = [];
            $.each(data.data, function (i, v) {
                if (v.flag == 'S') {
                    bookmarkBySystem.push(v);
                } else {
                    bookmarkByUser.push(v);
                }
                bookmarkedApps.push(v.applicationId);
            });
 
            var i = 0;
            $.each(bookmarkBySystem, function (index, val) {
                createBookmarkToHome(i, val);
                i++;
            });
 
            $.each(bookmarkByUser, function (index, val) {
                createBookmarkToHome(i, val);
                i++;
            });
//        } else {
//            $('#bookmarkList').hide();
//        }
        
        
    });
}
 
function createBookmarkToHome(i, v) {
    var moduloMenu = i % bookmarkSameBaseColor;
    
    if (moduloMenu == 0) {
        indexBaseColor++;
        if (indexBaseColor >= baseColorBookmark.length) {
            indexBaseColor = 0;
        }
    }
    var colorCss = shadeColor2(baseColorBookmark[indexBaseColor], moduloMenu * 0.1);
    
    if (colorCss.length > 7) {
        colorCss = colorCss.substr(0, 7);
    }
    $('#bookmarkList').append(generateBookmark(v, colorCss));
}
 
 
function removeBookmarkHomeMenu(obj, event) {
    event.preventDefault();
    var formId = $(obj).data('formid');
    var arrappid = formId.split('/');
    var data = new Object();
    data.applicationId = arrappid[arrappid.length - 1];
    
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/unbookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).closest('.tile').remove();
            addBookmarkMenu();
            $('button[name="buttonBookmark"]', $('#tabpanel_' + arrappid[arrappid.length - 1])).removeClass('dislike').attr("onclick", "bookmarkApps(this, event)");
        }
    });
    
    event.cancelBubble = true;
    event.stopPropagation();
    
    return false;
    
}
 
function openAppsFromHome(obj) {
    var fullformid = $(obj).data('appid');
    var formId = fullformid;
    var form_obj = $('#tablink_' + formId);
    if (form_obj.html() == undefined) {
        var form = $('a[data-appid="' + formId + '"]', $('#ahmdsh1_menu_ul'));
        get_form(form);
    } else {
        form_obj.tab('show');
        $('[role="tabpanel"].tab-pane').removeClass('active');
        $('#tabpanel_' + formId).addClass('active');
    }
    setLocationHash();
    return false;
}
 
var _vloadhash_initAction = Array();
function getFormFromHash() {
    if (document.location.hash !== '') {
        var ah = document.location.hash.split(',');
        var acttab = '';
        for (var x = 0; x < ah.length; x++) {
            var xs = ah[x].split(':');
            if (xs.length > 1)
                acttab = xs[0].replace('#', '');
            if (xs.length > 2) {
                _vloadhash_initAction[xs[0].replace('#', '').toLowerCase()] = xs[2];
            }
            
            $('#ahmdsh1_menu_ul a[data-appid="' + xs[0].replace('#', '') + '"]').click();
        }
    }
    var ctab = $('.nav-tabs-container a.tablink[href*="' + acttab + '"]');
    if (ctab.length > 0) {
        ctab.click();
        _fw_slideMenuNav($('#tablink_' + acttab));
    }
}
 
function refreshForm(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');
    var form = $('a[data-appid="' + formId + '"]', $('#ahmdsh1_menu_ul'));
    
    get_form(form);
    
    return false;
}
 
 
function bookmarkApps(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');
    
    var data = new Object();
    data.applicationId = formId;
    
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/add-bookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).toggleClass('dislike');
            $(obj).attr("onclick", "unbookmarkApps(this, event)");
            addBookmarkMenu();
        }
    });
    return false;
}
 
function unbookmarkApps(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');
    
    var data = new Object();
    data.applicationId = formId;
    
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/unbookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).toggleClass('dislike');
            $(obj).attr("onclick", "bookmarkApps(this, event)");
            addBookmarkMenu();
        }
    });
    return false;
}
 
function generateBookmark(val, color) {
    var bookmarkIcon = '<div class="tile" style="background-color:#eee;" data-appid="' + val.applicationId + '" data-formid="' + val.url + '" onclick="openAppsFromHome(this)">'
            + '<div class="tile-content">'
            + '<i class="' + val.icon + '" style="color:' + color + ';"></i>'
            + '</div>'
            + '<div class="tile-status">'
            + '<span class="name">' + val.title + '</span>'
            + '</div>';
    if (val.flag !== 'S') {
        bookmarkIcon += '<a href="#" class="link-unbookmark-tile" title="Unbookmark Apps" data-formid="' + val.url + '" onclick="removeBookmarkHomeMenu(this, event)">'
                + '<span class="glyphicon glyphicon-pushpin">'
                + '</span>'
                + '</a>';
    }
    bookmarkIcon += '</div>';
    return bookmarkIcon;
}
 
function shadeColor2(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}
 
//rani
function openLoginForm() {
//    $("#dolphin-chat").remove();
//    $(".dolphin-chat-icon").remove();
    $('.ahm .login-outer').slideDown();
    $('.ahm .login-outer :input[name="password"]').focus();
    //$('.ahm .login-outer :input[name="username"]').attr("readonly","readonly");
    Chat.resetToLogin(true);
    hideWidget();
}
 
function getJxid() {
    if (typeof Cookies.get('JXID') == 'undefined') {
        return '';
    } else {
        return Cookies.get('JXID');
    }
}
 
$(".btn-clear").click(function () {
    var objinput = $(this).closest(".form-group");
    $('input[type="text"]', objinput).val('');
});
 
function _fw_tableAddRowBefore(tableId, arrayData, withRowNumber, styletr) {
    //_fw_setMessageCurrent(-1, '');
    if ($('#' + tableId + '>tbody>tr').first().attr('class') == 'no-records-found') {
        $('#' + tableId + '>tbody>tr').remove();
    }
    
    var tbl = $('table#' + tableId);
    var spage = tbl.closest('.sub-page');
    var spages = tbl.closest('.sub-pages');
    var maxrow = $('table#' + tableId + ' > tbody > tr').length;
    
    if (tbl.length > 0) {
        var hasDtlView = ($('thead .detailView', tbl).length > 0);
        var hdrMaxPr = 1;
        var uniqData = {
        };
        var checkUnique = false;
        var rowExists = false;
        var hasActionColumn = false;
        var actionVid = '';
        $('thead td, thead th', tbl).each(function () {
            if (!$(this).hasClass('rowNumber') && !$(this).hasClass('actionColumn')) {
                if ($(this).hasClass('priority4') && (hdrMaxPr < 4))
                    hdrMaxPr = 4;
                else if ($(this).hasClass('priority3') && (hdrMaxPr < 3))
                    hdrMaxPr = 3;
                else if ($(this).hasClass('priority2') && (hdrMaxPr < 2))
                    hdrMaxPr = 2;
            }
            if ($(this).hasClass('keycheck')) {
                checkUnique = true;
                uniqData[$(this).data('field')] = arrayData[$(this).data('field')];
            }
            if ($(this).hasClass('actionColumn')) {
                hasActionColumn = true;
                actionVid = $(this).data('field');
            }
        });
        if (checkUnique)
            rowExists = _fw_tableIsKeyExists(tableId, uniqData);
        var dtlView = '';
        var rowStr = '<tr style="' + styletr + '">';
        if (withRowNumber && ($('thead .rowNumber', tbl).length > 0)) {
            var classNum = $('thead .rowNumber', tbl).attr('class').replace('tblHeader', 'tblData');
            rowStr += '<td class="' + classNum + '">' + (maxrow + 1) + '</td>';
        }
        if (hasActionColumn && (actionVid !== '') && (typeof arrayData[actionVid] == 'undefined')) {
            if (typeof tbl.data('actions') !== 'undefined') {
                var _bsort = false,
                        _bedit = false,
                        _bdel = false;
                var _bsdata = ',' + tbl.data('actions').toLowerCase() + ',';
                _bsort = _bsdata.indexOf('order') > -1;
                _bedit = _bsdata.indexOf('edit') > -1;
                _bdel = _bsdata.indexOf('delete') > -1;
                //arrayData[actionVid] = _fw_tableActionLinks(_bsort, _bdel, _bedit);
            }
        }
        if (!rowExists) {
            $.each(arrayData, function (key, value) {
                var th = $('thead [field-id="' + key.replace(/:/g, '\\:') + '"]', tbl);
                var dtl = '';
                var linkDtl = '';
                var tdclass = '';
                if (th.length > 0) {
                    var _txtVal = value;
                    try {
                        _txtVal = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    } catch (ex) {
                    }
                    if (th.hasClass('right'))
                        tdclass += 'text-right';
                    var hfield = (!th.hasClass('rowNumber') && !th.hasClass('actionColumn') && String(_txtVal).indexOf('&lt;') <= -1) ? '<input type="hidden" name="' + key + '" value="' + _txtVal + '">' : '';
                    rowStr += '<td field-id="' + key + '" class="' + tdclass + '">' + linkDtl + '<span class="field-value">' + value + '</span>' + dtl + hfield + '</td>';
                }
            });
            rowStr = rowStr.replace('<!--[dview]-->', dtlView);
            rowStr += '</tr>';
            var newRow = $(rowStr);
            $('#' + tableId + '>tbody').prepend(newRow);
            $('.tableView[data-table="' + tableId + '"]', spages).each(function () {
                var ct = $('.clone_' + tableId, spages).length;
                var tid = tableId + '_c' + ct;
                var t = tbl.clone().attr('id', tid).addClass('clonedTable').addClass(ct).attr('data-sourcetable', tableId);
                $(this).empty().append(t);
            });
        } else {
            _fw_setMessage(('#' + tableId), 0, 'Data already exist');
            //_fw_setMessageCurrent(0,"Data already exist.");
        }
        return newRow;
    }
}
 
function _fw_tableAddRowAfter(tableId, arrayData, withRowNumber) {
    //_fw_setMessageCurrent(-1, '');
    if ($('#' + tableId + '>tbody>tr').first().attr('class') == 'no-records-found') {
        $('#' + tableId + '>tbody>tr').remove();
    }
    
    var tbl = $('table#' + tableId);
    var spage = tbl.closest('.sub-page');
    var spages = tbl.closest('.sub-pages');
    var maxrow = $('table#' + tableId + ' > tbody > tr').length;
    
    if (tbl.length > 0) {
        var hasDtlView = ($('thead .detailView', tbl).length > 0);
        var hdrMaxPr = 1;
        var uniqData = {
        };
        var checkUnique = false;
        var rowExists = false;
        var hasActionColumn = false;
        var actionVid = '';
        $('thead td, thead th', tbl).each(function () {
            if (!$(this).hasClass('rowNumber') && !$(this).hasClass('actionColumn')) {
                if ($(this).hasClass('priority4') && (hdrMaxPr < 4))
                    hdrMaxPr = 4;
                else if ($(this).hasClass('priority3') && (hdrMaxPr < 3))
                    hdrMaxPr = 3;
                else if ($(this).hasClass('priority2') && (hdrMaxPr < 2))
                    hdrMaxPr = 2;
            }
            if ($(this).hasClass('keycheck')) {
                checkUnique = true;
                uniqData[$(this).data('field')] = arrayData[$(this).data('field')];
            }
            if ($(this).hasClass('actionColumn')) {
                hasActionColumn = true;
                actionVid = $(this).data('field');
            }
        });
        if (checkUnique)
            rowExists = _fw_tableIsKeyExists(tableId, uniqData);
        var dtlView = '';
        var rowStr = '<tr>';
        if (withRowNumber && ($('thead .rowNumber', tbl).length > 0)) {
            var classNum = $('thead .rowNumber', tbl).attr('class').replace('tblHeader', 'tblData');
            rowStr += '<td class="' + classNum + '">' + (maxrow + 1) + '</td>';
        }
        if (hasActionColumn && (actionVid !== '') && (typeof arrayData[actionVid] == 'undefined')) {
            if (typeof tbl.data('actions') !== 'undefined') {
                var _bsort = false,
                        _bedit = false,
                        _bdel = false;
                var _bsdata = ',' + tbl.data('actions').toLowerCase() + ',';
                _bsort = _bsdata.indexOf('order') > -1;
                _bedit = _bsdata.indexOf('edit') > -1;
                _bdel = _bsdata.indexOf('delete') > -1;
                //arrayData[actionVid] = _fw_tableActionLinks(_bsort, _bdel, _bedit);
            }
        }
        if (!rowExists) {
            $.each(arrayData, function (key, value) {
                var th = $('thead [field-id="' + key.replace(/:/g, '\\:') + '"]', tbl);
                var dtl = '';
                var linkDtl = '';
                var tdclass = '';
                if (th.length > 0) {
                    var _txtVal = value;
                    try {
                        _txtVal = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    } catch (ex) {
                    }
                    if (th.hasClass('right'))
                        tdclass += 'text-right';
                    var hfield = (!th.hasClass('rowNumber') && !th.hasClass('actionColumn')) && String(_txtVal).indexOf('&lt;') <= -1 ? '<input type="hidden" name="' + key + '" value="' + _txtVal + '">' : '';
                    rowStr += '<td field-id="' + key + '" class="' + tdclass + '">' + linkDtl + '<span class="field-value">' + value + '</span>' + dtl + hfield + '</td>';
                }
            });
            rowStr = rowStr.replace('<!--[dview]-->', dtlView);
            rowStr += '</tr>';
            var newRow = $(rowStr);
            $('#' + tableId + '>tbody').append(newRow);
            $('.tableView[data-table="' + tableId + '"]', spages).each(function () {
                var ct = $('.clone_' + tableId, spages).length;
                var tid = tableId + '_c' + ct;
                var t = tbl.clone().attr('id', tid).addClass('clonedTable').addClass(ct).attr('data-sourcetable', tableId);
                $(this).empty().append(t);
            });
        } else {
            _fw_setMessage(('#' + tableId), 0, 'Data already exist');
            //_fw_setMessageCurrent(0,"Data already exist.");
        }
        return newRow;
    }
}
 
function _fw_tableIsKeyExists(tableId, arrdata) {
    var tbl = $('table#' + tableId);
    var found = false;
    for (var r = 0; r < $('tbody tr', tbl).length; r++) {
        var tr = $('tbody tr:nth(' + r + ')', tbl);
        found = true;
        for (var idx in arrdata) {
            var itm = $('td input[name="' + idx + '"][value="' + arrdata[idx] + '"]', tr);
            if (itm.length <= 0) {
                found = false;
                break;
            }
        }
        if (found)
            break;
    }
    return found;
}
function _fw_tableEmptyRows(tableId) {
    $('table#' + tableId + " tbody").empty();
}
function _fw_tableRenumbering(tableId) {
    var tbl = $('table#' + tableId);
    if (tbl.length > 0) {
        var idx = 1;
        $('table#' + tableId + ' > tbody > tr').each(function (i, e) {
            $('td.rowNumber', this).html(idx);
            idx++;
        });
    }
}
 
function _fw_tableDeleteRow(obj) {
    var spages = $(obj).closest('.sub-pages');
    var st = $(obj).closest('table');
    var tid = st.attr('id');
    var tgt = $(obj).closest('tr');
    var rid = $('tr', st).index(tgt);
    var origTable = st.data('sourcetable');
    tgt.remove();
    _fw_tableRenumbering(tid);
    if (st.hasClass('clonedTable')) {
        var t = $('#' + origTable + ' tr:nth(' + rid + ') td .tblActionDel', spages);
        t.click();
    }
}
 
function _fw_filterpanel_toggle(obj) {
    obj = $(obj);
    var prt = obj.closest('.form-filter-panel');
    if (prt.hasClass('collapsed'))
        _fw_filterpanel_show(obj);
    else
        _fw_filterpanel_hide(obj);
}
 
function _fw_filterpanel_hide(obj) {
    obj = $(obj);
    var prt = obj.closest('.form-filter-panel');
    $('div.row:not(:has(.form-group-button))', prt).slideUp();
    $('.filter-link-collapse', prt).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    prt.addClass('collapsed');
}
 
 
function _fw_filterpanel_show(obj) {
    obj = $(obj);
    var prt = obj.closest('.form-filter-panel');
    $('div.row:not(:has(.form-group-button))', prt).slideDown();
    $('.filter-link-collapse', prt).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    prt.removeClass('collapsed');
}
 
function _fw_upload_isFileValid(obj, exts, maxsize) {
    var exts = getUrlParameter('allowedext'), maxsize = getUrlParameter('maxsize'), vo = obj[0], v = obj.val(), e = '', valid = true, msg = '';
    if (exts !== null) {
        exts = decodeURIComponent(exts);
        e = v.split('.');
    }
    if (e.length > 1) {
        var xt = e[e.length - 1].toLowerCase();
        if ((',' + exts + ',').indexOf(xt) == -1) {
            // error
            msg = 'Allowed file extension' + (exts.indexOf(',') > -1 ? 's are : ' : ' is : ') + '<b>' + exts.replace(',', '</b>, <b>') + '</b>';
            valid = false;
        }
    }
    if (valid && (maxsize !== null) && (maxsize > 0) && (typeof vo.files !== 'undefined') && (typeof vo.files[0] !== 'undefined') && (typeof vo.files[0].size !== 'undefined') && (vo.files[0].size > parseInt(maxsize, 10))) {
        msg = 'Max file size allowed is : <b>' + humanFileSize(maxsize, true) + '</b>, your file size is <b>' + humanFileSize(vo.files[0].size, true) + '</b>';
        valid = false;
    }
    if (!valid) {
        window.top.$.Dialog({
            shadow: true,
            overlay: false,
            icon: '<span class="icon-cancel fg-crimson"></span>',
            title: 'Request Error',
            width: 500,
            padding: 10,
            content: '<h1><span class="icon-cancel fg-crimson"></span> Upload failed</h1><div class="errMessage">' + msg + '</div><div class="dialogButtons"><button class="primary danger" type="button" onclick="$.Dialog.close()"><span class="icon-cancel-2"></span> Close</button></div>'
        });
        valid = false;
        $('#file_upload').val('');
    }
    return valid;
}
 
function _fw_humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}
 
function _fw_upload_delete(obj) {
    
    var inf = $(obj);
    var prt = inf.closest('.upload-file');
    inf.closest('.file-info').remove();
    $('.input-upload', prt).show();
    $('.input-upload', prt).val('');
}
 
//function _fw_freezeTable(tblid, left, right) {
//    var tbl = $('table#' + tblid);
//    var wrp = tbl.closest('.fixed-table-container');
//    var tblParent = tbl.parent(), tblw = tbl.outerWidth();
//
//    tbl.parent().css({paddingLeft: 0});
//    var tdw = [], tdx = [], tdy = [], ridx = 0, pLeft = 0, pTop = 0, tWidth = 0;
//
//    $('tr', tbl).each(function (ix, ox) {
//        var hh = $(this).outerHeight();
//        $(this).css({height: hh});
//        $('th,td', this).each(function (i, val) {
//            if (typeof tdw[i] == 'undefined') {
//                tdw[i] = $(this).outerWidth();
//            }
//            var pos = $(this).position(), px = pos.left, py = pos.top;
//            if ((i == 0) && (px > 0)) {
//                pLeft = px;
//            }
//            if ((i == 0) && (py > 0)) {
//                pTop = py;
//            }
//            if (typeof tdx[i] == 'undefined') {
//                tdx[i] = px - pLeft;
//            }
//            if (typeof tdy[i] == 'undefined') {
//                tdy[i] = py - pTop;
//            }
//            $(this).css({width: tdw[i], height: hh});
//
//        });
//    });
//    if (!tblParent.hasClass('responsiveTableScroller')) {
//        tblParent = $('<div class="fixed-table-container"><div class="responsiveTableScroller" ></div></div>');
//        tbl.css('table-layout', 'fixed').addClass('freezedTable').wrap(tblParent);
//        if (left > 0)
//            $('.fixedLCol', tbl).removeClass('fixedLCol fixedLColLast');
//        if (right > 0)
//            $('.fixedRCol', tbl).removeClass('fixedRCol fixedRColLast');
//    }
//    var fxPos = [];
//    var xw = -1, mxw = 0, ppos = $('thead tr:first th:nth(' + left + ')', tbl).position().left, rx = [], rWidth = 0, lWidth = 0, rWc = {};
//
//    $('tr', tbl).each(function (ri, rval) {
//        var len = $('td,th', this).length, xw = -1;
//        var trY = $(this).position().top;
//        rWidth = 0;
//        $('td,th', this).each(function (i, val) {
//            if (i < left) {
//                $(this).addClass('fixedLCol').css({left: tdx[i] + 'px'});
//                if ($(this).is('th'))
//                    $(this).css({top: tdy[i] + 'px'});
//                if (ri == 0)
//                    lWidth += $(this).outerWidth();
//            } else if (i >= (len - right)) {
//                $(this).addClass('fixedRCol').css({right: '0px', top: '-=1'});
//                $(this).css({top: trY + 'px'});
//            } else {
//                if (ri == 0)
//                    tWidth += tdw[i] + 1;
//            }
//        });
//        rWidth = 0;
//        for (var x = len - 1; x >= len - right; x--) {
//            var cell = $('td:nth(' + x + '),th:nth(' + x + ')', this);
//            if (typeof rWc[x] == 'undefined')
//                rWc[x] = 0;
//            cell.css({right: rWc[x]});
//            rWidth += cell.outerWidth() - 1;
//            rWc[x - 1] = rWidth;
//        }
//    });
//
//    if (!tblParent.hasClass('responsiveTableScroller')) {
//        tbl.parent().css({marginLeft: lWidth - left, marginRight: rWidth});
//    }
//
//}
 
function _fw_parseDate(str) {
    var months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6
        , 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    var monthName = str.split('-')[0] + '-' + months[str.split('-')[1]] + '-' + str.split('-')[2];
    var mdy = monthName.split('-');
    return new Date(mdy[2], mdy[1], mdy[0] - 1);
}
 
function _fw_dayDiff(dateFrom, dateTo) {
    var first = _fw_parseDate(dateFrom);
    var second = _fw_parseDate(dateTo);
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}
 
function _fw_setDatePickerFilter(objParent) {
    $.each($('.filterdate', objParent), function () {
        $(this).datetimepicker({
            widgetParent: 'body',
            format: 'DD-MMM-YYYY',
            locale: 'en'
        })
                .on('dp.show', function () {
                    var top = ($(this).offset().top - 220);
            var left = $(this).offset().left;
            if ($(this).offset().top - 400 <= 0) { //display below if not enough room above
                top = $(this).offset().top + $(this).height() + 10;
                $('.bootstrap-datetimepicker-widget').removeClass('top');
                $('.bootstrap-datetimepicker-widget').addClass('bottom');
            }
            $('.bootstrap-datetimepicker-widget').css({
                'top': top + 'px',
                'left': left + 'px',
                'bottom': 'auto',
                'right': 'auto'
            });
        });
    });
}
 
function _fw_freezeTable(tblid, left, right) {
    var tbl = $('table#' + tblid);
    var vmarginleft = 0;
    var vmarginright = 0;
    $('tr', tbl).each(function (ix, ox) {
        var len = $('td', this).length;
        var h_trh = $(this).outerHeight();
        var vleft = 0;
        var vright = 0;
        $(this).css({height: h_trh});
        $('td', this).each(function (i, val) {
            if (i < left) {
                var w_th = $('td:nth(' + i + ')', $('#' + tblid + ' tbody tr:first')).outerWidth() >
                        $(this).outerWidth() ? $('td:nth(' + i + ')', $('#' + tblid + ' tbody tr:first')).outerWidth()
                : $(this).outerWidth();
                
                $(this).css({height: h_trh, width: w_th, left: vleft});
                vleft = vleft + w_th;
                vmarginleft = vleft;
            } else if (i >= (len - right)) {
                var w_th = $('td:nth(' + i + ')', $('#' + tblid + ' tbody tr:first')).outerWidth() >
                        $(this).outerWidth() ? $('td:nth(' + i + ')', $('#' + tblid + ' tbody tr:first')).outerWidth()
                : $(this).outerWidth();
                $(this).css({height: h_trh, width: w_th, right: vright});
                vright = vright + w_th;
                vmarginright = vright;
            }
        });
        var rWidth = 0, rWc = {};
        for (var x = len - 1; x >= len - right; x--) {
            var cell = $('td:nth(' + x + '),th:nth(' + x + ')', this);
            if (typeof rWc[x] == 'undefined') rWc[x] = 0;
            cell.css({ right: rWc[x] });
            rWidth += cell.outerWidth() - 1;
            rWc[x - 1] = rWidth;
        }
    });
    
    $('tr', tbl).each(function (ix, ox) {
        var len = $('th', this).length;
        var h_trh = $(this).outerHeight();
        var vleft = 0;
        var vright = 0;
        $('th', this).each(function (i, val) {
            if (i < left) {
                var w_th = $('th:nth(' + i + ')', $('#' + tblid + ' thead tr:nth(2)')).outerWidth() >
                        $(this).outerWidth() ? $('th:nth(' + i + ')', $('#' + tblid + ' thead tr:nth(2)')).outerWidth()
                : $(this).outerWidth();
                $(this).css({height: h_trh, width: w_th, left: vleft});
                vleft = vleft + w_th;
                vmarginleft = vleft;
            } else if (i >= (len - right)) {
                var w_th = $('th:nth(' + i + ')', $('#' + tblid + ' thead tr:nth(2)')).outerWidth() >
                        $(this).outerWidth() ? $('th:nth(' + i + ')', $('#' + tblid + ' thead tr:nth(2)')).outerWidth()
                : $(this).outerWidth();
                $(this).css({height: h_trh, width: w_th, right: vright});
                vright = vright + w_th;
                vmarginright = vright;
            }
        });
        var rWidth = 0, rWc = {};
        for (var x = len - 1; x >= len - right; x--) {
            var cell = $('td:nth(' + x + '),th:nth(' + x + ')', this);
            if (typeof rWc[x] == 'undefined') rWc[x] = 0;
            cell.css({ right: rWc[x] });
            rWidth += cell.outerWidth() - 1;
            rWc[x - 1] = rWidth;
        }
    });
    
    $('tr', tbl).each(function (ix, ox) {
        var len = $('td,th', this).length;
        $('td,th', this).each(function (i, val) {
            if (i < left) {
                $(this).addClass('fixedLCol');
            } else if (i >= (len - right)) {
                $(this).addClass('fixedRCol');
            }
        });
    });
    
    $('#' + tblid).parent().css({marginLeft: vmarginleft, marginRight: vmarginright});
}
 
function _fw_freezeTableOnPost(tblid, left, right) {
    var tbl = $('table#' + tblid);
    
    $('tr', tbl).each(function (ix, ox) {
        var len = $('td,th', this).length;
        $('td,th', this).each(function (i, val) {
            if (i < left) {
                $(this).addClass('fixedLCol');
            } else if (i >= (len - right)) {
                $(this).addClass('fixedRCol');
            }
        });
    });
    
    var tdw = [], tdx = [], tdy = [], ridx = 0, pLeft = 0, pTop = 0, tWidth = 0;
    $('tr', tbl).each(function (ix, ox) {
        var hh = $(this).outerHeight();
        $(this).css({height: hh});
        $('th:visible,td:visible', this).each(function (i, val) {
            if (typeof tdw[i] == 'undefined') {
                tdw[i] = $(this).outerWidth();
            }
            var pos = $(this).position(), px = pos.left, py = pos.top;
            if ((i == 0) && (px > 0)) {
                pLeft = px;
            }
            if ((i == 0) && (py > 0)) {
                pTop = py;
            }
            if (typeof tdx[i] == 'undefined') {
                tdx[i] = px - pLeft;
            }
            if (typeof tdy[i] == 'undefined') {
                tdy[i] = py - pTop;
            }
            $(this).css({width: tdw[i], height: hh});
            
        });
    });
    
    var fxPos = [];
    var xw = -1, mxw = 0, ppos = $('thead tr:first th:nth(' + left + ')', tbl).position().left, rx = [], rWidth = 0, lWidth = 0, rWc = {};
    
    $('tr', tbl).each(function (ri, rval) {
        var len = $('td,th', this).length, xw = -1;
        var trY = $(this).position().top;
        $('td,th', this).each(function (i, val) {
            if (i < left) {
                $(this).addClass('fixedLCol').css({left: tdx[i] + 'px'});
                if ($(this).is('th'))
                    $(this).css({top: trY[i] + 'px'});
                if (ri == 0)
                    lWidth += $(this).outerWidth();
            } else if (i >= (len - right)) {
                $(this).addClass('fixedRCol').css({right: '0px', top: '-=1'});
                $(this).css({top: trY + 'px'});
            } else {
                if (ri == 0)
                    tWidth += tdw[i] + 1;
            }
        });
        var rWidth = 0, rWc = {};
        for (var x = len - 1; x >= len - right; x--) {
            var cell = $('td:nth(' + x + '),th:nth(' + x + ')', this);
            if (typeof rWc[x] == 'undefined') rWc[x] = 0;
            cell.css({ right: rWc[x] });
            rWidth += cell.outerWidth() - 1;
            rWc[x - 1] = rWidth;
        }
    });
}
 
function _fw_currencyFormatDisp(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
 
function _fw_currencyFormatOnType(obj) {
    var xnew = $(obj).val().replace(/,/g, "");
    xnew = xnew.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    obj.value = xnew;
}
 
function _fw_decimalOnlyOnType(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode !== 188 // ,
            && charCode !== 190 // .
            && charCode !== 8 // backspace
            && charCode !== 46 // delete
            && charCode !== 9  // tab
            && (charCode < 37 // arrow keys
            || charCode > 40)
            && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
 
function _fw_upload(postUrl, postData, callback) {
    jQuery.ajax({
        url: postUrl,
        data: postData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        headers: {
            'JXID': getJxid()
        },
        success: function (data) {
            if (data.stat != '401') {
                if (typeof (callback) == 'function') {
                    callback(data);
                }
            }
        }
    });
}
 
function _fw_getActiveAppTitle() {
    return $('.toptoolbar .nav-tabs .active a').text();
}
 
function _fw_exportToExcel(url) {
    $.ajax({
        type: "POST",
        url: "/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/validate-token",
        contentType: "application/json",
        dataType: 'json',
        //headers: {
           // "JXID": getJxid()
//        },
        async: false//,
    })
            .done(function (data) {
                if (data.status == "1") {
                    var win = window.open(url, '_blank');
            win.focus();
        }
    });
}
 
function _fw_upload(postUrl, postData, callback) {
    jQuery.ajax({
        url: postUrl,
        data: postData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        headers: {
            'JXID': getJxid()
        },
        success: function (data) {
            if (data.stat != '401') {
                if (typeof (callback) == 'function') {
                    callback(data);
                }
            }
        }
    });
}
 
function _fw_getAppsProblem(){
            
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/supp-get-apps-problem', null, function (data) {
        if (data.status == "1") {
            var str = '';
            if (data.data.length > 0){
                str += '<div class="row">\
                            <div class="slideshow-apps-problem">';
                $.each(data.data, function (i, v) {
                    str += '<div class="slideshow-apps">\
                            <div class="caption-text">\
                            '+v.probdesc+'.';
                    if (v.followingStatus == false){
                        str += '<a href="#" onclick="followTopic('+v.probid+')" id="followTopic-'+v.probid+'"><b> Follow this topic</b></a>';
                    }
 
                    str += '</div>\
                            </div>';
                });
                str += '</div>\
                        </div>';
 
                str += '<div class="row" style="margin-bottom : 20px;">\
                        <div style="text-align:center">';
                $.each(data.data, function (i, v) {
                    str += '<span class="dot clicked" onclick="currentSlide('+(i+1)+')"></span>';
                });
                str += '</div>\
                       </div>';
 
                $('#slides-apps').append(str);
                showSlides(appsProblemIndex);
 
            } else {
                str += '<div class="row" style="margin-bottom : 20px;">';
                $('#slides-apps').append(str);
            }
        }
    });
    
}
 
function _fw_getAnnouncement(){
    
    var vo = {limit: 10, offset: 0, search: {any: ""}};
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/get-published-announcements', vo, function (ret) {
        
        if(ret.status == '1'){
                        
            var htmlVal = '<div class="col-xs-12">';
            htmlVal += '<div id="myCarousel" class="carousel slide">';
            htmlVal += '<div class="carousel-inner">';
            var close = 0;
 
            $.each(ret.data, function (key, v) {
                var src = v.thumbnail != null ? 'data:image/png;base64,' + v.thumbnail : 'resources/image/img_anc.png';
                var a = new RegExp('href="http', 'g');
                var content = v.content.toString();
                contentAnnouncement.push(content);
 
                if (key % 4 == 0){
                    if (key == 0){
                        htmlVal += '<div class="item active"><div class="row">';
 
                    } else {
                        htmlVal += '<div class="item"><div class="row">';
                    }
 
                    htmlVal += '<div class="col-xs-3" onClick=detailCarousel('+key+')>';
                    htmlVal += '<div class="carousel-col">';
                    htmlVal += '<div onClick=detailCarousel('+key+')><img src="' + src + '" alt="News image" style="width: 100%;height: 100%;"/></div>';
                    htmlVal += '<div class="block img-responsive">';
                    htmlVal += '<div class="box-content" >';
                    htmlVal += '<div style="text-size: 11px;"><a href="#" class="anc-title-dashboard">'+v.title.substr(0, 100)+'</a></div>';
                    htmlVal += '</div></div></div></div>';
                } else {
                    htmlVal += '<div class="col-xs-3" onClick=detailCarousel('+key+')>';
                    htmlVal += '<div class="carousel-col">';
                    htmlVal += '<div onClick=detailCarousel('+key+')><img src="' + src + '" alt="News image" style="width: 100%;height: 100%;/></div>';
                    htmlVal += '<div class="block img-responsive">';
                    htmlVal += '<div class="box-content" >';
                    htmlVal += '<div style="text-size: 11px;"><a href="#" class="anc-title-dashboard">'+v.title.substr(0, 100)+'</a></div>';
                    htmlVal += '</div></div></div></div>';
                }
 
                close++;
 
                if (close == 4){
                    htmlVal += '</div></div>';
                    close = 0;
                               }
 
            });
 
            htmlVal += '</div></div>';
            htmlVal += '<a class="carousel-control left" href="#myCarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>';
            htmlVal += '<a class="carousel-control right" href="#myCarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>';
            htmlVal += '</div>';
            $('#fw_annn').html(htmlVal);
            detailCarousel(0);
        }
    });
}
 
function _fw_detailAnc(obj){
    
    var tabpane = $(obj).closest('.tab-pane');
    var anc = $(obj).closest('.row');
    var thumbsrc = $('.vthumb', anc).html() != '' ? '<blockquote class="pull-left"><img src="' + $('.vthumb', anc).html() + '" class="img-responsive" style="margin-top: 10px; max-height: 250px;" alt="feature-top"></blockquote>' : '';
    $('.app-wrapper', tabpane).hide();
    $('.anc-detail', tabpane).show();
    
    $('.entity_title', tabpane).html('<h1>' + $('.anc-title', anc).html() + '</h1>');
    $('.entity_meta', tabpane).html($('.anc-meta', anc).html());
    $('.entity_thumb', tabpane).html(thumbsrc);
    $('.entity_content', tabpane).html($('.anc-content', anc).html());
    return false;
}
 
function _fw_backAnc(obj){
    var tabpane = $(obj).closest('.tab-pane');
    $('.app-wrapper', tabpane).show();
    $('.anc-detail', tabpane).hide();
}
 
function hideWidget() {
    Chat.removeWaitingTextIcon();
    $(".dolphin-login").fadeOut("fast");
    $(".dolphin-chat").fadeOut("fast");
    $(".dolphin-chat-icon").remove();
}
 
function showIcon() {
    var chatIcon = document.createElement("div");
    chatIcon.id = "dolphin-chat-icon";
    chatIcon.classList.add("dolphin-chat-icon");
//    document.body.appendChild(chatIcon);
    $('#default_home').append(chatIcon);
    $('.dolphin-chat-icon').css('background-image', 'url("' + Chat.icon_avatar + '")');
    localStorage.setItem("inmotion_chat_state", "icon");
    Chat.state = "icon";
    Chat.addIconEvent();
}
 
function detailCarousel(content){
    $('#announ').html(contentAnnouncement[content]);
    $('#announ').show();
}
 
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slideshow-apps");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) 
    {
        appsProblemIndex = 1
    }
    
    if (n < 1) 
    {
        appsProblemIndex = slides.length
    }
            
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" clicked", "");
    }
    
    slides[appsProblemIndex-1].style.display = "block";
    dots[appsProblemIndex-1].className += " clicked";
}
        
function currentSlide(n) {
    showSlides(appsProblemIndex = n);
}
        
function followTopic(probid){
    $('#followTopic-'+probid).hide();
            
    var postData = new Object();
    postData.search = {
        vprobid: probid
    };
            
    _fw_post('/jx02/ahmsvipdsh000-pst/rest/ip/dsh001/follow-apps-problem', postData, function (data) {
        if (data.status === '1') {
            alert("Berhasil follow, info perbaikan akan diberitahukan via email");
            
        } else {
            alert("Gagal follow");
        }
    });
}