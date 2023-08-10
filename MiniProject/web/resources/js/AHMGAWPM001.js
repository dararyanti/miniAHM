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
function _fw_post(postUrl, postData, callback) {
    $.ajax({
        type: "POST",
        url: postUrl,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        // headers: {
        //     "JXID": getJxid()
        // },
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

const ahmgawpm001 = $("#ahmgawpm001");

var selectedIndex = 0;
var plantVarGlobal = 0;

var areaTableNameGlobal = 0;
var areaTableNameException = ["ahmgawpm001_area_add_ehs_table"]
var oldRenewAreaTable = new Array();

var personnelTableNameGlobal = 0;
var personnelTableNameException = [""];
var oldRenewPersonnelTable = new Array();

var toolTableNameGlobal = 0;
var toolTableNameException = [""];
var oldRenewToolTable = new Array();

var spesifikasiTableNameGlobal = 0;
var oldRenewSpesifikasiTable = new Array();

var vikpidGlobal = 0;
var loginPatrolGlobal = 0;

var oldNomorAssetArea = 0;
var oldNikPasporKontraktor = 0;
var oldIkpToolsId = 0;
var offsetTableGlobal = 0;

var oldDeskripsiItem = 0;
var oldDeskripsiItemSpk = 0;
var oldNomorPo = 0;
var oldNomorSpk = 0;

var roleGlobal = "";
var userTypeLogin = "";
var userTypeLoginFinal = "";
var userPartnerId = "";
var userPartnerName = "";
var userId = "";
var userName = "";
var plantEhsGlobal = "";

var listIkpIdChecked = new Array();
var listStatusChecked = new Array();

var savedKontraktorData = new Array();
var savedProjectOwnerData = new Array();
var savedEhsControllerData = new Array();

var renewedNoIkp = "";

$("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(null);
$("#ahmgawpm001_lookup_nomor_po_filter", ahmgawpm001).attr("disabled", true);
$("#ahmgawpm001_nomor_po_filter", ahmgawpm001).attr("readonly", true);

$(document).ready(() => {
//    ahmgawpm001check_role();
});

//ahmgawpm001check_role();

function reset_notification_modal() {
    $('#ahmgawpm001_notification_modal_message').val(null);
    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
    $('#ahmgawpm001_notification_modal_submessage').val(null);
    document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
}

function reset_submit_modal() {
    $('#ahmgawpm001_submit_ikp_message').val(null);
    document.getElementById("ahmgawpm001_submit_ikp_message").innerHTML = $('#ahmgawpm001_submit_ikp_message').val();
}

$("#ahmgawpm001_notification_modal").on('hide.bs.modal', function () {
    reset_notification_modal();
});

$("#ahmgawpm001_submit_ikp").on('show.bs.modal', function () {
    var stringIkp = "";
    for (let i = 0; i < listIkpIdChecked.length; i++) {
        stringIkp = stringIkp + "<p>" + listIkpIdChecked[i] + "</p>";
    }
    $('#ahmgawpm001_submit_ikp_message').val(stringIkp);
    document.getElementById("ahmgawpm001_submit_ikp_message").innerHTML = $('#ahmgawpm001_submit_ikp_message').val();
});

$("#ahmgawpm001_submit_ikp").on('hide.bs.modal', function () {
    reset_submit_modal();
});



//function ahmgawpm001check_role() {
//    _fw_post('/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-role', null, function (data) {
//        userTypeLogin = data.data;
//        for (let i = 0; i < userTypeLogin.length; i++) {
//            if (userTypeLogin[i].rolename.includes("RO_GAWPM_ALL")) {
//                userTypeLoginFinal = userTypeLogin[i].rolename;
//                userPartnerId = userTypeLogin[i].partnerId;
//                userId = userTypeLogin[i].userId;
//                userName = userTypeLogin[i].userName;
//                userPartnerName = userTypeLogin[i].partnerName;
//                break;
//            } else {
//                userTypeLoginFinal = userTypeLogin[i].rolename;
//                userPartnerId = userTypeLogin[i].partnerId;
//                userId = userTypeLogin[i].userId;
//                userName = userTypeLogin[i].userName;
//                userPartnerName = userTypeLogin[i].partnerName;
//            }
//        }
//
//        console.log(userTypeLogin);
//
//
//
//        if (data.status === "1") {
//            switch (true) {
//                case userTypeLoginFinal.includes("RO_GAWPM_KONTRAKTOR"):
//                    roleGlobal = "kontraktor";
//                    $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(userPartnerId);
//                    $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val(userPartnerName);
//                    $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).attr("readonly", true);
//                    $("#ahmgawpm001_lookup_id_supplier_filter", ahmgawpm001).attr("disabled", true);
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_DEPT_HEAD"):
//                    roleGlobal = "deptHead";
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_PIC"):
//                    roleGlobal = "projectOwner";
//                    $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(userId);
//                    $("#ahmgawpm001_nama_pic_filter", ahmgawpm001).val(userName);
//                    $("#ahmgawpm001_id_pic_filter", ahmgawpm001).attr("readonly", true);
//                    $("#ahmgawpm001_lookup_id_pic_filter", ahmgawpm001).attr("disabled", true);
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_EHSC"):
//                    roleGlobal = "ehsController";
//                    plantEhsGlobal = userTypeLoginFinal.split('_')[3];
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_OFCSECT"):
//                    roleGlobal = "security";
//                    plantEhsGlobal = userTypeLoginFinal.split('_')[3];
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_EHSO"):
//                    roleGlobal = "ehsOfficer";
//                    plantEhsGlobal = userTypeLoginFinal.split('_')[3];
//                    break;
//                case userTypeLoginFinal.includes("RO_GAWPM_ALL"):
//                    roleGlobal = "admin";
//                    break;
//            }
//            if (data.status == '0') {
//                _fw_setMessage(obj, ret.status, ret.message.message + ': ' + ret.message.res)
//                validateResult = false
//            }
//        }
//    });
//}

function ahmgawpm001_hideShow() {
    $("#ahmgawpm001_request_button_maintain_kontraktor").show();
    $("#ahmgawpm001_create_button_maintain_ehs_controller").hide();
}

function ahmgawpm001_hideShowBack() {
    $("#ahmgawpm001_request_button_maintain_kontraktor").hide();
    $("#ahmgawpm001_create_button_maintain_ehs_controller").show();
}

function ahmgawpm001_ehsControllerCreatePage(obj) {
    $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001).bootstrapTable('removeAll');
    document.getElementById("ahmgawpm001_id_plant_add_ehs_lookup").style.display =
        "block";
    document.getElementById(
        "ahmgawpm001_id_plant_add_ehs_non_lookup"
    ).style.display = "none";
    $('#ahmgawpm001_add_new_area_add_ehs', ahmgawpm001).attr("disabled", true);

    $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_save_add_ehs', ahmgawpm001).attr("disabled", true);
    $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).attr("readonly", true);
    $("#ahmgawpm001_no_po_add_ehs_button", ahmgawpm001).attr("disabled", true);

    $('#ahmgawpm001_delete_all_area_add_ehs', ahmgawpm001).attr("disabled", true);
    _fw_validation_clear($("#ahmgawpm001_halaman_create_ehs_controller"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_create_ehs_controller"));
    areaTableNameGlobal = $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001);
    _fw_subpage(obj, "ahmgawpm001_halaman_create_ehs_controller");
}

function ahmgawpm001_back_display_kontraktor(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_back_display_ehs(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_back_display_security(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_request_kontraktor(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_add_ehs(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_edit_ehs(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_edit_admin(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_edit_kontraktor(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_renew_admin(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_renew_ehs_controller(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_renew_kontraktor(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_button_dept_head(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_button_ehs_officer(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}

function ahmgawpm001_cancel_upload_project_owner(obj) {
    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
    listIkpIdChecked = new Array();
}


function ahmgawpm001_ehsControllerEditPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_edit_ehs_controller"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_ehs_controller"));
    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-ehscontroller",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_edit_ehs", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_supplier_id_edit_ehs", ahmgawpm001).val(data.supplierId);
                    $("#ahmgawpm001_nama_supplier_edit_ehs", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_edit_ehs", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_edit_ehs", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_edit_ehs", ahmgawpm001).val(
                        data.kategoriIzinKerja
                    );
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_edit_ehs", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_edit_ehs", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_edit_ehs", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_id_pic_edit_ehs", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_edit_ehs", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_edit_ehs", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_edit_ehs", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_edit_ehs", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_edit_ehs", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_edit_ehs", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_edit_ehs", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_nrp_pic_edit_ehs", ahmgawpm001).val(data.nrpPic);
                    $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable("refresh");
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_edit_ehs", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_edit_ehs", ahmgawpm001).val();
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_edit_ehs_controller");
    }
}

$("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        if ($("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable("getData").length > 0) {
            $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).attr("disabled", false);
        } else {
            $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).attr("disabled", true);
            $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).attr("disabled", true);
        }
    }
})

function ahmgawpm001_ehsControllerRenewPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_renew_ehs_controller"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_renew_ehs_controller"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_renew_ehs_controller", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_renew_ehs_controller", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_renew_ehs_controller", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_renew_ehs_controller", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_renew_ehs_controller", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_renew_ehs_controller", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_renew_ehs_controller", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_renew_ehs_controller", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_renew_ehs_controller", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_renew_ehs_controller", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_renew_ehs_controller", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_renew_ehs_controller_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_renew_ehs_controller", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_renew_ehs_controller", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_renew_ehs_controller", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_renew_ehs_controller", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_ehs_controller", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_ehs_controller", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_renew_ehs_controller", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_renew_ehs_controller", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_renew_ehs_controller", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_renew_ehs_controller_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_renew_ehs_controller_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_renew_ehs_controller_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_renew_ehs_controller_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_renew_ehs_controller_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_renew_ehs_controller", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val();
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        ahmgawpm001_check_po_onload_renew_ehs_controller(data.orderingType);
        _fw_subpage(obj, "ahmgawpm001_halaman_renew_ehs_controller");
    }
}
function ahmgawpm001_check_po_onload_renew_ehs_controller(value) {
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_nomor_po_renew_ehs_controller_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_ehs_controller_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(oldNomorPo);
        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).val(null);
    } else {
        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_renew_ehs_controller_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller_non_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_nomor_po_renew_ehs_controller_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_ehs_controller_non_lookup"
        ).style.display = "block";
    }
}

$("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        if ($("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001).bootstrapTable("getData").length > 0) {
            $('#ahmgawpm001_submit_renew_ehs', ahmgawpm001).attr("disabled", false);
            document.getElementById("ahmgawpm001_id_plant_renew_ehs_controller_lookup").style.display =
                "none";
            document.getElementById(
                "ahmgawpm001_id_plant_renew_ehs_controller_non_lookup"
            ).style.display = "block";

        } else {
            $('#ahmgawpm001_submit_renew_ehs', ahmgawpm001).attr("disabled", true);
            document.getElementById("ahmgawpm001_id_plant_renew_ehs_controller_lookup").style.display =
                "block";
            document.getElementById(
                "ahmgawpm001_id_plant_renew_ehs_controller_non_lookup"
            ).style.display = "none";
        }
    }
})

function ahmgawpm001_kontraktorRequestPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_request_kontraktor"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_request_kontraktor"));
    let validateResult = true;
    if (savedKontraktorData.length > 0) {
        $('#ahmgawpm001_nomor_ikp_request_kontraktor', ahmgawpm001).val(savedKontraktorData[0]);
        let stringData = JSON.stringify({
            nomorIkp: savedKontraktorData[0],
        })
        let jsonSendString = JSON.parse(stringData);
        _fw_post(
            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
            jsonSendString,
            function (ret) {
                if (ret.status == "1") {
                    _fw_setMessage(ret.status, ret.message.res);
                    if (ret.data != null) {
                        data = ret.data[0];
                        $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val(data.nomorIkp);
                        $("#ahmgawpm001_id_supplier_request_kontraktor", ahmgawpm001).val(data.idSupplier);
                        $("#ahmgawpm001_nama_supplier_request_kontraktor", ahmgawpm001).val(data.namaSupplier);
                        $("#ahmgawpm001_ordering_type_request_kontraktor", ahmgawpm001).val(data.orderingType);
                        $("#ahmgawpm001_purchasing_organization_request_kontraktor", ahmgawpm001).val(data.purchasingOrganization);
                        $("#ahmgawpm001_kategori_pekerjaan_request_kontraktor", ahmgawpm001).val(data.kategoriPekerjaan);
                        $("#ahmgawpm001_kategori_izin_kerja_request_kontraktor", ahmgawpm001).val(data.kategoriIzinKerja);
                        if (data.orderingType == "PO") {
                            $("#ahmgawpm001_nomor_po_request_kontraktor", ahmgawpm001).val(data.nomorPo);
                            $("#ahmgawpm001_nomor_spk_request_kontraktor", ahmgawpm001).val(null);
                        } else {
                            $("#ahmgawpm001_nomor_po_request_kontraktor", ahmgawpm001).val(null);
                            $("#ahmgawpm001_nomor_spk_request_kontraktor", ahmgawpm001).val(data.nomorSpk);
                        }
                        $("#ahmgawpm001_deskripsi_item_request_kontraktor", ahmgawpm001).val(
                            data.deskripsiItem
                        );
                        $("#ahmgawpm001_nrp_pic_request_kontraktor", ahmgawpm001).val(
                            data.nrpPic
                        );
                        $("#ahmgawpm001_nama_pic_request_kontraktor", ahmgawpm001).val(data.namaPic);
                        $("#ahmgawpm001_seksi_pic_request_kontraktor", ahmgawpm001).val(data.seksiPic);
                        $("#ahmgawpm001_nomor_pengajuan_lk3_request_kontraktor", ahmgawpm001).val(
                            data.nomorPengajuanLk3
                        );
                        $("#ahmgawpm001_departemen_pic_request_kontraktor", ahmgawpm001).val(
                            data.departemenPic
                        );
                        $("#ahmgawpm001_login_patrol_request_kontraktor", ahmgawpm001).val(data.loginPatrol);
                        $("#ahmgawpm001_id_plant_request_kontraktor", ahmgawpm001).val(data.plantId);
                        $("#ahmgawpm001_divisi_pic_request_kontraktor", ahmgawpm001).val(data.divisiPic);
                        $("#ahmgawpm001_detail_proyek_request_kontraktor", ahmgawpm001).val(data.detailProyek);
                        $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                        $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(data.endTanggalPekerjaan);
                        $("#ahmgawpm001_nama_pengawas_proyek_request_kontraktor", ahmgawpm001).val(data.namaPengawasProyek);
                        $("#ahmgawpm001_nama_pengawas_lk3_request_kontraktor", ahmgawpm001).val(data.namaPengawasLk3);
                        $("#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor", ahmgawpm001).val(data.nomorHpPengawasProyek);
                        $("#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor", ahmgawpm001).val(data.nomorHpPengawasLk3);
                        $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                        $("#ahmgawpm001_remarks_request_kontraktor", ahmgawpm001).val(data.remarks);


                        $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        plantVarGlobal = data.plantId;
                        loginPatrolGlobal = $("#ahmgawpm001_login_patrol_request_kontraktor", ahmgawpm001).val();
                        vikpidGlobal = $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val();
                        areaTableNameGlobal = $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001);
                        personnelTableNameGlobal = $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001);
                        toolTableNameGlobal = $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001);
                    }
                }

                if (ret.status == "0") {
                    _fw_setMessage(
                        ret.status,
                        ret.message.message + ": " + ret.message.res
                    );
                    validateResult = false;
                }
            }
        );
        $('#ahmgawpm001_detail_proyek_request_kontraktor', ahmgawpm001).val(savedKontraktorData[1]);
        $('#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor', ahmgawpm001).val(savedKontraktorData[2]);
        $('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', ahmgawpm001).val(savedKontraktorData[3]);
        $('#ahmgawpm001_nama_pengawas_proyek_request_kontraktor', ahmgawpm001).val(savedKontraktorData[4]);
        $('#ahmgawpm001_nama_pengawas_lk3_request_kontraktor', ahmgawpm001).val(savedKontraktorData[5]);
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor', ahmgawpm001).val(savedKontraktorData[6]);
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor', ahmgawpm001).val(savedKontraktorData[7]);

    } else {
        $('#ahmgawpm001_add_new_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_add_new_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_add_new_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_delete_all_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_delete_all_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_delete_all_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);
    }
    $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_request_kontraktor");
    }
}

$("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        ahmgawpm001_check_table_request_kontraktor();
    }
})

$("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        ahmgawpm001_check_table_request_kontraktor();
    }
})

$("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        ahmgawpm001_check_table_request_kontraktor();
    }
})

function ahmgawpm001_kontraktorEditPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_edit_kontraktor"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_kontraktor"));


    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_edit_kontraktor", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_edit_kontraktor", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_edit_kontraktor", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_edit_kontraktor", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_edit_kontraktor", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_edit_kontraktor", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_edit_kontraktor", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_edit_kontraktor", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_edit_kontraktor", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_edit_kontraktor", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_edit_kontraktor", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_edit_kontraktor", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_edit_kontraktor", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_edit_kontraktor", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_edit_kontraktor", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_edit_kontraktor", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_edit_kontraktor", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_edit_kontraktor", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_edit_kontraktor", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_edit_kontraktor", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_edit_kontraktor", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_edit_kontraktor", ahmgawpm001).val(data.remarks);


                    $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_edit_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_edit_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_edit_kontraktor", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_edit_kontraktor", ahmgawpm001).val();
                    areaTableNameGlobal = $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_edit_kontraktor_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_edit_kontraktor_table", ahmgawpm001);
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_edit_kontraktor");
    }

}

function ahmgawpm001_kontraktorRenewPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_renew_kontraktor"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_renew_kontraktor"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_renew_kontraktor", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_renew_kontraktor", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_renew_kontraktor", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_renew_kontraktor", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_renew_kontraktor", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_renew_kontraktor", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_renew_kontraktor", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_renew_kontraktor", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_renew_kontraktor", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_renew_kontraktor", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_renew_kontraktor", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_renew_kontraktor", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_renew_kontraktor", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_renew_kontraktor", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_renew_kontraktor", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_renew_kontraktor", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_renew_kontraktor", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_plant_id_renew_kontraktor", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_renew_kontraktor", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_renew_kontraktor", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_renew_kontraktor", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_renew_kontraktor", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_renew_kontraktor", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_renew_kontraktor", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_kontraktor", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_kontraktor", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_renew_kontraktor", ahmgawpm001).val(data.remarks);


                    $("#ahmgawpm001_area_renew_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_renew_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_renew_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_renew_kontraktor_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_renew_kontraktor_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_renew_kontraktor_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_renew_kontraktor", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val();
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_renew_kontraktor");
    }
}

function ahmgawpm001_projectOwnerEditPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_edit_project_owner"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_project_owner"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_upload_project_owner", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_upload_project_owner", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_upload_project_owner", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_upload_project_owner", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_upload_project_owner", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_upload_project_owner", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_upload_project_owner", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_upload_project_owner", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_upload_project_owner", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_upload_project_owner", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_upload_project_owner", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_upload_project_owner", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_upload_project_owner", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_upload_project_owner", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_upload_project_owner", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_upload_project_owner", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_upload_project_owner", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_upload_project_owner", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_plant_id_upload_project_owner", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_upload_project_owner_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_upload_project_owner", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_upload_project_owner", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_upload_project_owner", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_upload_project_owner", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_upload_project_owner", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_upload_project_owner", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_upload_project_owner", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_upload_project_owner", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_upload_project_owner", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_upload_project_owner", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_upload_project_owner_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_upload_project_owner_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_upload_project_owner_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );

                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_upload_project_owner_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_upload_project_owner_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_upload_project_owner", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_upload_project_owner", ahmgawpm001).val();
                    spesifikasiTableNameGlobal = $("#ahmgawpm001_spesifikasi_upload_project_owner_table", ahmgawpm001);
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (savedProjectOwnerData.length > 0) {
        $('#ahmgawpm001_penanggung_jawab_limbah_upload_project_owner', ahmgawpm001).val(savedProjectOwnerData[0]);
        $('#ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner', ahmgawpm001).val(savedProjectOwnerData[1]);
        $('#ahmgawpm001_remarks_upload_project_owner', ahmgawpm001).val(savedProjectOwnerData[2]);
    }
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_edit_project_owner");
    }
}

function ahmgawpm001_projectOwnerUploadPage(obj) {
    _fw_validation_clear($("#ahmgawpm001_halaman_upload_project_owner"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_upload_project_owner"));
    $("#ahmgawpm001_upload_spesifikasi_project_owner", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
    $("#ahmgawpm001_batal_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
    _fw_subpage(obj, "ahmgawpm001_halaman_upload_project_owner");
}

function ahmgawpm001_deptHeadApprovePage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_approve_dept_head"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_approve_dept_head"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_approve_dept_head", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_approve_dept_head", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_approve_dept_head", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_approve_dept_head", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_approve_dept_head", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_approve_dept_head", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_approve_dept_head", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_approve_dept_head", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_approve_dept_head", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_approve_dept_head", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_approve_dept_head", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_approve_dept_head", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_approve_dept_head", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_approve_dept_head", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_approve_dept_head", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_approve_dept_head", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_approve_dept_head", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_approve_dept_head", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_plant_id_approve_dept_head", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_approve_dept_head", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_approve_dept_head", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_approve_dept_head", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_approve_dept_head", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_approve_dept_head", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_approve_dept_head", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_approve_dept_head", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_approve_dept_head", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_approve_dept_head", ahmgawpm001).val(data.remarks);


                    $("#ahmgawpm001_area_approve_dept_head_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_approve_dept_head_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_approve_dept_head_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_approve_dept_head_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_approve_dept_head_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_approve_dept_head_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_approve_dept_head", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_approve_dept_head", ahmgawpm001).val();
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_approve_dept_head");
    }
}

function ahmgawpm001_kontraktorDisplayPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_display_kontraktor"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_display_kontraktor"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_display_kontraktor", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_display_kontraktor", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_display_kontraktor", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_display_kontraktor", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_display_kontraktor", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_display_kontraktor", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_display_kontraktor", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_display_kontraktor", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_display_kontraktor", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_display_kontraktor", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_display_kontraktor", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_display_kontraktor", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_display_kontraktor", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_display_kontraktor", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_display_kontraktor", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_display_kontraktor", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_display_kontraktor", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_display_kontraktor", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_display_kontraktor", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_display_kontraktor", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_display_kontraktor", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_display_kontraktor", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_display_kontraktor", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_display_kontraktor", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_display_kontraktor", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_display_kontraktor", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_display_kontraktor", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_display_kontraktor", ahmgawpm001).val(data.remarks);


                    $("#ahmgawpm001_area_display_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_display_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_display_kontraktor_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_display_kontraktor_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_display_kontraktor_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_display_kontraktor_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_display_kontraktor", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_display_kontraktor", ahmgawpm001).val();
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_display_kontraktor");
    }
}

function ahmgawpm001_ehsControllerDisplayPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_display_ehs_controller"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_display_ehs_controller"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-ehscontroller",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_display_ehs", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_supplier_id_display_ehs", ahmgawpm001).val(data.supplierId);
                    $("#ahmgawpm001_nama_supplier_display_ehs", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_display_ehs", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_display_ehs", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_display_ehs", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_display_ehs", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_display_ehs", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_display_ehs", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_display_ehs", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_display_ehs", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_display_ehs", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_id_pic_display_ehs", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_display_ehs", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_display_ehs", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_display_ehs", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_display_ehs", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_display_ehs", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_display_ehs", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_display_ehs", ahmgawpm001).val(data.divisiPic);

                    $("#ahmgawpm001_area_display_ehs_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_display_ehs_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_display_ehs", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_display_ehs", ahmgawpm001).val();
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_display_ehs_controller");
    }
}

function ahmgawpm001_ehsOfficerApprovePage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_approve_ehs_officer"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_approve_ehs_officer"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_approve_ehs_officer", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_approve_ehs_officer", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_approve_ehs_officer", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_approve_ehs_officer", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_approve_ehs_officer", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_approve_ehs_officer", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_approve_ehs_officer", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_approve_ehs_officer", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_approve_ehs_officer", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_approve_ehs_officer", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_approve_ehs_officer", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_approve_ehs_officer", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_approve_ehs_officer", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_approve_ehs_officer", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_approve_ehs_officer", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_approve_ehs_officer", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_approve_ehs_officer", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_approve_ehs_officer", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_plant_id_approve_ehs_officer", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_approve_ehs_officer_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_approve_ehs_officer", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_approve_ehs_officer", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_approve_ehs_officer", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_approve_ehs_officer", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_approve_ehs_officer", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_approve_ehs_officer", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_approve_ehs_officer", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_approve_ehs_officer", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_approve_ehs_officer", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_approve_ehs_officer", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_approve_ehs_officer", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_approve_ehs_officer_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_approve_ehs_officer_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_approve_ehs_officer_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_approve_ehs_officer_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );

                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_approve_ehs_officer_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_approve_ehs_officer_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_approve_ehs_officer_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_approve_ehs_officer", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_approve_ehs_officer", ahmgawpm001).val();
                    spesifikasiTableNameGlobal = $("#ahmgawpm001_spesifikasi_approve_ehs_officer_table", ahmgawpm001);
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        _fw_subpage(obj, "ahmgawpm001_halaman_approve_ehs_officer");
    }
}

// function ahmgawpm001_ehsOfficerUploadPage(obj) {
//     _fw_validation_clear($("#ahmgawpm001_halaman_upload_ehs_officer"));
//     _fw_reset_subpage($("#ahmgawpm001_halaman_upload_ehs_officer"));
//     _fw_subpage(obj, "ahmgawpm001_halaman_upload_ehs_officer");
// }

