(function ($) {
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    "use strict";
     
    $.fn.lovtable = function (options, callback) {
        // default parameters
        var settings = $.extend({
            delay: 500,
            width: null,
            isBindFunc: false,
            url: null,
            queryParams: null,
            changeFunction: null,
            bindFunction: null,
            nextFocus: null,
            nextFunction: null,
            tableId: generateUUID(),
            columns: [],
            callbacks: [],
            multiple: false,
            multipleValue: null,
            multipleText: null,
            loadFirstTime: false,
            otherValue: false
        }, options);
        
        var timeout;
        
        if (settings.bindFunction !== undefined) {
            if (settings.bindFunction !== '') {
                var data_bind_func_f = window[settings.bindFunction];
                if (typeof (data_bind_func_f) === 'function') {
                    settings.isBindFunc = true;
                }
            }
        }
        var ddLookup = $(this);
        var ddTextbox = $(this).find('.input-lookup');
        var ddBtnLov = $(this).find('.btn-lookup');
        var ddLookupWrapper = $(this).closest('.lookup-wrapper');
        var firstTime = true;
        var fromButton = false;
        var urlLov = settings.url;
        
        
        // 18-nov-2021
        // set url to null when param loadFirstTime is false
        if(settings.loadFirstTime == false){
            settings.url = null;
        }
        
        var el = {
            ddDiv: $("<div>", {class: 'lookup-form'}),
            ddBtnTableMultiple: $('<button class="btn btn-default btn-primary large-button bg-blue" onclick="return false">' +
                    '<i class="glyphicon glyphicon-check fg-white"></i> Select Item</button>'),
            ddSelectedDiv: $('<div class="lookup-multiple"><span class="lookup-multiple-span"><i class="lookup-no-selected" style="color: #b1b1b1;font-weight: 400;">No Item Selected</i></div></div>'),
            ddTable: $("<table></table>", {style: "width:" + settings.width,
                "data-page-list": [10],
                id: settings.tableId,
                "data-method": 'post',
                "data-url": settings.url,
                "data-content-type": 'application/json',
                "data-data-type": 'json',
                "data-query-params-type": 'limit',
                "data-query-params": settings.queryParams,
                "data-response-handler": 'loadData',
                "data-side-pagination": 'server',
                "data-pagination": 'true'}),
            ddTableSelectedDiv: $('<div class="lookup-table-selected" style="display: none;"></table>'),
            ddTableSelected: $("<table></table>", {style: "display: none",
                "id": settings.tableId + "-Selected", 
                "data-source-id":settings.tableId, 
                "data-unique-id":settings.multipleValue,
                "data-pagination":"true",
                "data-page-size":"5"})
        };
        
        
        
        var keys = {
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            TAB: 9,
            BACKSPACE: 8
        };
        
        var lovtable = {
            text: function () {
                return el.ddTextbox.data("text");
            }
        };
        
        var bootsdiv = $(this).parents(".bootstrap-table");
        if(bootsdiv.length > 0){
            bootsdiv.before(el.ddDiv);
        }else{
            this.after(el.ddDiv);
        }
        
        if(settings.multiple == true){
            //el.ddDiv.append(el.ddBtnTableMultiple);
            el.ddTable.attr("data-checkbox-table",settings.tableId + "-Selected");
            el.ddTable.attr("data-unique-id",settings.multipleValue);
            el.ddTableSelectedDiv.append(el.ddTableSelected);
            ddLookupWrapper.append(el.ddTableSelectedDiv);
            ddLookupWrapper.append(el.ddSelectedDiv);
            var headerSelected = '<thead><tr>' +
                    '<th data-field="' + settings.multipleValue + '" data-sortable="false" data-visible="true">' + settings.multipleValue + '</th>' +
                    '<th data-field="' + settings.multipleText + '" data-sortable="false" data-visible="true">' + settings.multipleText + '</th>' +
                    '</thead></tr>';
            el.ddTableSelected.append(headerSelected);
            el.ddTableSelected.bootstrapTable();
            
            var removeSelected = function (idField, idVal) {
                $('#' + settings.tableId + '-Selected').bootstrapTable('remove', {
                    field: idField,
                    values: [idVal]
                });
            };
            
            el.ddTable.on('check-all.bs.table', function (e, rows) {
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
                            var vselected = $('<span class="lookup-multiple-selected-label" data-uniqueid="' + v[settings.multipleValue] + '">' + v[settings.multipleText] + '</span>');
                            var removeSel = $('<i class="fa fa-times remove-selected" style="margin-left: 5px;" data-value="' + v[settings.multipleValue] +'"></i>');
                            vselected.append(removeSel);
                            $('.lookup-multiple-span', el.ddSelectedDiv).append(vselected);
                            removeSel.click(function() {
                                removeSelected(settings.multipleValue, v[settings.multipleValue]);
                                vselected.remove();
                                if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length == 0) $('.lookup-no-selected',el.ddSelectedDiv).show();
                            });
                            if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length > 0) $('.lookup-no-selected',el.ddSelectedDiv).hide();
                        }
                    });
                }
            });
            
            //checkbox table event oncheck
            el.ddTable.on('check.bs.table ', function (e, row) {
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
                        
                        var vselected = $('<span class="lookup-multiple-selected-label" data-uniqueid="' + row[settings.multipleValue] + '">' + row[settings.multipleText] + '</span>');
                        var removeSel = $('<i class="fa fa-times remove-selected" style="margin-left: 5px;" data-value="' + row[settings.multipleValue] +'"></i>');
                        vselected.append(removeSel);
                        $('.lookup-multiple-span', el.ddSelectedDiv).append(vselected);
                        removeSel.click(function() {
                            removeSelected(settings.multipleValue, row[settings.multipleValue]);
                            vselected.remove();
                            if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length == 0) $('.lookup-no-selected',el.ddSelectedDiv).show();
                        });
                        if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length > 0) $('.lookup-no-selected',el.ddSelectedDiv).hide();
                    }
                }
            });
            
            //checkbox table event uncheck
            el.ddTable.on('uncheck.bs.table', function (e, row) {
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
                            
                            $('span[data-uniqueid="' + [v[tblTempUniqueId]] + '"]',el.ddSelectedDiv).remove();
                            if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length == 0) $('.lookup-no-selected',el.ddSelectedDiv).show();
                            else $('.lookup-no-selected',el.ddSelectedDiv).hide();
                        }
                    }
                });
            });
            
            //checkbox table event uncheck all
            el.ddTable.on('uncheck-all.bs.table', function (e, rows) {
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
                        $('span[data-uniqueid="' + [v[tblTempUniqueId]] + '"]',el.ddSelectedDiv).remove();
                        if($('.lookup-multiple-selected-label',el.ddSelectedDiv).length == 0) $('.lookup-no-selected',el.ddSelectedDiv).show();
                        else $('.lookup-no-selected',el.ddSelectedDiv).hide();
                    }
                });
            });
            
            //checkbox table event preserve checkbox
            el.ddTable.on('post-body.bs.table', function (e) {
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
        }
        
        el.ddDiv.append(el.ddTable);
        var header = "<thead><tr>";
        if(settings.multiple == true){
            header = header + '<th data-field="state" data-checkbox="true"></th>';
        }
        $.each(settings.columns, function (index, element) {
            header = header + "<th data-field='" + element.id + "' data-sortable='" + element.sortable + "' data-visible='" + element.visible + "'>" + element.name + "</th>";
        });
        header = header + "</thead></tr>";
        el.ddTable.append(header);
        
        if (ddTextbox.attr('id') == undefined) {
            ddTextbox.attr('id', generateUUID());
        }
        
        var delay = (function () {
            var timer = 0;
            return function (callsback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callsback, ms);
            };
        })();
        
        // 18-nov-2021
        // added attr(data-url) on bootstraptable on firsttime
        // added urlLov param when 'refresh'
        ddTextbox.keyup(function (e) {
            //if (e.which === 13) {
            if(firstTime && bootsdiv.length > 0){
                el.ddTable.attr("data-url",urlLov);
                el.ddTable.bootstrapTable();
            }
            if(bootsdiv.length > 0 && !el.ddDiv.is(":visible")){
                var top = ddLookup.offset().top + 30;
                var left = ddLookup.offset().left;
                
                el.ddDiv.css({
                    'top': top + 'px',
                    'left': left + 'px',
                    'bottom': 'auto',
                    'right': 'auto'
                });
            }
            delay(function () {
                firstTime = false;
                fromButton = false;
                el.ddTable.bootstrapTable('refresh', {
                    url: urlLov 
                });
            }, settings.delay);
            //}
        });
        
        // 18-nov-2021
        // added attr(data-url) on bootstraptable on firsttime
        // added urlLov param when 'refresh'
        ddBtnLov.click(function () {
            clearTimeout(timeout);
            if(firstTime && bootsdiv.length > 0){
                el.ddTable.attr("data-url",urlLov);
                el.ddTable.bootstrapTable();
                
            }
            if(bootsdiv.length > 0 && !el.ddDiv.is(":visible")){
                var top = ddLookup.offset().top + 30;
                var left = ddLookup.offset().left;
                
                el.ddDiv.css({
                    'top': top + 'px',
                    'left': left + 'px',
                    'bottom': 'auto',
                    'right': 'auto'
                });
            }
            firstTime = false;
            fromButton = true;
            if (el.ddDiv.is(":visible")) {
                el.ddDiv.slideUp();
            } else {
                el.ddDiv.slideDown();
            }
            
            //if(ddTextbox.val() != '') 
            el.ddTable.bootstrapTable('refresh', {
                url: urlLov 
            });
        });
        if(bootsdiv.length == 0){
            el.ddTable.bootstrapTable();
        }
        el.ddTable.on('post-body.bs.table', function (e) {
            
            if (!settings.isBindFunc) {
                var value_changed = false;
                if (!firstTime && !fromButton) {
                    var data = $(this).bootstrapTable('getData', 'useCurrentPage');
                    if (ddTextbox.val() == '' || ddTextbox.val() == null) {
                        $.each(settings.callbacks, function (key, val) {
                            $('#' + key).val('');
                            $('#' + key).data('text', '');
                        });
                    } else {
                        if (data.length == 1)  {
                            $.each(settings.callbacks, function (key, val) {
                                if ($(':input[name="' + key + '"]').length > 1) {
                                    $.each($(':input[name="' + key + '"]'), function (i, v) {
                                        if ($(this).val() === data[0][val]) {
                                            $(this).attr('checked', true);
                                        }
                                    });
                                    
                                } else {
                                    //remark by Rani 19-Jan-2022
									//if ($('#' + key).val() !== data[0][val]) {
                                        value_changed = true;
                                    //}
                                    $('#' + key).val(data[0][val]);
                                    $('#' + key).data('text', data[0][val]);
                                }
                                
                                
                            });
                            if(settings.multiple == true) {
                                if(!$('input[name="btSelectItem"]', $(this)).prop('checked')){
                                    $('input[name="btSelectItem"]', $(this)).click();
                                }
                                ddTextbox.val('');
                            }
                            el.ddDiv.slideUp();
                            
                            if (settings.nextFocus !== undefined && settings.nextFocus !== '') {
                                $('#' + settings.nextFocus).focus();
                            }
                            
                            var data_next_func_f = window[settings.nextFunction];
                            if (typeof (data_next_func_f) === 'function') {
                                //$.each(settings.callbacks, function (key, val) {
                                //data_next_func_f($('#' + key));
                                data_next_func_f(ddTextbox);
                                //});
                            }
                            
                        } else if (data.length === 0) {
                            el.ddDiv.slideUp();
                            $.each(settings.callbacks, function (key, val) {
                                value_changed = true;
                                if(settings.otherValue === false){
                                    $('#' + key).val('');
                                    $('#' + key).data('text', '');
                                } 
//                                else {
                                    //$('#' + key).val('');
                                    //$('#' + key).data('text', '');
//                                }
                            });
                            
                        } else {
                            el.ddDiv.slideDown();
                        }
                    }
                }
                if (value_changed) {
                    var data_func_change_f = window[settings.changeFunction];
                    if (typeof (data_func_change_f) === 'function') {
                        data_func_change_f();
                    }
                }
            } else {
                if (!firstTime && !fromButton) {
                    el.ddDiv.slideDown();
                }
            }
        });
        
        if(!settings.multiple){
            el.ddTable.on('click-row.bs.table', function (e, row, $element) {
                if (!settings.isBindFunc) {
                    el.ddDiv.slideUp();
                    var value_changed = false;
                    $.each(settings.callbacks, function (key, val) {
                        if ($('input[name="' + key + '"]').length > 1) {
                            $.each($('input[name="' + key + '"]'), function (i, v) {
                                if ($(this).val() === row[val]) {
                                    $(this).attr('checked', true);
                                }
                            });
                        } else {
                            if ($('#' + key).val() !== row[val]) {
                                value_changed = true;
                            }
                            
                            $('#' + key).val(row[val]);
                            $('#' + key).data('text', row[val]);
                        }
                    });
                    if (value_changed) {
                        var data_func_change_f = window[settings.changeFunction];
                        if (typeof (data_func_change_f) === 'function') {
                            data_func_change_f();
                        }
                    }
                } else {
                    data_bind_func_f(row);
                    
                    var valLength = ddTextbox.val().length * 2;
                    ddTextbox[0].setSelectionRange(valLength, valLength);
                }
                
                if (settings.nextFocus !== undefined && settings.nextFocus !== '') {
                    $('#' + settings.nextFocus).focus();
                }
                
                var data_next_func_f = window[settings.nextFunction];
                if (typeof (data_next_func_f) === 'function') {
                    //$.each(settings.callbacks, function (key, val) {
                    //data_next_func_f($('#' + key));
                    data_next_func_f(ddTextbox);
                    //});
                }
                
            });
        }
        
        return lovtable;
    };
}(jQuery));
