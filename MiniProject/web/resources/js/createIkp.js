const createIkp = $("#createIkp");
var selectedIkpId = null;
var lookupTableId = null;
var openLookup = false;
var correctPlant = false;

$(document).ready(() => {

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
            $('#id_supplier_lookup_wrapper',createIkp).lovtable({
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
function lov_supplier_create_ikp(params){
    params.search = {
        supplyId: $("#id_supplier_create_ikp", createIkp).val(),
        supplyDesc: $("#id_supplier_create_ikp", createIkp).val(),
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
function lov_supplier_create_ikp_change(){
    if ($('#id_supplier_create_ikp',createIkp).val()!=null &&
        $('#id_supplier_create_ikp',createIkp).val()!=""){
            $('#ordering_type_create_ikp',createIkp).val("PO");
        check_po($('#ordering_type_create_ikp',createIkp).val());
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
            $('#id_pic_lookup_wrapper',createIkp).lovtable({
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
function lov_pic_create_ikp(params){
    params.search = {
        nrpId: $("#id_pic_create_ikp", createIkp).val(),
        nama: $("#id_pic_create_ikp", createIkp).val(),
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
    var value = $('#ordering_type_create_ikp',createIkp).val();
    if (value == "PO") {
        if ($('#id_supplier_create_ikp',createIkp).val()!=null &&
        $('#id_supplier_create_ikp',createIkp).val()!=""){
            $("#no_po_create_ikp", createIkp).attr("readonly", false);
            $("#no_po_create_ikp_button", createIkp).attr("disabled", false);
        } else{
            $("#no_po_create_ikp", createIkp).attr("readonly", true);
            $("#no_po_create_ikp_button", createIkp).attr("disabled", true);
        }
        $("#no_spk_create_ikp", createIkp).attr("readonly", true);
        $("#deskripsi_item_create_ikp", createIkp).attr("readonly", true);
        
    } else {
        $("#no_spk_create_ikp", createIkp).attr("readonly", false);
        $("#deskripsi_item_create_ikp", createIkp).attr("readonly",false);
        $("#no_po_create_ikp", createIkp).val(null);
        $("#no_spk_create_ikp", createIkp).val(null);
        $("#deskripsi_item_create_ikp", createIkp).val(null);
        $("#no_po_create_ikp", createIkp).attr("readonly", true);
        $("#no_po_create_ikp_button", createIkp).attr("disabled", true);
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
            $('#id_po_lookup_wrapper',createIkp).lovtable({
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
function lov_po_create_ikp(params){
    params.search = {
        noPo: $("#no_po_create_ikp", createIkp).val(),
        poDesc: $("#no_po_create_ikp", createIkp).val(),
        supplierId :$("#id_supplier_create_ikp", createIkp).val(),
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
            $('#id_plant_lookup_wrapper',createIkp).lovtable({
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
function lov_plant_create_ikp(params){
    params.search = {
        plantVar: $("#id_plant_create_ikp", createIkp).val(),
        plantDesc: $("#id_plant_create_ikp", createIkp).val(),
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
function lov_plant_create_ikp_change(){
    if ($("#id_plant_create_ikp", createIkp).val()!=null &&
    $("#id_plant_create_ikp", createIkp).val() != ""){
        correctPlant = true;
    } 
}
function lov_plant_create_ikp_input(){
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
        plantVar : $("#id_plant_create_ikp", createIkp).val(),
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

function create_ikp_page(obj) {
    window.location.href = '/MiniProject/forms/createIkp.htm';
}
function check_plant_create_ikp(){
    if ($("#id_plant_create_ikp", createIkp).val()!=null &&
    $("#id_plant_create_ikp", createIkp).val() != "" &&
    correctPlant){
        $("#add_area_modal").modal('show');
    } else {
        alert("Harap isi plant terlebih dahulu!");
    }
}

function add_area(){
    if ($("#nomor_asset_add_area").val() != null &&
    $("#nomor_asset_add_area").val() != ""){
        if ($("#task_list_title_add_area").val() != null &&
        $("#task_list_title_add_area").val() != ""){
            var rows = [];
            var index = $('#area_create_ikp_table', createIkp).bootstrapTable('getData').length;
                if (index < 6) {
                    rows.push({
                        nomorAsset: $("#nomor_asset_add_area").val(),
                        areaDetail: $("#area_detail_add_area").val(),
                        indoorOutdoor: $("#indoor_outdoor_add_area").val(),
                        criticality: $("#criticality_add_area").val(),
                        taskListTitle: $("#task_list_title_add_area").val(),
                    });
                    console.log(rows);
                    $('#area_create_ikp_table', createIkp).bootstrapTable('append', rows);

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
    var index = $('#area_create_ikp_table', createIkp).bootstrapTable('getData').length;
    if (index == 0){
        $("#id_plant_create_ikp").attr("readonly", false);
        $("#button_id_plant_create_ikp").attr("disabled", false);
    } else {
        $("#id_plant_create_ikp").attr("readonly", true);
        $("#button_id_plant_create_ikp").attr("disabled", true);
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