function ahmgawpm001_adminUploadPage(obj) {
    _fw_validation_clear($("#ahmgawpm001_halaman_upload_admin"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_upload_admin"));
    $("#ahmgawpm001_upload_spesifikasi_admin", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
    $("#ahmgawpm001_batal_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", false);
    _fw_subpage(obj, "ahmgawpm001_halaman_upload_admin");
}

function ahmgawpm001_renewAdminUploadPage(obj) {
    _fw_validation_clear($("#ahmgawpm001_halaman_upload_renew_admin"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_upload_renew_admin"));
    $("#ahmgawpm001_upload_spesifikasi_renew_admin", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
    $("#ahmgawpm001_batal_upload_spesifikasi_renew_admin", ahmgawpm001).prop("disabled", false);
    _fw_subpage(obj, "ahmgawpm001_halaman_upload_renew_admin");
}

function ahmgawpm001_renewEhsControllerUploadPage(obj) {
    _fw_validation_clear($("#ahmgawpm001_halaman_upload_renew_ehs_controller"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_upload_renew_ehs_controller"));
    $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
    $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
    _fw_subpage(obj, "ahmgawpm001_halaman_upload_renew_ehs_controller");
}

function ahmgawpm001_adminEditPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_edit_admin"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_admin"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_edit_admin", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_edit_admin", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_edit_admin", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_edit_admin", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_edit_admin", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_edit_admin", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_edit_admin", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_edit_admin", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_edit_admin", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_edit_admin", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_edit_admin", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_edit_admin", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_edit_admin_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_edit_admin", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_edit_admin", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_edit_admin", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_edit_admin", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_edit_admin", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_edit_admin", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_edit_admin", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_edit_admin", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_edit_admin", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_edit_admin", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_edit_admin", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_edit_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_edit_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_edit_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_edit_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );

                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_edit_admin_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_edit_admin_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_edit_admin_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_edit_admin", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val();
                    spesifikasiTableNameGlobal = $("#ahmgawpm001_spesifikasi_edit_admin_table", ahmgawpm001);
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        ahmgawpm001_check_po_onload_edit_admin(data.orderingType);
        _fw_subpage(obj, "ahmgawpm001_halaman_edit_admin");
    }

}

$("#ahmgawpm001_area_edit_admin_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        ahmgawpm001_add_area_revalidate();
    }
})

function ahmgawpm001_adminRenewPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_renew_admin"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_renew_admin"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_renew_admin", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_renew_admin", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_renew_admin", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_renew_admin", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_renew_admin", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_renew_admin", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_renew_admin", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_renew_admin", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_renew_admin", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_renew_admin", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_renew_admin", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_renew_admin", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_renew_admin_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_renew_admin", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_renew_admin", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_renew_admin", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_renew_admin", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_renew_admin", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_renew_admin", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_admin", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_admin", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_renew_admin", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_renew_admin", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_renew_admin", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_renew_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_renew_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_renew_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_renew_admin_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_renew_admin_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_renew_admin_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_renew_admin_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_renew_admin", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val();
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        ahmgawpm001_check_po_onload_renew_admin(data.orderingType);
        _fw_subpage(obj, "ahmgawpm001_halaman_renew_admin");
    }
}

function ahmgawpm001_securityDisplayPage(obj, index) {
    _fw_validation_clear($("#ahmgawpm001_halaman_display_security"));
    _fw_reset_subpage($("#ahmgawpm001_halaman_display_security"));

    let stringData = JSON.stringify({
        nomorIkp: $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp,
    })
    let jsonSendString = JSON.parse(stringData);
    let validateResult = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-projectowner-ehsofficer",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#ahmgawpm001_nomor_ikp_display_security", ahmgawpm001).val(data.nomorIkp);
                    $("#ahmgawpm001_id_supplier_display_security", ahmgawpm001).val(data.idSupplier);
                    $("#ahmgawpm001_nama_supplier_display_security", ahmgawpm001).val(data.namaSupplier);
                    $("#ahmgawpm001_ordering_type_display_security", ahmgawpm001).val(data.orderingType);
                    $("#ahmgawpm001_purchasing_organization_display_security", ahmgawpm001).val(data.purchasingOrganization);
                    $("#ahmgawpm001_kategori_pekerjaan_display_security", ahmgawpm001).val(data.kategoriPekerjaan);
                    $("#ahmgawpm001_kategori_izin_kerja_display_security", ahmgawpm001).val(data.kategoriIzinKerja);
                    if (data.orderingType == "PO") {
                        $("#ahmgawpm001_nomor_po_display_security", ahmgawpm001).val(data.nomorPo);
                        $("#ahmgawpm001_nomor_spk_display_security", ahmgawpm001).val(null);
                    } else {
                        $("#ahmgawpm001_nomor_po_display_security", ahmgawpm001).val(null);
                        $("#ahmgawpm001_nomor_spk_display_security", ahmgawpm001).val(data.nomorSpk);
                    }
                    $("#ahmgawpm001_deskripsi_item_display_security", ahmgawpm001).val(
                        data.deskripsiItem
                    );
                    $("#ahmgawpm001_nrp_pic_display_security", ahmgawpm001).val(
                        data.nrpPic
                    );
                    $("#ahmgawpm001_nama_pic_display_security", ahmgawpm001).val(data.namaPic);
                    $("#ahmgawpm001_seksi_pic_display_security", ahmgawpm001).val(data.seksiPic);
                    $("#ahmgawpm001_nomor_pengajuan_lk3_display_security", ahmgawpm001).val(
                        data.nomorPengajuanLk3
                    );
                    $("#ahmgawpm001_departemen_pic_display_security", ahmgawpm001).val(
                        data.departemenPic
                    );
                    $("#ahmgawpm001_login_patrol_display_security", ahmgawpm001).val(data.loginPatrol);
                    $("#ahmgawpm001_id_plant_display_security", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_id_plant_display_security_non_lookup_value", ahmgawpm001).val(data.plantId);
                    $("#ahmgawpm001_divisi_pic_display_security", ahmgawpm001).val(data.divisiPic);
                    $("#ahmgawpm001_detail_proyek_display_security", ahmgawpm001).val(data.detailProyek);
                    if (data.startTanggalPekerjaan != null) {
                        $("#ahmgawpm001_start_tanggal_pekerjaan_display_security", ahmgawpm001).val(moment(data.startTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    if (data.endTanggalPekerjaan != null) {
                        $("#ahmgawpm001_end_tanggal_pekerjaan_display_security", ahmgawpm001).val(moment(data.endTanggalPekerjaan).format('DD-MMM-YYYY'));
                    }
                    $("#ahmgawpm001_nama_pengawas_proyek_display_security", ahmgawpm001).val(data.namaPengawasProyek);
                    $("#ahmgawpm001_nama_pengawas_lk3_display_security", ahmgawpm001).val(data.namaPengawasLk3);
                    $("#ahmgawpm001_nomor_hp_pengawas_proyek_display_security", ahmgawpm001).val(data.nomorHpPengawasProyek);
                    $("#ahmgawpm001_nomor_hp_pengawas_lk3_display_security", ahmgawpm001).val(data.nomorHpPengawasLk3);
                    $("#ahmgawpm001_remarks_display_security", ahmgawpm001).val(data.remarks);
                    $("#ahmgawpm001_penanggung_jawab_limbah_display_security", ahmgawpm001).val(data.penanggungJawabLimbah);
                    $("#ahmgawpm001_lokasi_pembuangan_limbah_display_security", ahmgawpm001).val(data.lokasiPembuanganLimbah);


                    $("#ahmgawpm001_area_display_security_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_personnel_display_security_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_tool_display_security_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    $("#ahmgawpm001_spesifikasi_display_security_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );

                    plantVarGlobal = data.plantId;
                    areaTableNameGlobal = $("#ahmgawpm001_area_display_security_table", ahmgawpm001);
                    personnelTableNameGlobal = $("#ahmgawpm001_personnel_display_security_table", ahmgawpm001);
                    toolTableNameGlobal = $("#ahmgawpm001_tool_display_security_table", ahmgawpm001);
                    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_display_security", ahmgawpm001).val();
                    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_display_security", ahmgawpm001).val();
                    spesifikasiTableNameGlobal = $("#ahmgawpm001_spesifikasi_display_security_table", ahmgawpm001);
                    if (data.nomorPo != null) {
                        oldDeskripsiItem = data.deskripsiItem;
                    } else {
                        oldDeskripsiItem = null;
                    }
                    if (data.nomorSpk != null) {
                        oldDeskripsiItemSpk = data.deskripsiItem;
                    } else {
                        oldDeskripsiItemSpk = null;
                    }
                    oldNomorPo = data.nomorPo;
                    oldNomorSpk = data.nomorSpk;
                }
            }

            if (ret.status == "0") {
                _fw_setMessage(
                    ret.status,
                    ret.message.message + ": " + ret.message.res
                );
                validateResult = false;
            }
        }
    );
    if (validateResult) {
        // ahmgawpm001_check_po_onload_display_security(data.orderingType);
        _fw_subpage(obj, "ahmgawpm001_halaman_display_security");
    }

}

// TOMBOL SUBMIT MAINTAIN IKP BERDASARKAN ROLE
if (roleGlobal == "projectOwner") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button" onclick="">' +
        '<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit' +
        '</button>'
}
if (roleGlobal == "deptHead") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button" onclick="">' +
        '<i class="glyphicon glyphicon-ok fg-white"> </i> Approve' +
        '</button>'
}
if (roleGlobal == "ehsOfficer") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button" onclick="">' +
        '<i class="glyphicon glyphicon-ok fg-white"> </i> Approve' +
        '</button>'
}
if (roleGlobal == "kontraktor") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button" onclick="">' +
        '<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit' +
        '</button>' +
        '<!--Button khusus Kontraktor sama Admin-->' +
        '<button id="ahmgawpm001_request_button_maintain_kontraktor" style="float: right; margin-right: 5px"' +
        '   class="btn bg-orange large-button" onclick="ahmgawpm001_kontraktorRequestPage(this);">' +
        '<i class="glyphicon glyphicon-plus fg-white"></i> Request IKP' +
        '</button>'
}
if (roleGlobal == "ehsController") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button"">' +
        '<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit' +
        '</button>' +
        '<!--Button khusus EHS Controller-->' +
        '<button id="ahmgawpm001_create_button_maintain_ehs_controller" style="float: right; margin-right: 5px"' +
        'class="btn bg-orange large-button" onclick="ahmgawpm001_ehsControllerCreatePage(this);">' +
        ' <i class="glyphicon glyphicon-plus fg-white"></i> Create IKP' +
        '</button>'
}
if (roleGlobal == "admin") {
    document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
        '<button id="ahmgawpm001_submit_button_maintain" disabled data-toggle="modal" data-target="#ahmgawpm001_submit_ikp" style="float: right"' +
        'class="btn bg-green large-button" onclick="">' +
        '<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit' +
        '</button>' +
        '<!--Button khusus Kontraktor sama Admin-->' +
        '<button id="ahmgawpm001_request_button_maintain_kontraktor" style="float: right; margin-right: 5px"' +
        '   class="btn bg-orange large-button" onclick="ahmgawpm001_kontraktorRequestPage(this);">' +
        '<i class="glyphicon glyphicon-plus fg-white"></i> Request IKP' +
        '</button>' +
        '<!--Button khusus EHS Controller-->' +
        '<button id="ahmgawpm001_create_button_maintain_ehs_controller" style="float: right; margin-right: 5px"' +
        'class="btn bg-orange large-button" onclick="ahmgawpm001_ehsControllerCreatePage(this);">' +
        ' <i class="glyphicon glyphicon-plus fg-white"></i> Create IKP' +
        '</button>'
}
// document.getElementById("ahmgawpm001_button_add_submit").innerHTML = '<!--Dept Head dan EHS Officer ga ada button submit-->' +
//     '<button id="ahmgawpm001_submit_button_maintain" style="float: right"' +
//     'class="btn btn-success large-button" onclick="">' +
//     '<i class="glyphicon glyphicon-ok fg-white"> </i> Submit' +
//     '</button>' +
//     '<!--Button khusus Kontraktor sama Admin-->' +
//     '<button id="ahmgawpm001_request_button_maintain_kontraktor" style="float: right; margin-right: 5px"' +
//     '   class="btn btn-primary large-button" onclick="ahmgawpm001_kontraktorRequestPage(this);">' +
//     '<i class="glyphicon glyphicon-plus fg-white"></i> Request IKP' +
//     '</button>' +
//     '<!--Button khusus EHS Controller-->' +
//     '<button id="ahmgawpm001_create_button_maintain_ehs_controller" style="float: right; margin-right: 5px"' +
//     'class="btn btn-primary large-button" onclick="ahmgawpm001_ehsControllerCreatePage(this);">' +
//     ' <i class="glyphicon glyphicon-plus fg-white"></i> Create IKP' +
//     '</button>'


//-------------------------------------------------------------------------------------------
// MAINTAIN IKP SECTOR

// MAINTAIN IKP FILTER

function ahmgawpm001_maintain_ikp_filter(params) {
    vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    vdepthead = "";
    vsupplyid = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
    if (roleGlobal == "ehsController") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    }
    if (roleGlobal == "kontraktor") {
        vstatus = ['01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
        vsupplyid = userPartnerId;
    }
    if (roleGlobal == "deptHead") {
        vstatus = ['03-IKP'];
        vdepthead = userId;
    }
    if (roleGlobal == "projectOwner") {
        vstatus = ['02-IKP'];
    }
    if (roleGlobal == "ehsOfficer") {
        vstatus = ['04-IKP'];
    }
    if (roleGlobal == "admin") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    }
    if (roleGlobal == "security") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    }

    vplant = '';
    if (plantEhsGlobal != undefined) {
        vplant = plantEhsGlobal;
    }



    params.search = {
        nomorIkp: $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val(),
        idSupplier: vsupplyid,
        namaSupplier: $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val(),
        nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
        nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
        startPeriode: $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val(),
        endPeriode: $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val(),
        status: vstatus,
        plantId: vplant,
        nrpDeptHead: vdepthead,
    };

    offsetTableGlobal = params.offset;
    if (params.sort === "nrpPic.nrpPicId") {
        params.sort = "nrpPicId";
    }
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }


    return params;
}
// SEARCH BUTTON MAINTAIN IKP FUNCTION
$("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).click(function () {
    listIkpIdChecked = new Array();
    $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", true);
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(this);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Searching...').prop("disabled", true);
    $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001)
        .removeClass("has-error")
        .removeClass("has-feedback");
    if (_fw_validation_validate(ahmgawpm001)) {
        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
            "refresh"
        );
    } else {
        $(window).scrollTop("0");
    }
    setTimeout(function () {
        thisContent.html('<i class="glyphicon glyphicon-search fg-white"></i> Search').prop("disabled", false);
        $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", false);
    }, 1000);

});
// EXPORT BUTTON MAINTAIN IKP FUNCTION
$("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).click(
    function () {
        const tanggal = Date.now();
        let fileName = "AHMGAWPMHDRIKPS_" + tanggal.toString() + ".xls"
        _fw_validation_clear(ahmgawpm001);
        $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
        var thisContent = $(this);
        thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
        $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", true);

        setTimeout(function () {
            params = new Object();
            if (roleGlobal == "ehsController") {
                params = new Object();
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.plantId = plantEhsGlobal;
                params.sort = "idSupplier";
                params.order = "asc";
            }
            else if (roleGlobal == "kontraktor") {
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.sort = "idSupplier";
                params.order = "asc";
            }
            else if (roleGlobal == "deptHead") {
                params = new Object();
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ['03-IKP'];
                params.deptHead = userId;
                params.sort = "idSupplier";
                params.order = "asc";
            }
            else if (roleGlobal == "projectOwner") {
                params = new Object();
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["02-IKP"];
                params.sort = "idSupplier";
                params.order = "asc";
            }
            else if (roleGlobal == "ehsOfficer") {
                params = new Object();
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["04-IKP"];
                params.sort = "idSupplier";
                params.plantId = plantEhsGlobal;
                params.order = "asc";
            }
            else if (roleGlobal == "admin") {
                params = new Object();
//                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.sort = "idSupplier";
                params.order = "asc";
            }
            else if (roleGlobal == "security") {
                params = new Object();
                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.sort = "idSupplier";
                params.plantId = plantEhsGlobal;
                params.order = "asc";
            } else {
                params = new Object();
                params.JXID = encodeURIComponent(getJxid());
                params.idSupplier = $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val();
                params.namaSupplier = $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val();
                params.nrpPic = $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val();
                params.nomorPoSpk = $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val();
                params.orderingType = $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val();
                params.startPeriode = $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val();
                params.endPeriode = $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val();
                params.nomorIkp = $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val();
                params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.sort = "idSupplier";
                params.order = "asc";
            }
            var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/export-to-excel-ikp?";
            $.each(params, function (keypar, param) {
                exportUrl += '' + keypar + '=' + param + '&';
            });
            _fw_exportToExcel(exportUrl);
            console.log(exportUrl);
            thisContent.html('<i class="fa fa-check fg-white mr-10"></i> Downloaded');
            setTimeout(function () {
                thisContent.html('<i class="glyphicon glyphicon-open-file fg-white"></i> Export to Excel').prop("disabled", false);
                $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
                $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
                $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", false);
                $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", false);
                $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", false);
            }, 3000);
        }, 3000)
    }
);
// REFRESH BUTTON MAINTAIN IKP FUNCTION
$("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).click(function () {
    listIkpIdChecked = new Array();
    $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", true);
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(this);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Refreshing...').prop("disabled", true);
    $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_lookup_nomor_po_filter", ahmgawpm001).attr("disabled", true);
    $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).attr("readonly", true);

    $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_pic_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_ikp_filter", ahmgawpm001).val(null);
    if (roleGlobal == "kontraktor") {
        $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(userPartnerId);
        $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val(userPartnerName);
    }
    if (roleGlobal == "projectOwner") {
        $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(userId);
        $("#ahmgawpm001_nama_pic_filter", ahmgawpm001).val(userName);
    }
    if (_fw_validation_validate(ahmgawpm001)) {
        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
            "refresh"
        );
    } else {
        $(window).scrollTop("0");
    }
    setTimeout(function () {
        thisContent.html('<i class="glyphicon glyphicon-refresh fg-white"></i> Refresh').prop("disabled", false);
        $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", false);
    }, 1000);
});
// MAINTAIN IKP FILTER
function ahmgawpm001_maintain_area_filter(params) {
    params.search = {
        nomorAsset: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
        building: $("#ahmgawpm001_nama_supplier_filter", ahmgawpm001).val(),
        floor: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
        sectionLocation: $("#ahmgawpm001_no_spk_filter", ahmgawpm001).val(),
        areaDetail: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
        indoorOutdoor: $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val(),
        criticality: $("#ahmgawpm001_end_periode_filter", ahmgawpm001).val(),
        taskListTitle: $("#ahmgawpm001_start_periode_filter", ahmgawpm001).val(),
    };

    if (params.sort === undefined) {
        return {
            vikpid: null,
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        };
    }
    return params;
}
// DELETE IKP CONFIRMATION FUNCTION
$("#ahmgawpm001_delete_ikp_confirm_button", ahmgawpm001).click(function () {
    var thisContent = $("#ahmgawpm001_delete_ikp_confirm_button", ahmgawpm001);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Deleting...').prop("disabled", true);
    $("#ahmgawpm001_cancel_delete_ikp_confirm_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", true);
    setTimeout(function () {
        var id = $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[selectedIndex].nomorIkp;
        stringData = JSON.stringify({
            vikpid: id,
        });
        jsonSendString = JSON.parse(stringData);
        let validateResult = true;
        _fw_post(
            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/delete-ikp",
            jsonSendString,
            function (ret) {
                if (ret.status == "1") {
                    _fw_setMessage(ret.status, ret.message.res);
                }

                if (ret.status == "0") {
                    _fw_setMessage(
                        ret.status,
                        ret.message.message + ": " + ret.message.res
                    );
                    validateResult = false;
                }
            }
        );
        $("#ahmgawpm001_delete_ikp").modal('hide');
        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"></i> Confirm').prop("disabled", false);
        $("#ahmgawpm001_search_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_refresh_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_export_maintain_ikp_button", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_create_button_maintain_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_request_button_maintain_kontraktor", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_cancel_delete_ikp_confirm_button", ahmgawpm001).prop("disabled", false);
        if (listIkpIdChecked.length > 0) {
            $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", false);
        } else {
            $("#ahmgawpm001_submit_button_maintain", ahmgawpm001).prop("disabled", true);
        }

        if (validateResult) {
            $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                "refresh"
            );
        }
    }, 1000);
});
$('#ahmgawpm001_delete_ikp').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
});
// FUNCTION ACTION BUTTON MAINTAIN IKP TABLE
function ahmgawpm001_maintain_ikp_action_button(value, row, index) {
    if (roleGlobal == "admin") {
        ///////////////////////////BUTTON EHS CONTROLLER//////////////////////////////////////
        return '<div id="ahmgawpm001_button_maintain_ehs_controller"' +
            'style="white-space: nowrap; display: block" >' +
            '<span class="span-btn" onclick="ahmgawpm001_securityDisplayPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Display">' +
            '<i class="glyphicon glyphicon-search fg-red"></i>' +
            "</span>" +
            "<span>&nbsp;</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_adminEditPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
            '<i class="glyphicon glyphicon-edit fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" data-toggle="tooltip" data-placement="top"' +
            'title="Delete" style="margin: 0 5px 0 5px">' +
            '<span data-toggle="modal" data-selected-index="' + index + '" ' +
            'data-target="#ahmgawpm001_delete_ikp">' +
            '<i class="glyphicon glyphicon-trash fg-red"></i>' +
            "</span>" +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_adminRenewPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Renew">' +
            '<i class="glyphicon glyphicon-plus fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
            index +
            ')" data-toggle="tooltip" data-placement="top"' +
            'title="Download" style="margin-left: 5px">' +
            '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
            "</span>" +
            "</div >"
    }
    else if (roleGlobal == "ehsController") {
        ///////////////////////////BUTTON EHS CONTROLLER//////////////////////////////////////
        if (row.status.includes('Created')) {
            return '<div id="ahmgawpm001_button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn" onclick="ahmgawpm001_ehsControllerEditPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<i class="glyphicon glyphicon-edit fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" data-toggle="tooltip" data-placement="top"' +
                'title="Delete" style="margin: 0 5px 0 5px">' +
                '<span data-toggle="modal" data-selected-index="' + index + '" ' +
                'data-target="#ahmgawpm001_delete_ikp">' +
                '<i class="glyphicon glyphicon-trash fg-red"></i>' +
                "</span>" +
                "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        } else if (row.status.includes('Approved')) {
            return '<div id="ahmgawpm001_button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn"  onclick="ahmgawpm001_securityDisplayPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Display" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-search fg-red"></i>' +
                "</span>" +
                "<span>&nbsp;</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_ehsControllerRenewPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Renew">' +
                '<i class="glyphicon glyphicon-plus fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        } else {
            return '<div id="ahmgawpm001_button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn"  onclick="ahmgawpm001_ehsControllerDisplayPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Display" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-search fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        }

    }
    else if (roleGlobal == "kontraktor") {
        ///////////////////////////BUTTON KONTRAKTOR //////////////////////////////////////
        if (row.status.includes('Requested')) {
            return '<div id="ahmgawpm001_button_maintain_kontraktor"' +
                'style="white-space: nowrap; display: block">' +
                '<span class="span-btn" onclick="ahmgawpm001_kontraktorEditPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<i class="glyphicon glyphicon-edit fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" data-toggle="tooltip" data-placement="top"' +
                'title="Delete" style="margin: 0 5px 0 5px">' +
                '<span data-toggle="modal" data-target="#ahmgawpm001_delete_ikp">' +
                '<i class="glyphicon glyphicon-trash fg-red"></i>' +
                "</span>" +
                "</span>" +
                // '<span class="span-btn" onclick="ahmgawpm001_kontraktorRenewPage(this, ' +
                // index +
                // ')" data-toggle="tooltip" data-placement="top" title="Renew">' +
                // '<i class="glyphicon glyphicon-plus fg-red"></i>' +
                // "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div>"
        } else if (row.status.includes('Revision')) {
            return '<div id="ahmgawpm001_button_maintain_kontraktor"' +
                'style="white-space: nowrap; display: block">' +
                '<span class="span-btn" onclick="ahmgawpm001_kontraktorEditPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<i class="glyphicon glyphicon-edit fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div>"
        } else {
            return '<div id="ahmgawpm001_button_maintain_kontraktor"' +
                'style="white-space: nowrap; display: block">' +
                '<span class="span-btn"  onclick="ahmgawpm001_kontraktorDisplayPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Display" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-search fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div>"
        }
    }
    else if (roleGlobal == "deptHead") {
        ///////////////////////////BUTTON DEPT HEAD //////////////////////////////////////
        return '<div id="ahmgawpm001_button_maintain_dept_head"' +
            'style="white-space: nowrap; display: block">' +
            '<span class="span-btn" onclick="ahmgawpm001_deptHeadApprovePage(this, ' +
            index +
            ')"data-toggle="tooltip" data-placement="top" title="Approve">' +
            '<i class="glyphicon glyphicon-ok fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
            index +
            ')" data-toggle="tooltip" data-placement="top"' +
            'title="Download" style="margin-left: 5px">' +
            '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
            "</span>" +
            "</div>"
    }
    else if (roleGlobal == "projectOwner") {
        ///////////////////////////BUTTON PROJECT OWNER //////////////////////////////////////
        return '<div id="ahmgawpm001_button_maintain_project_owner"' +
            'style="white-space: nowrap; display: block">' +
            '<span class="span-btn" onclick="ahmgawpm001_projectOwnerEditPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
            '<i class="glyphicon glyphicon-edit fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
            index +
            ')" data-toggle="tooltip" data-placement="top"' +
            'title="Download" style="margin-left: 5px">' +
            '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
            "</span>" +
            "</div>"
    }
    else if (roleGlobal == "ehsOfficer") {
        ///////////////////////////BUTTON EHS OFFICER //////////////////////////////////////
        return '<div id="ahmgawpm001_button_maintain_ehs_officer"' +
            'style="white-space: nowrap; display: block">' +
            '<span class="span-btn" onclick="ahmgawpm001_securityDisplayPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Display">' +
            '<i class="glyphicon glyphicon-search fg-red"></i>' +
            "</span>" +
            "<span>&nbsp;</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_ehsOfficerApprovePage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Approve">' +
            '<i class="glyphicon glyphicon-ok fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
            index +
            ')" data-toggle="tooltip" data-placement="top"' +
            'title="Download" style="margin-left: 5px">' +
            '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
            "</span>" +
            "</div>"
    }
    else if (roleGlobal == "security") {
        ///////////////////////////BUTTON SECURITY //////////////////////////////////////
        return '<div id="ahmgawpm001_button_maintain_security"' +
            'style="white-space: nowrap; display: block">' +
            '<span class="span-btn" onclick="ahmgawpm001_securityDisplayPage(this, ' +
            index +
            ')" data-toggle="tooltip" data-placement="top" title="Display">' +
            '<i class="glyphicon glyphicon-search fg-red"></i>' +
            "</span>" +
            '<span class="span-btn" onclick="ahmgawpm001_download_ikp(' +
            index +
            ')" data-toggle="tooltip" data-placement="top"' +
            'title="Download" style="margin-left: 5px">' +
            '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
            "</span>" +
            "</div>"
    }
}

//-------------------------------------------------------------------------------------------
// LOV MASTER

function ahmgawpm001_lov_ikp(params) {
    $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    vsupplyid = null;
    vstatus = new Array();
    if (roleGlobal == "kontraktor") {
        vsupplyid = userPartnerId;
        vstatus = ['01-IKP'];
    }
    if (roleGlobal == "admin") {
        vstatus = ['01-IKP'];
    }
    params.search = {
        vikpid: $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val(),
        idSupplier: vsupplyid,
        status: vstatus,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorIkp",
            order: "asc"
        }
    }
    return params;
}

function ahmgawpm001_lov_ikp_maintain(params) {
    vsupplyid = null;
    vplant = null;
    vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    vdepthead = null;
    vnrppic = null;
    if (roleGlobal == "kontraktor") {
        vsupplyid = userPartnerId;
        vstatus = ['01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    }
    if (roleGlobal == "admin") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    }
    if (roleGlobal == "ehsController") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
        vplant = plantEhsGlobal;
    }
    if (roleGlobal == "projectOwner") {
        vstatus = ['02-IKP'];
        vnrppic = userId;
    }
    if (roleGlobal == "ehsOfficer") {
        vstatus = ['04-IKP'];
        vplant = plantEhsGlobal;
    }
    if (roleGlobal == "deptHead") {
        vstatus = ['03-IKP'];
        vdepthead = userId;
    }
    if (roleGlobal == "security") {
        vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
        vplant = plantEhsGlobal;
    }
    if (vdepthead != null) {
        params.search = {
            idSupplier: vsupplyid,
            nomorIkp: $('#ahmgawpm001_nomor_ikp_filter', ahmgawpm001).val(),
            status: vstatus,
            plantId: vplant,
            nrpDeptHead: vdepthead,
        };
    } else if (vnrppic != null) {
        params.search = {
            idSupplier: vsupplyid,
            nomorIkp: $('#ahmgawpm001_nomor_ikp_filter', ahmgawpm001).val(),
            status: vstatus,
            plantId: vplant,
            nrpPic: vnrppic,
        };
    } else {
        params.search = {
            idSupplier: vsupplyid,
            nomorIkp: $('#ahmgawpm001_nomor_ikp_filter', ahmgawpm001).val(),
            status: vstatus,
            plantId: vplant
        };
    }

    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorIkp",
            order: "asc"
        }
    }
    return params;
}

