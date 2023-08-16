const editIkp = $("#editIkp");
var selectedIkpId = null;
var lookupTableId = null;
var openLookup = false;
var correctPlant = true;
var uniqueId = null;

$(document).ready(() => {
    get_data_edit_ikp();
});

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

get_data_edit_ikp();

// AREA IKP FILTER
function area_edit_ikp_table_filter(params) {
    params.search = new Array();
    params.search = {
        ikpId: localStorage.getItem('ikpId'),
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

function get_data_edit_ikp(){
    params = new Object();
    params.search = {
        ikpId: localStorage.getItem('ikpId'),
        status: ['00-IKP', '01-IKP', '02-IKP', '03-IKP', '04-IKP', '05-IKP', '06-IKP', '07-IKP'],
        nrpId: "",
    };
    let stringData = JSON.stringify({
        limit: 1,
        offset: 0,
        search: params.search,
        sort: "idSupplier",
        order: "asc",
    })
    let jsonSendString = JSON.parse(stringData);
    _fw_post(
        "/MiniProject/rest/ga/wpm001/get-ikp-table",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    data = ret.data[0];
                    $("#nomor_ikp_edit_ikp", editIkp).val(data.ikpId);
                    $("#id_supplier_edit_ikp", editIkp).val(data.idSupplier);
                    $("#nama_supplier_edit_ikp", editIkp).val(data.namaSupplier);
                    $("#ordering_type_edit_ikp", editIkp).val(data.tipeOrder);
                    $("#purchasing_organization_edit_ikp", editIkp).val(data.purchasingOrganization);
                    $("#kategori_pekerjaan_edit_ikp", editIkp).val(data.kategoriPekerjaan);
                    $("#kategori_izin_kerja_edit_ikp", editIkp).val(data.kategoriIzinKerja);
                    if (data.tipeOrder == "PO") {
                        $("#no_po_edit_ikp", editIkp).val(data.nomorPoSpk);
                        $("#no_spk_edit_ikp", editIkp).val(null);
                    } else {
                        $("#no_po_edit_ikp", editIkp).val(null);
                        $("#no_spk_edit_ikp", editIkp).val(data.nomorPoSpk);
                    }
                    $("#deskripsi_item_edit_ikp", editIkp).val(data.deskripsiItem);
                    $("#id_pic_edit_ikp", editIkp).val(data.nrpPic);
                    $("#nama_pic_edit_ikp", editIkp).val(data.namaPic);
                    $("#seksi_pic_edit_ikp", editIkp).val(data.seksi);
                    $("#nomor_pengajuan_proyek_edit_ikp", editIkp).val(data.nomorPengajuanProyek);
                    $("#departemen_pic_edit_ikp", editIkp).val(data.departemen);
                    $("#login_patrol_edit_ikp", editIkp).val(data.loginPatrol);
                    $("#id_plant_edit_ikp", editIkp).val(data.plantId);
                    $("#divisi_pic_edit_ikp", editIkp).val(data.divisi);
                    $("#area_edit_ikp_table", editIkp).bootstrapTable("refresh");
                }
            }

            if (ret.status == "0") {
                validateResult = false;
            }
        }
    );
}

$('#area_edit_ikp_table',editIkp).bootstrapTable({
   
});


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

// INDEX FORMATTER
function index_formatter(value, row, index) {
    return index + 1;
}


