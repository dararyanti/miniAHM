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

const maintainIkp = $("#maintainIkp");

$(document).ready(() => {

});
// MAINTAIN IKP FILTER
function maintain_ikp_filter(params) {
    vstatus = ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'];
    vsupplyid = $("#id_supplier_filter", maintainIkp).val();

    params.search = {
        ikpId: $("#nomor_ikp_filter", maintainIkp).val(),
        supplierId : vsupplyid,
        namaSupplier: $("#nama_supplier_filter", maintainIkp).val(),
        nrpId: $("#id_pic_filter", maintainIkp).val(),
        nomorPoSpk: $("#nomor_po_filter", maintainIkp).val(),
        orderingType: $("#ordering_type_filter", maintainIkp).val(),
        startPeriode: $("#start_periode_filter", maintainIkp).val(),
        endPeriode: $("#end_periode_filter", maintainIkp).val(),
        status: vstatus,
        plantId: "",
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

$("#search_maintain_ikp_table", maintainIkp).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
        console.log(data);
    }
})

// INDEX FORMATTER
function index_formatter(value, row, index) {
    return index + 1;
}


// FUNCTION ACTION BUTTON MAINTAIN IKP TABLE
function maintain_ikp_action_button(value, row, index) {
        if (row.status.includes('Created')) {
            return '<div id="button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn" onclick="ehsControllerEditPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<i class="glyphicon glyphicon-edit fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" data-toggle="tooltip" data-placement="top"' +
                'title="Delete" style="margin: 0 5px 0 5px">' +
                '<span data-toggle="modal" data-selected-index="' + index + '" ' +
                'data-target="#delete_ikp">' +
                '<i class="glyphicon glyphicon-trash fg-red"></i>' +
                "</span>" +
                "</span>" +
                '<span class="span-btn" onclick="download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        } else if (row.status.includes('Approved')) {
            return '<div id="button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn"  onclick="securityDisplayPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Display" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-search fg-red"></i>' +
                "</span>" +
                "<span>&nbsp;</span>" +
                '<span class="span-btn" onclick="ehsControllerRenewPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Renew">' +
                '<i class="glyphicon glyphicon-plus fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        } else {
            return '<div id="button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn"  onclick="ehsControllerDisplayPage(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Display" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-search fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" onclick="download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        }


}