function ahmgawpm001_check_table_request_kontraktor() {
    if ($("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable("getData").length > 0) {
        if ($("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable("getData").length > 0) {
            if ($("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable("getData").length > 0) {
                $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", false);
                return;
            }
        }
    }
    $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", true);
}

function ahmgawpm001_lov_ikp_change() {
    if ($("#ahmgawpm001_ordering_type_request_kontraktor", ahmgawpm001).val() == "PO") {
        $("#ahmgawpm001_nomor_spk_request_kontraktor", ahmgawpm001).val(null);
    } else {
        $("#ahmgawpm001_nomor_po_request_kontraktor", ahmgawpm001).val(null);
    }
    if ($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
        $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(moment(Number($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val())).format('DD-MMM-YYYY'));
    }
    if ($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
        $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(moment(Number($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val())).format('DD-MMM-YYYY'));
    }
    $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001).bootstrapTable(
        "refresh"
    );
    if ($("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val() != "" && $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val() != null) {
        $('#ahmgawpm001_add_new_personnel_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_add_new_area_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_add_new_tool_request_kontraktor', ahmgawpm001).attr("disabled", false);

        $('#ahmgawpm001_delete_all_area_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_delete_all_personnel_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_delete_all_tool_request_kontraktor', ahmgawpm001).attr("disabled", false);
    } else {
        _fw_reset_subpage($("#ahmgawpm001_halaman_request_kontraktor"));
        $('#ahmgawpm001_add_new_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_add_new_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_add_new_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_delete_all_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_delete_all_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_delete_all_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);
    }
    plantVarGlobal = $("#ahmgawpm001_id_plant_request_kontraktor", ahmgawpm001).val();
    areaTableNameGlobal = $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001);
    personnelTableNameGlobal = $("#ahmgawpm001_personnel_request_kontraktor_table", ahmgawpm001);
    toolTableNameGlobal = $("#ahmgawpm001_tool_request_kontraktor_table", ahmgawpm001);
    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_request_kontraktor", ahmgawpm001).val();
    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val();
}
function ahmgawpm001_lov_ikp_empty() {
    $('#ahmgawpm001_add_new_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_add_new_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_add_new_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);

    $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", true);

    $('#ahmgawpm001_delete_all_area_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_personnel_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_tool_request_kontraktor', ahmgawpm001).attr("disabled", true);

    $("#ahmgawpm001_id_supplier_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_supplier_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_ordering_type_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_purchasing_organization_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_kategori_pekerjaan_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_kategori_izin_kerja_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_po_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_spk_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_deskripsi_item_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nrp_pic_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_pic_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_seksi_pic_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_pengajuan_lk3_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_departemen_pic_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_login_patrol_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_id_plant_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_divisi_pic_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_detail_proyek_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_pengawas_proyek_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nama_pengawas_lk3_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor", ahmgawpm001).val(null);
    $("#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor", ahmgawpm001).val(null);
}

function ahmgawpm001_lov_pic_add_ehs(params) {
    params.search = {
        nrpPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        namaPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}
// function ahmgawpm001_lov_pic_add_ehs_change() {
//     var params = new Object();
//     params.search = {
//         nrpPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001)
//             .val()
//             .toString()
//             .toLowerCase(),
//         namaPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001)
//             .val()
//             .toString()
//             .toLowerCase(),
//     };
//     params = {
//         limit: params.limit,
//         offset: params.offset,
//         search: params.search,
//         sort: "nrpPic",
//         order: "asc",
//     }


//     let stringData = JSON.stringify(params);
//     let jsonSendString = JSON.parse(stringData);
//     _fw_post(
//         "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-lov-pic",
//         jsonSendString,
//         function (ret) {
//             if (ret.status == "1") {
//                 _fw_setMessage(ret.status, ret.message.res);
//                 data = ret.data[0];
//                 $("#ahmgawpm001_seksi_pic_add_ehs", ahmgawpm001).val(data.seksiPic);
//                 $("#ahmgawpm001_departemen_pic_add_ehs", ahmgawpm001).val(data.departemenPic);
//                 $("#ahmgawpm001_divisi_pic_add_ehs", ahmgawpm001).val(data.divisiPic);
//             }

//             if (ret.status == "0") {
//                 _fw_setMessage(
//                     ret.status,
//                     ret.message.message + ": " + ret.message.res
//                 );
//                 validateTanggal = false;
//             }
//         }
//     );
// }
function ahmgawpm001_lov_supplier_add_ehs(params) {
    params.search = {
        idSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
        namaSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_supplier_add_ehs_change() {
    if ($("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val() != null && $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val() != "") {
        $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_no_po_add_ehs_button", ahmgawpm001).attr("disabled", false);
    } else {
        $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_no_po_add_ehs_button", ahmgawpm001).attr("disabled", true);
    }
}
function ahmgawpm001_lov_supplier_add_ehs_empty() {
    $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(null);
    $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).attr("readonly", true);
    $("#ahmgawpm001_no_po_add_ehs_button", ahmgawpm001).attr("disabled", true);
}
function ahmgawpm001_lov_plant_add_ehs(params) {
    params.search = {
        plantVar1: $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        plantVar2: $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        description: $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        plantId: plantEhsGlobal,
    };
    plantVarGlobal = $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val();
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "plantVar2",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_add_ehs_change() {
    ahmgawpm001_set_nomor_ikp_from_plant();
    if ($("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val() != "" && $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val() != null) {
        $('#ahmgawpm001_add_new_area_add_ehs', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_delete_all_area_add_ehs', ahmgawpm001).attr("disabled", false);
    } else {
        _fw_reset_subpage($("#ahmgawpm001_halaman_add_ehs"));
        $('#ahmgawpm001_add_new_area_add_ehs', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_save_add_ehs', ahmgawpm001).attr("disabled", true);
        $('#ahmgawpm001_delete_all_area_add_ehs', ahmgawpm001).attr("disabled", true);
    }
    ahmgawpm001_reset_add_modal_area();
    plantVarGlobal = $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val();
    areaTableNameGlobal = $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001);
    personnelTableNameGlobal = $("#ahmgawpm001_personnel_add_ehs_table", ahmgawpm001);
    toolTableNameGlobal = $("#ahmgawpm001_tool_add_ehs_table", ahmgawpm001);
    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_add_ehs", ahmgawpm001).val();
    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_add_ehs", ahmgawpm001).val();
}
function ahmgawpm001_lov_plant_add_ehs_empty() {
    $('#ahmgawpm001_add_new_area_add_ehs', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_save_add_ehs', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_area_add_ehs', ahmgawpm001).attr("disabled", true);
    ahmgawpm001_reset_add_modal_area();
}
function ahmgawpm001_lov_po_add_ehs(params) {
    params.search = {
        noPoSpk: $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(),
        poDescription: $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_add_ehs", ahmgawpm001).val(),
        idSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
        newPo: true,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_supplier_add_ehs(params) {
    params.search = {
        idSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ahmgawpm001_id_supplier_add_ehs",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_indoor_outdoor_edit_area_change(selectObject) {
    if (roleGlobal == "kontraktor") {
        $("#ahmgawpm001_submit_modal_edit_area").attr("disabled", false);
    }
}

function ahmgawpm001_check_po_filter(selectObject) {
    var value = selectObject.value;
    if (value == "PO" || value == "SPK" || value == "SPK Sementara") {
        $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(null);
        $("#ahmgawpm001_lookup_nomor_po_filter", ahmgawpm001).attr("disabled", false);
        $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).attr("readonly", false);
    } else {
        $("#ahmgawpm001_lookup_nomor_po_filter", ahmgawpm001).attr("disabled", true);
        $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(null);
    }
}
function ahmgawpm001_check_po(selectObject) {
    var value = selectObject.value;
    if (value == "PO") {
        $("#ahmgawpm001_no_spk_add_ehs", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_no_po_add_ehs_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_no_po_add_ehs_non_lookup"
        ).style.display = "none";
    } else {
        $("#ahmgawpm001_no_spk_add_ehs", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_no_po_add_ehs_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(null);
        $("#ahmgawpm001_no_po_add_ehs_non_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_no_po_add_ehs_non_lookup_value", ahmgawpm001).val(null);
        $("#ahmgawpm001_no_spk_add_ehs", ahmgawpm001).val(null);
        $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).val(null);
        document.getElementById("ahmgawpm001_no_po_add_ehs_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_no_po_add_ehs_non_lookup"
        ).style.display = "block";
    }
}
function ahmgawpm001_check_po_renew_ehs(selectObject) {
    var value = selectObject.value;
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_no_po_renew_ehs_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_no_po_renew_ehs_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_renew_ehs", ahmgawpm001).val(oldNomorPo);
    } else {
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_nomor_po_renew_ehs", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_ehs_lookup", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_no_po_renew_ehs_non_lookup_value", ahmgawpm001).val(null);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_no_po_renew_ehs_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_no_po_renew_ehs_non_lookup"
        ).style.display = "block";
    }
}
function ahmgawpm001_check_po_edit_admin(selectObject) {
    var value = selectObject.value;
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_nomor_po_edit_admin_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_nomor_po_edit_admin_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(oldNomorPo);
    } else {
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_edit_admin_non_lookup_value", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_nomor_po_edit_admin_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_nomor_po_edit_admin_non_lookup"
        ).style.display = "block";
    }
}
function ahmgawpm001_check_po_renew_admin(selectObject) {
    var value = selectObject.value;
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_nomor_po_renew_admin_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_admin_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(oldNomorPo);
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(null);
    } else {
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_renew_admin_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_admin_non_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_nomor_po_renew_admin_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_admin_non_lookup"
        ).style.display = "block";
    }
}



function ahmgawpm001_check_po_onload_renew_ehs(value) {
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_no_po_renew_ehs_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_no_po_renew_ehs_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_renew_ehs", ahmgawpm001).val(oldNomorPo);
    } else {
        $("#ahmgawpm001_nomor_spk_renew_ehs", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_renew_ehs", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_ehs_lookup", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_no_po_renew_ehs_non_lookup_value", ahmgawpm001).val(null);
        $("#ahmgawpm001_deskripsi_item_renew_ehs", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_no_po_renew_ehs_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_no_po_renew_ehs_non_lookup"
        ).style.display = "block";
    }
}
function ahmgawpm001_check_po_onload_edit_admin(value) {
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_nomor_po_edit_admin_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_nomor_po_edit_admin_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(oldNomorPo);
    } else {
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_edit_admin_non_lookup_value", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_nomor_po_edit_admin_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_nomor_po_edit_admin_non_lookup"
        ).style.display = "block";
    }
}
function ahmgawpm001_check_po_onload_renew_admin(value) {
    if (value == "PO") {
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).attr(
            "readonly",
            true
        );
        document.getElementById("ahmgawpm001_nomor_po_renew_admin_lookup").style.display =
            "block";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_admin_non_lookup"
        ).style.display = "none";
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(oldDeskripsiItem);
        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(oldNomorPo);
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(null);
    } else {
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).attr(
            "readonly",
            false
        );
        $("#ahmgawpm001_nomor_po_renew_admin_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_po_renew_admin_non_lookup", ahmgawpm001).val(null);
        $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(oldNomorSpk);
        $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(oldDeskripsiItemSpk);
        document.getElementById("ahmgawpm001_nomor_po_renew_admin_lookup").style.display =
            "none";
        document.getElementById(
            "ahmgawpm001_nomor_po_renew_admin_non_lookup"
        ).style.display = "block";
    }
}




function ahmgawpm001_lov_po_edit_ehs(params) {
    params.search = {
        noPoSpk: $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(),
        poDescription: $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val(),
        idSupplier: $("#ahmgawpm001_supplier_id_edit_ehs", ahmgawpm001).val(),
        newPo: true,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_pic_edit_ehs(params) {
    params.search = {
        nrpPic: $("#ahmgawpm001_id_pic_edit_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        namaPic: $("#ahmgawpm001_id_pic_edit_ehs", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}



function ahmgawpm001_lov_supplier(params) {
    if (roleGlobal == "deptHead") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            nrpDeptHead: userId,
            status: ["03-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "projectOwner") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            nrpPic: userId,
            status: ["02-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "ehsController") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "ehsOfficer") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["04-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "security") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "admin") {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            plantId: null,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };
    } else {
        params.search = {
            idSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
            namaSupplier: $("#ahmgawpm001_id_supplier_filter", ahmgawpm001).val(),
        };
    }
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_pic(params) {
    vsupplyid = null;
    if (roleGlobal == "kontraktor") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            idSupplier: userPartnerId,
            status: ["01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "deptHead") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            nrpDeptHead: userId,
            status: ["03-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "ehsController") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "ehsOfficer") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["04-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "security") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        }
    } else if (roleGlobal == "admin") {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            plantId: null,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        }
    } else {
        params.search = {
            nrpPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
            namaPic: $("#ahmgawpm001_id_pic_filter", ahmgawpm001).val(),
        };
    }

    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_po(params) {
    if (roleGlobal == "deptHead") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            nrpDeptHead: userId,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["03-IKP"],
            hasRole: true,
        };
    } else if (roleGlobal == "kontraktor") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            idSupplier: userPartnerId,
            plantId: null,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };

    } else if (roleGlobal == "projectOwner") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            plantId: null,
            nrpPic: userId,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["02-IKP"],
            hasRole: true,
        };

    } else if (roleGlobal == "ehsController") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };

    } else if (roleGlobal == "ehsOfficer") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["04-IKP"],
            hasRole: true,
        };

    } else if (roleGlobal == "security") {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            plantId: plantEhsGlobal,
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
            hasRole: true,
        };

    } else {
        params.search = {
            nomorPoSpk: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            poDescription: $("#ahmgawpm001_nomor_po_filter", ahmgawpm001).val(),
            orderingType: $("#ahmgawpm001_ordering_type_filter", ahmgawpm001).val(),
            plantId: null,
            status: ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"],
        };
    }
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}



