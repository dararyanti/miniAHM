const maintainIkp = $("#maintainIkp");
var selectedIkpId = null;
var lookupTableId = null;
var openLookup = false;

$(document).ready(() => {
  
});

// $('.lookup-wrapper').lovtable({
// });

function load_data(resps) {
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

// MAINTAIN IKP FILTER
function maintain_ikp_filter(params) {
    params.search = {
        ikpId: $("#nomor_ikp_filter", maintainIkp).val(),
        supplierId : $("#id_supplier_filter", maintainIkp).val(),
        namaSupplier: $("#nama_supplier_filter", maintainIkp).val(),
        nrpId: $("#id_pic_filter", maintainIkp).val(),
        nomorPoSpk: $("#nomor_po_filter", maintainIkp).val(),
        orderingType: $("#ordering_type_filter", maintainIkp).val(),
        startPeriode: $("#start_periode_filter", maintainIkp).val(),
        endPeriode: $("#end_periode_filter", maintainIkp).val(),
        status: ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'],
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
// SEARCH BUTTON MAINTAIN
$("#search_maintain_ikp_button", maintainIkp).click(function () {
    // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", true);
    // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", true);
    // $("#submit_button_maintain", maintainIkp).prop("disabled", true);
    var thisContent = $(this);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Searching...').prop("disabled", true);
    $("#export_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#search_maintain_ikp_table", maintainIkp).bootstrapTable("refresh");
    setTimeout(function () {
        thisContent.html('<i class="glyphicon glyphicon-search fg-white"></i> Search').prop("disabled", false);
        $("#export_maintain_ikp_button", maintainIkp).prop("disabled", false);
        $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", false);
        $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", false);
    }, 1000);

});
// REFRESH BUTTON MAINTAIN
$("#refresh_maintain_ikp_button", maintainIkp).click(function () {
    $("#submit_button_maintain", maintainIkp).prop("disabled", true);
    // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", true);
    // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", true);
    var thisContent = $(this);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Refreshing...').prop("disabled", true);
    $("#search_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#export_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#lookup_nomor_po_filter", maintainIkp).attr("disabled", true);
    $("#nomor_po_filter", maintainIkp).attr("readonly", true);
    reset_field_filter();
    $("#search_maintain_ikp_table", maintainIkp).bootstrapTable("refresh");
    setTimeout(function () {
        thisContent.html('<i class="glyphicon glyphicon-refresh fg-white"></i> Refresh').prop("disabled", false);
        $("#search_maintain_ikp_button", maintainIkp).prop("disabled", false);
        $("#export_maintain_ikp_button", maintainIkp).prop("disabled", false);
        // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", false);
        // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", false);
    }, 1000);
});
// EXPORT BUTTON MAINTAIN IKP FUNCTION
$("#export_maintain_ikp_button", maintainIkp).click(
    function () {
        var thisContent = $(this);
        thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Downloading...').prop("disabled", true);
        $("#search_maintain_ikp_button", maintainIkp).prop("disabled", true);
        $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", true);
        // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", true);
        // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", true);
        // $("#submit_button_maintain", maintainIkp).prop("disabled", true);

        setTimeout(function () {
            params = new Object();
            if ($("#ordering_type_filter", maintainIkp).val() == null){
                $("#ordering_type_filter", maintainIkp).val("");
            }
                // params.JXID = encodeURIComponent(getJxid());
                params.supplierId = $("#id_supplier_filter", maintainIkp).val();
                params.namaSupplier = $("#nama_supplier_filter", maintainIkp).val();
                params.nrpId = $("#id_pic_filter", maintainIkp).val();
                params.nomorPoSpk = $("#nomor_po_filter", maintainIkp).val();
                params.tipeOrder = $("#ordering_type_filter", maintainIkp).val();
                params.startPeriode = $("#start_periode_filter", maintainIkp).val();
                params.endPeriode = $("#end_periode_filter", maintainIkp).val();
                params.ikpId = $("#nomor_ikp_filter", maintainIkp).val();
                params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
                params.sort = "supplierId";
                params.order = "asc";
            var exportUrl = "/MiniProject/rest/ga/wpm001/export-to-excel-ikp?";
            $.each(params, function (keypar, param) {
                exportUrl += '' + keypar + '=' + param + '&';
            });
            window.open(exportUrl, '_blank');
            if ($("#ordering_type_filter", maintainIkp).val() == ""){
                $("#ordering_type_filter", maintainIkp).val(null);
            }
            thisContent.html('<i class="fa fa-check fg-white mr-10"></i> Downloaded');
            setTimeout(function () {
                thisContent.html('<i class="glyphicon glyphicon-open-file fg-white"></i> Export to Excel').prop("disabled", false);
                $("#search_maintain_ikp_button", maintainIkp).prop("disabled", false);
                $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", false);
                // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", false);
                // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", false);
                // $("#submit_button_maintain", maintainIkp).prop("disabled", false);
            }, 3000);
        }, 3000)
    }
);
// IKP TABLE
$("#search_maintain_ikp_table", maintainIkp).bootstrapTable({
    onLoadSuccess: function (data, status, jqXHR) {
    }
})
// INDEX FORMATTER
function index_formatter(value, row, index) {
    var offsetValue = $('#search_maintain_ikp_table',maintainIkp).bootstrapTable('getOptions').pageSize * ($('#search_maintain_ikp_table',maintainIkp).bootstrapTable('getOptions').pageNumber-1);
    return index + 1 + offsetValue;
}
// CHECK PO
function check_po_filter(selectObject) {
    var value = selectObject.value;
    if (value == "PO" || value == "SPK" || value == "SPK Sementara") {
        $("#nomor_po_filter", maintainIkp).val(null);
        $("#lookup_nomor_po_filter", maintainIkp).attr("disabled", false);
        $("#nomor_po_filter", maintainIkp).attr("readonly", false);
    } else {
        $("#lookup_nomor_po_filter", maintainIkp).attr("disabled", true);
        $("#nomor_po_filter", maintainIkp).attr("readonly", true);
        $("#nomor_po_filter", maintainIkp).val(null);
    }
}
// RESET FIELD
function reset_field_filter(){
    $("#id_supplier_filter", maintainIkp).val(null);
    $("#nama_supplier_filter", maintainIkp).val(null);
    $("#id_pic_filter", maintainIkp).val(null);
    $("#nama_pic_filter", maintainIkp).val(null);
    $("#ordering_type_filter", maintainIkp).val(null);
    $("#nomor_po_filter", maintainIkp).val(null);
    $("#start_periode_filter", maintainIkp).val(null);
    $("#end_periode_filter", maintainIkp).val(null);
    $("#nomor_ikp_filter", maintainIkp).val(null);
}
// FUNCTION ACTION BUTTON MAINTAIN IKP TABLE
function maintain_ikp_action_button(value, row, index) {
        if (row.status.includes('Created')) {
            return '<div id="button_maintain_ehs_controller"' +
                'style="white-space: nowrap; display: block" >' +
                '<span class="span-btn" onclick="edit_ikp_page(this, ' +
                index +
                ')" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<i class="glyphicon glyphicon-edit fg-red"></i>' +
                "</span>" +
                '<span class="span-btn" data-toggle="tooltip" data-placement="top"' +
                'title="Delete" style="margin: 0 5px 0 5px">' +
                '<span data-toggle="modal" data-selected-index="' + index + '" ' +
                'data-target="#delete_ikp_modal">' +
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
                // '<span class="span-btn"  onclick="securityDisplayPage(this, ' +
                // index +
                // ')" data-toggle="tooltip" data-placement="top"' +
                // 'title="Display" style="margin-left: 5px">' +
                // '<i class="glyphicon glyphicon-search fg-red"></i>' +
                // "</span>" +
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
                // '<span class="span-btn"  onclick="ehsControllerDisplayPage(this, ' +
                // index +
                // ')" data-toggle="tooltip" data-placement="top"' +
                // 'title="Display" style="margin-left: 5px">' +
                // '<i class="glyphicon glyphicon-search fg-red"></i>' +
                // "</span>" +
                '<span class="span-btn" onclick="download_ikp(' +
                index +
                ')" data-toggle="tooltip" data-placement="top"' +
                'title="Download" style="margin-left: 5px">' +
                '<i class="glyphicon glyphicon-download-alt fg-red"></i>' +
                "</span>" +
                "</div >"
        }


}
// DELETE IKP CONFIRMATION FUNCTION
$("#delete_ikp_confirm_button", maintainIkp).click(function () {
    var thisContent = $("#delete_ikp_confirm_button", maintainIkp);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Deleting...').prop("disabled", true);
    $("#cancel_delete_ikp_confirm_button", maintainIkp).prop("disabled", true);
    $("#search_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", true);
    $("#export_maintain_ikp_button", maintainIkp).prop("disabled", true);
    // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", true);
    // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", true);
    setTimeout(function () {
        paramsUrl = "";
        params = new Object;
        params.ikpId = selectedIkpId;
        $.each(params, function (keypar, param) {
            paramsUrl += '' + keypar + '=' + param + '&';
        });
        let validateResult = true;
        _fw_post(
            "/MiniProject/rest/ga/wpm001/delete-ikp?"+paramsUrl,
            null,
            function (ret) {
                if (ret.status == "1") {
                    alert("Success delete IKP "+ret.data[0].ikpId);
                }
                if (ret.status == "0") {
                    validateResult = false;
                }
            }
        );
        $("#delete_ikp_modal").modal('hide');
        thisContent.html('<i class="glyphicon glyphicon-ok fg-white"></i> Confirm').prop("disabled", false);
        $("#search_maintain_ikp_button", maintainIkp).prop("disabled", false);
        $("#refresh_maintain_ikp_button", maintainIkp).prop("disabled", false);
        $("#export_maintain_ikp_button", maintainIkp).prop("disabled", false);
        // $("#create_button_maintain_ehs_controller", maintainIkp).prop("disabled", false);
        // $("#request_button_maintain_kontraktor", maintainIkp).prop("disabled", false);
        $("#cancel_delete_ikp_confirm_button", maintainIkp).prop("disabled", false);
        if (validateResult) {
            $("#search_maintain_ikp_table", maintainIkp).bootstrapTable("refresh");
        }
    }, 1000);
});
$('#delete_ikp_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    console.log(index);
    selectedIkpId = $('#search_maintain_ikp_table').bootstrapTable('getData')[index].ikpId;
    console.log(selectedIkpId);
});
// DOWNLOAD IKP BUTTON
function download_ikp(index) {
    params = new Object();
    params.ikpId = $('#search_maintain_ikp_table').bootstrapTable('getData')[index].ikpId;
    params.status = ["00-IKP", "01-IKP", "02-IKP", "03-IKP", "04-IKP", "05-IKP", "06-IKP", "07-IKP"];
    alert("Downloading "+params.ikpId)
    setTimeout(function () {
        var exportUrl = "/MiniProject/rest/ga/wpm001/download-ikp?";
        $.each(params, function (keypar, param) {
            exportUrl += '' + keypar + '=' + param + '&';
        });
        window.open(exportUrl, '_blank');
        // window.location.href = exportUrl;
        setTimeout(function () {
        }, 3000);
    }, 3000)
}


// LOV SUPPLIER
function id_supplier_display_lookup(){
    var $lookupWrapper = $('#id_supplier_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_supplier_lookup_wrapper',maintainIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: null,
                bindFunction: null,
                nextFocus: null,
                nextFunction: null,
                tableId: generateUUID(),
                columns: columns,
                callbacks: callback,
                multiple: false,
                multipleValue: null,
                multipleText: null,
                loadFirstTime: true,
                otherValue: false
            });
        },500);
        openLookup = true;
    } else {
        openLookup = false;
    }
}
function lov_supplier_filter(params){
    params.search = {
        supplyId: $("#id_supplier_filter", maintainIkp).val(),
        supplyDesc: $("#id_supplier_filter", maintainIkp).val(),
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

// LOV PIC
function id_pic_display_lookup(){
    var $lookupWrapper = $('#id_pic_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_pic_lookup_wrapper',maintainIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: null,
                bindFunction: null,
                nextFocus: null,
                nextFunction: null,
                tableId: generateUUID(),
                columns: columns,
                callbacks: callback,
                multiple: false,
                multipleValue: null,
                multipleText: null,
                loadFirstTime: openLookup,
                otherValue: false
            });
        },500);
        openLookup = true;
    } else {
        openLookup = false;
    }
    
}
function lov_pic_filter(params){
    params.search = {
        nrpId: $("#id_pic_filter", maintainIkp).val(),
        nama: $("#id_pic_filter", maintainIkp).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "nrpId",
            order: "asc",
        };
    }
    return params;
}