// LOV SUPPLIER
function id_supplier_display_lookup(){
    var $lookupWrapper = $('#id_supplier_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var changeFunc = $lookupWrapper.data('lookup-change-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_supplier_lookup_wrapper',editIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: changeFunc,
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
function lov_supplier_edit_ikp(params){
    params.search = {
        supplyId: $("#id_supplier_edit_ikp", editIkp).val(),
        supplyDesc: $("#id_supplier_edit_ikp", editIkp).val(),
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
function lov_supplier_edit_ikp_change(){
    if ($('#id_supplier_edit_ikp',editIkp).val()!=null &&
        $('#id_supplier_edit_ikp',editIkp).val()!=""){
            $('#tipe_order_edit_ikp',editIkp).val("PO");
        check_po($('#tipe_order_edit_ikp',editIkp).val());
    }

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
            $('#id_pic_lookup_wrapper',editIkp).lovtable({
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
function lov_pic_edit_ikp(params){
    params.search = {
        nrpId: $("#id_pic_edit_ikp", editIkp).val(),
        nama: $("#id_pic_edit_ikp", editIkp).val(),
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
function check_po(selectObject) {
    var value = $('#tipe_order_edit_ikp',editIkp).val();
    if (value == "PO") {
        if ($('#id_supplier_edit_ikp',editIkp).val()!=null &&
        $('#id_supplier_edit_ikp',editIkp).val()!=""){
            $("#no_po_edit_ikp", editIkp).attr("readonly", false);
            $("#no_po_edit_ikp_button", editIkp).attr("disabled", false);
        } else{
            $("#no_po_edit_ikp", editIkp).attr("readonly", true);
            $("#no_po_edit_ikp_button", editIkp).attr("disabled", true);
        }
        $("#no_spk_edit_ikp", editIkp).attr("readonly", true);
        $("#deskripsi_item_edit_ikp", editIkp).attr("readonly", true);
        
    } else {
        $("#no_spk_edit_ikp", editIkp).attr("readonly", false);
        $("#deskripsi_item_edit_ikp", editIkp).attr("readonly",false);
        $("#no_po_edit_ikp", editIkp).val(null);
        $("#no_spk_edit_ikp", editIkp).val(null);
        $("#deskripsi_item_edit_ikp", editIkp).val(null);
        $("#no_po_edit_ikp", editIkp).attr("readonly", true);
        $("#no_po_edit_ikp_button", editIkp).attr("disabled", true);
    }
}
function id_po_display_lookup(){
    var $lookupWrapper = $('#id_po_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_po_lookup_wrapper',editIkp).lovtable({
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
function lov_po_edit_ikp(params){
    params.search = {
        noPo: $("#no_po_edit_ikp", editIkp).val(),
        poDesc: $("#no_po_edit_ikp", editIkp).val(),
        supplierId :$("#id_supplier_edit_ikp", editIkp).val(),
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

// LOV PLANT
function id_plant_display_lookup(){
    var $lookupWrapper = $('#id_plant_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var changeFunc = $lookupWrapper.data('lookup-change-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_plant_lookup_wrapper',editIkp).lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: changeFunc,
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
function lov_plant_edit_ikp(params){
    params.search = {
        plantVar: $("#id_plant_edit_ikp", editIkp).val(),
        plantDesc: $("#id_plant_edit_ikp", editIkp).val(),
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
function lov_plant_edit_ikp_change(){
    if ($("#id_plant_edit_ikp", editIkp).val()!=null &&
    $("#id_plant_edit_ikp", editIkp).val() != ""){
        correctPlant = true;
    } 
}
function lov_plant_edit_ikp_input(){
        correctPlant = false;
}

// LOV ASSET
function id_asset_display_lookup(){
    var $lookupWrapper = $('#id_asset_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var lookupChangeFunc = $lookupWrapper.data('lookup-change-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_asset_lookup_wrapper').lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: lookupChangeFunc,
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
function lov_nomor_asset_add_area(params){
    params.search = {
        noAsset: $("#nomor_asset_add_area").val(),
        descAsset: $("#nomor_asset_add_area").val(),
        plantVar : $("#id_plant_edit_ikp", editIkp).val(),
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
function lov_nomor_asset_add_area_change(){
    if ($("#nomor_asset_add_area").val() != null &&
    $("#nomor_asset_add_area").val() != ""){
        $("#task_list_title_add_area").attr("readonly", false);
        $("#button_task_list_title_add_area").attr("disabled", false);
    } else {
        $("#task_list_title_add_area").attr("readonly", true);
        $("#button_task_list_title_add_area").attr("disabled", true);
    }
}
function lov_nomor_asset_add_area_input(){
    $("#task_list_title_add_area").attr("readonly", true);
    $("#button_task_list_title_add_area").attr("disabled", true);
}

// LOV TASKLIST
function id_tasklist_display_lookup(){
    var $lookupWrapper = $('#id_tasklist_lookup_wrapper');
    var url = $lookupWrapper.data('url');
    var lookupPreFunc = $lookupWrapper.data('lookup-pre-func');
    var lookupChangeFunc = $lookupWrapper.data('lookup-change-func');
    var columns = $lookupWrapper.data('columns');
    var callback = $lookupWrapper.data('callback');
    if (openLookup == false){
        $('.lookup-wrapper .lookup-form').remove();
        setTimeout(function(){
            $('#id_tasklist_lookup_wrapper').lovtable({
                delay: 500,
                width: null,
                isBindFunc: false,
                url: url,
                queryParams: lookupPreFunc,
                changeFunction: lookupChangeFunc,
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
function lov_tasklist_add_area(params){
    params.search = {
        kode: $("#task_list_title_add_area").val(),
        title: $("#task_list_title_add_area").val(),
        noAsset : $("#nomor_asset_add_area").val(),
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

function cancel_edit_ikp(obj) {
    window.location.href = '/MiniProject/forms/maintainIkp.htm';
}
function check_plant_edit_ikp(){
    if ($("#id_plant_edit_ikp", editIkp).val()!=null &&
    $("#id_plant_edit_ikp", editIkp).val() != "" &&
    correctPlant){
        $("#add_area_modal").modal('show');
    } else {
        alert("Harap isi plant terlebih dahulu!");
    }
}

// ADD AREA MODAL
function add_area(){
    if ($("#nomor_asset_add_area").val() != null &&
    $("#nomor_asset_add_area").val() != ""){
        if ($("#task_list_title_add_area").val() != null &&
        $("#task_list_title_add_area").val() != ""){
            var rows = [];
            var index = $('#area_edit_ikp_table', editIkp).bootstrapTable('getData').length;
                if (index < 6) {
                    let stringData = JSON.stringify({
                        ikpId: localStorage.getItem('ikpId'),
                        assetNo: $("#nomor_asset_add_area").val(),
                        areaDetail: $("#area_detail_add_area").val(),
                        inOut: $("#indoor_outdoor_add_area").val(),
                        criticality: $("#criticality_add_area").val(),
                        taskList: $("#task_list_title_add_area").val(),
                    })
                    let jsonSendString = JSON.parse(stringData);
                    _fw_post(
                        "/MiniProject/rest/ga/wpm001/save-area",
                        jsonSendString,
                        function (ret) {
                            if (ret.status == "1") {
                                _fw_setMessage(ret.status, ret.message.res);
                                if (ret.data != null) {
                                    $("#area_edit_ikp_table", editIkp).bootstrapTable("refresh");
                                }
                            }
                
                            if (ret.status == "0") {
                                validateResult = false;
                            }
                        }
                    );
                    // $('#area_edit_ikp_table', editIkp).bootstrapTable('append', rows);
                    reset_add_modal_area();
                    check_exist_area();
                }
                else {
                    alert("Area tidak boleh lebih dari 6")
                }
            return;
        }
    }
    alert("Nomor asset dan Tasklist tidak boleh kosong!");
}
function check_exist_area(){
    var index = $('#area_edit_ikp_table', editIkp).bootstrapTable('getData').length;
    if (index == 0){
        $("#id_plant_edit_ikp").attr("readonly", false);
        $("#button_id_plant_edit_ikp").attr("disabled", false);
    } else {
        $("#id_plant_edit_ikp").attr("readonly", true);
        $("#button_id_plant_edit_ikp").attr("disabled", true);
    }
}
function area_action_button(value, row, index) {
    return '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Revise"'
        + 'style="margin-right: 10px">'
        + '<span data-toggle="modal" data-target="#edit_area_modal" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-edit fg-red"></i>'
        + '</span>'
        + '</span>'
        + '<span class="span-btn" data-toggle="tooltip" data-placement="top" title="Delete">'
        + '<span data-toggle="modal" data-target="#delete_area_modal" '
        + 'data-selected-index="' + index + '">'
        + '<i class="glyphicon glyphicon-trash fg-red"></i>'
        + '</span>'
        + '</span>'
}
function reset_add_modal_area() {
    $("#nomor_asset_add_area").val(null);
    $("#area_detail_add_area").val(null);
    $("#task_list_title_add_area").val(null);
}

$('#delete_area_modal').on('show.bs.modal', function (e) {
    var index = $(e.relatedTarget).data('selected-index');
    uniqueId = $("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[index].assetNo;
});

function delete_area_modal(){
    params = new Object();
    params.ikpId = localStorage.getItem('ikpId');
    params.assetNo = uniqueId;
    deleteUrl = "/MiniProject/rest/ga/wpm001/delete-area?";
    $.each(params, function (keypar, param) {
        deleteUrl += '' + keypar + '=' + param + '&';
    });
    _fw_post(
        deleteUrl, null,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    $("#area_edit_ikp_table", editIkp).bootstrapTable("refresh");
                }
            }

            if (ret.status == "0") {
                validateResult = false;
            }
        }
    );
    // $("#area_edit_ikp_table",editIkp).bootstrapTable('removeByUniqueId', uniqueId);
    check_exist_area()
    uniqueId = null;
}

// EDIT AREA MODAL
$('#edit_area_modal').on('show.bs.modal', function (e) {
    var selectedIndex = $(e.relatedTarget).data('selected-index');
    uniqueId = $("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].assetNo;
    $("#nomor_asset_edit_area").val($("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].assetNo);
    $("#area_detail_edit_area").val($("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].areaDetail);
    $("#indoor_outdoor_edit_area").val($("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].inOut);
    $("#criticality_edit_area").val($("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].criticality);
    $("#task_list_title_edit_area").val($("#area_edit_ikp_table",editIkp).bootstrapTable('getData')[selectedIndex].taskList);
});
function edit_area_modal() {
    let stringData = JSON.stringify({
        ikpId: localStorage.getItem('ikpId'),
        assetNo: $("#nomor_asset_edit_area").val(),
        areaDetail: $("#area_detail_edit_area").val(),
        inOut: $("#indoor_outdoor_edit_area").val(),
        criticality: $("#criticality_edit_area").val(),
        taskList: $("#task_list_title_edit_area").val(),
    })
    let jsonSendString = JSON.parse(stringData);
    _fw_post(
        "/MiniProject/rest/ga/wpm001/save-area",
        jsonSendString,
        function (ret) {
            if (ret.status == "1") {
                _fw_setMessage(ret.status, ret.message.res);
                if (ret.data != null) {
                    $("#area_edit_ikp_table", editIkp).bootstrapTable("refresh");
                }
            }

            if (ret.status == "0") {
                validateResult = false;
            }
        }
    );
    };

// SUBMIT FUNCTION ADD EHS
function submit_edit_ikp(obj) {
    var tableAreaProject = $('#area_edit_ikp_table', editIkp).bootstrapTable('getData');
    _fw_validation_clear(editIkp);
    var thisContent = $(obj);
    thisContent.html('<i class="fa fa-spin fa-spinner mr-10"></i> Submitting...').prop("disabled", true);
    $('#cancel_edit_ikp', editIkp).prop("disabled", true);
    $(".has-error", editIkp).removeClass("has-error").removeClass("has-feedback");
    _fw_validation_add(editIkp, 'login_patrol_edit_ikp', 'required');
    _fw_validation_add(editIkp, 'id_supplier_edit_ikp', 'required');
    _fw_validation_add(editIkp, 'nomor_pengajuan_proyek_edit_ikp', 'required');
    _fw_validation_add(editIkp, 'tipe_order_edit_ikp', 'required');
    if ($("#tipe_order_edit_ikp", editIkp).val() == "PO") {
        _fw_validation_add(editIkp, 'no_po_edit_ikp', 'required');
    } else {
        _fw_validation_add(editIkp, 'no_spk_edit_ikp', 'required');
    }
    _fw_validation_add(editIkp, 'id_pic_edit_ikp', 'required');
    _fw_validation_add(editIkp, 'id_plant_edit_ikp', 'required');
    var index = $("#area_edit_ikp_table", editIkp).bootstrapTable('getData').length;
    $("#kategori_izin_kerja_edit_ikp", editIkp).val("Izin Kerja Proyek");
    setTimeout(function () {
        if (_fw_validation_validate(editIkp)) {
            if (index < 1) {
                alert("Data Area tidak boleh kosong!");
            } else {
                let data = new Object();

                let areaProject = new Object();

                data.ikp = {
                    ikpId: localStorage.getItem('ikpId'),
                    katIzinKerja: $( "#kategori_izin_kerja_edit_ikp",editIkp).val(),
                    noPengajuanProyek: $("#nomor_pengajuan_proyek_edit_ikp", editIkp).val(),
                    katPekerjaan: $("#kategori_pekerjaan_edit_ikp",editIkp).val(),
                    tipeOrder: $("#tipe_order_edit_ikp", editIkp).val(),
                    purchasingOrg: $("#purchasing_organization_edit_ikp",editIkp).val(),
                    noSpk: $("#no_spk_edit_ikp", editIkp).val(),
                    noPo: $("#no_po_edit_ikp", editIkp).val(),
                    deskripsiItem: $("#deskripsi_item_edit_ikp", editIkp).val(),
                    plantId: $("#id_plant_edit_ikp", editIkp).val(), 
                    nrpId: $("#id_pic_edit_ikp", editIkp).val(), 
                    supplyId: $("#id_supplier_edit_ikp", editIkp).val(), 
                    supplyDesc: $("#nama_supplier_edit_ikp", editIkp).val(),
                    status : "00-IKP",                 
                }

                data.listArea = new Array();
                

                for (let i = 0; i < tableAreaProject.length; i++) {
                    areaProject = {
                        ikpId: localStorage.getItem('ikpId'),
                        inOut: tableAreaProject[i].indoorOutdoor,
                        areaDetail: tableAreaProject[i].areaDetail,
                        criticality: tableAreaProject[i].criticality,
                        taskList: tableAreaProject[i].taskList,
                        assetNo: tableAreaProject[i].assetNo,
                        loginPatrol: $("#login_patrol_edit_ikp", editIkp).val(),
                    }
                    data.listArea.push(areaProject);
                }


                let stringData = JSON.stringify(data);
                let jsonSendString = JSON.parse(stringData);
                let validateResult = true;
                _fw_post(
                    "/MiniProject/rest/ga/wpm001/save-ikp",
                    jsonSendString,
                    function (ret) {
                        if (ret.status == "1") {
                            alert("IKP has been successfully submitted");
                        }

                        if (ret.status == "0") {
                            validateResult = false;
                        }
                    }
                );
                if (validateResult) {
                    $('#cancel_edit_ikp', editIkp).prop("disabled", false);
                    $("#area_edit_ikp_table", editIkp).bootstrapTable('removeAll');
                    cancel_edit_ikp();
                }
            }
        } else {
            alert("Harap mengisi data Mandatory*");
        }
        thisContent.html('<i class="glyphicon glyphicon-file fg-white"> </i> Submit').prop("disabled", false);
        $('#cancel_edit_ikp', editIkp).prop("disabled", false);
    }, 1000);




};