function ahmgawpm001_lov_pic_renew_ehs_controller(params) {
    params.search = {
        nrpPic: $("#ahmgawpm001_nrp_pic_renew_ehs_controller", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        namaPic: $("#ahmgawpm001_nrp_pic_renew_ehs_controller", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_po_renew_ehs_controller(params) {
    params.search = {
        noPoSpk: $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(),
        poDescription: $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_renew_ehs_controller", ahmgawpm001).val(),
        idSupplier: $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val(),
        newPo: true,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_renew_ehs_controller(params) {
    params.search = {
        plantVar1: $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        plantVar2: $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        description: $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    plantVarGlobal = $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val();
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idPlant2",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_renew_ehs_controller_change() {
    if ($("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val() != "" && $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val() != null) {
        $('#ahmgawpm001_add_new_area_renew_ehs_controller', ahmgawpm001).attr("disabled", false);

        $('#ahmgawpm001_delete_all_area_renew_ehs_controller', ahmgawpm001).attr("disabled", false);
    } else {
        _fw_reset_subpage($("#ahmgawpm001_halaman_renew_ehs_controller"));
        $('#ahmgawpm001_add_new_area_renew_ehs_controller', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_submit_renew_ehs_controller', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_delete_all_area_renew_ehs_controller', ahmgawpm001).attr("disabled", true);
    }
    ahmgawpm001_reset_add_modal_area();
    plantVarGlobal = $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val();
    areaTableNameGlobal = $("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001);
    personnelTableNameGlobal = $("#ahmgawpm001_personnel_renew_ehs_controller_table", ahmgawpm001);
    toolTableNameGlobal = $("#ahmgawpm001_tool_renew_ehs_controller_table", ahmgawpm001);
    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_renew_ehs_controller", ahmgawpm001).val();
    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val();
}
function ahmgawpm001_lov_plant_renew_ehs_controller_empty() {
    $('#ahmgawpm001_add_new_area_renew_ehs_controller', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_renew_ehs_controller', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_area_renew_ehs_controller', ahmgawpm001).attr("disabled", true);
    ahmgawpm001_reset_add_modal_area();
}
function ahmgawpm001_lov_supplier_renew_ehs_controller(params) {
    params.search = {
        idSupplier: $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val(),
        namaSupplier: $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_supplier_renew_ehs_controller_change() {
    if ($("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val() != null && $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val() != "") {
        $("#ahmgawpm001_nomor_po_renew_ehs_controller_button", ahmgawpm001).attr("disabled", false);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).attr("readonly", false);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(null);
    } else {
        $("#ahmgawpm001_nomor_po_renew_ehs_controller_button", ahmgawpm001).attr("disabled", true);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).attr("readonly", true);
        $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).attr("readonly", false);
    }
}
function ahmgawpm001_lov_supplier_renew_ehs_controller_empty() {
    $("#ahmgawpm001_nomor_po_renew_ehs_controller_button", ahmgawpm001).attr("disabled", true);
    $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).attr("readonly", true);
}

function ahmgawpm001_lov_pic_edit_admin(params) {
    params.search = {
        nrpPic: $("#ahmgawpm001_nrp_pic_edit_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        namaPic: $("#ahmgawpm001_nrp_pic_edit_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_po_edit_admin(params) {
    params.search = {
        noPoSpk: $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(),
        poDescription: $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_edit_admin", ahmgawpm001).val(),
        idSupplier: $("#ahmgawpm001_id_supplier_edit_admin", ahmgawpm001).val(),
        newPo: true,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_edit_admin(params) {
    params.search = {
        plantVar1: $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        plantVar2: $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        description: $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    plantVarGlobal = $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val();
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idPlant2",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_edit_admin_change() {
    if ($("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val() != "" && $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val() != null) {
        $('#ahmgawpm001_add_new_area_edit_admin', ahmgawpm001).attr("disabled", false);

        $('#ahmgawpm001_delete_all_area_edit_admin', ahmgawpm001).attr("disabled", false);
    } else {
        _fw_reset_subpage($("#ahmgawpm001_halaman_edit_admin"));
        $('#ahmgawpm001_add_new_area_edit_admin', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_submit_edit_admin', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_delete_all_area_edit_admin', ahmgawpm001).attr("disabled", true);
    }
    plantVarGlobal = $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val();
    areaTableNameGlobal = $("#ahmgawpm001_area_edit_admin_table", ahmgawpm001);
    personnelTableNameGlobal = $("#ahmgawpm001_personnel_edit_admin_table", ahmgawpm001);
    toolTableNameGlobal = $("#ahmgawpm001_tool_edit_admin_table", ahmgawpm001);
    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_edit_admin", ahmgawpm001).val();
    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val();
}
function ahmgawpm001_lov_plant_edit_admin_empty() {
    $('#ahmgawpm001_add_new_area_edit_admin', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_edit_admin', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_area_edit_admin', ahmgawpm001).attr("disabled", true);
}
function ahmgawpm001_lov_supplier_edit_admin(params) {
    params.search = {
        idSupplier: $("#ahmgawpm001_supplier_id_edit_admin", ahmgawpm001).val(),
        namaSupplier: $("#ahmgawpm001_supplier_id_edit_admin", ahmgawpm001).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }
    return params;
}



function ahmgawpm001_lov_pic_renew_admin(params) {
    params.search = {
        nrpPic: $("#ahmgawpm001_nrp_pic_renew_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        namaPic: $("#ahmgawpm001_nrp_pic_renew_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpPic",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_po_renew_admin(params) {
    params.search = {
        noPoSpk: $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(),
        poDescription: $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(),
        orderingType: $("#ahmgawpm001_ordering_type_renew_admin", ahmgawpm001).val(),
        idSupplier: $("#ahmgawpm001_id_supplier_renew_admin", ahmgawpm001).val(),
        newPo: true,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPoSpk",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_renew_admin(params) {
    params.search = {
        plantVar1: $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        plantVar2: $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
        description: $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001)
            .val()
            .toString()
            .toLowerCase(),
    };
    plantVarGlobal = $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val();
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idPlant2",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_plant_renew_admin_change() {
    if ($("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val() != "" && $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val() != null) {
        $('#ahmgawpm001_add_new_area_renew_admin', ahmgawpm001).attr("disabled", false);

        $('#ahmgawpm001_delete_all_area_renew_admin', ahmgawpm001).attr("disabled", false);
    } else {
        _fw_reset_subpage($("#ahmgawpm001_halaman_renew_admin"));
        $('#ahmgawpm001_add_new_area_renew_admin', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_submit_renew_admin', ahmgawpm001).attr("disabled", true);

        $('#ahmgawpm001_delete_all_area_renew_admin', ahmgawpm001).attr("disabled", true);
    }
    ahmgawpm001_reset_add_modal_area();
    plantVarGlobal = $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val();
    areaTableNameGlobal = $("#ahmgawpm001_area_renew_admin_table", ahmgawpm001);
    personnelTableNameGlobal = $("#ahmgawpm001_personnel_renew_admin_table", ahmgawpm001);
    toolTableNameGlobal = $("#ahmgawpm001_tool_renew_admin_table", ahmgawpm001);
    loginPatrolGlobal = $("#ahmgawpm001_login_patrol_renew_admin", ahmgawpm001).val();
    vikpidGlobal = $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val();
}
function ahmgawpm001_lov_plant_renew_admin_empty() {
    $('#ahmgawpm001_add_new_area_renew_admin', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_submit_renew_admin', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_delete_all_area_renew_admin', ahmgawpm001).attr("disabled", true);
    ahmgawpm001_reset_add_modal_area();
}
function ahmgawpm001_lov_supplier_renew_admin(params) {
    params.search = {
        idSupplier: $("#ahmgawpm001_supplier_id_renew_admin", ahmgawpm001).val(),
        namaSupplier: $("#ahmgawpm001_supplier_id_renew_admin", ahmgawpm001).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "idSupplier",
            order: "asc",
        };
    }
    return params;
}

// EDIT AREA MODAL
$('#ahmgawpm001_edit_area_modal').on('show.bs.modal', function (e) {
    if ($("#ahmgawpm001_task_list_title_edit_area").val() != null && $("#ahmgawpm001_task_list_title_edit_area").val() != "") {
        $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", false);
    } else {
        $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", true);
    }
    if (roleGlobal == "kontraktor") {
        $("#ahmgawpm001_nomor_asset_edit_area").prop("readonly", true);
        $("#ahmgawpm001_lov_nomor_asset_button").prop("disabled", true);
        $("#ahmgawpm001_task_list_title_edit_area").prop("readonly", true);
        $("#ahmgawpm001_button_task_list_title_edit_area").prop("disabled", true);
        $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", true);
    }
});
function ahmgawpm001_lov_tasklist_edit_area(params) {
    params.search = {
        taskListCode: $("#ahmgawpm001_task_list_title_edit_area").val(),
        taskListTitle: $("#ahmgawpm001_task_list_title_edit_area").val(),
        plantId: plantVarGlobal,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "taskListCode",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_tasklist_edit_area_empty() {
    $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", true);
}
function ahmgawpm001_lov_tasklist_edit_area_change() {
    if ($("#ahmgawpm001_task_list_title_edit_area").val() != null && $("#ahmgawpm001_task_list_title_edit_area").val() != "") {
        $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", false);
    } else {
        $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", true);
    }
}

function ahmgawpm001_lov_nomor_asset_edit_area(params) {
    var tableAreaProject = $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData');

    exception = new Array();

    for (let i = 0; i < tableAreaProject.length; i++) {
        if (tableAreaProject[selectedIndex].nomorAsset != tableAreaProject[i].nomorAsset) {
            exception.push(tableAreaProject[i].nomorAsset);
        }
    }

    params.search = {
        nomorAsset: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        building: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        floor: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        sectionLocation: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        areaDetail: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        criticality: $("#ahmgawpm001_nomor_asset_edit_area").val(),
        vplantVar2: plantVarGlobal,
        existedAsset: exception,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_nomor_asset_edit_area_empty() {
    $("#ahmgawpm001_button_task_list_title_edit_area").prop("disabled", true);
    $("#ahmgawpm001_task_list_title_edit_area").prop("disabled", true);
    $("#ahmgawpm001_submit_modal_edit_area").prop("disabled", true);
}
function ahmgawpm001_lov_nomor_asset_edit_area_change() {
    $("#ahmgawpm001_task_list_title_edit_area").val("");
    $("#ahmgawpm001_task_list_title_edit_area").prop("disabled", false);
    $("#ahmgawpm001_button_task_list_title_edit_area").prop("disabled", false);
}


// ADD AREA MODAL
$('#ahmgawpm001_add_area_modal').on('show.bs.modal', function (e) {
    if ($("#ahmgawpm001_task_list_title_add_area").val() != null && $("#ahmgawpm001_task_list_title_add_area").val() != "") {
        $("#ahmgawpm001_submit_modal_add_area").prop("disabled", false);
    } else {
        $("#ahmgawpm001_submit_modal_add_area").prop("disabled", true);
    }
});
$('#ahmgawpm001_add_area_modal').on('hide.bs.modal', function (e) {
    ahmgawpm001_reset_add_modal_area();
});

function ahmgawpm001_lov_tasklist_add_area(params) {
    params.search = {
        taskListCode: $("#ahmgawpm001_task_list_title_add_area").val(),
        taskListTitle: $("#ahmgawpm001_task_list_title_add_area").val(),
        plantId: plantVarGlobal,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "taskListCode",
            order: "asc",
        };
    }
    return params;
}
function ahmgawpm001_lov_tasklist_add_area_empty() {
    $("#ahmgawpm001_submit_modal_add_area").prop("disabled", true);
}
function ahmgawpm001_lov_tasklist_add_area_change() {
    if ($("#ahmgawpm001_task_list_title_add_area").val() != null && $("#ahmgawpm001_task_list_title_add_area").val() != "") {
        $("#ahmgawpm001_submit_modal_add_area").prop("disabled", false);
    } else {
        $("#ahmgawpm001_submit_modal_add_area").prop("disabled", true);
    }

}

function ahmgawpm001_lov_nomor_asset_add_area(params) {
    var tableAreaProject = $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData');
    exception = new Array();

    for (let i = 0; i < tableAreaProject.length; i++) {
        exception.push(tableAreaProject[i].nomorAsset);
    }

    params.search = {
        nomorAsset: $("#ahmgawpm001_nomor_asset_add_area").val(),
        building: $("#ahmgawpm001_nomor_asset_add_area").val(),
        floor: $("#ahmgawpm001_nomor_asset_add_area").val(),
        sectionLocation: $(
            "#ahmgawpm001_nomor_asset_add_area"
        ).val(),
        areaDetail: $("#ahmgawpm001_nomor_asset_add_area").val(),
        criticality: $("#ahmgawpm001_nomor_asset_add_area").val(),
        vplantVar2: plantVarGlobal,
        existedAsset: exception,
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        };
    }
    $("#ahmgawpm001_task_list_title_add_area").val(null);
    return params;
}
function ahmgawpm001_lov_nomor_asset_add_area_empty() {
    $("#ahmgawpm001_button_task_list_title_add_area").prop("disabled", true);
    $("#ahmgawpm001_task_list_title_add_area").prop("readonly", true);
    $("#ahmgawpm001_submit_modal_add_area").prop("disabled", true);
}
function ahmgawpm001_lov_nomor_asset_add_area_change() {
    $("#ahmgawpm001_task_list_title_add_area").val("");
    $("#ahmgawpm001_task_list_title_add_area").prop("readonly", false);
    $("#ahmgawpm001_button_task_list_title_add_area").prop("disabled", false);
}

//-------------------------------------------------------------------------------------------
// SUBMIT MASTER

// SUBMIT EHS CONTROLLER DI MENU MAINTAIN
$("#ahmgawpm001_submit_ikp_confirm_button", ahmgawpm001).click(function () {
    _fw_validation_clear(ahmgawpm001);
    if (roleGlobal == "deptHead" || roleGlobal == "ehsOfficer") {
        $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Approving...');
    } else {
        $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...');
    }

    $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_request_button_maintain_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_create_button_maintain_ehs_controller', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_search_maintain_ikp_button', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_refresh_maintain_ikp_button', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_export_maintain_ikp_button', ahmgawpm001).attr("disabled", true);
    var listData = "";
    if (roleGlobal == "admin") {
        if (listIkpIdChecked.length > 0) {
            setTimeout(function () {
                if (_fw_validation_validate(ahmgawpm001)) {
                    var listIkpIdCheckedEhsController = new Array();
                    var listIkpIdCheckedKontraktor = new Array();
                    var listIkpIdCheckedProjectOwner = new Array();
                    var listIkpIdCheckedDeptHead = new Array();
                    var listIkpIdCheckedEhsOfficer = new Array();
                    var submessage = "";
                    for (let i = 0; i < listIkpIdChecked.length; i++) {
                        if (listStatusChecked[i].includes("Created")) {
                            listIkpIdCheckedEhsController.push(listIkpIdChecked[i]);
                        }
                        if (listStatusChecked[i].includes("Requested") || listStatusChecked[i].includes("Revision")) {
                            listIkpIdCheckedKontraktor.push(listIkpIdChecked[i]);
                        }
                        if (listStatusChecked[i].includes("Project Owner")) {
                            listIkpIdCheckedProjectOwner.push(listIkpIdChecked[i]);
                        }
                        if (listStatusChecked[i].includes("Dept Head")) {
                            listIkpIdCheckedDeptHead.push(listIkpIdChecked[i]);
                        }
                        if (listStatusChecked[i].includes("EHS Officer")) {
                            listIkpIdCheckedEhsOfficer.push(listIkpIdChecked[i]);
                        }
                    }


                    let validateTanggal = true;
                    for (let i = 0; i < listIkpIdCheckedKontraktor.length; i++) {
                        let stringData = JSON.stringify({
                            nomorIkp: listIkpIdCheckedKontraktor[i],
                        })
                        let jsonSendString = JSON.parse(stringData);
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
                            jsonSendString,
                            function (ret) {
                                if (ret.status == "1") {
                                    _fw_setMessage(ret.status, ret.message.res);
                                    if (ret.data != null) {
                                        data = ret.data[0];
                                        if (data.startTanggalPekerjaan == null || data.endTanggalPekerjaan == null) {
                                            submessage = submessage + "<p>" + data.nomorIkp + " tidak memiliki tanggal pekerjaan </p>";
                                            validateTanggal = false;
                                        }
                                    }
                                }

                                if (ret.status == "0") {
                                    _fw_setMessage(
                                        ret.status,
                                        ret.message.message + ": " + ret.message.res
                                    );
                                    validateTanggal = false;
                                }
                            }
                        );
                    }

                    if (validateTanggal) {
                        let dataApproveKontraktor = new Object();
                        dataApproveKontraktor.status = ["01-IKP", "05-IKP"];
                        dataApproveKontraktor.listVikpid = listIkpIdCheckedKontraktor;
                        dataApproveKontraktor.ehsController = new Object();
                        if (plantEhsGlobal != undefined) {
                            dataApproveKontraktor.ehsController.plantId = plantEhsGlobal;
                        } else {
                            dataApproveKontraktor.ehsController.plantId = "";
                        }
                        let stringDataApproveKontraktor = JSON.stringify(dataApproveKontraktor);
                        let jsonSendStringApproveKontraktor = JSON.parse(stringDataApproveKontraktor);
                        let validateResultApproveKontraktor = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApproveKontraktor,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        if (typeof retApprove.message.picNotHaveDeptHead != "undefined") {
                                            if (typeof retApprove.message.picNotHaveDeptHead[i] != "undefined") {
                                                listData = listData + "<p>" + retApprove.data[i].vikpid + " tidak memmiliki Dept Head</p>";
                                            }
                                        } else {
                                            listData = listData + "<p>" + retApprove.data[i].vikpid + "</p>";
                                        }
                                    }
                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApproveKontraktor = false;
                                }
                            }
                        );


                        let dataApproveEhsController = new Object();
                        dataApproveEhsController.status = ["00-IKP"];
                        dataApproveEhsController.listVikpid = listIkpIdCheckedEhsController;
                        dataApproveEhsController.ehsController = new Object();
                        if (plantEhsGlobal != undefined) {
                            dataApproveEhsController.ehsController.plantId = plantEhsGlobal;
                        } else {
                            dataApproveEhsController.ehsController.plantId = "";
                        }
                        let stringDataApproveEhsController = JSON.stringify(dataApproveEhsController);
                        let jsonSendStringApproveEhsController = JSON.parse(stringDataApproveEhsController);
                        let validateResultApproveEhsController = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApproveEhsController,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        listData = "<p center>" + listData + retApprove.data[i].vikpid + "</p>";
                                    }

                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApproveEhsController = false;
                                }
                            }
                        );


                        let dataApproveProjectOwner = new Object();
                        dataApproveProjectOwner.status = ["02-IKP"];
                        dataApproveProjectOwner.listVikpid = listIkpIdCheckedProjectOwner;
                        dataApproveProjectOwner.ehsController = new Object();
                        if (plantEhsGlobal != undefined) {
                            dataApproveProjectOwner.ehsController.plantId = plantEhsGlobal;
                        } else {
                            dataApproveProjectOwner.ehsController.plantId = "";
                        }
                        let stringDataApproveProjectOwner = JSON.stringify(dataApproveProjectOwner);
                        let jsonSendStringApproveProjectOwner = JSON.parse(stringDataApproveProjectOwner);
                        let validateResultApproveProjectOwner = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApproveProjectOwner,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        listData = "<p center>" + listData + retApprove.data[i].vikpid + "</p>";
                                    }
                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApproveProjectOwner = false;
                                }
                            }
                        );


                        let dataApproveDeptHead = new Object();
                        dataApproveDeptHead.status = ["03-IKP"];
                        dataApproveDeptHead.listVikpid = listIkpIdCheckedDeptHead;
                        dataApproveDeptHead.ehsController = new Object();
                        if (plantEhsGlobal != undefined) {
                            dataApproveDeptHead.ehsController.plantId = plantEhsGlobal;
                        } else {
                            dataApproveDeptHead.ehsController.plantId = "";
                        }
                        let stringDataApproveDeptHead = JSON.stringify(dataApproveDeptHead);
                        let jsonSendStringApproveDeptHead = JSON.parse(stringDataApproveDeptHead);
                        let validateResultApproveDeptHead = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApproveDeptHead,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        listData = "<p center>" + listData + retApprove.data[i].vikpid + "</p>";
                                    }
                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApproveDeptHead = false;
                                }
                            }
                        );

                        let dataApproveEhsOfficer = new Object();
                        dataApproveEhsOfficer.status = ["04-IKP"];
                        dataApproveEhsOfficer.listVikpid = listIkpIdCheckedEhsOfficer;
                        dataApproveEhsOfficer.ehsController = new Object();
                        if (plantEhsGlobal != undefined) {
                            dataApproveEhsOfficer.ehsController.plantId = plantEhsGlobal;
                        } else {
                            dataApproveEhsOfficer.ehsController.plantId = "";
                        }
                        let stringDataApproveEhsOfficer = JSON.stringify(dataApproveEhsOfficer);
                        let jsonSendStringApproveEhsOfficer = JSON.parse(stringDataApproveEhsOfficer);
                        let validateResultApproveEhsOfficer = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApproveEhsOfficer,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        listData = "<p center>" + listData + retApprove.data[i].vikpid + "</p>";
                                    }
                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApproveEhsOfficer = false;
                                }
                            }
                        );



                        if (validateResultApproveEhsController && validateResultApproveKontraktor && validateResultApproveProjectOwner && validateResultApproveEhsOfficer && validateResultApproveDeptHead) {
                            listIkpIdChecked = new Array();
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                            $('#ahmgawpm001_notification_modal_submessage').val(listData);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                                "refresh"
                            );
                        }
                    } else {
                        listIkpIdChecked = new Array();
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable("refresh");
                        $('#ahmgawpm001_notification_modal_message').val("Submit gagal");
                        $('#ahmgawpm001_notification_modal_submessage').val(submessage);
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }
                } else {
                    $('#ahmgawpm001_notification_modal_message').val("Submit gagal");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                    $(window).scrollTop("0");
                }
                $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit');
                $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).attr("disabled", true);
                $('#ahmgawpm001_request_button_maintain_kontraktor', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_create_button_maintain_ehs_controller', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_search_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_refresh_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_export_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            }, 3000);
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Submit gagal, tidak ada data yang dipilih");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit');
            $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).attr("disabled", true);
            $('#ahmgawpm001_request_button_maintain_kontraktor', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_create_button_maintain_ehs_controller', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_search_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_refresh_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_export_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
        }
    } else {
        if (listIkpIdChecked.length > 0) {
            setTimeout(function () {
                if (_fw_validation_validate(ahmgawpm001)) {

                    let dataApprove = new Object();
                    let validateTanggal = true;
                    let validateSpesifikasi = true;
                    var submessage = "";
                    dataApprove.listVikpid = listIkpIdChecked;
                    dataApprove.ehsController = new Object();
                    if (plantEhsGlobal != undefined) {
                        dataApprove.ehsController.plantId = plantEhsGlobal;
                    } else {
                        dataApprove.ehsController.plantId = "";
                    }
                    if (roleGlobal == "ehsController") {
                        dataApprove.status = ["00-IKP"];
                    } else if (roleGlobal == "deptHead") {
                        dataApprove.status = ["03-IKP"];
                        for (let i = 0; i < listIkpIdChecked.length; i++) {
                            let stringData = JSON.stringify({
                                nomorIkp: listIkpIdChecked[i],
                            })
                            let jsonSendString = JSON.parse(stringData);
                            _fw_post(
                                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
                                jsonSendString,
                                function (ret) {
                                    if (ret.status == "1") {
                                        _fw_setMessage(ret.status, ret.message.res);
                                        if (ret.data != null) {
                                            data = ret.data[0];
                                            if (data.startTanggalPekerjaan == null || data.endTanggalPekerjaan == null) {
                                                submessage = submessage + "<p>" + data.nomorIkp + " tidak memiliki tanggal pekerjaan</p>";
                                                validateTanggal = false;
                                            }
                                        }
                                    }

                                    if (ret.status == "0") {
                                        _fw_setMessage(
                                            ret.status,
                                            ret.message.message + ": " + ret.message.res
                                        );
                                        validateTanggal = false;
                                    }
                                }
                            );
                        }
                    } else if (roleGlobal == "ehsOfficer") {
                        dataApprove.status = ["04-IKP"];
                    } else if (roleGlobal == "kontraktor") {
                        dataApprove.status = ["01-IKP", "05-IKP"];
                        var submessage = "";
                        for (let i = 0; i < listIkpIdChecked.length; i++) {
                            let stringData = JSON.stringify({
                                nomorIkp: listIkpIdChecked[i],
                            })
                            let jsonSendString = JSON.parse(stringData);
                            _fw_post(
                                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-ikp-by-kontraktor-depthead",
                                jsonSendString,
                                function (ret) {
                                    if (ret.status == "1") {
                                        _fw_setMessage(ret.status, ret.message.res);
                                        if (ret.data != null) {
                                            data = ret.data[0];
                                            if (data.startTanggalPekerjaan == null || data.endTanggalPekerjaan == null) {
                                                submessage = submessage + "<p>" + data.nomorIkp + " tidak memiliki tanggal pekerjaan</p>";
                                                validateTanggal = false;
                                            }
                                        }
                                    }

                                    if (ret.status == "0") {
                                        _fw_setMessage(
                                            ret.status,
                                            ret.message.message + ": " + ret.message.res
                                        );
                                        validateTanggal = false;
                                    }
                                }
                            );
                        }
                    } else if (roleGlobal == "projectOwner") {
                        dataApprove.status = ["02-IKP"];
                        for (let i = 0; i < listIkpIdChecked.length; i++) {
                            let stringDataSpesifikasi = JSON.stringify({
                                paging: {
                                    order: "asc",
                                    sort: "kodePekerjaan",
                                },
                                primaryKey: {
                                    vikpid: listIkpIdChecked[i],
                                }
                            });
                            let jsonSendStringSpesifikasi = JSON.parse(stringDataSpesifikasi);
                            _fw_post(
                                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-spesifikasi-by-id",
                                jsonSendStringSpesifikasi,
                                function (ret) {
                                    if (ret.status == "1") {
                                        _fw_setMessage(ret.status, ret.message.res);
                                        if (ret.data != null) {
                                            data = ret.data;
                                            if (ret.total == 0) {
                                                submessage = submessage + "<p>" + listIkpIdChecked[i] + " gagal disubmit karena tidak memiliki spesifikasi pekerjaan, penanggung jawab limbah dan tempat pembuangan limbah</p>";
                                                validateSpesifikasi = false;
                                            }
                                        }
                                    }

                                    if (ret.status == "0") {
                                        _fw_setMessage(
                                            ret.status,
                                            ret.message.message + ": " + ret.message.res
                                        );
                                        validateSpesifikasi = false;
                                    }
                                }
                            );
                        }
                    }
                    if (validateTanggal && validateSpesifikasi) {
                        let stringDataApprove = JSON.stringify(dataApprove);
                        let jsonSendStringApprove = JSON.parse(stringDataApprove);
                        let validateResultApprove = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                            jsonSendStringApprove,
                            function (retApprove) {
                                if (retApprove.status == "1") {
                                    _fw_setMessage(retApprove.status, retApprove.message.res);
                                    $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                                    var listData = "";
                                    for (let i = 0; i < retApprove.data.length; i++) {
                                        listData = listData + "<p>" + retApprove.data[i].vikpid + "</p>";
                                    }
                                    if (typeof retApprove.message.picNotHaveDeptHead != "undefined") {
                                        if (typeof retApprove.message.picNotHaveDeptHead[0] != "undefined") {
                                            for (let i = 0; i < retApprove.message.picNotHaveDeptHead.length; i++) {
                                                listData = listData + "<p>" + retApprove.message.picNotHaveDeptHead[i].vikpid + " tidak memiliki Dept Head</p>";
                                            }
                                        }
                                    }
                                    $('#ahmgawpm001_notification_modal_submessage').val(listData);
                                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                    document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                    $('#ahmgawpm001_notification_modal').modal('show');
                                }

                                if (retApprove.status == "0") {
                                    _fw_setMessage(
                                        retApprove.status,
                                        retApprove.message.message + ": " + retApprove.message.res
                                    );
                                    validateResultApprove = false;
                                }
                            }
                        );

                        if (validateResultApprove) {
                            listIkpIdChecked = new Array();
                            $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                                "refresh"
                            );
                        }
                    } else {
                        listIkpIdChecked = new Array();
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable("refresh");
                        $('#ahmgawpm001_notification_modal_message').val("Submit gagal");
                        $('#ahmgawpm001_notification_modal_submessage').val(submessage);
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }
                } else {
                    $('#ahmgawpm001_notification_modal_message').val("Submit gagal");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                    $(window).scrollTop("0");
                }
                if (roleGlobal == "deptHead" || roleGlobal == "ehsOfficer") {
                    $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve');
                } else {
                    $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit');
                }
                $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).attr("disabled", true);
                $('#ahmgawpm001_request_button_maintain_kontraktor', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_create_button_maintain_ehs_controller', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_search_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_refresh_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_export_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            }, 3000);
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Submit gagal, tidak ada data yang dipilih");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            if (roleGlobal == "deptHead") {
                $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve');
            } else {
                $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit');
            }
            $('#ahmgawpm001_submit_button_maintain', ahmgawpm001).attr("disabled", true);
            $('#ahmgawpm001_request_button_maintain_kontraktor', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_create_button_maintain_ehs_controller', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_search_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_refresh_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_export_maintain_ikp_button', ahmgawpm001).attr("disabled", false);
        }
    }


});
// SUBMIT FUNCTION ADD EHS
function ahmgawpm001_submit_add_ehs(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_add_ehs_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#ahmgawpm001_save_add_ehs', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_add_ehs', 'required');
    if ($("#ahmgawpm001_ordering_type_add_ehs", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_no_po_add_ehs', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_no_spk_add_ehs', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_pic_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_plant_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_kategori_izin_kerja_add_ehs', 'required');
    var index = $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_add_ehs", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (index < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.listAreaProject = new Array();
                data.status = new Array();
                data.status = ['01-IKP'];

                let areaProject = new Object();

                for (let i = 0; i < tableAreaProject.length; i++) {
                    areaProject = {
                        indoorOutdoor: tableAreaProject[i].indoorOutdoor,
                        areaDetail: tableAreaProject[i].areaDetail,
                        criticality: tableAreaProject[i].criticality,
                        taskListTitle: tableAreaProject[i].taskListTitle,
                    }
                    areaProject.primaryKey = {
                        assetNo: tableAreaProject[i].nomorAsset,
                    }
                    data.listAreaProject.push(areaProject);
                }

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_add_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_add_ehs", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_add_ehs",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_add_ehs",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_add_ehs", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_add_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_no_spk_add_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_add_ehs", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_add_ehs", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_add_ehs", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).val(),
                };

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/create-ikp",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );
                if (validateResult) {
                    $('#ahmgawpm001_save_add_ehs', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_create_ehs_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_create_ehs_controller"));
                    $(window).scrollTop("0");
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Submit').prop("disabled", false);
        $('#ahmgawpm001_save_add_ehs', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", false);
    }, 1000);




};
// SAVE FUNCTION ADD EHS
function ahmgawpm001_save_add_ehs(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_add_ehs_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_add_ehs', 'required');
    if ($("#ahmgawpm001_ordering_type_add_ehs", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_no_po_add_ehs', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_no_spk_add_ehs', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_pic_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_plant_add_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_kategori_izin_kerja_add_ehs', 'required');
    var index = $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_add_ehs", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (index < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.listAreaProject = new Array();
                data.status = new Array();
                data.status = ['00-IKP'];

                let areaProject = new Object();

                for (let i = 0; i < tableAreaProject.length; i++) {
                    areaProject = {
                        indoorOutdoor: tableAreaProject[i].indoorOutdoor,
                        areaDetail: tableAreaProject[i].areaDetail,
                        criticality: tableAreaProject[i].criticality,
                        taskListTitle: tableAreaProject[i].taskListTitle,
                    }
                    areaProject.primaryKey = {
                        assetNo: tableAreaProject[i].nomorAsset,
                    }
                    data.listAreaProject.push(areaProject);
                }

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_add_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_add_ehs", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_add_ehs",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_add_ehs",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_add_ehs", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_add_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_no_spk_add_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_add_ehs", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_id_supplier_add_ehs", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_add_ehs", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_id_pic_add_ehs", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_add_ehs", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_no_po_add_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_add_ehs", ahmgawpm001).val(),
                };

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/create-ikp",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully created");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );
                if (validateResult) {
                    $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_add_ehs_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_create_ehs_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_create_ehs_controller"));
                    $(window).scrollTop("0");
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
        $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_add_ehs', ahmgawpm001).prop("disabled", false);
    }, 1000);




};
// SAVE FUNCTION EDIT EHS CONTROLLER
function ahmgawpm001_save_edit_ehs(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_edit_ehs_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_supplier_id_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_ehs', 'required');
    if ($("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_edit_ehs', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_edit_ehs', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_pic_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_plant_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_kategori_izin_kerja_edit_ehs', 'required');
    var index = $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_edit_ehs", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (index < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.status = ['00-IKP'];

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_ehs", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_nomor_spk_edit_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_ehs", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_edit_ehs", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_supplier_id_edit_ehs", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_id_pic_edit_ehs", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_ehs", ahmgawpm001).val(),
                };



                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-ehscontroller",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully saved");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );

                if (validateResult) {
                    $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).attr("disabled", false);
                    $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_edit_ehs_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_ehs_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
        $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).attr("disabled", false);
    }, 1000);


};
// SUBMIT FUNCTION EDIT EHS CONTROLLER
function ahmgawpm001_submit_edit_ehs(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_edit_ehs_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_supplier_id_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_ehs', 'required');
    if ($("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_edit_ehs', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_edit_ehs', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_pic_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_plant_edit_ehs', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_kategori_izin_kerja_edit_ehs', 'required');
    var index = $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_edit_ehs", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (index < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.status = ['01-IKP'];

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_ehs", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_edit_ehs", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_edit_ehs",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_nomor_spk_edit_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_ehs", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_edit_ehs", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_supplier_id_edit_ehs", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_id_pic_edit_ehs", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_edit_ehs", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_nomor_po_edit_ehs", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_ehs", ahmgawpm001).val(),
                };



                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-ehscontroller",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );

                if (validateResult) {
                    $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_edit_ehs_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_edit_ehs_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_ehs_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Submit').prop("disabled", false);
        $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_edit_ehs', ahmgawpm001).prop("disabled", false);
    }, 1000);


};
// SUBMIT FUNCTION RENEW EHS CONTROLLER
function ahmgawpm001_submit_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Renewing...').prop("disabled", true);
    $('#ahmgawpm001_cancel_renew_ehs_controller', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_renew_ehs_controller', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_renew_ehs_controller', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_renew_ehs_controller', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_ehs_controller', 'required');
    if ($("#ahmgawpm001_ordering_type_renew_ehs_controller", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_renew_ehs_controller', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_renew_ehs_controller', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_ehs_controller', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_renew_ehs_controller', 'required');
    var indexArea = $("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_renew_ehs_controller", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            var end = new Date();
            end.setDate(end.getDate() - 1);
            end.setHours(23, 59, 59, 999);
            if (moment($("#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller", ahmgawpm001).val()) < moment(end)) {
                $('#ahmgawpm001_notification_modal_message').val("Tanggal Start Pekerjaan tidak boleh backdate");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
                $(window).scrollTop("0");
            } else {
                if (indexArea < 1) {
                    $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                }
                else {
                    let data = new Object();
                    data.ehsController = new Object();
                    data.lovPic = new Object();
                    data.lovSupplier = new Object();
                    data.lovPo = new Object();
                    data.lovPlant = new Object();
                    data.listAreaProject = new Array();
                    data.listPersonnel = new Array();
                    data.listTool = new Array();
                    data.listSpesifikasiPekerjaan = new Array();
                    data.kontraktor = new Object();
                    data.status = ['00-IKP'];

                    data.kontraktor = {
                        detailProyek: $("#ahmgawpm001_detail_proyek_renew_ehs_controller", ahmgawpm001).val(),
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        startTanggalPekerjaan: moment($("#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller", ahmgawpm001).val()).format('DD-MM-YYYY'),
                        endTanggalPekerjaan: moment($("#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller", ahmgawpm001).val()).format('DD-MM-YYYY'),
                        namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_renew_ehs_controller", ahmgawpm001).val(),
                        nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_ehs_controller", ahmgawpm001).val(),
                        namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_renew_ehs_controller", ahmgawpm001).val(),
                        nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_ehs_controller", ahmgawpm001).val(),
                        remarks: $("#ahmgawpm001_remarks_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    data.ehsController = {
                        kategoriIzinKerja: $(
                            "#ahmgawpm001_kategori_izin_kerja_renew_ehs_controller",
                            ahmgawpm001
                        ).val(),
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        nomorPengajuanLk3: $(
                            "#ahmgawpm001_nomor_pengajuan_lk3_renew_ehs_controller",
                            ahmgawpm001
                        ).val(),
                        kategoriPekerjaan: $(
                            "#ahmgawpm001_kategori_pekerjaan_renew_ehs_controller",
                            ahmgawpm001
                        ).val(),
                        orderingType: $("#ahmgawpm001_ordering_type_renew_ehs_controller", ahmgawpm001).val(),
                        purchasingOrganization: $(
                            "#ahmgawpm001_purchasing_organization_renew_ehs_controller",
                            ahmgawpm001
                        ).val(),
                        nomorSpk: $("#ahmgawpm001_nomor_spk_renew_ehs_controller", ahmgawpm001).val(),
                        deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).val(),
                        loginPatrol: $("#ahmgawpm001_login_patrol_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    data.lovSupplier = {
                        idSupplier: $("#ahmgawpm001_id_supplier_renew_ehs_controller", ahmgawpm001).val(),
                        namaSupplier: $("#ahmgawpm001_nama_supplier_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    data.lovPlant = {
                        plantVar2: $("#ahmgawpm001_id_plant_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    data.lovPic = {
                        nrpPic: $("#ahmgawpm001_nrp_pic_renew_ehs_controller", ahmgawpm001).val(),
                        namaPic: $("#ahmgawpm001_nama_pic_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    data.lovPo = {
                        nomorPo: $("#ahmgawpm001_nomor_po_renew_ehs_controller", ahmgawpm001).val(),
                        deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_ehs_controller", ahmgawpm001).val(),
                    };

                    oldAreaProject = new Array();
                    areaProject = new Object();
                    let stringDataArea = JSON.stringify({
                        paging: {
                            order: "asc",
                            sort: "assetNo",
                        },
                        primaryKey: {
                            vikpid: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        }
                    });
                    let jsonSendStringArea = JSON.parse(stringDataArea);
                    let validateResultArea = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-areaproject-by-id",
                        jsonSendStringArea,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                oldAreaProject = ret.data;
                                for (let i = 0; i < oldAreaProject.length; i++) {
                                    areaProject = {
                                        indoorOutdoor: oldAreaProject[i].indoorOutdoor,
                                        areaDetail: oldAreaProject[i].areaDetail,
                                        criticality: oldAreaProject[i].criticality,
                                        taskListTitle: oldAreaProject[i].taskListTitle,
                                    }
                                    areaProject.primaryKey = {
                                        assetNo: oldAreaProject[i].nomorAsset,
                                    }
                                    data.listAreaProject.push(areaProject);
                                }
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultArea = false;
                            }
                        }
                    );

                    oldPersonnel = new Array();
                    personnel = new Object();
                    let stringDataPersonnel = JSON.stringify({
                        paging: {
                            order: "asc",
                            sort: "assetNo",
                        },
                        primaryKey: {
                            vikpid: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        }
                    });
                    let jsonSendStringPersonnel = JSON.parse(stringDataPersonnel);
                    let validateResultPersonnel = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-personnel-by-id",
                        jsonSendStringPersonnel,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                oldPersonnel = ret.data;
                                for (let i = 0; i < oldPersonnel.length; i++) {
                                    personnel = {
                                        tipeTugas: oldPersonnel[i].tipeTugas,
                                        namaKontraktor: oldPersonnel[i].namaKontraktor,
                                        nomorSertifikasi: oldPersonnel[i].nomorSertifikasi,
                                    }
                                    personnel.primaryKey = {
                                        vnik: oldPersonnel[i].nikPasporKontraktor,
                                    }
                                    data.listPersonnel.push(personnel);
                                }
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultPersonnel = false;
                            }
                        }
                    );

                    oldTool = new Array();
                    tool = new Object();
                    let stringDataTool = JSON.stringify({
                        paging: {
                            order: "asc",
                            sort: "assetNo",
                        },
                        primaryKey: {
                            vikpid: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        }
                    });
                    let jsonSendStringTool = JSON.parse(stringDataTool);
                    let validateResultTool = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-tool-by-id",
                        jsonSendStringTool,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                oldTool = ret.data;
                                for (let i = 0; i < oldTool.length; i++) {
                                    tool = {
                                        deskripsiAlat: oldTool[i].deskripsiAlat,
                                        permitFlag: oldTool[i].permitFlag,
                                        permitType: oldTool[i].permitType,
                                        serialNumber: oldTool[i].serialNumber,
                                        nomorIzin: oldTool[i].nomorIzin,
                                        effectiveDateFrom: moment(oldTool[i].effectiveDateFrom).format('DD-MM-YYYY'),
                                        effectiveDateTo: moment(oldTool[i].effectiveDateTo).format('DD-MM-YYYY'),
                                    }
                                    tool.primaryKey = {
                                        vikptoolsid: oldTool[i].ikpToolsId,
                                    }
                                    data.listTool.push(tool);
                                }
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultTool = false;
                            }
                        }
                    );

                    oldSpesifikasi = new Array();
                    spesifikasi = new Object();
                    let stringDataSpesifikasi = JSON.stringify({
                        paging: {
                            order: "asc",
                            sort: "kodePekerjaan",
                        },
                        primaryKey: {
                            vikpid: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                        }
                    });
                    let jsonSendStringSpesifikasi = JSON.parse(stringDataSpesifikasi);
                    let validateResultSpesifikasi = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-spesifikasi-by-id",
                        jsonSendStringSpesifikasi,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                oldSpesifikasi = ret.data;
                                for (let i = 0; i < oldSpesifikasi.length; i++) {
                                    spesifikasi = {
                                        ketentuanProses: oldSpesifikasi[i].ketentuanProses,
                                        ketentuanSertifikasi: oldSpesifikasi[i].ketentuanSertifikasi,
                                        keteranganItemProject: oldSpesifikasi[i].keteranganItemProject,
                                        groupingItemLevel1: oldSpesifikasi[i].groupingItemLevel1,
                                        groupingItemLevel2: oldSpesifikasi[i].groupingItemLevel2,
                                        groupingItemLevel3: oldSpesifikasi[i].groupingItemLevel3,
                                        ketentuanGeneralSupport: oldSpesifikasi[i].ketentuanGeneralSupport,
                                        ketentuanAreaKerja: oldSpesifikasi[i].ketentuanAreaKerja,
                                        ketentuanMonitoringPekerjaan: oldSpesifikasi[i].ketentuanMonitoringPekerjaan,
                                        ketentuanVerifikasiBarang: oldSpesifikasi[i].ketentuanVerifikasiBarang,
                                        ketentuanAlatPemadamApi: oldSpesifikasi[i].ketentuanAlatPemadamApi,
                                        ketentuanHiradcProject: oldSpesifikasi[i].ketentuanHiradcProject,
                                        ketentuanEhs: oldSpesifikasi[i].ketentuanEhs,
                                        ketentuanApd: oldSpesifikasi[i].ketentuanApd,
                                        pembuanganLimbah: oldSpesifikasi[i].pembuanganLimbah,
                                        tanggungJawabLimbah: oldSpesifikasi[i].tanggungJawabLimbah,
                                    }
                                    spesifikasi.primaryKey = {
                                        kodePekerjaan: oldSpesifikasi[i].kodePekerjaan,
                                    }
                                    data.listSpesifikasiPekerjaan.push(spesifikasi);
                                }
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultSpesifikasi = false;
                            }
                        }
                    );

                    data = new Object();
                    data.ehsController = new Object();

                    data.ehsController = {
                        nomorIkpExtend: renewedNoIkp,
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val(),
                    }


                    let stringDataRenewed = JSON.stringify(data);
                    let jsonSendStringRenewed = JSON.parse(stringDataRenewed);
                    let validateResultRenewed = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-ehscontroller",
                        jsonSendStringRenewed,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                $('#ahmgawpm001_notification_modal_message').val("IKP renew failed");
                                $('#ahmgawpm001_notification_modal_submessage').val("IKP sudah direnew dengan nomor " + ret.message.existVikpextend);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                                $('#ahmgawpm001_cancel_renew_ehs_controller', ahmgawpm001).attr("disabled", false);
                                thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Renew').prop("disabled", false);
                                validateResultRenewed = false;
                            }
                        }
                    );

                    if (validateResultRenewed) {
                        let stringData = JSON.stringify(data);
                        let jsonSendString = JSON.parse(stringData);
                        let validateResult = true;
                        _fw_post(
                            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/create-ikp",
                            jsonSendString,
                            function (ret) {
                                if (ret.status == "1") {
                                    _fw_setMessage(ret.status, ret.message.res);
                                    renewedNoIkp = ret.data[0].vnoikp;
                                }

                                if (ret.status == "0") {
                                    _fw_setMessage(
                                        ret.status,
                                        ret.message.message + ": " + ret.message.res
                                    );
                                    validateResult = false;
                                }
                            }
                        );
                    }

                    var index = listIkpIdChecked.indexOf($("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val());
                    if (index !== -1) {
                        listIkpIdChecked.splice(index, 1);
                    }



                    if (validateResult && validateResultArea && validateResultPersonnel && validateResultTool && validateResultSpesifikasi) {
                        $("#ahmgawpm001_area_renew_ehs_controller_table", ahmgawpm001).bootstrapTable('removeAll');
                        _fw_validation_clear($("#ahmgawpm001_halaman_renew_ehs_controller_controller"));
                        _fw_reset_subpage($("#ahmgawpm001_halaman_renew_ehs_controller_controller"));
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        stringMessage = "<p>" + $("#ahmgawpm001_nomor_ikp_renew_ehs_controller", ahmgawpm001).val() + " telah direnew menjadi " + renewedNoIkp + "</p>";
                        $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully renewed");
                        $('#ahmgawpm001_notification_modal_submessage').val(stringMessage);
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                        _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                        listIkpIdChecked = new Array();
                    }
                }
            }

        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        $('#ahmgawpm001_cancel_renew_ehs_controller', ahmgawpm001).attr("disabled", false);
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Renew').prop("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION REQUEST KONTRAKTOR
function ahmgawpm001_submit_request_kontraktor(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    var tablePersonnel = $('#ahmgawpm001_personnel_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    var tableTool = $('#ahmgawpm001_tool_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_request_kontraktor', 'required');
    if ($("#ahmgawpm001_ordering_type_request_kontraktor", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_request_kontraktor', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_request_kontraktor', 'required');
    }

    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_detail_proyek_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_request_kontraktor', 'required');
    $("#ahmgawpm001_kategori_izin_kerja_request_kontraktor", ahmgawpm001).val("Izin Kerja Proyek");

    if (tableAreaProject.length > 0 && tablePersonnel.length > 0 && tableTool.length > 0) {
        setTimeout(function () {
            if (_fw_validation_validate(ahmgawpm001)) {

                let data = new Object();
                data.kontraktor = new Object();
                data.status = new Array();
                data.status = ['03-IKP', '02-IKP'];
                varStartTanggalPekerjaan = null;
                if ($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
                    varStartTanggalPekerjaan = moment($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }
                varEndTanggalPekerjaan = null;
                if ($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
                    varEndTanggalPekerjaan = moment($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }

                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_request_kontraktor", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val(),
                    startTanggalPekerjaan: varStartTanggalPekerjaan,
                    endTanggalPekerjaan: varEndTanggalPekerjaan,
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_request_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_request_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor", ahmgawpm001).val(),
                    // remarks: $("#ahmgawpm001_remarks_request_kontraktor", ahmgawpm001).val(),
                };

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-kontraktor",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            var listData = "";
                            for (let i = 0; i < ret.data.length; i++) {
                                listData = listData + "<p>" + ret.data[i].vikpid + "</p>";
                            }
                            if (typeof ret.message.picNotHaveDeptHead != "undefined") {
                                if (typeof ret.message.picNotHaveDeptHead[0] != "undefined") {
                                    for (let i = 0; i < ret.message.picNotHaveDeptHead.length; i++) {
                                        listData = listData + "<p>" + ret.message.picNotHaveDeptHead[i].vikpid + " tidak memiliki Dept Head</p>";
                                    }
                                }
                            }
                            $('#ahmgawpm001_notification_modal_submessage').val(listData);
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );

                if (validateResult) {
                    $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_request_kontraktor_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_request_kontraktor_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit').prop("disabled", false);
                    $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", false);
                    $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }

            } else {
                $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
                $(window).scrollTop("0");
                thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit').prop("disabled", false);
                $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
            }
        }, 3000);
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Area Project, Alat, dan Personnel");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
        $(window).scrollTop("0");
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"> </i> Submit').prop("disabled", false);
        $('#ahmgawpm001_save_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
    }
};

// SAVE FUNCTION REQUEST KONTRAKTOR
function ahmgawpm001_save_request_kontraktor(obj) {
    var tableAreaProject = $('#ahmgawpm001_area_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    var tablePersonnel = $('#ahmgawpm001_personnel_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    var tableTool = $('#ahmgawpm001_tool_request_kontraktor_table', ahmgawpm001).bootstrapTable('getData');
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_request_kontraktor', 'required');
    if ($("#ahmgawpm001_ordering_type_request_kontraktor", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_request_kontraktor', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_request_kontraktor', 'required');
    }

    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_detail_proyek_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_request_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_request_kontraktor', 'required');
    $("#ahmgawpm001_kategori_izin_kerja_request_kontraktor", ahmgawpm001).val("Izin Kerja Proyek");
    if ($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() <= $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val()) {
        if (tableAreaProject.length > 0 && tablePersonnel.length > 0 && tableTool.length > 0) {
            setTimeout(function () {
                if (_fw_validation_validate(ahmgawpm001)) {

                    let data = new Object();
                    data.kontraktor = new Object();
                    data.status = new Array();
                    data.status = ['01-IKP'];
                    varStartTanggalPekerjaan = null;
                    if ($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
                        varStartTanggalPekerjaan = moment($("#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                    }
                    varEndTanggalPekerjaan = null;
                    if ($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val() != "") {
                        varEndTanggalPekerjaan = moment($("#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                    }

                    data.kontraktor = {
                        detailProyek: $("#ahmgawpm001_detail_proyek_request_kontraktor", ahmgawpm001).val(),
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_request_kontraktor", ahmgawpm001).val(),
                        startTanggalPekerjaan: varStartTanggalPekerjaan,
                        endTanggalPekerjaan: varEndTanggalPekerjaan,
                        namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_request_kontraktor", ahmgawpm001).val(),
                        nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor", ahmgawpm001).val(),
                        namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_request_kontraktor", ahmgawpm001).val(),
                        nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor", ahmgawpm001).val(),
                        // remarks: $("#ahmgawpm001_remarks_request_kontraktor", ahmgawpm001).val(),
                    };

                    let stringData = JSON.stringify(data);
                    let jsonSendString = JSON.parse(stringData);
                    let validateResult = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-kontraktor",
                        jsonSendString,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                                $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully saved");
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResult = false;
                            }
                        }
                    );

                    if (validateResult) {
                        $("#ahmgawpm001_area_request_kontraktor_table", ahmgawpm001).bootstrapTable('removeAll');
                        _fw_validation_clear($("#ahmgawpm001_halaman_request_kontraktor_controller"));
                        _fw_reset_subpage($("#ahmgawpm001_halaman_request_kontraktor_controller"));
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Save').prop("disabled", false);
                        $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", false);
                        $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
                        _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                        listIkpIdChecked = new Array();
                    }

                } else {
                    $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                    $(window).scrollTop("0");
                    thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Save').prop("disabled", false);
                    $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", false);
                    $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
                }
            }, 3000);
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Area Project, Alat, dan Personnel");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
            thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Save').prop("disabled", false);
            $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
        }
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Start Date tidak boleh diatas End Date");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
        $(window).scrollTop("0");
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Save').prop("disabled", false);
        $('#ahmgawpm001_submit_request_kontraktor', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_request_kontraktor', ahmgawpm001).attr("disabled", false);
    }




};
// SUBMIT FUNCTION EDIT KONTRAKTOR
function ahmgawpm001_submit_edit_kontraktor(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#ahmgawpm001_save_edit_kontraktor', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_kontraktor', 'required');
    if ($("#ahmgawpm001_ordering_type_edit_kontraktor", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_edit_kontraktor', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_edit_kontraktor', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_edit_kontraktor', 'required');
    var indexArea = $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_edit_kontraktor", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (indexArea < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.kontraktor = new Object();
                data.status = ['02-IKP', '03-IKP'];
                varStartTanggalPekerjaan = null;
                if ($("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != "") {
                    varStartTanggalPekerjaan = moment($("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }
                varEndTanggalPekerjaan = null;
                if ($("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != "") {
                    varEndTanggalPekerjaan = moment($("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }

                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_edit_kontraktor", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_kontraktor", ahmgawpm001).val(),
                    startTanggalPekerjaan: varStartTanggalPekerjaan,
                    endTanggalPekerjaan: varEndTanggalPekerjaan,
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_edit_kontraktor", ahmgawpm001).val(),
                };

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-kontraktor",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );


                if (validateResult) {
                    $('#ahmgawpm001_save_edit_kontraktor', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_edit_kontraktor_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_kontraktor_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Submit').prop("disabled", false);
        $('#ahmgawpm001_save_edit_kontraktor', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", false);
    }, 1000);
};

// SAVE FUNCTION EDIT KONTRAKTOR
function ahmgawpm001_save_edit_kontraktor(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $('#ahmgawpm001_submit_edit_kontraktor', ahmgawpm001).prop("disabled", true);
    $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_kontraktor', 'required');
    if ($("#ahmgawpm001_ordering_type_edit_kontraktor", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_edit_kontraktor', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_edit_kontraktor', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_edit_kontraktor', 'required');
    var indexArea = $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_edit_kontraktor", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (indexArea < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.kontraktor = new Object();
                data.status = ['01-IKP'];
                varStartTanggalPekerjaan = null;
                if ($("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != "") {
                    varStartTanggalPekerjaan = moment($("#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }
                varEndTanggalPekerjaan = null;
                if ($("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != null && $("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val() != "") {
                    varEndTanggalPekerjaan = moment($("#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY')
                }

                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_edit_kontraktor", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_kontraktor", ahmgawpm001).val(),
                    startTanggalPekerjaan: varStartTanggalPekerjaan,
                    endTanggalPekerjaan: varEndTanggalPekerjaan,
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_edit_kontraktor", ahmgawpm001).val(),
                };

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-kontraktor",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully saved");
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );


                if (validateResult) {
                    $('#ahmgawpm001_submit_edit_kontraktor', ahmgawpm001).prop("disabled", false);
                    $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_edit_kontraktor_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_edit_kontraktor_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_kontraktor_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
        $('#ahmgawpm001_submit_edit_kontraktor', ahmgawpm001).prop("disabled", false);
        $('#ahmgawpm001_cancel_edit_kontraktor', ahmgawpm001).prop("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION RENEW KONTRAKTOR
function ahmgawpm001_submit_renew_kontraktor(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Renewing...').prop("disabled", true);
    $('#ahmgawpm001_cancel_renew_kontraktor', ahmgawpm001).prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_renew_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_renew_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_kontraktor', 'required');
    if ($("#ahmgawpm001_ordering_type_renew_kontraktor", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_renew_kontraktor', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_renew_kontraktor', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_kontraktor', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_renew_kontraktor', 'required');
    var indexArea = $("#ahmgawpm001_area_renew_kontraktor_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_renew_kontraktor", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (indexArea < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.listAreaProject = new Array();
                data.listPersonnel = new Array();
                data.listTool = new Array();
                data.kontraktor = new Object();
                data.status = ['01-IKP'];

                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_renew_kontraktor", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(),
                    startTanggalPekerjaan: moment($("#ahmgawpm001_start_tanggal_pekerjaan_renew_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY'),
                    endTanggalPekerjaan: moment($("#ahmgawpm001_end_tanggal_pekerjaan_renew_kontraktor", ahmgawpm001).val()).format('DD-MM-YYYY'),
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_renew_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_kontraktor", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_renew_kontraktor", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_kontraktor", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_renew_kontraktor", ahmgawpm001).val(),
                };

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_renew_kontraktor",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_renew_kontraktor",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_renew_kontraktor",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_renew_kontraktor", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_renew_kontraktor",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_nomor_spk_renew_kontraktor", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_kontraktor", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_renew_kontraktor", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_id_supplier_renew_kontraktor", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_renew_kontraktor", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_plant_id_renew_kontraktor", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_nrp_pic_renew_kontraktor", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_renew_kontraktor", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_nomor_po_renew_kontraktor", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_kontraktor", ahmgawpm001).val(),
                };

                oldAreaProject = new Array();
                areaProject = new Object();
                let stringDataArea = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringArea = JSON.parse(stringDataArea);
                let validateResultArea = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-areaproject-by-id",
                    jsonSendStringArea,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldAreaProject = ret.data;
                            for (let i = 0; i < oldAreaProject.length; i++) {
                                areaProject = {
                                    indoorOutdoor: oldAreaProject[i].indoorOutdoor,
                                    areaDetail: oldAreaProject[i].areaDetail,
                                    criticality: oldAreaProject[i].criticality,
                                    taskListTitle: oldAreaProject[i].taskListTitle,
                                }
                                areaProject.primaryKey = {
                                    assetNo: oldAreaProject[i].nomorAsset,
                                }
                                data.listAreaProject.push(areaProject);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultArea = false;
                        }
                    }
                );

                oldPersonnel = new Array();
                personnel = new Object();
                let stringDataPersonnel = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringPersonnel = JSON.parse(stringDataPersonnel);
                let validateResultPersonnel = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-personnel-by-id",
                    jsonSendStringPersonnel,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldPersonnel = ret.data;
                            for (let i = 0; i < oldPersonnel.length; i++) {
                                personnel = {
                                    tipeTugas: oldPersonnel[i].tipeTugas,
                                    namaKontraktor: oldPersonnel[i].namaKontraktor,
                                    nomorSertifikasi: oldPersonnel[i].nomorSertifikasi,
                                }
                                personnel.primaryKey = {
                                    vnik: oldPersonnel[i].nikPasporKontraktor,
                                }
                                data.listPersonnel.push(personnel);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultPersonnel = false;
                        }
                    }
                );

                oldTool = new Array();
                tool = new Object();
                let stringDataTool = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringTool = JSON.parse(stringDataTool);
                let validateResultTool = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-tool-by-id",
                    jsonSendStringTool,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldTool = ret.data;
                            for (let i = 0; i < oldTool.length; i++) {
                                tool = {
                                    deskripsiAlat: oldTool[i].deskripsiAlat,
                                    permitFlag: oldTool[i].permitFlag,
                                    permitType: oldTool[i].permitType,
                                    serialNumber: oldTool[i].serialNumber,
                                    nomorIzin: oldTool[i].nomorIzin,
                                    effectiveDateFrom: moment(oldTool[i].effectiveDateFrom).format('DD-MM-YYYY'),
                                    effectiveDateTo: moment(oldTool[i].effectiveDateTo).format('DD-MM-YYYY'),
                                }
                                tool.primaryKey = {
                                    vikptoolsid: oldTool[i].ikpToolsId,
                                }
                                data.listTool.push(tool);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultTool = false;
                        }
                    }
                );

                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/create-ikp",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            renewedNoIkp = ret.data[0].vnoikp;
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );

                let stringMessage = "";
                let dataReject = new Object();
                dataReject.vikpid = $("#ahmgawpm001_nomor_ikp_renew_kontraktor", ahmgawpm001).val();
                let stringDataReject = JSON.stringify(dataReject);
                let jsonSendStringReject = JSON.parse(stringDataReject);
                let validateResultReject = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/reject-ikp",
                    jsonSendStringReject,
                    function (retReject) {
                        if (retReject.status == "1") {
                            _fw_setMessage(retReject.status, retReject.message.res);

                            var index = listIkpIdChecked.indexOf(retReject.data[0].vnoikp);
                            if (index !== -1) {
                                listIkpIdChecked.splice(index, 1);
                            }
                            stringMessage = "<p>" + retReject.data[0].vnoikp + " telah direnew menjadi " + renewedNoIkp + "</p>";
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully renewed");
                            $('#ahmgawpm001_notification_modal_submessage').val(stringMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (retReject.status == "0") {
                            _fw_setMessage(
                                retReject.status,
                                retReject.message.message + ": " + retReject.message.res
                            );
                            validateResultReject = false;
                        }
                    }
                );

                if (validateResult && validateResultArea && validateResultPersonnel && validateResultTool && validateResultReject) {
                    $('#ahmgawpm001_cancel_renew_kontraktor', ahmgawpm001).prop("disabled", false);
                    $("#ahmgawpm001_area_renew_kontraktor_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_renew_kontraktor_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_renew_kontraktor_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Renew').prop("disabled", false);
        $('#ahmgawpm001_cancel_renew_kontraktor', ahmgawpm001).prop("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION APPROVE DEPT HEAD
function ahmgawpm001_submit_approve_dept_head(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Approving...').prop("disabled", true);
    $('#ahmgawpm001_reject_button_dept_head', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", true);
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {

            let dataApprove = new Object();

            if (roleGlobal == "deptHead") {
                dataApprove.status = ["03-IKP"];
            }
            listVikpid = new Array();
            listVikpid.push($("#ahmgawpm001_nomor_ikp_approve_dept_head", ahmgawpm001).val());

            dataApprove.listVikpid = listVikpid;

            dataApprove.kontraktor = new Object();

            dataApprove.kontraktor.remarks = $("#ahmgawpm001_remarks_approve_dept_head", ahmgawpm001).val();
            let stringDataApprove = JSON.stringify(dataApprove);
            let jsonSendStringApprove = JSON.parse(stringDataApprove);
            let validateResultApprove = true;
            _fw_post(
                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                jsonSendStringApprove,
                function (retApprove) {
                    if (retApprove.status == "1") {
                        _fw_setMessage(retApprove.status, retApprove.message.res);
                        $('#ahmgawpm001_notification_modal_submessage').val(retApprove.data[0].vnoikp);
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully approved");
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }

                    if (retApprove.status == "0") {
                        _fw_setMessage(
                            retApprove.status,
                            retApprove.message.message + ": " + retApprove.message.res
                        );
                        validateResultApprove = false;
                        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve').prop("disabled", false);
                        $('#ahmgawpm001_reject_button_dept_head', ahmgawpm001).attr("disabled", false);
                    }
                }
            );

            if (validateResultApprove) {
                $("#ahmgawpm001_area_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_personnel_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_tool_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                _fw_validation_clear($("#ahmgawpm001_halaman_approve_dept_head"));
                _fw_reset_subpage($("#ahmgawpm001_halaman_approve_dept_head"));
                $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                    "refresh"
                );
                $('#ahmgawpm001_reject_button_dept_head', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", false);
                _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                listIkpIdChecked = new Array();
            }

        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve').prop("disabled", false);
        $('#ahmgawpm001_reject_button_dept_head', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION REJECT DEPT HEAD
function ahmgawpm001_submit_reject_dept_head(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Rejecting...').prop("disabled", true);
    $('#ahmgawpm001_approve_button_dept_head', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", true);
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {

            let dataApprove = new Object();
            dataApprove.vikpid = $("#ahmgawpm001_nomor_ikp_approve_dept_head", ahmgawpm001).val();

            dataApprove.kontraktor = new Object();

            dataApprove.kontraktor.remarks = $("#ahmgawpm001_remarks_approve_dept_head", ahmgawpm001).val();
            let stringDataApprove = JSON.stringify(dataApprove);
            let jsonSendStringApprove = JSON.parse(stringDataApprove);
            let validateResultApprove = true;
            _fw_post(
                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/reject-ikp",
                jsonSendStringApprove,
                function (retApprove) {
                    if (retApprove.status == "1") {
                        _fw_setMessage(retApprove.status, retApprove.message.res);
                        $('#ahmgawpm001_notification_modal_submessage').val(retApprove.data[0].vnoikp);
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully rejected");
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }

                    if (retApprove.status == "0") {
                        _fw_setMessage(
                            retApprove.status,
                            retApprove.message.message + ": " + retApprove.message.res
                        );
                        validateResultApprove = false;
                    }
                }
            );

            if (validateResultApprove) {
                $("#ahmgawpm001_area_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_personnel_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_tool_approve_dept_head_table", ahmgawpm001).bootstrapTable('removeAll');
                _fw_validation_clear($("#ahmgawpm001_halaman_approve_dept_head"));
                _fw_reset_subpage($("#ahmgawpm001_halaman_approve_dept_head"));
                $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                    "refresh"
                );
                $('#ahmgawpm001_approve_button_dept_head', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", false);
                _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                listIkpIdChecked = new Array();
            }

        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-remove fg-white"> </i> Reject').prop("disabled", false);
        $('#ahmgawpm001_approve_button_dept_head', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_button_dept_head', ahmgawpm001).attr("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION EDIT ADMIN
function ahmgawpm001_submit_edit_admin(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_edit_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_edit_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_edit_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_admin', 'required');
    if ($("#ahmgawpm001_ordering_type_edit_admin", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_edit_admin', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_edit_admin', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_edit_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_edit_admin', 'required');
    var indexArea = $("#ahmgawpm001_area_edit_admin_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_edit_admin", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (indexArea < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.kontraktor = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.kontraktor = new Object();
                data.projectOwner = new Object();
                data.status = ['08-IKP'];

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_edit_admin",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_edit_admin",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_edit_admin",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_edit_admin", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_edit_admin",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_nomor_spk_edit_admin", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_edit_admin", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_supplier_id_edit_admin", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_edit_admin", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_edit_admin", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_nrp_pic_edit_admin", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_edit_admin", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_nomor_po_edit_admin", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_edit_admin", ahmgawpm001).val(),
                };



                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResultEhs = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-ehscontroller",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully saved");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultEhs = false;
                        }
                    }
                );

                varStartTanggalPekerjaan = null;
                if ($("#ahmgawpm001_start_tanggal_pekerjaan_edit_admin", ahmgawpm001).val() != null && $("#ahmgawpm001_start_tanggal_pekerjaan_edit_admin", ahmgawpm001).val() != "") {
                    varStartTanggalPekerjaan = moment($("#ahmgawpm001_start_tanggal_pekerjaan_edit_admin", ahmgawpm001).val()).format('DD-MM-YYYY')
                }
                varEndTanggalPekerjaan = null;
                if ($("#ahmgawpm001_end_tanggal_pekerjaan_edit_admin", ahmgawpm001).val() != null && $("#ahmgawpm001_end_tanggal_pekerjaan_edit_admin", ahmgawpm001).val() != "") {
                    varEndTanggalPekerjaan = moment($("#ahmgawpm001_end_tanggal_pekerjaan_edit_admin", ahmgawpm001).val()).format('DD-MM-YYYY')
                }
                data.status = ['01-IKP'];
                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_edit_admin", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val(),
                    startTanggalPekerjaan: varStartTanggalPekerjaan,
                    endTanggalPekerjaan: varEndTanggalPekerjaan,
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_edit_admin", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_edit_admin", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_edit_admin", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_edit_admin", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_edit_admin", ahmgawpm001).val(),
                };

                stringData = JSON.stringify(data);
                jsonSendString = JSON.parse(stringData);
                let validateResultKontraktor = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-kontraktor",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultKontraktor = false;
                        }
                    }
                );

                data.projectOwner = {
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_edit_admin", ahmgawpm001).val(),
                    penanggungJawabLimbah: $("#ahmgawpm001_penanggung_jawab_limbah_edit_admin", ahmgawpm001).val(),
                    lokasiPembuanganLimbah: $("#ahmgawpm001_lokasi_pembuangan_limbah_edit_admin", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_edit_admin", ahmgawpm001).val(),
                };


                stringData = JSON.stringify(data);
                jsonSendString = JSON.parse(stringData);
                let validateResultProjectOwner = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-projectowner",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultProjectOwner = false;
                        }
                    }
                );


                if (validateResultEhs && validateResultKontraktor && validateResultProjectOwner) {
                    $("#ahmgawpm001_area_edit_admin_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_edit_admin_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_edit_admin_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION RENEW ADMIN
function ahmgawpm001_submit_renew_admin(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Renewing...').prop("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_login_patrol_renew_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_renew_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_renew_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_admin', 'required');
    if ($("#ahmgawpm001_ordering_type_renew_admin", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_renew_admin', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_renew_admin', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_renew_admin', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_renew_admin', 'required');
    var indexArea = $("#ahmgawpm001_area_renew_admin_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_renew_admin", ahmgawpm001).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {
            if (indexArea < 1) {
                $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
            } else {
                let data = new Object();
                data.ehsController = new Object();
                data.lovPic = new Object();
                data.lovSupplier = new Object();
                data.lovPo = new Object();
                data.lovPlant = new Object();
                data.listAreaProject = new Array();
                data.listPersonnel = new Array();
                data.listTool = new Array();
                data.listSpesifikasiPekerjaan = new Array();
                data.kontraktor = new Object();
                data.status = ['00-IKP'];

                data.kontraktor = {
                    detailProyek: $("#ahmgawpm001_detail_proyek_renew_admin", ahmgawpm001).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    startTanggalPekerjaan: moment($("#ahmgawpm001_start_tanggal_pekerjaan_renew_admin", ahmgawpm001).val()).format('DD-MM-YYYY'),
                    endTanggalPekerjaan: moment($("#ahmgawpm001_end_tanggal_pekerjaan_renew_admin", ahmgawpm001).val()).format('DD-MM-YYYY'),
                    namaPengawasProyek: $("#ahmgawpm001_nama_pengawas_proyek_renew_admin", ahmgawpm001).val(),
                    nomorHpPengawasProyek: $("#ahmgawpm001_nomor_hp_pengawas_proyek_renew_admin", ahmgawpm001).val(),
                    namaPengawasLk3: $("#ahmgawpm001_nama_pengawas_lk3_renew_admin", ahmgawpm001).val(),
                    nomorHpPengawasLk3: $("#ahmgawpm001_nomor_hp_pengawas_lk3_renew_admin", ahmgawpm001).val(),
                    remarks: $("#ahmgawpm001_remarks_renew_admin", ahmgawpm001).val(),
                };

                data.ehsController = {
                    kategoriIzinKerja: $(
                        "#ahmgawpm001_kategori_izin_kerja_renew_admin",
                        ahmgawpm001
                    ).val(),
                    nomorIkp: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    nomorPengajuanLk3: $(
                        "#ahmgawpm001_nomor_pengajuan_lk3_renew_admin",
                        ahmgawpm001
                    ).val(),
                    kategoriPekerjaan: $(
                        "#ahmgawpm001_kategori_pekerjaan_renew_admin",
                        ahmgawpm001
                    ).val(),
                    orderingType: $("#ahmgawpm001_ordering_type_renew_admin", ahmgawpm001).val(),
                    purchasingOrganization: $(
                        "#ahmgawpm001_purchasing_organization_renew_admin",
                        ahmgawpm001
                    ).val(),
                    nomorSpk: $("#ahmgawpm001_nomor_spk_renew_admin", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(),
                    loginPatrol: $("#ahmgawpm001_login_patrol_renew_admin", ahmgawpm001).val(),
                };

                data.lovSupplier = {
                    idSupplier: $("#ahmgawpm001_id_supplier_renew_admin", ahmgawpm001).val(),
                    namaSupplier: $("#ahmgawpm001_nama_supplier_renew_admin", ahmgawpm001).val(),
                };

                data.lovPlant = {
                    plantVar2: $("#ahmgawpm001_id_plant_renew_admin", ahmgawpm001).val(),
                };

                data.lovPic = {
                    nrpPic: $("#ahmgawpm001_nrp_pic_renew_admin", ahmgawpm001).val(),
                    namaPic: $("#ahmgawpm001_nama_pic_renew_admin", ahmgawpm001).val(),
                };

                data.lovPo = {
                    nomorPo: $("#ahmgawpm001_nomor_po_renew_admin", ahmgawpm001).val(),
                    deskripsiItem: $("#ahmgawpm001_deskripsi_item_renew_admin", ahmgawpm001).val(),
                };

                oldAreaProject = new Array();
                areaProject = new Object();
                let stringDataArea = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringArea = JSON.parse(stringDataArea);
                let validateResultArea = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-areaproject-by-id",
                    jsonSendStringArea,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldAreaProject = ret.data;
                            for (let i = 0; i < oldAreaProject.length; i++) {
                                areaProject = {
                                    indoorOutdoor: oldAreaProject[i].indoorOutdoor,
                                    areaDetail: oldAreaProject[i].areaDetail,
                                    criticality: oldAreaProject[i].criticality,
                                    taskListTitle: oldAreaProject[i].taskListTitle,
                                }
                                areaProject.primaryKey = {
                                    assetNo: oldAreaProject[i].nomorAsset,
                                }
                                data.listAreaProject.push(areaProject);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultArea = false;
                        }
                    }
                );

                oldPersonnel = new Array();
                personnel = new Object();
                let stringDataPersonnel = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringPersonnel = JSON.parse(stringDataPersonnel);
                let validateResultPersonnel = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-personnel-by-id",
                    jsonSendStringPersonnel,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldPersonnel = ret.data;
                            for (let i = 0; i < oldPersonnel.length; i++) {
                                personnel = {
                                    tipeTugas: oldPersonnel[i].tipeTugas,
                                    namaKontraktor: oldPersonnel[i].namaKontraktor,
                                    nomorSertifikasi: oldPersonnel[i].nomorSertifikasi,
                                }
                                personnel.primaryKey = {
                                    vnik: oldPersonnel[i].nikPasporKontraktor,
                                }
                                data.listPersonnel.push(personnel);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultPersonnel = false;
                        }
                    }
                );

                oldTool = new Array();
                tool = new Object();
                let stringDataTool = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "assetNo",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringTool = JSON.parse(stringDataTool);
                let validateResultTool = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-tool-by-id",
                    jsonSendStringTool,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldTool = ret.data;
                            for (let i = 0; i < oldTool.length; i++) {
                                tool = {
                                    deskripsiAlat: oldTool[i].deskripsiAlat,
                                    permitFlag: oldTool[i].permitFlag,
                                    permitType: oldTool[i].permitType,
                                    serialNumber: oldTool[i].serialNumber,
                                    nomorIzin: oldTool[i].nomorIzin,
                                    effectiveDateFrom: moment(oldTool[i].effectiveDateFrom).format('DD-MM-YYYY'),
                                    effectiveDateTo: moment(oldTool[i].effectiveDateTo).format('DD-MM-YYYY'),
                                }
                                tool.primaryKey = {
                                    vikptoolsid: oldTool[i].ikpToolsId,
                                }
                                data.listTool.push(tool);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultTool = false;
                        }
                    }
                );

                oldSpesifikasi = new Array();
                spesifikasi = new Object();
                let stringDataSpesifikasi = JSON.stringify({
                    paging: {
                        order: "asc",
                        sort: "kodePekerjaan",
                    },
                    primaryKey: {
                        vikpid: $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val(),
                    }
                });
                let jsonSendStringSpesifikasi = JSON.parse(stringDataSpesifikasi);
                let validateResultSpesifikasi = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/get-spesifikasi-by-id",
                    jsonSendStringSpesifikasi,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            oldSpesifikasi = ret.data;
                            for (let i = 0; i < oldSpesifikasi.length; i++) {
                                spesifikasi = {
                                    ketentuanProses: oldSpesifikasi[i].ketentuanProses,
                                    ketentuanSertifikasi: oldSpesifikasi[i].ketentuanSertifikasi,
                                    keteranganItemProject: oldSpesifikasi[i].keteranganItemProject,
                                    groupingItemLevel1: oldSpesifikasi[i].groupingItemLevel1,
                                    groupingItemLevel2: oldSpesifikasi[i].groupingItemLevel2,
                                    groupingItemLevel3: oldSpesifikasi[i].groupingItemLevel3,
                                    ketentuanGeneralSupport: oldSpesifikasi[i].ketentuanGeneralSupport,
                                    ketentuanAreaKerja: oldSpesifikasi[i].ketentuanAreaKerja,
                                    ketentuanMonitoringPekerjaan: oldSpesifikasi[i].ketentuanMonitoringPekerjaan,
                                    ketentuanVerifikasiBarang: oldSpesifikasi[i].ketentuanVerifikasiBarang,
                                    ketentuanAlatPemadamApi: oldSpesifikasi[i].ketentuanAlatPemadamApi,
                                    ketentuanHiradcProject: oldSpesifikasi[i].ketentuanHiradcProject,
                                    ketentuanEhs: oldSpesifikasi[i].ketentuanEhs,
                                    ketentuanApd: oldSpesifikasi[i].ketentuanApd,
                                    pembuanganLimbah: oldSpesifikasi[i].pembuanganLimbah,
                                    tanggungJawabLimbah: oldSpesifikasi[i].tanggungJawabLimbah,
                                }
                                spesifikasi.primaryKey = {
                                    kodePekerjaan: oldSpesifikasi[i].kodePekerjaan,
                                }
                                data.listSpesifikasiPekerjaan.push(spesifikasi);
                            }
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResultSpesifikasi = false;
                        }
                    }
                );


                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/create-ikp",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            _fw_setMessage(ret.status, ret.message.res);
                            renewedNoIkp = ret.data[0].vnoikp;
                        }

                        if (ret.status == "0") {
                            _fw_setMessage(
                                ret.status,
                                ret.message.message + ": " + ret.message.res
                            );
                            validateResult = false;
                        }
                    }
                );

                let dataReject = new Object();
                dataReject.vikpid = $("#ahmgawpm001_nomor_ikp_renew_admin", ahmgawpm001).val();
                let stringDataReject = JSON.stringify(dataReject);
                let jsonSendStringReject = JSON.parse(stringDataReject);
                let validateResultReject = true;
                _fw_post(
                    "/jx04/ahmgawpm000-pst/rest/ga/wpm001/reject-ikp",
                    jsonSendStringReject,
                    function (retReject) {
                        if (retReject.status == "1") {
                            _fw_setMessage(retReject.status, retReject.message.res);
                            var index = listIkpIdChecked.indexOf(retReject.data[0].vnoikp);
                            if (index !== -1) {
                                listIkpIdChecked.splice(index, 1);
                            }
                            stringMessage = "<p>" + retReject.data[0].vnoikp + " telah direnew menjadi " + renewedNoIkp + "</p>";
                            $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully renewed");
                            $('#ahmgawpm001_notification_modal_submessage').val(stringMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }

                        if (retReject.status == "0") {
                            _fw_setMessage(
                                retReject.status,
                                retReject.message.message + ": " + retReject.message.res
                            );
                            validateResultReject = false;
                        }
                    }
                );

                if (validateResult && validateResultArea && validateResultPersonnel && validateResultTool && validateResultSpesifikasi && validateResultReject) {
                    $("#ahmgawpm001_area_renew_admin_table", ahmgawpm001).bootstrapTable('removeAll');
                    _fw_validation_clear($("#ahmgawpm001_halaman_renew_admin_controller"));
                    _fw_reset_subpage($("#ahmgawpm001_halaman_renew_admin_controller"));
                    $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                        "refresh"
                    );
                    _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                    listIkpIdChecked = new Array();
                }
            }
        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Renew').prop("disabled", false);
    }, 1000);
};
// SUBMIT FUNCTION EDIT PROJECT OWNER
function ahmgawpm001_submit_upload_project_owner(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#ahmgawpm001_save_upload_project_owner', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_penanggung_jawab_limbah_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner', 'required');
    if ($("#ahmgawpm001_ordering_type_upload_project_owner", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_upload_project_owner', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_upload_project_owner', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_upload_project_owner', 'required');
    var indexArea = $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_upload_project_owner", ahmgawpm001).val("Izin Kerja Proyek");
    if ($("#ahmgawpm001_spesifikasi_upload_project_owner_table", ahmgawpm001).bootstrapTable('getData').length > 0) {
        setTimeout(function () {
            if (_fw_validation_validate(ahmgawpm001)) {
                if (indexArea < 1) {
                    $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                } else {
                    let data = new Object();
                    data.projectOwner = new Object();
                    data.status = new Array();
                    data.status = ['02-IKP'];

                    data.projectOwner = {
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_upload_project_owner", ahmgawpm001).val(),
                        penanggungJawabLimbah: $("#ahmgawpm001_penanggung_jawab_limbah_upload_project_owner", ahmgawpm001).val(),
                        lokasiPembuanganLimbah: $("#ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner", ahmgawpm001).val(),
                        remarks: $("#ahmgawpm001_remarks_upload_project_owner", ahmgawpm001).val(),
                    };


                    stringData = JSON.stringify(data);
                    jsonSendString = JSON.parse(stringData);
                    let validateResultProjectOwner = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-projectowner",
                        jsonSendString,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                                $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully submitted");
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultProjectOwner = false;
                            }
                        }
                    );


                    if (validateResultProjectOwner) {
                        $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001).bootstrapTable('removeAll');
                        _fw_validation_clear($("#ahmgawpm001_halaman_upload_project_owner_controller"));
                        _fw_reset_subpage($("#ahmgawpm001_halaman_upload_project_owner_controller"));
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                        listIkpIdChecked = new Array();
                    }
                }
            } else {
                $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
                $(window).scrollTop("3000");
            }
            thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Submit').prop("disabled", false);
            $('#ahmgawpm001_save_upload_project_owner', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", false);
        }, 1000);
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Tabel Spesifikasi Pekerjaan tidak boleh kosong!");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
        thisContent.html('<i class="glyphicon glyphicon-floppy-disk fg-white"></i> Submit').prop("disabled", false);
        $('#ahmgawpm001_save_upload_project_owner', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", false);
    }
};
// SAVE FUNCTION PROJECT OWNER
function ahmgawpm001_save_upload_project_owner(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Saving...').prop("disabled", true);
    $('#ahmgawpm001_submit_upload_project_owner', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", true);
    $(".has-error", ahmgawpm001).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_id_supplier_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_pengajuan_lk3_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_penanggung_jawab_limbah_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner', 'required');
    if ($("#ahmgawpm001_ordering_type_upload_project_owner", ahmgawpm001).val() == "PO") {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_po_upload_project_owner', 'required');
    } else {
        _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nomor_spk_upload_project_owner', 'required');
    }
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_ordering_type_upload_project_owner', 'required');
    _fw_validation_add(ahmgawpm001, 'ahmgawpm001_nrp_pic_upload_project_owner', 'required');
    var indexArea = $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001).bootstrapTable('getData').length;
    $("#ahmgawpm001_kategori_izin_kerja_upload_project_owner", ahmgawpm001).val("Izin Kerja Proyek");
    if ($("#ahmgawpm001_spesifikasi_upload_project_owner_table", ahmgawpm001).bootstrapTable('getData').length > 0) {
        setTimeout(function () {
            if (_fw_validation_validate(ahmgawpm001)) {
                if (indexArea < 1) {
                    $('#ahmgawpm001_notification_modal_message').val("Data Area tidak boleh kosong!");
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                } else {
                    let data = new Object();
                    data.projectOwner = new Object();
                    data.status = new Array();

                    data.projectOwner = {
                        nomorIkp: $("#ahmgawpm001_nomor_ikp_upload_project_owner", ahmgawpm001).val(),
                        penanggungJawabLimbah: $("#ahmgawpm001_penanggung_jawab_limbah_upload_project_owner", ahmgawpm001).val(),
                        lokasiPembuanganLimbah: $("#ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner", ahmgawpm001).val(),
                        remarks: $("#ahmgawpm001_remarks_upload_project_owner", ahmgawpm001).val(),
                    };


                    stringData = JSON.stringify(data);
                    jsonSendString = JSON.parse(stringData);
                    let validateResultProjectOwner = true;
                    _fw_post(
                        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-ikp-by-projectowner",
                        jsonSendString,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                $('#ahmgawpm001_notification_modal_submessage').val(ret.data[0].vnoikp);
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully saved");
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }

                            if (ret.status == "0") {
                                _fw_setMessage(
                                    ret.status,
                                    ret.message.message + ": " + ret.message.res
                                );
                                validateResultProjectOwner = false;
                            }
                        }
                    );


                    if (validateResultProjectOwner) {
                        $("#ahmgawpm001_area_upload_project_owner_table", ahmgawpm001).bootstrapTable('removeAll');
                        _fw_validation_clear($("#ahmgawpm001_halaman_upload_project_owner_controller"));
                        _fw_reset_subpage($("#ahmgawpm001_halaman_upload_project_owner_controller"));
                        $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                            "refresh"
                        );
                        _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                        listIkpIdChecked = new Array();
                    }
                }
            } else {
                $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                $('#ahmgawpm001_notification_modal').modal('show');
                $(window).scrollTop("3000");
            }
            thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
            $('#ahmgawpm001_submit_upload_project_owner', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", false);
        }, 3000);
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Tabel Spesifikasi Pekerjaan tidak boleh kosong!");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"></i> Save').prop("disabled", false);
        $('#ahmgawpm001_submit_upload_project_owner', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_upload_project_owner', ahmgawpm001).attr("disabled", false);
    }
}
// SUBMIT FUNCTION REJECT EHS OFFICER
function ahmgawpm001_submit_reject_ehs_officer(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Rejecting...').prop("disabled", true);
    $('#ahmgawpm001_approve_button_ehs_officer', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", true);
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {

            let dataReject = new Object();
            dataReject.vikpid = $("#ahmgawpm001_nomor_ikp_approve_ehs_officer", ahmgawpm001).val();

            dataReject.ehsOfficer = new Object();
            dataReject.ehsOfficer.remarks = $("#ahmgawpm001_remarks_approve_ehs_officer", ahmgawpm001).val();
            let stringDataReject = JSON.stringify(dataReject);
            let jsonSendStringReject = JSON.parse(stringDataReject);
            let validateResultReject = true;
            _fw_post(
                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/reject-ikp",
                jsonSendStringReject,
                function (retApprove) {
                    if (retApprove.status == "1") {
                        _fw_setMessage(retApprove.status, retApprove.message.res);
                        $('#ahmgawpm001_notification_modal_submessage').val(retApprove.data[0].vnoikp);
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully rejected");
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }

                    if (retApprove.status == "0") {
                        _fw_setMessage(
                            retApprove.status,
                            retApprove.message.message + ": " + retApprove.message.res
                        );
                        validateResultReject = false;
                    }
                }
            );

            if (validateResultReject) {
                $('#ahmgawpm001_approve_button_ehs_officer', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", false);
                $("#ahmgawpm001_area_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_personnel_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_tool_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                _fw_validation_clear($("#ahmgawpm001_halaman_approve_ehs_officer"));
                _fw_reset_subpage($("#ahmgawpm001_halaman_approve_ehs_officer"));
                $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                    "refresh"
                );
                _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                listIkpIdChecked = new Array();
            }

        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-remove fg-white"> </i> Reject').prop("disabled", false);
        $('#ahmgawpm001_approve_button_ehs_officer', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", false);
    }, 3000);
};
// SUBMIT FUNCTION APPROVE EHS OFFICER
function ahmgawpm001_submit_approve_ehs_officer(obj) {
    _fw_validation_clear(ahmgawpm001);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Approving...').prop("disabled", true);
    $('#ahmgawpm001_reject_button_ehs_officer', ahmgawpm001).attr("disabled", true);
    $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", true);
    setTimeout(function () {
        if (_fw_validation_validate(ahmgawpm001)) {

            let dataApprove = new Object();

            if (roleGlobal == "ehsOfficer") {
                dataApprove.status = ["04-IKP"];
            }

            dataApprove.listVikpid = [$("#ahmgawpm001_nomor_ikp_approve_ehs_officer", ahmgawpm001).val()];

            dataApprove.ehsOfficer = new Object();

            dataApprove.ehsOfficer.remarks = $("#ahmgawpm001_remarks_approve_ehs_officer", ahmgawpm001).val();
            let stringDataApprove = JSON.stringify(dataApprove);
            let jsonSendStringApprove = JSON.parse(stringDataApprove);
            let validateResultApprove = true;
            _fw_post(
                "/jx04/ahmgawpm000-pst/rest/ga/wpm001/approve-ikp",
                jsonSendStringApprove,
                function (retApprove) {
                    if (retApprove.status == "1") {
                        _fw_setMessage(retApprove.status, retApprove.message.res);
                        $('#ahmgawpm001_notification_modal_submessage').val(retApprove.data[0].vnoikp);
                        document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                        $('#ahmgawpm001_notification_modal_message').val("IKP has been successfully approved");
                        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                        $('#ahmgawpm001_notification_modal').modal('show');
                    }

                    if (retApprove.status == "0") {
                        _fw_setMessage(
                            retApprove.status,
                            retApprove.message.message + ": " + retApprove.message.res
                        );
                        validateResultApprove = false;
                        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve').prop("disabled", false);
                        $('#ahmgawpm001_reject_button_ehs_officer', ahmgawpm001).attr("disabled", false);
                        $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", false);
                    }
                }
            );

            if (validateResultApprove) {
                $("#ahmgawpm001_area_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_personnel_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                $("#ahmgawpm001_tool_approve_ehs_officer_table", ahmgawpm001).bootstrapTable('removeAll');
                _fw_validation_clear($("#ahmgawpm001_halaman_approve_ehs_officer"));
                _fw_reset_subpage($("#ahmgawpm001_halaman_approve_ehs_officer"));
                $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable(
                    "refresh"
                );
                $('#ahmgawpm001_reject_button_ehs_officer', ahmgawpm001).attr("disabled", false);
                $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", true);
                _fw_subpage(obj, "ahmgawpm001_halaman_maintain");
                listIkpIdChecked = new Array();
            }

        } else {
            $('#ahmgawpm001_notification_modal_message').val("Harap mengisi data Mandatory*");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
            $(window).scrollTop("0");
        }
        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"> </i> Approve').prop("disabled", false);
        $('#ahmgawpm001_reject_button_ehs_officer', ahmgawpm001).attr("disabled", false);
        $('#ahmgawpm001_cancel_button_ehs_officer', ahmgawpm001).attr("disabled", true);
    }, 3000);
};


// DOWNLOAD IKP BUTTON
function ahmgawpm001_download_ikp(index) {
    params = new Object();
    params.vikpid = $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp;
    $('#ahmgawpm001_notification_modal_message').val("Downloading " + params.vikpid);
    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
    $('#ahmgawpm001_notification_modal').modal('show');
    setTimeout(function () {
        var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/download-ikp?";
        $.each(params, function (keypar, param) {
            exportUrl += '' + keypar + '=' + param + '&';
        });
        exportUrl += 'JXID=' + encodeURIComponent(getJxid())
        _fw_exportToExcel(exportUrl);
        // window.location.href = exportUrl;
        setTimeout(function () {
        }, 3000);
    }, 3000)
}


//-------------------------------------------------------------------------------------------
// SECTOR AREA JAVASCRIPT

// FUNCTION POST BACKEND EDIT/ADD AREA
function ahmgawpm001_post_edit_area(rows) {
    let dataArea = new Array();
    let areaProject = new Object();

    areaProject = {
        indoorOutdoor: rows.indoorOutdoor,
        areaDetail: rows.areaDetail,
        criticality: rows.criticality,
        taskListTitle: rows.taskListTitle,
        loginPatrol: loginPatrolGlobal,
    }
    areaProject.primaryKey = {
        vikpid: vikpidGlobal,
        assetNo: rows.nomorAsset,
    }
    dataArea.push(areaProject)

    let stringDataArea = JSON.stringify(dataArea);
    let jsonSendStringArea = JSON.parse(stringDataArea);
    let validateResultArea = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-area",
        jsonSendStringArea,
        function (retArea) {
            if (retArea.status == "1") {
                _fw_setMessage(retArea.status, retArea.message.res);
            }

            if (retArea.status == "0") {
                _fw_setMessage(
                    retArea.status,
                    retArea.message.message + ": " + retArea.message.res
                );
                validateResultArea = false;
            }
        }
    );
    return validateResultArea;
}
// FUNCTION POST BACKEND DELETE AREA
function ahmgawpm001_post_delete_area(rows) {
    deletedArea = new Object();
    dataDeletedArea = new Array();

    for (let i = 0; i < rows.length; i++) {
        deletedArea = {
            primaryKey: {
                vikpid: vikpidGlobal,
                assetNo: rows[i]
            }
        }
        dataDeletedArea.push(deletedArea);
    }

    let validateResultDeletedArea = true;
    if (dataDeletedArea.length > 0) {
        let stringDataDeletedArea = JSON.stringify(dataDeletedArea);
        let jsonSendStringDeletedArea = JSON.parse(stringDataDeletedArea);
        _fw_post(
            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/delete-area",
            jsonSendStringDeletedArea,
            function (retDeletedArea) {
                if (retDeletedArea.status == "1") {
                    _fw_setMessage(retDeletedArea.status, retDeletedArea.message.res);
                }

                if (retDeletedArea.status == "0") {
                    _fw_setMessage(
                        retDeletedArea.status,
                        retDeletedArea.message.message + ": " + retDeletedArea.message.res
                    );
                    validateResultDeletedArea = false;
                }
            }
        );
    }
    return validateResultDeletedArea;
}
// FUNCTION ADD AREA TO TABLE
function ahmgawpm001_add_area() {
    var rows = [];
    var index = $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length;
    var nomorAsset = $("#ahmgawpm001_nomor_asset_add_area").val();
    var taskListTitle = $("#ahmgawpm001_task_list_title_add_area").val();
    if (nomorAsset != "" && taskListTitle != "") {
        if (index < 6) {
            rows.push({
                nomorAsset: $("#ahmgawpm001_nomor_asset_add_area").val(),
                building: $("#ahmgawpm001_building_add_area").val(),
                floor: $("#ahmgawpm001_floor_add_area").val(),
                sectionLocation: $("#ahmgawpm001_section_location_add_area").val(),
                areaDetail: $("#ahmgawpm001_area_detail_add_area").val(),
                indoorOutdoor: $("#ahmgawpm001_indoor_outdoor_add_area").val(),
                criticality: $("#ahmgawpm001_criticality_add_area").val(),
                taskListTitle: $("#ahmgawpm001_task_list_title_add_area").val(),
            });
            isClientEdited = false;
            if (areaTableNameException.includes(areaTableNameGlobal[0].id)) {
                isClientEdited = true;
            }
            if (isClientEdited) {
                $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('append', rows);
                ahmgawpm001_add_area_revalidate();
                ahmgawpm001_reset_add_modal_area();
            } else {
                $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('append', rows);
                validateResultArea = ahmgawpm001_post_edit_area(rows[0]);
                // REVALIDATE
                if (validateResultArea) {
                    ahmgawpm001_reset_add_modal_area();
                    ahmgawpm001_refresh_table_area();
                    ahmgawpm001_add_area_revalidate();
                }
            }




        } else {
            $('#ahmgawpm001_notification_modal_message').val("Telah mencapai batas maksimal 6 Area yang ditambahkan");
            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
            $('#ahmgawpm001_notification_modal').modal('show');
        }
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Nomor Asset dan Task List tidak boleh kosong!");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
// RESET VALUE ADD AREA MODAL
function ahmgawpm001_reset_add_modal_area() {
    $("#ahmgawpm001_nomor_asset_add_area").val(null);
    $("#ahmgawpm001_building_add_area").val(null);
    $("#ahmgawpm001_floor_add_area").val(null);
    $("#ahmgawpm001_section_location_add_area").val(null);
    $("#ahmgawpm001_area_detail_add_area").val(null);
    $("#ahmgawpm001_criticality_add_area").val(null);
    $("#ahmgawpm001_task_list_title_add_area").val(null);
}
function ahmgawpm001_add_area_revalidate() {
    if (areaTableNameGlobal.id = 'ahmgawpm001_area_add_ehs_table') {
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            $(ahmgawpm001_id_plant_add_ehs_non_lookup_value, ahmgawpm001).val(plantVarGlobal);
            document.getElementById(ahmgawpm001_id_plant_add_ehs_lookup.id).style.display = "none";
            document.getElementById(ahmgawpm001_id_plant_add_ehs_non_lookup.id).style.display = "block";
            $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_save_add_ehs', ahmgawpm001).attr("disabled", false);
        } else {
            document.getElementById(ahmgawpm001_id_plant_add_ehs_lookup.id).style.display = "block";
            document.getElementById(ahmgawpm001_id_plant_add_ehs_non_lookup.id).style.display = "none";
            $('#ahmgawpm001_submit_add_ehs', ahmgawpm001).attr("disabled", true);
            $('#ahmgawpm001_save_add_ehs', ahmgawpm001).attr("disabled", true);
        }
    }
    if (areaTableNameGlobal.id = 'ahmgawpm001_area_edit_ehs_table') {
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).attr("disabled", false);
            $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).attr("disabled", false);
        } else {
            $('#ahmgawpm001_save_edit_ehs', ahmgawpm001).attr("disabled", true);
            $('#ahmgawpm001_submit_edit_ehs', ahmgawpm001).attr("disabled", true);
        }
    }
    if (areaTableNameGlobal.id = 'ahmgawpm001_area_renew_ehs_controller_table') {
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            $(ahmgawpm001_id_plant_renew_ehs_controller_non_lookup_value, ahmgawpm001).val(plantVarGlobal);
            document.getElementById(ahmgawpm001_id_plant_renew_ehs_controller_lookup.id).style.display = "none";
            document.getElementById(ahmgawpm001_id_plant_renew_ehs_controller_non_lookup.id).style.display = "block";
            $('#ahmgawpm001_submit_renew_ehs', ahmgawpm001).attr("disabled", false);
        } else {
            document.getElementById(ahmgawpm001_id_plant_renew_ehs_controller_lookup.id).style.display = "block";
            document.getElementById(ahmgawpm001_id_plant_renew_ehs_controller_non_lookup.id).style.display = "none";
            $('#ahmgawpm001_submit_renew_ehs', ahmgawpm001).attr("disabled", true);
        }
    }
    if (areaTableNameGlobal.id = 'ahmgawpm001_area_edit_admin_table') {
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            $(ahmgawpm001_id_plant_edit_admin_non_lookup_value, ahmgawpm001).val(plantVarGlobal);
            document.getElementById(ahmgawpm001_id_plant_edit_admin_lookup.id).style.display = "none";
            document.getElementById(ahmgawpm001_id_plant_edit_admin_non_lookup.id).style.display = "block";
            $('#ahmgawpm001_submit_edit_admin', ahmgawpm001).attr("disabled", false);
        } else {
            document.getElementById(ahmgawpm001_id_plant_edit_admin_lookup.id).style.display = "block";
            document.getElementById(ahmgawpm001_id_plant_edit_admin_non_lookup.id).style.display = "none";
            $('#ahmgawpm001_submit_edit_admin', ahmgawpm001).attr("disabled", true);
        }
    }
    if (areaTableNameGlobal.id = 'ahmgawpm001_area_renew_admin_table') {
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            $(ahmgawpm001_id_plant_renew_admin_non_lookup_value, ahmgawpm001).val(plantVarGlobal);
            document.getElementById(ahmgawpm001_id_plant_renew_admin_lookup.id).style.display = "none";
            document.getElementById(ahmgawpm001_id_plant_renew_admin_non_lookup.id).style.display = "block";
            $('#ahmgawpm001_submit_renew_admin', ahmgawpm001).attr("disabled", false);
        } else {
            document.getElementById(ahmgawpm001_id_plant_renew_admin_lookup.id).style.display = "block";
            document.getElementById(ahmgawpm001_id_plant_renew_admin_non_lookup.id).style.display = "none";
            $('#ahmgawpm001_submit_renew_admin', ahmgawpm001).attr("disabled", true);
        }
    }
}
// FUNCTION VALIDATE AREA (IF WANT TO ADD ASSET NO PLANT ID MUST EXIST, IF ALREADY ADD AREA = CANNOT CHANGE PLANT)
function ahmgawpm001_add_area_validate(plantId, plantLookup, plantNonLookup, plantNonLookupValue) {
    plantVarGlobal = document.getElementById(plantId.id).value
    if (plantVarGlobal != 0 && plantVarGlobal != null) {
        $('#ahmgawpm001_add_area_modal').modal('show');
        if ($(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length > 0) {
            document.getElementById(plantLookup.id).style.display = "none";
            document.getElementById(plantNonLookup.id).style.display = "block";
            $(plantNonLookupValue, ahmgawpm001).val(plantVarGlobal);
        }
        return true;
    } else {
        document.getElementById(plantLookup.id).style.display = "block";
        document.getElementById(plantNonLookup.id).style.display = "none";
        $('#ahmgawpm001_add_area_modal').modal('hide');
        $('#ahmgawpm001_notification_modal_message').val("Plant Pekerjaan diperlukan sebelum menambah Area");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
        return false;
    }
}
// FUNCTION DELETE ALL AREA FROM TABLE
function ahmgawpm001_delete_all_area_modal() {
    var lengthData = $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length;
    isClientEdited = false;
    if (areaTableNameException.includes(areaTableNameGlobal[0].id)) {
        isClientEdited = true;
    }
    if (isClientEdited) {
        $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('removeAll');
    } else {
        $(areaTableNameGlobal, ahmgawpm001).bootstrapTable('removeAll');
        listUniqueId = new Array();
        listUniqueId.push("deleteAll");
        validateDeletedArea = ahmgawpm001_post_delete_area(listUniqueId);
        if (validateDeletedArea) {
            ahmgawpm001_refresh_table_area();
        }
    }
    ahmgawpm001_add_area_revalidate();
}
// FUNCTION DELETE 1 AREA FROM TABLE
$('#ahmgawpm001_delete_area_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
});
function ahmgawpm001_delete_area_modal() {
    var uniqueId = $(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorAsset;
    listUniqueId = new Array();
    listUniqueId.push(uniqueId);
    isClientEdited = false;
    if (areaTableNameException.includes(areaTableNameGlobal[0].id)) {
        isClientEdited = true;
    }
    if (isClientEdited) {
        $(areaTableNameGlobal).bootstrapTable('removeByUniqueId', uniqueId);
    } else {
        $(areaTableNameGlobal).bootstrapTable('removeByUniqueId', uniqueId);
        validateDeletedArea = ahmgawpm001_post_delete_area(listUniqueId);
        if (validateDeletedArea) {
            ahmgawpm001_refresh_table_area();
        }
    }
    ahmgawpm001_add_area_revalidate();
}
// FUNCTION GENERATE ACTION BUTTON AREA TABLE
function ahmgawpm001_area_action_button(value, row, index) {
    return '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Revise"'
        + 'style="margin-right: 10px">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_edit_area_modal" '
        + 'data-area-table="' + areaTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-edit fg-red"></i>'
        + '</span>'
        + '</span>'
        + '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Delete">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_delete_area_modal" '
        + 'data-area-table="' + areaTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-trash fg-red"></i>'
        + '</span>'
        + '</span>'
}
// RESET VALUE EDIT AREA MODAL
function ahmgawpm001_reset_edit_modal_area() {
    $("#ahmgawpm001_nomor_asset_edit_area").val(null);
    $("#ahmgawpm001_building_edit_area").val(null);
    $("#ahmgawpm001_floor_edit_area").val(null);
    $("#ahmgawpm001_section_location_edit_area").val(null);
    $("#ahmgawpm001_area_detail_edit_area").val(null);
    $("#ahmgawpm001_criticality_edit_area").val(null);
    $("#ahmgawpm001_task_list_title_edit_area").val(null);
}
// FUNCTION EDIT AREA MODAL
$('#ahmgawpm001_edit_area_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
    oldNomorAssetArea = $(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorAsset;
    $("#ahmgawpm001_nomor_asset_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorAsset);
    $("#ahmgawpm001_building_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].building);
    $("#ahmgawpm001_floor_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].floor);
    $("#ahmgawpm001_section_location_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].sectionLocation);
    $("#ahmgawpm001_area_detail_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].areaDetail);
    $("#ahmgawpm001_indoor_outdoor_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].indoorOutdoor);
    $("#ahmgawpm001_criticality_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].criticality);
    $("#ahmgawpm001_task_list_title_edit_area").val($(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].taskListTitle);
});
$('#ahmgawpm001_edit_area_modal').on('hide.bs.modal', function (e) {
    ahmgawpm001_reset_edit_modal_area();
});
function ahmgawpm001_edit_area_modal() {
    isClientEdited = false;
    if (areaTableNameException.includes(areaTableNameGlobal[0].id)) {
        isClientEdited = true;
    }
    if (isClientEdited) {
        var uniqueId = $(areaTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorAsset;
        $(areaTableNameGlobal).bootstrapTable('updateByUniqueId', {
            id: uniqueId,
            row: {
                nomorAsset: $("#ahmgawpm001_nomor_asset_edit_area").val(),
                building: $("#ahmgawpm001_building_edit_area").val(),
                floor: $("#ahmgawpm001_floor_edit_area").val(),
                sectionLocation: $("#ahmgawpm001_section_location_edit_area").val(),
                areaDetail: $("#ahmgawpm001_area_detail_edit_area").val(),
                indoorOutdoor: $("#ahmgawpm001_indoor_outdoor_edit_area").val(),
                criticality: $("#ahmgawpm001_criticality_edit_area").val(),
                taskListTitle: $("#ahmgawpm001_task_list_title_edit_area").val(),
            }
        });
    } else {
        let rows = []
        rows.push({
            nomorAsset: $("#ahmgawpm001_nomor_asset_edit_area").val(),
            building: $("#ahmgawpm001_building_edit_area").val(),
            floor: $("#ahmgawpm001_floor_edit_area").val(),
            sectionLocation: $("#ahmgawpm001_section_location_edit_area").val(),
            areaDetail: $("#ahmgawpm001_area_detail_edit_area").val(),
            indoorOutdoor: $("#ahmgawpm001_indoor_outdoor_edit_area").val(),
            criticality: $("#ahmgawpm001_criticality_edit_area").val(),
            taskListTitle: $("#ahmgawpm001_task_list_title_edit_area").val(),
        });
        validateResultArea = ahmgawpm001_post_edit_area(rows[0]);
        listUniqueId = new Array();
        if (oldNomorAssetArea != rows[0].nomorAsset) {
            listUniqueId.push(oldNomorAssetArea);
            validateDeletedArea = ahmgawpm001_post_delete_area(listUniqueId);
        }
        // REVALIDATE
        if (validateResultArea) {
            ahmgawpm001_reset_add_modal_area();
            ahmgawpm001_add_area_revalidate();
            ahmgawpm001_refresh_table_area();
        }
    }
}
function ahmgawpm001_refresh_table_area() {
    $(areaTableNameGlobal, ahmgawpm001).bootstrapTable(
        "refresh"
    );
}


//-------------------------------------------------------------------------------------------
// SECTOR PERSONNEL JAVASCRIPT
$('#ahmgawpm001_add_personnel_modal').on('show.bs.modal', function (e) {
    ahmgawpm001_check_add_personnel_modal();
});
$('#ahmgawpm001_edit_personnel_modal').on('show.bs.modal', function (e) {
    ahmgawpm001_check_edit_personnel_modal();
});
// FUNCTION POST BACKEND EDIT/ADD PERSONNEL
function ahmgawpm001_post_edit_personnel(rows) {
    let dataPersonnel = new Array();
    let personnel = new Object();

    personnel = {
        tipeTugas: rows.tipeTugas,
        namaKontraktor: rows.namaKontraktor,
        nomorSertifikasi: rows.nomorSertifikasi,
    }
    personnel.primaryKey = {
        vikpid: vikpidGlobal,
        vnik: rows.nikPasporKontraktor,
    }
    dataPersonnel.push(personnel);

    let stringDataPersonnel = JSON.stringify(dataPersonnel);
    let jsonSendStringPersonnel = JSON.parse(stringDataPersonnel);
    let validateResultPersonnel = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-personnel",
        jsonSendStringPersonnel,
        function (retPersonnel) {
            if (retPersonnel.status == "1") {
                _fw_setMessage(retPersonnel.status, retPersonnel.message.res);
            }

            if (retPersonnel.status == "0") {
                _fw_setMessage(
                    retPersonnel.status,
                    retPersonnel.message.message + ": " + retPersonnel.message.res
                );
                validateResultPersonnel = false;
            }
        }
    );
    return validateResultPersonnel;
}
// FUNCTION POST BACKEND DELETE AREA
function ahmgawpm001_post_delete_personnel(rows) {
    deletedPersonnel = new Object();
    dataDeletedPersonnel = new Array();

    for (let i = 0; i < rows.length; i++) {
        deletedPersonnel = {
            primaryKey: {
                vikpid: vikpidGlobal,
                vnik: rows[i]
            }
        }
        dataDeletedPersonnel.push(deletedPersonnel);
    }

    let validateResultDeletedPersonnel = true;
    if (dataDeletedPersonnel.length > 0) {
        let stringDataDeletedPersonnel = JSON.stringify(dataDeletedPersonnel);
        let jsonSendStringDeletedPersonnel = JSON.parse(stringDataDeletedPersonnel);
        _fw_post(
            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/delete-personnel",
            jsonSendStringDeletedPersonnel,
            function (retDeletedPersonnel) {
                if (retDeletedPersonnel.status == "1") {
                    _fw_setMessage(retDeletedPersonnel.status, retDeletedPersonnel.message.res);
                }

                if (retDeletedPersonnel.status == "0") {
                    _fw_setMessage(
                        retDeletedPersonnel.status,
                        retDeletedPersonnel.message.message + ": " + retDeletedPersonnel.message.res
                    );
                    validateResultDeletedPersonnel = false;
                }
            }
        );
    }
    return validateResultDeletedPersonnel;
}
// FUNCTION ADD PERSONNEL TO TABLE
function ahmgawpm001_add_personnel() {
    var rows = [];
    var nikPasporKontraktor = $("#ahmgawpm001_nik_paspor_kontraktor_add").val();
    var namaKontraktor = $("#ahmgawpm001_nama_kontraktor_add").val();
    var nomorSertifikasi = $("#ahmgawpm001_nomor_sertifikasi_add").val();
    var tipeTugas = $("#ahmgawpm001_tipe_tugas_add").val();
    if (nikPasporKontraktor != "" && namaKontraktor != "" && nomorSertifikasi != "" && tipeTugas != "") {
        rows.push({
            nikPasporKontraktor: $("#ahmgawpm001_nik_paspor_kontraktor_add").val(),
            namaKontraktor: $("#ahmgawpm001_nama_kontraktor_add").val(),
            nomorSertifikasi: $("#ahmgawpm001_nomor_sertifikasi_add").val(),
            tipeTugas: $("#ahmgawpm001_tipe_tugas_add").val(),
        });
        validateResultPersonnel = ahmgawpm001_post_edit_personnel(rows[0]);
        if (validateResultPersonnel) {
            ahmgawpm001_reset_add_modal_personnel();
            ahmgawpm001_refresh_table_personnel();
        }
    } else {
        $('#ahmgawpm001_notification_modal_message').val("Data tidak boleh ada yang kosong");
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
function ahmgawpm001_check_add_personnel_modal() {
    if ($("#ahmgawpm001_tipe_tugas_add").val() != "") {
        if ($("#ahmgawpm001_nik_paspor_kontraktor_add").val() != "") {
            if ($("#ahmgawpm001_nama_kontraktor_add").val() != "") {
                if ($("#ahmgawpm001_nomor_sertifikasi_add").val() != "") {
                    $("#ahmgawpm001_submit_modal_add_personnel").prop("disabled", false);
                    return true;
                }
            }
        }
    }
    $("#ahmgawpm001_submit_modal_add_personnel").prop("disabled", true);
}
// RESET VALUE ADD PERSONNEL MODAL
function ahmgawpm001_reset_add_modal_personnel() {
    $("#ahmgawpm001_nik_paspor_kontraktor_add").val(null);
    $("#ahmgawpm001_nama_kontraktor_add").val(null);
    $("#ahmgawpm001_nomor_sertifikasi_add").val(null);
    $("#ahmgawpm001_tipe_tugas_add").val(null);
}
// FUNCTION DELETE ALL PERSONNEL FROM TABLE
function ahmgawpm001_delete_all_personnel_modal() {
    var lengthData = $(personnelTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length;
    if (personnelTableNameGlobal.id == "") {
        $(personnelTableNameGlobal, ahmgawpm001).bootstrapTable('removeAll');
    } else {
        listUniqueId = new Array();
        listUniqueId.push("deleteAll");
        validateDeletedArea = ahmgawpm001_post_delete_personnel(listUniqueId);
        ahmgawpm001_refresh_table_personnel();
    }
}
// FUNCTION DELETE 1 PERSONNEL FROM TABLE
$('#ahmgawpm001_delete_personnel_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
});
function ahmgawpm001_delete_personnel_modal() {
    var uniqueId = $(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].nikPasporKontraktor;
    listUniqueId = new Array();
    listUniqueId.push(uniqueId);
    validateDeletedPersonnel = ahmgawpm001_post_delete_personnel(listUniqueId);
    if (validateDeletedPersonnel) {
        ahmgawpm001_refresh_table_personnel();
    }
}
// FUNCTION GENERATE ACTION BUTTON PERSONNEL TABLE
function ahmgawpm001_personnel_action_button(value, row, index) {
    return '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Revise"'
        + 'style="margin-right: 10px">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_edit_personnel_modal" '
        + 'data-area-table="' + personnelTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-edit fg-red"></i>'
        + '</span>'
        + '</span>'
        + '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Delete">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_delete_personnel_modal" '
        + 'data-area-table="' + personnelTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-trash fg-red"></i>'
        + '</span>'
        + '</span>'
}
// FUNCTION EDIT PERSONNEL MODAL
$('#ahmgawpm001_edit_personnel_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
    oldNikPasporKontraktor = $(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].nikPasporKontraktor;
    $("#ahmgawpm001_nik_paspor_kontraktor_edit").val($(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].nikPasporKontraktor);
    $("#ahmgawpm001_nama_kontraktor_edit").val($(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].namaKontraktor);
    $("#ahmgawpm001_nomor_sertifikasi_edit").val($(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorSertifikasi);
    $("#ahmgawpm001_tipe_tugas_edit").val($(personnelTableNameGlobal).bootstrapTable('getData')[selectedIndex].tipeTugas);
});
function ahmgawpm001_edit_personnel_modal() {
    let rows = [];
    rows.push({
        nikPasporKontraktor: $("#ahmgawpm001_nik_paspor_kontraktor_edit").val(),
        namaKontraktor: $("#ahmgawpm001_nama_kontraktor_edit").val(),
        nomorSertifikasi: $("#ahmgawpm001_nomor_sertifikasi_edit").val(),
        tipeTugas: $("#ahmgawpm001_tipe_tugas_edit").val(),
    });
    validateResultPersonnel = ahmgawpm001_post_edit_personnel(rows[0]);
    listUniqueId = new Array();
    if (oldNikPasporKontraktor != rows[0].nikPasporKontraktor) {
        listUniqueId.push(oldNikPasporKontraktor);
        validateDeletedPersonnel = ahmgawpm001_post_delete_personnel(listUniqueId);
    }
    if (validateResultPersonnel) {
        ahmgawpm001_refresh_table_personnel();
    }
}
function ahmgawpm001_check_edit_personnel_modal() {
    if ($("#ahmgawpm001_tipe_tugas_edit").val() != "") {
        if ($("#ahmgawpm001_nik_paspor_kontraktor_edit").val() != "") {
            if ($("#ahmgawpm001_nama_kontraktor_edit").val() != "") {
                if ($("#ahmgawpm001_nomor_sertifikasi_edit").val() != "") {
                    $("#ahmgawpm001_submit_modal_edit_personnel").prop("disabled", false);
                    return true;
                }
            }
        }
    }
    $("#ahmgawpm001_submit_modal_edit_personnel").prop("disabled", true);
}
function ahmgawpm001_refresh_table_personnel() {
    $(personnelTableNameGlobal, ahmgawpm001).bootstrapTable(
        "refresh"
    );
}


//-------------------------------------------------------------------------------------------
// SECTOR TOOL JAVASCRIPT
$('#ahmgawpm001_add_tool_modal').on('show.bs.modal', function (e) {
    ahmgawpm001_check_add_tool_modal();
});
$('#ahmgawpm001_edit_tool_modal').on('show.bs.modal', function (e) {
    ahmgawpm001_check_edit_tool_modal();
});

// FUNCTION POST BACKEND EDIT/ADD PERSONNEL
function ahmgawpm001_post_edit_tool(rows) {
    let dataTool = new Array();
    let tool = new Object();

    tool = {
        deskripsiAlat: rows.deskripsiAlat,
        permitFlag: rows.permitFlag,
        permitType: rows.permitType,
        serialNumber: rows.serialNumber,
        nomorIzin: rows.nomorIzin,
        effectiveDateFrom: moment(rows.effectiveDateFrom).format('DD-MM-YYYY'),
        effectiveDateTo: moment(rows.effectiveDateTo).format('DD-MM-YYYY'),
    }
    tool.primaryKey = {
        vikpid: vikpidGlobal,
        vikptoolsid: rows.ikpToolsId,
    }
    dataTool.push(tool);

    let stringDataTool = JSON.stringify(dataTool);
    let jsonSendStringTool = JSON.parse(stringDataTool);
    let validateResultTool = true;
    _fw_post(
        "/jx04/ahmgawpm000-pst/rest/ga/wpm001/edit-tool",
        jsonSendStringTool,
        function (retTool) {
            if (retTool.status == "1") {
                _fw_setMessage(retTool.status, retTool.message.res);
            }

            if (retTool.status == "0") {
                _fw_setMessage(
                    retTool.status,
                    retTool.message.message + ": " + retTool.message.res
                );
                validateResultTool = false;
            }
        }
    );
    return validateResultTool;
}
// FUNCTION POST BACKEND DELETE AREA
function ahmgawpm001_post_delete_tool(rows) {
    let dataDeletedTool = new Array();
    let deletedTool = new Object();

    for (let i = 0; i < rows.length; i++) {
        deletedTool = {
            primaryKey: {
                vikpid: vikpidGlobal,
                vikptoolsid: rows[i],
            }
        }
        dataDeletedTool.push(deletedTool);
    }

    let validateResultDeletedTool = true;
    if (dataDeletedTool.length > 0) {
        let stringDataDeletedTool = JSON.stringify(dataDeletedTool);
        let jsonSendStringDeletedTool = JSON.parse(stringDataDeletedTool);
        _fw_post(
            "/jx04/ahmgawpm000-pst/rest/ga/wpm001/delete-tool",
            jsonSendStringDeletedTool,
            function (retDeletedTool) {
                if (retDeletedTool.status == "1") {
                    _fw_setMessage(retDeletedTool.status, retDeletedTool.message.res);
                }

                if (retDeletedTool.status == "0") {
                    _fw_setMessage(
                        retDeletedTool.status,
                        retDeletedTool.message.message + ": " + retDeletedTool.message.res
                    );
                    validateResultDeletedTool = false;
                }
            }
        );
    }
    return validateResultDeletedTool;
}
// FUNCTION ADD TOOL TO TABLE
function ahmgawpm001_add_tool() {
    var rows = [];
    rows.push({
        ikpToolsId: null,
        deskripsiAlat: $("#ahmgawpm001_deskripsi_alat_add").val(),
        permitFlag: $("#ahmgawpm001_permit_flag_add").val(),
        permitType: $("#ahmgawpm001_permit_type_add").val(),
        serialNumber: $("#ahmgawpm001_serial_number_add").val(),
        nomorIzin: $("#ahmgawpm001_nomor_izin_add").val(),
        effectiveDateFrom: $("#ahmgawpm001_effective_date_from_add").val(),
        effectiveDateTo: $("#ahmgawpm001_effective_date_to_add").val(),
    });
    // $(toolTableNameGlobal, ahmgawpm001).bootstrapTable('append', rows);
    ahmgawpm001_post_edit_tool(rows[0]);
    ahmgawpm001_refresh_table_tool();
    ahmgawpm001_reset_add_modal_tool();
}
function ahmgawpm001_check_add_tool_modal() {
    if ($("#ahmgawpm001_deskripsi_alat_add").val() != "") {
        if ($("#ahmgawpm001_permit_flag_add").val() != "") {
            if ($("#ahmgawpm001_permit_type_add").val() != "") {
                if ($("#ahmgawpm001_serial_number_add").val() != "") {
                    if ($("#ahmgawpm001_nomor_izin_add").val() != "") {
                        if ($("#ahmgawpm001_effective_date_from_add").val() != "") {
                            if ($("#ahmgawpm001_effective_date_to_add").val() != "") {
                                var dateTo = Date.parse($("#ahmgawpm001_effective_date_to_add").val());
                                var dateFrom = Date.parse($("#ahmgawpm001_effective_date_from_add").val());
                                if (dateTo > 0 && dateFrom > 0 && dateTo >= dateFrom) {
                                    $("#ahmgawpm001_submit_modal_add_tool").prop("disabled", false);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $("#ahmgawpm001_submit_modal_add_tool").prop("disabled", true);
}
$('#ahmgawpm001_effective_date_from_add_datetimepicker').on("dp.change", function (e) {
    ahmgawpm001_check_add_tool_modal();
});
$('#ahmgawpm001_effective_date_to_add_datetimepicker').on("dp.change", function (e) {
    ahmgawpm001_check_add_tool_modal();
});


// RESET VALUE ADD TOOL MODAL
function ahmgawpm001_reset_add_modal_tool() {
    $("#ahmgawpm001_deskripsi_alat_add").val(null);
    $("#ahmgawpm001_permit_flag_add").val(null);
    $("#ahmgawpm001_permit_type_add").val(null);
    $("#ahmgawpm001_serial_number_add").val(null);
    $("#ahmgawpm001_nomor_izin_add").val(null);
    $("#ahmgawpm001_effective_date_from_add").val(null);
    $("#ahmgawpm001_effective_date_to_add").val(null);
}
// FUNCTION DELETE ALL TOOL FROM TABLE
function ahmgawpm001_delete_all_tool_modal() {
    var lengthData = $(toolTableNameGlobal, ahmgawpm001).bootstrapTable('getData').length;
    if (toolTableNameGlobal == "") {
        $(toolTableNameGlobal, ahmgawpm001).bootstrapTable('removeAll');
    } else {
        listUniqueId = new Array();
        listUniqueId.push("deleteAll");
        validateDeletedArea = ahmgawpm001_post_delete_tool(listUniqueId);
        ahmgawpm001_refresh_table_tool();
    }
}
// FUNCTION DELETE 1 TOOL FROM TABLE
$('#ahmgawpm001_delete_tool_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
});
function ahmgawpm001_delete_tool_modal() {
    var uniqueId = $(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].ikpToolsId;
    listUniqueId = new Array();
    listUniqueId.push(uniqueId);
    validateDeletedTool = ahmgawpm001_post_delete_tool(listUniqueId);
    if (validateDeletedTool) {
        ahmgawpm001_refresh_table_tool();
    }
}
// FUNCTION GENERATE ACTION BUTTON TOOL TABLE
function ahmgawpm001_tool_action_button(value, row, index) {
    return '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Revise"'
        + 'style="margin-right: 10px">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_edit_tool_modal" '
        + 'data-area-table="' + toolTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-edit fg-red"></i>'
        + '</span>'
        + '</span>'
        + '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Delete">'
        + '<span data-toggle="modal" data-target="#ahmgawpm001_delete_tool_modal" '
        + 'data-area-table="' + toolTableNameGlobal + '" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-trash fg-red"></i>'
        + '</span>'
        + '</span>'
}
// FUNCTION EDIT TOOL MODAL
$('#ahmgawpm001_edit_tool_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    selectedIndex = index;
    oldIkpToolsId = $(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].ikpToolsId;
    $("#ahmgawpm001_id_alat_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].ikpToolsId);
    $("#ahmgawpm001_deskripsi_alat_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].deskripsiAlat);
    $("#ahmgawpm001_permit_flag_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].permitFlag);
    $("#ahmgawpm001_permit_type_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].permitType);
    $("#ahmgawpm001_serial_number_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].serialNumber);
    $("#ahmgawpm001_nomor_izin_edit").val($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].nomorIzin);
    $("#ahmgawpm001_effective_date_from_edit").val(moment($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].effectiveDateFrom).format('DD-MMM-YYYY'));
    $("#ahmgawpm001_effective_date_to_edit").val(moment($(toolTableNameGlobal).bootstrapTable('getData')[selectedIndex].effectiveDateTo).format('DD-MMM-YYYY'));
    myDate = $('#ahmgawpm001_effective_date_to_edit').val();
    $('#ahmgawpm001_effective_date_to_edit_datetimepicker').data('DateTimePicker').minDate(moment(myDate));
});
function ahmgawpm001_edit_tool_modal() {
    let rows = [];
    rows.push({
        ikpToolsId: $("#ahmgawpm001_id_alat_edit").val(),
        deskripsiAlat: $("#ahmgawpm001_deskripsi_alat_edit").val(),
        permitFlag: $("#ahmgawpm001_permit_flag_edit").val(),
        permitType: $("#ahmgawpm001_permit_flag_edit").val(),
        tipeTugas: $("#ahmgawpm001_permit_type_edit").val(),
        serialNumber: $("#ahmgawpm001_serial_number_edit").val(),
        nomorIzin: $("#ahmgawpm001_nomor_izin_edit").val(),
        effectiveDateFrom: $("#ahmgawpm001_effective_date_from_edit").val(),
        effectiveDateTo: $("#ahmgawpm001_effective_date_to_edit").val(),
    });
    validateResultTool = ahmgawpm001_post_edit_tool(rows[0]);
    listUniqueId = new Array();
    if (oldIkpToolsId != rows[0].ikpToolsId) {
        listUniqueId.push(oldIkpToolsId);
        validateDeletedTool = ahmgawpm001_post_delete_tool(listUniqueId);
    }
    if (validateResultTool) {
        ahmgawpm001_refresh_table_tool();
    }
}
function ahmgawpm001_check_edit_tool_modal() {
    if ($("#ahmgawpm001_deskripsi_alat_edit").val() != "") {
        if ($("#ahmgawpm001_permit_flag_edit").val() != "") {
            if ($("#ahmgawpm001_permit_type_edit").val() != "") {
                if ($("#ahmgawpm001_serial_number_edit").val() != "") {
                    if ($("#ahmgawpm001_nomor_izin_edit").val() != "") {
                        if ($("#ahmgawpm001_effective_date_from_edit").val() != "") {
                            if ($("#ahmgawpm001_effective_date_to_edit").val() != "") {
                                var dateTo = Date.parse($("#ahmgawpm001_effective_date_to_edit").val());
                                var dateFrom = Date.parse($("#ahmgawpm001_effective_date_from_edit").val());
                                if (dateTo > 0 && dateFrom > 0 && dateTo >= dateFrom) {
                                    $("#ahmgawpm001_submit_modal_edit_tool").prop("disabled", false);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $("#ahmgawpm001_submit_modal_edit_tool").prop("disabled", true);
}
$('#ahmgawpm001_effective_date_from_edit_datetimepicker').on("dp.change", function (e) {
    ahmgawpm001_check_edit_tool_modal();
});
$('#ahmgawpm001_effective_date_to_edit_datetimepicker').on("dp.change", function (e) {
    ahmgawpm001_check_edit_tool_modal();
});
function ahmgawpm001_refresh_table_tool() {
    $(toolTableNameGlobal, ahmgawpm001).bootstrapTable(
        "refresh"
    );
}





function ahmgawpm001_add_tool_filter(params) {
    params = {
        deskripsiAlat: $("#ahmgawpm001_deskripsi_alat_filter", ahmgawpm001).val(),
        permitFlag: $("#ahmgawpm001_permit_flag_filter", ahmgawpm001).val(),
        permitType: $("#ahmgawpm001_permit_type_filter", ahmgawpm001).val(),
        serialNumber: $("#ahmgawpm001_serial_number_filter", ahmgawpm001).val(),
        nomorIzin: $("#ahmgawpm001_nomor_izin_filter", ahmgawpm001).val(),
        effectiveDateFrom: $(
            "#ahmgawpm001_effective_date_from_filter",
            ahmgawpm001
        ).val(),
        effectiveDateTo: $(
            "#ahmgawpm001_effective_date_to_filter",
            ahmgawpm001
        ).val(),
    };
    return params;
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

// CHECKBOX FORMATTER
$("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        console.log(data.data);
        // if (roleGlobal == null || roleGlobal == "") {
        // //    ahmgawpm001check_role();
        //     setTimeout(function () {
        //         $("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable('refresh');
        //     }, 1000);
        // }
    },
    onCheck: function (row, $element) {
        listIkpIdChecked.push(row.nomorIkp);
        listStatusChecked.push(row.status);
        if (listIkpIdChecked.length > 0) {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", false);
        }
    },
    onCheckAll: function (rowsAfter, rowsBefore) {
        for (let i = 0; i < rowsAfter.length; i++) {
            var index = listIkpIdChecked.indexOf(rowsAfter[i].nomorIkp);
            if (index !== -1) {
                listIkpIdChecked.splice(index, 1);
                listStatusChecked.splice(index, 1);
            }
        }
        for (let i = 0; i < rowsAfter.length; i++) {
            listIkpIdChecked.push(rowsAfter[i].nomorIkp);
            listStatusChecked.push(rowsAfter[i].status);
        }
        if (listIkpIdChecked.length > 0) {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", false);
        }
    },
    onUncheck: function (row, $element) {
        var index = listIkpIdChecked.indexOf(row.nomorIkp);
        if (index !== -1) {
            listIkpIdChecked.splice(index, 1);
            listStatusChecked.splice(index, 1);
        }
        if (listIkpIdChecked.length > 0) {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", false);
        } else {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", true);
        }
    },
    onUncheckAll: function (rowsAfter, rowsBefore) {
        for (let i = 0; i < rowsAfter.length; i++) {
            var index = listIkpIdChecked.indexOf(rowsAfter[i].nomorIkp);
            if (index !== -1) {
                listIkpIdChecked.splice(index, 1);
                listStatusChecked.splice(index, 1);
            }
        }
        if (listIkpIdChecked.length > 0) {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", false);
        } else {
            $("#ahmgawpm001_submit_button_maintain").prop("disabled", true);
        }
    }

})

function emptyCheckBoxFormatter(value, row, index) {
    return " ";
}

function stateCheckBoxFormatter(value, row, index) {
    if (roleGlobal == "ehsController") {
        if ($('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].status.includes("Created")) {
            $(this).closest("td").prevObject[0].checkbox = true;
            for (let i = 0; i < listIkpIdChecked.length; i++) {
                if ($("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable('getRowByUniqueId', listIkpIdChecked[i]).nomorIkp == $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp) {
                    return {
                        disabled: false,
                        checked: true
                    }
                }
            }
        } else {
            $(this).closest("td").prevObject[0].checkbox = false;
        }
    }
    if (roleGlobal == "kontraktor") {
        if ($('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].status.includes("Requested") || $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].status.includes("Revision")) {
            $(this).closest("td").prevObject[0].checkbox = true;
            for (let i = 0; i < listIkpIdChecked.length; i++) {
                if ($("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable('getRowByUniqueId', listIkpIdChecked[i]).nomorIkp == $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp) {
                    return {
                        disabled: false,
                        checked: true
                    }
                }
            }
        } else {
            $(this).closest("td").prevObject[0].checkbox = false;
        }
    }
    if (roleGlobal == "admin") {
        if (!$('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].status.includes("Rejected") && !$('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].status.includes("Approved")) {
            $(this).closest("td").prevObject[0].checkbox = true;
            for (let i = 0; i < listIkpIdChecked.length; i++) {
                if ($("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable('getRowByUniqueId', listIkpIdChecked[i]).nomorIkp == $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp) {
                    return {
                        disabled: false,
                        checked: true
                    }
                }
            }
        } else {
            $(this).closest("td").prevObject[0].checkbox = false;
        }

    }
    for (let i = 0; i < listIkpIdChecked.length; i++) {
        if ($("#ahmgawpm001_search_maintain_ikp_table", ahmgawpm001).bootstrapTable('getRowByUniqueId', listIkpIdChecked[i]).nomorIkp == $('#ahmgawpm001_search_maintain_ikp_table').bootstrapTable('getData')[index].nomorIkp) {
            return {
                disabled: false,
                checked: true
            }
        }
    }
}

// INDEX FORMATTER
function ahmgawpm001_index_formatter(value, row, index) {
    return index + 1 + offsetTableGlobal;
}

// INDEX FORMATTER
function ahmgawpm001_index_formatter_local(value, row, index) {
    return index + 1;
}



// DATE FORMATTER
function ahmgawpm001_date_formatter(value, row, index) {
    return moment(value).format('DD-MMM-YYYY')
}


function ahmgawpm001_area_edit_ehs(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_ehs').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}

function ahmgawpm001_area_display_ehs(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_ehs').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}




function ahmgawpm001_area_renew_ehs_controller(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_ehs_controller').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_renew_ehs_controller(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_ehs_controller').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_renew_ehs_controller(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_ehs_controller').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_renew_ehs_controller(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_ehs_controller').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "kodePekerjaan",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}

function ahmgawpm001_area_display_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_display_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_display_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}

function ahmgawpm001_area_display_security(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_security').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_display_security(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_security').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_display_security(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_security').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_display_security(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_display_security').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}



function ahmgawpm001_area_request_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_request_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_request_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_request_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_request_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_request_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}



function ahmgawpm001_area_edit_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_edit_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_edit_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}



function ahmgawpm001_area_renew_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_renew_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_renew_kontraktor(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_kontraktor').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}



function ahmgawpm001_area_approve_dept_head(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_dept_head').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_approve_dept_head(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_dept_head').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_approve_dept_head(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_dept_head').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}


function ahmgawpm001_area_edit_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_edit_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_edit_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_edit_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_edit_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "kodePekerjaan",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}


function ahmgawpm001_area_renew_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_renew_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_renew_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_renew_admin(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_renew_admin').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "kodePekerjaan",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}


function ahmgawpm001_area_upload_project_owner(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_upload_project_owner').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_upload_project_owner(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_upload_project_owner').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_upload_project_owner(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_upload_project_owner').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_upload_project_owner(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_upload_project_owner').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "kodePekerjaan",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}


function ahmgawpm001_area_approve_ehs_officer(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_ehs_officer').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nomorAsset",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_personnel_approve_ehs_officer(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_ehs_officer').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nikPasporKontraktor",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_tool_approve_ehs_officer(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_ehs_officer').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "ikpToolsId",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}
function ahmgawpm001_spesifikasi_approve_ehs_officer(params) {
    params.primaryKey = {
        vikpid: $('#ahmgawpm001_nomor_ikp_approve_ehs_officer').val()
    };
    if (params.sort === undefined) {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "kodePekerjaan",
            order: "asc",
        }
    } else {
        params.paging = {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: params.sort,
            order: params.order,
        }
    }
    offsetTableGlobal = params.offset;
    return params;
}



function ahmgawpm001_set_nomor_ikp_from_plant() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var monthRoman;
    switch (month) {
        case 1:
            monthRoman = "I";
            break;
        case 2:
            monthRoman = "II";
            break;
        case 3:
            monthRoman = "III";
            break;
        case 4:
            monthRoman = "IV";
            break;
        case 5:
            monthRoman = "V";
            break;
        case 6:
            monthRoman = "VI";
            break;
        case 7:
            monthRoman = "VII";
            break;
        case 8:
            monthRoman = "VIII";
            break;
        case 9:
            monthRoman = "IX";
            break;
        case 10:
            monthRoman = "X";
            break;
        case 11:
            monthRoman = "XI";
            break;
        case 12:
            monthRoman = "XII";
            break;
    }
    var year = d.getFullYear();
    $("#ahmgawpm001_nomor_ikp_add_ehs", ahmgawpm001).val(
        "IKP/" +
        $("#ahmgawpm001_id_plant_add_ehs", ahmgawpm001).val() +
        "/" +
        monthRoman +
        "/" +
        year
        +
        "/XXXXX"
    );
    $("#ahmgawpm001_kategori_izin_kerja_add_ehs", ahmgawpm001).val("Izin Kerja Proyek");
}

function ahmgawpm001_upload_spesifikasi_project_owner(obj) {
    _fw_validation_clear(ahmgawpm001);

    var params = new FormData();
    params.append("uploadType", "LIMIT");
    params.append("vikpid", vikpidGlobal);
    params.append("vsewage", $("#ahmgawpm001_lokasi_pembuangan_limbah_upload_project_owner", ahmgawpm001).val());
    params.append("vswrespon", $("#ahmgawpm001_penanggung_jawab_limbah_upload_project_owner", ahmgawpm001).val());
    var emptyFile = true;
    jQuery.each(jQuery('#ahmgawpm001_file_spesifikasi_project_owner')[0].files, function (i, file) {
        params.append('file', file);
        emptyFile = false;
    });
    if (emptyFile === false) {
        $("#ahmgawpm001_upload_spesifikasi_project_owner", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Uploading...').prop("disabled", true);
        $("#ahmgawpm001_batal_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_download_spesifikasi_project_owner", ahmgawpm001).prop("disabled", true);


        setTimeout(function () {
            $("#ahmgawpm001_upload_spesifikasi_project_owner", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
            $("#ahmgawpm001_batal_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
            $("#ahmgawpm001_download_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
            _fw_upload("/jx04/ahmgawpm000-pst/rest/ga/wpm001/upload-spesifikasi", params, function (data) {
                var dataMessage = '';
                if (data != null) {
                    if (data.message) {
                        if (data.message.message) {
                            var dataMessage = data.message.message;
                        } else {
                            var dataMessage = data.message;
                        }
                    }
                }

                if (data != null) {
                    if (data.status == "1") {
                        if (data.data[0]) {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $("#ahmgawpm001_spesifikasi_upload_project_owner_table", ahmgawpm001).bootstrapTable('refresh');
                            $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            _fw_subpage(obj, "ahmgawpm001_halaman_edit_project_owner");
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    } else {
                        if (data.data != null) {
                            if (data.data[0]) {
                                $('#ahmgawpm001_notification_modal_message').val(data.data[0].cellName);
                                $('#ahmgawpm001_notification_modal_submessage').val(data.data[0].description);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            } else {
                                _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                                $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    }
                } else {
                    _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                    $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                }
            });
        }, 3000);
    } else {
        _fw_setMessage(ahmgawpm001, '0', 'Mohon pilih file terlebih dahulu');
        $('#ahmgawpm001_notification_modal_message').val('Mohon pilih file terlebih dahulu');
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
function ahmgawpm001_download_spesifikasi_project_owner(obj) {
    _fw_validation_clear(ahmgawpm001);

    $("#ahmgawpm001_download_spesifikasi_project_owner", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
    $("#ahmgawpm001_batal_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_project_owner", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_project_owner", ahmgawpm001).prop("readonly", true);


    setTimeout(function () {
        var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/download-template-spesifikasi?";
        exportUrl += 'JXID=' + encodeURIComponent(getJxid())
        _fw_exportToExcel(exportUrl);
        $("#ahmgawpm001_download_spesifikasi_project_owner", ahmgawpm001).html('<i class="glyphicon glyphicon-download fg-white"></i> Download Template').prop("disabled", false);
        $("#ahmgawpm001_batal_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_upload_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_project_owner", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_project_owner", ahmgawpm001).prop("readonly", false);
    }, 3000);
}
function ahmgawpm001_batal_upload_spesifikasi_project_owner(obj) {
    _fw_validation_clear(ahmgawpm001);
    _fw_subpage(obj, "ahmgawpm001_halaman_edit_project_owner");
}

function ahmgawpm001_upload_spesifikasi_admin(obj) {
    _fw_validation_clear(ahmgawpm001);

    var params = new FormData();
    params.append("uploadType", "LIMIT");
    params.append("vikpid", vikpidGlobal);
    params.append("vsewage", $("#ahmgawpm001_lokasi_pembuangan_limbah_edit_admin", ahmgawpm001).val());
    params.append("vswrespon", $("#ahmgawpm001_penanggung_jawab_limbah_edit_admin", ahmgawpm001).val());
    var emptyFile = true;
    jQuery.each(jQuery('#ahmgawpm001_file_spesifikasi_admin')[0].files, function (i, file) {
        params.append('file', file);
        emptyFile = false;
    });

    if (emptyFile === false) {
        $("#ahmgawpm001_upload_spesifikasi_admin", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Uploading...').prop("disabled", true);
        $("#ahmgawpm001_batal_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", true);

        setTimeout(function () {
            _fw_upload("/jx04/ahmgawpm000-pst/rest/ga/wpm001/upload-spesifikasi", params, function (data) {
                var dataMessage = '';
                if (data != null) {
                    if (data.message) {
                        if (data.message.message) {
                            dataMessage = data.message.message;
                        } else {
                            dataMessage = data.message;
                        }
                    }
                }

                $("#ahmgawpm001_upload_spesifikasi_admin", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
                $("#ahmgawpm001_batal_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", false);


                if (data != null) {
                    if (data.status == "1") {
                        if (data.data[0]) {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $("#ahmgawpm001_spesifikasi_edit_admin_table", ahmgawpm001).bootstrapTable('refresh');
                            $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            _fw_subpage(obj, "ahmgawpm001_halaman_edit_admin");
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                        }
                    } else {
                        if (data.data != null) {
                            if (data.data[0]) {
                                $("#ahmgawpm001_spesifikasi_edit_admin_table", ahmgawpm001).bootstrapTable('refresh');
                                $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                                _fw_subpage(obj, "ahmgawpm001_halaman_edit_admin");
                            } else {
                                _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                                $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    }
                } else {
                    _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                    $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                }
            });
        }, 100);
    } else {
        _fw_setMessage(ahmgawpm001, '0', 'Mohon pilih file terlebih dahulu');
        $('#ahmgawpm001_notification_modal_message').val('Mohon pilih file terlebih dahulu');
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
function ahmgawpm001_download_spesifikasi_admin(obj) {
    _fw_validation_clear(ahmgawpm001);

    $("#ahmgawpm001_download_spesifikasi_admin", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
    $("#ahmgawpm001_batal_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_admin", ahmgawpm001).prop("disabled", true);


    setTimeout(function () {
        var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/download-template-spesifikasi?";
        exportUrl += 'JXID=' + encodeURIComponent(getJxid())
        _fw_exportToExcel(exportUrl);
        $("#ahmgawpm001_download_spesifikasi_admin", ahmgawpm001).html('<i class="glyphicon glyphicon-download fg-white"></i> Download Template').prop("disabled", false);
        $("#ahmgawpm001_batal_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_upload_spesifikasi_admin", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_admin", ahmgawpm001).prop("disabled", false);
    }, 3000);
}
function ahmgawpm001_batal_upload_spesifikasi_admin(obj) {
    _fw_validation_clear(ahmgawpm001);
    _fw_subpage(obj, "ahmgawpm001_halaman_edit_admin");
}


function ahmgawpm001_upload_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);

    var params = new FormData();
    params.append("uploadType", "LIMIT");
    params.append("vikpid", vikpidGlobal);
    params.append("vsewage", $("#ahmgawpm001_lokasi_pembuangan_limbah_renew_ehs_controller", ahmgawpm001).val());
    params.append("vswrespon", $("#ahmgawpm001_penanggung_jawab_limbah_renew_ehs_controller", ahmgawpm001).val());
    var emptyFile = true;
    jQuery.each(jQuery('#ahmgawpm001_file_spesifikasi_renew_ehs_controller')[0].files, function (i, file) {
        params.append('file', file);
        emptyFile = false;
    });
    if (emptyFile === false) {
        $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Uploading...').prop("disabled", true);
        $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);


        setTimeout(function () {
            $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
            $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
            $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
            _fw_upload("/jx04/ahmgawpm000-pst/rest/ga/wpm001/upload-spesifikasi", params, function (data) {
                var dataMessage = '';
                if (data != null) {
                    if (data.message) {
                        if (data.message.message) {
                            var dataMessage = data.message.message;
                        } else {
                            var dataMessage = data.message;
                        }
                    }
                }

                if (data != null) {
                    if (data.status == "1") {
                        if (data.data[0]) {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $("#ahmgawpm001_spesifikasi_renew_ehs_controller_table", ahmgawpm001).bootstrapTable('refresh');
                            $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            _fw_subpage(obj, "ahmgawpm001_halaman_edit_renew_ehs_controller");
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    } else {
                        if (data.data != null) {
                            if (data.data[0]) {
                                $('#ahmgawpm001_notification_modal_message').val(data.data[0].cellName);
                                $('#ahmgawpm001_notification_modal_submessage').val(data.data[0].description);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                document.getElementById("ahmgawpm001_notification_modal_submessage").innerHTML = $('#ahmgawpm001_notification_modal_submessage').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            } else {
                                _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                                $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    }
                } else {
                    _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                    $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                }
            });
        }, 3000);
    } else {
        _fw_setMessage(ahmgawpm001, '0', 'Mohon pilih file terlebih dahulu');
        $('#ahmgawpm001_notification_modal_message').val('Mohon pilih file terlebih dahulu');
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
function ahmgawpm001_download_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);

    $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
    $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("readonly", true);


    setTimeout(function () {
        var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/download-template-spesifikasi?";
        exportUrl += 'JXID=' + encodeURIComponent(getJxid())
        _fw_exportToExcel(exportUrl);
        $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="glyphicon glyphicon-download fg-white"></i> Download Template').prop("disabled", false);
        $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("readonly", false);
    }, 3000);
}
function ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);
    _fw_subpage(obj, "ahmgawpm001_halaman_edit_renew_ehs_controller");
}

function ahmgawpm001_upload_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);

    var params = new FormData();
    params.append("uploadType", "LIMIT");
    params.append("vikpid", vikpidGlobal);
    params.append("vsewage", $("#ahmgawpm001_lokasi_pembuangan_limbah_renew_ehs_controller", ahmgawpm001).val());
    params.append("vswrespon", $("#ahmgawpm001_penanggung_jawab_limbah_renew_ehs_controller", ahmgawpm001).val());
    var emptyFile = true;
    jQuery.each(jQuery('#ahmgawpm001_file_spesifikasi_renew_ehs_controller')[0].files, function (i, file) {
        params.append('file', file);
        emptyFile = false;
    });
    if (emptyFile === false) {
        $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Uploading...').prop("disabled", true);
        $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
        $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);


        setTimeout(function () {
            $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-upload fg-white mr-10"></i>Upload').prop("disabled", false);
            $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
            $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
            _fw_upload("/jx04/ahmgawpm000-pst/rest/ga/wpm001/upload-spesifikasi", params, function (data) {
                var dataMessage = '';
                if (data != null) {
                    if (data.message) {
                        if (data.message.message) {
                            var dataMessage = data.message.message;
                        } else {
                            var dataMessage = data.message;
                        }
                    }
                }

                if (data != null) {
                    if (data.status == "1") {
                        if (data.data[0]) {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $("#ahmgawpm001_spesifikasi_renew_ehs_controller_table", ahmgawpm001).bootstrapTable('refresh');
                            $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                            _fw_subpage(obj, "ahmgawpm001_halaman_renew_ehs_controller");
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                        }
                    } else {
                        if (data.data != null) {
                            if (data.data[0]) {
                                $("#ahmgawpm001_spesifikasi_renew_ehs_controller_table", ahmgawpm001).bootstrapTable('refresh');
                                $('#ahmgawpm001_notification_modal_message').val("Sukses Upload Spesifikasi");
                                $('#ahmgawpm001_notification_modal').modal('show');
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                _fw_subpage(obj, "ahmgawpm001_halaman_renew_ehs_controller");
                            } else {
                                _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                                $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                                document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                                $('#ahmgawpm001_notification_modal').modal('show');
                            }
                        } else {
                            _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                            $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                            document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                            $('#ahmgawpm001_notification_modal').modal('show');
                        }
                    }
                } else {
                    _fw_setMessage(ahmgawpm001, data.status, dataMessage);
                    $('#ahmgawpm001_notification_modal_message').val(dataMessage);
                    document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
                    $('#ahmgawpm001_notification_modal').modal('show');
                }
            });
        }, 3000);
    } else {
        _fw_setMessage(ahmgawpm001, '0', 'Mohon pilih file terlebih dahulu');
        $('#ahmgawpm001_notification_modal_message').val('Mohon pilih file terlebih dahulu');
        document.getElementById("ahmgawpm001_notification_modal_message").innerHTML = $('#ahmgawpm001_notification_modal_message').val();
        $('#ahmgawpm001_notification_modal').modal('show');
    }
}
function ahmgawpm001_download_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);

    $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
    $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);
    $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", true);


    setTimeout(function () {
        var exportUrl = "/jx04/ahmgawpm000-pst/rest/ga/wpm001/download-template-spesifikasi?";
//        exportUrl += 'JXID=' + encodeURIComponent(getJxid())
        _fw_exportToExcel(exportUrl);
        $("#ahmgawpm001_download_spesifikasi_renew_ehs_controller", ahmgawpm001).html('<i class="glyphicon glyphicon-download fg-white"></i> Download Template').prop("disabled", false);
        $("#ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_upload_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
        $("#ahmgawpm001_file_spesifikasi_renew_ehs_controller", ahmgawpm001).prop("disabled", false);
    }, 3000);
}
function ahmgawpm001_batal_upload_spesifikasi_renew_ehs_controller(obj) {
    _fw_validation_clear(ahmgawpm001);
    _fw_subpage(obj, "ahmgawpm001_halaman_renew_ehs_controller");
}

// DATETIMEPICKER
$('#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor_timepicker').datetimepicker({
    format: 'DD-MMM-YYYY',
    minDate: new Date() - 1,
});
$('#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor_timepicker').datetimepicker({
    format: 'DD-MMM-YYYY',
    minDate: new Date() - 1,
});
$('#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller_timepicker').datetimepicker({
    format: 'DD-MMM-YYYY',
    minDate: new Date() - 1,
});




$('#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor_timepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor_timepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', ahmgawpm001).val()) < moment(myDate) && $('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', ahmgawpm001).val() != "") {
        $('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor', ahmgawpm001).val(moment(myDate).format('DD-MMM-YYYY'));
    }
});
$('#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor_timepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor_timepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val()) < moment(myDate) && $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val() != "") {
        $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val(moment(myDate).format('DD-MMM-YYYY'));
    }
});



$('#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller_timepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_start_tanggal_pekerjaan_renew_ehs_controller').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller_timepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller', ahmgawpm001).val()) < moment(myDate) && $('#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller', ahmgawpm001).val() != "") {
        $('#ahmgawpm001_end_tanggal_pekerjaan_renew_ehs_controller', ahmgawpm001).val(moment(myDate).format('DD-MMM-YYYY'));
    }
});
$('#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor_timepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_start_tanggal_pekerjaan_edit_kontraktor').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor_timepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val()) < moment(myDate) && $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val() != "") {
        $('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor', ahmgawpm001).val(moment(myDate).format('DD-MMM-YYYY'));
    }
});



$('#ahmgawpm001_effective_date_from_add_datetimepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_effective_date_from_add').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_effective_date_to_add_datetimepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_effective_date_to_add').val()) < moment(myDate) && $('#ahmgawpm001_effective_date_to_add').val() != "") {
        $('#ahmgawpm001_effective_date_to_add').val(moment(myDate).format('DD-MMM-YYYY'));
    }
});

$('#ahmgawpm001_effective_date_from_edit_datetimepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_effective_date_from_edit').val();
    var myDate = (new Date(selectedDate)).getTime();
    $('#ahmgawpm001_effective_date_to_edit_datetimepicker').data('DateTimePicker').minDate(moment(myDate));
    if (moment($('#ahmgawpm001_effective_date_to_edit').val()) < moment(myDate) && $('#ahmgawpm001_effective_date_to_edit').val() != "") {
        $('#ahmgawpm001_effective_date_to_edit').val(moment(myDate).format('DD-MMM-YYYY'));
    }
});

$('#ahmgawpm001_effective_date_to_edit_datetimepicker').on("dp.change", function (e) {
    var selectedDate = $('#ahmgawpm001_effective_date_to_edit').val();
    var myDate = (new Date(selectedDate)).getTime();
    if (moment($('#ahmgawpm001_effective_date_from_edit').val()) > moment(myDate) && $('#ahmgawpm001_effective_date_from_edit').val() != "") {
        $('#ahmgawpm001_effective_date_from_edit').val(moment(myDate).format('DD-MMM-YYYY'));
    }
});



$('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor_timepicker').datetimepicker({
    format: 'DD-MMM-YYYY',
    minDate: new Date() - 1,
});
$('#ahmgawpm001_end_tanggal_pekerjaan_edit_kontraktor_timepicker').datetimepicker({
    format: 'DD-MMM-YYYY',
    minDate: new Date() - 1,
});

function ahmgawpm001_check_telephone_number_request_kontraktor() {
    var validPhoneRegex = /^[0-9]+$/;
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_request_kontraktor', ahmgawpm001).val(validString);
    }
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_request_kontraktor', ahmgawpm001).val(validString);
    }
};


function ahmgawpm001_check_telephone_number_edit_kontraktor() {
    var validPhoneRegex = /^[0-9]+$/;
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_kontraktor', ahmgawpm001).val(validString);
    }
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_kontraktor', ahmgawpm001).val(validString);
    }
};



function ahmgawpm001_check_telephone_number_edit_admin() {
    var validPhoneRegex = /^[0-9]+$/;
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_admin', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_admin', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_edit_admin', ahmgawpm001).val(validString);
    }
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_admin', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_admin', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_edit_admin', ahmgawpm001).val(validString);
    }
};



function ahmgawpm001_check_telephone_number_renew_admin() {
    var validPhoneRegex = /^[0-9]+$/;
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_admin', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_admin', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_admin', ahmgawpm001).val(validString);
    }
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_admin', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_admin', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_admin', ahmgawpm001).val(validString);
    }
};



function ahmgawpm001_check_telephone_number_renew_ehs_controller() {
    var validPhoneRegex = /^[0-9]+$/;
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_ehs_controller', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_ehs_controller', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_proyek_renew_ehs_controller', ahmgawpm001).val(validString);
    }
    var invalidString = $('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_ehs_controller', ahmgawpm001).val();
    if ($('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_ehs_controller', ahmgawpm001).val().match(validPhoneRegex)) {
    } else {
        var validString = invalidString;
        for (let i = 0; i < invalidString.length; i++) {
            if (!(invalidString[i].match(validPhoneRegex))) {
                validString = validString.replace(invalidString[i], "");
            }
        }
        $('#ahmgawpm001_nomor_hp_pengawas_lk3_renew_ehs_controller', ahmgawpm001).val(validString);
    }
};



$('#ahmgawpm001_end_tanggal_pekerjaan_request_kontraktor_timepicker').datetimepicker().on('changeDate', function (ev) {
    $('#ahmgawpm001_start_tanggal_pekerjaan_request_kontraktor_timepicker').hide();
});