// LOV PO
function id_po_display_lookup(){
    var $lookupWrapper = $('#id_po_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_po_lookup_wrapper',maintainIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: null,
                bindFunction: null,
                nextFocus: null,
                nextFunction: null,
                tableId: generateUUID(),
                columns: columns,
                callbacks: callback,
                multiple: false,
                multipleValue: null,
                multipleText: null,
                loadFirstTime: openLookup,
                otherValue: false
            });
        },500);
        openLookup = true;
    } else {
        openLookup = false;
    }
    
}
function lov_po_filter(params){
    params.search = {
        noPo: $("#nomor_po_filter", maintainIkp).val(),
        poDesc: $("#nomor_po_filter", maintainIkp).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPo",
            order: "asc",
        };
    }
    return params;
}

// LOV IKP
function id_ikp_display_lookup(){
    var $lookupWrapper = $('#id_ikp_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_ikp_lookup_wrapper',maintainIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: null,
                bindFunction: null,
                nextFocus: null,
                nextFunction: null,
                tableId: generateUUID(),
                columns: columns,
                callbacks: callback,
                multiple: false,
                multipleValue: null,
                multipleText: null,
                loadFirstTime: openLookup,
                otherValue: false
            });
        },500);
        openLookup = true;
    } else {
        openLookup = false;
    }
    
}
function lov_ikp_filter(params){
    params.search = {
        ikpId: $("#nomor_ikp_filter", maintainIkp).val(),
        projectDetail : $("#nomor_ikp_filter", maintainIkp).val(),
    };
    if (params.sort === undefined) {
        return {
            limit: params.limit,
            offset: params.offset,
            search: params.search,
            sort: "noPo",
            order: "asc",
        };
    }
    return params;
}

function create_ikp_page(obj) {
    window.location.href = '/MiniProject/forms/createIkp.htm';
}
function edit_ikp_page(obj, index){
    ikpId = $("#search_maintain_ikp_table", maintainIkp).bootstrapTable("getData")[index].ikpId;
    localStorage.setItem('ikpId', ikpId);
    window.location.href = '/MiniProject/forms/editIkp.htm';
}

