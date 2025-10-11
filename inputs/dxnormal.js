//20240122
function mw_datainput_item_DX_normal_Autocomplete(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxAutocomplete(ops);
		
		return $($(container)).dxAutocomplete('instance');
		
	}
	this.onItemClick=function(e){
		console.log("onItemClick",e);
		//can be rewritten by UI or others
	}
	
	this.getDataStore=function(){
		if(!this.DataStore){
			this.DataStore=this.getDataSourceMan().getDataStore();
		}
		return this.DataStore;	
	}
	this.getDataSourceMan=function(){
		if(this.dataSourceMan){
			return this.dataSourceMan;	
		}
		this.createDataSourceMan()
		return this.dataSourceMan;	
	}
	
	this.createDataSourceMan=function(){
		var _this=this;
		var params=this.options.get_param_if_object("dataSourceMan",true);
		if(mw_is_function(params["isDSMan"])){
			this.dataSourceMan=params;
		}else{
			this.dataSourceMan=new mw_devextreme_data(params);	
		}
		return this.dataSourceMan;	
	}
	this.getDataSource=function(){
		if(!this.dataSource){
			this.dataSource=this.getDataSourceMan().getDataSource();
		}
		return this.dataSource;	
	}
	this.getDXOptions=function(){
		var _this=this;
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("DXOptions.placeholder")){
				params.placeholder=p;
			}
		}
		if(this.options.get_param_if_object("dataSourceMan")){
			if(!params["dataSource"]){
				params["dataSource"]=this.getDataSource();
			}


		}
		if(!params["onItemClick"]){
			params["onItemClick"]=function(e){_this.onItemClick(e)};
		}
		
		return params;

	
	}

}
function mw_datainput_item_DXnumber(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxNumberBox(ops);
		
		return $($(container)).dxNumberBox('instance');
		
	}

}

function mw_datainput_item_normal_dx_textbox(options){
	mw_datainput_item_dx_normal.call(this,options);

}

function mw_datainput_item_dx_normal(options){
	mw_datainput_item_base.call(this,options);
	this.getDXOptions=function(){
		var _this=this;
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("DXOptions.placeholder")){
				params.placeholder=p;
			}
		}
		
		return params;

	
	}
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxTextBox(ops);
		
		return $($(container)).dxTextBox('instance');
		
		
	}
	this.createDXControl=function(){
		if(!this.dx_dom_elem){
			return false;	
		}
		var _this=this;
		var o=this.getDXOptions();
		this.dx_ctr=this.createDXctr(this.dx_dom_elem,o);
		this.onDXCreated(this.dx_ctr);
		
	}
	this.onDXCreated=function(ctr){
		if(!ctr){
			return false;	
		}
		//console.log(ctr);
		var e=ctr.element();
		if(!e){
			return false;	
		}
		
	}

	this.afterAppend=function(){
		this.doAfterAppendFncs();

		this.createDXControl();
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		this.update_input_atts();
		this.initTooltipFromParams();
		
	}
	
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		c.className="form-control";
		c.type="hidden";
		this.set_def_input_atts(c);
		return c;
	}

	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			//c.className="form-group row";
			c.className="form-group mw-form-group-horizontal";
		}
		
		this.frm_group_elem=c;
		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}
		var inputelem=this.get_input_elem();
		if(inputelem){
			c.appendChild(inputelem);	
		}
		var cc;

		this.dx_dom_elem_out=document.createElement("div");
		if(this.is_horizontal()){
			//cc=document.createElement("div");
			//cc.className="input-group";
			this.dx_dom_elem_out.className="input-group";
		}
		
		c.appendChild(this.dx_dom_elem_out);	
		
		this.dx_dom_elem=document.createElement("div");
		this.dx_dom_elem.className="mw-dx-normal-ctr";
		//this.dx_dom_elem.className="form-control mw-dx-normal-ctr";
		//c.appendChild(this.dx_dom_elem);
		this.dx_dom_elem_out.appendChild(this.dx_dom_elem);
		this.create_notes_elem_if_req();
		return c;
	}
	this.get_tooltip_target_elem=function(){
		return this.dx_dom_elem;	
	}
	this.set_input_value=function(val){
		//console.log("set_input_value",val);
		if(this.input_elem){

			this.input_elem.value=this.format_input_value(val)+"";	
			
		
		}
		this.updateDXValue();
		
	}
	this.updateDXValue=function(){
		
		if(this.dx_ctr){
			this.dx_ctr.option("value",this.get_input_value());	
		}
	}

	
	
	this.onDXValueChanged=function(e){
		
		if(e){
			this.DXValue=e.value;
			if(this.input_elem){
				this.input_elem.value=	e.value;
			}
		}
		this.on_change();
	}
	this.update_input_atts=function(input){
		var required=this.options.get_param_as_boolean("state.required");
		var disabled=this.options.get_param_as_boolean("state.disabled");
		var readOnly=this.options.get_param_as_boolean("state.readOnly");
		if(disabled){
			required=false;	
		}
		if(readOnly){
			required=false;	
		}
		
		if(this.dx_ctr){
			
			this.dx_ctr.option("disabled",disabled);	
			this.dx_ctr.option("required",required);	
			this.dx_ctr.option("readOnly",readOnly);	
		}
	}
	

}


function mw_datainput_item_DX_dropDownTreeView(options){
    mw_datainput_item_dx_normal.call(this, options);

    this.createDXctr = function(container, ops){
        //console.log("[DX_dropDownTreeView] createDXctr", ops);
        return $($(container)).dxDropDownBox(ops).dxDropDownBox('instance');
    };

    this.arraysEqual = function(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        var sorted1 = arr1.slice().sort();
        var sorted2 = arr2.slice().sort();
        for (var i = 0; i < sorted1.length; i++) {
            if (sorted1[i] != sorted2[i]) return false;
        }
        return true;
    };

    this._filterByLevelIndex = function(nodes, levelIndex){
        var keys = [];
        nodes.forEach((n) => {
            if (n.itemData && n.itemData.level == levelIndex) {
                keys.push(n.key);
            }
        });
        return keys;
    };

    this.syncTreeViewSelection = function(treeViewInstance, value){
        //console.log("[DX_dropDownTreeView] syncTreeViewSelection", value);
        if (!treeViewInstance) return;
        treeViewInstance.unselectAll();
        if (value && value.length) {
            value.forEach(function(key){
                treeViewInstance.selectItem(key);
            });
        }
    };

    this.getDXOptions = function(){
        var _this = this;
        var params = this.options.get_param_if_object("DXOptions", true);
		console.log("[DX_dropDownTreeView] Original DXOptions", params);

        if(!params.valueExpr) params.valueExpr = "id";
        if(!params.displayExpr) params.displayExpr = "name";

        var levelIndex = params.levelIndex;
        //console.log("[DX_dropDownTreeView] levelIndex:", levelIndex);

        // 1️⃣ FLATTEN THE TREE DATA
        var flatDataSource = [];
        function flatten(items, parentId){
            items.forEach(function(item){
                flatDataSource.push({
                    id: item.id,
                    name: item.name,
                    level: item.level,
                    parentId: parentId || null
                });
                if(item.items && item.items.length){
                    flatten(item.items, item.id);
                }
            });
        }
		if(!params.dataSource){
			params.dataSource = [];
		}
        flatten(params.dataSource);
        //console.log("[DX_dropDownTreeView] Flattened DataSource", flatDataSource);

        // 2️⃣ Replace the DropDownBox's dataSource
        params.dataSource = flatDataSource;

        // 3️⃣ Placeholder
        var p = this.options.get_param_or_def("placeholder", false);
        if(p && !params.placeholder){
            params.placeholder = p;
        }

        // 4️⃣ Initial Value
        if(this.DXValue){
            params.value = this.parse_input_value(this.DXValue);
        }

        // 5️⃣ Display Value Formatter
		params.fieldTemplate = function (selectedIds, fieldElement) {
			//console.log("[DX_dropDownTreeView] fieldTemplate - selectedIds", selectedIds);

			if (!Array.isArray(selectedIds) || !selectedIds.length) {
				selectedIds = [];
			}
			//console.log("[DX_dropDownTreeView] fieldTemplate - selectedIds", selectedIds);

			var levelIndex = params.levelIndex;
			var names = [];

			function findNames(items) {
				items.forEach(function(item) {
					if (selectedIds.includes(item.id)) {
						if (levelIndex == null || item.level == levelIndex) {
							names.push(item.name);
						}
					}
					if (item.items && item.items.length) {
						findNames(item.items);
					}
				});
			}
			//console.log("[DX_dropDownTreeView] fieldTemplate - dataSource", params.dataSource);
			findNames(params.dataSource);

			//console.log("[DX_dropDownTreeView] fieldTemplate - names", names);
			return $("<div>")
				.dxTextBox({
					value: names.join(", "),
					readOnly: true
				});
		};
        // 6️⃣ TreeView Options
        var treeViewOpts = $.extend({}, params.treeViewOptions, {
            dataSource: flatDataSource,
            dataStructure: "plain",
            parentIdExpr: "parentId",
            keyExpr: params.valueExpr,
            displayExpr: params.displayExpr,
            selectionMode: "multiple",
            showCheckBoxesMode: "normal",
            selectNodesRecursive: params.treeViewOptions?.selectNodesRecursive ?? false
        });

        // 7️⃣ Content Template
        params.contentTemplate = function(e){
            //console.log("[DX_dropDownTreeView] contentTemplate init");
            var treeViewInstance;

            var $treeView = $("<div>").dxTreeView($.extend({}, treeViewOpts, {
                selectedItemKeys: e.component.option("value"),
                onContentReady: function(args){
                    console.log("[DX_dropDownTreeView] onContentReady");
                    _this.syncTreeViewSelection(args.component, e.component.option("value"));
                },
                onItemSelectionChanged: function(args){
                    //console.log("[DX_dropDownTreeView] onItemSelectionChanged raw", args);
                    var selectedNodes = args.component.getSelectedNodes();
                    var keys;
                    if (levelIndex != null) {
                        keys = _this._filterByLevelIndex(selectedNodes, levelIndex);
                    } else {
                        keys = selectedNodes.map((n) => n.key);
                    }
                    //console.log("[DX_dropDownTreeView] onItemSelectionChanged - filtered keys", keys);
                    if (!_this.arraysEqual(e.component.option("value"), keys)) {
                        e.component.option("value", keys);
                    }
                    _this.onDXValueChanged({ value: keys });
                }
            }));

            treeViewInstance = $treeView.dxTreeView('instance');

            e.component.on('valueChanged', function(args){
                //console.log("[DX_dropDownTreeView] DropDownBox valueChanged", args.value);
                if (!treeViewInstance) return;
                var selectedNodes = treeViewInstance.getSelectedNodes();
                var keys;
                if (levelIndex != null) {
                    keys = _this._filterByLevelIndex(selectedNodes, levelIndex);
                } else {
                    keys = selectedNodes.map((n) => n.key);
                }
                if (!_this.arraysEqual(keys, args.value)) {
                    console.log("[DX_dropDownTreeView] syncing TreeView selection to", args.value);
                    _this.syncTreeViewSelection(treeViewInstance, args.value);
                }
                _this.onDXValueChanged({ value: args.value });
            });

            return $treeView;
        };

        // 8️⃣ Default onValueChanged
        if(!params.onValueChanged){
            params.onValueChanged = function(e){ _this.onDXValueChanged(e); };
        }

        return params;
    };

    this.onDXValueChanged = function(e){
        console.log("[DX_dropDownTreeView] onDXValueChanged", e);
        if(!e) return;

        var filtered = e.value;
        var levelIndex = this.options.get_param_or_def("DXOptions.levelIndex", null);

        // Filter by levelIndex if needed
        if(levelIndex != null){
            var allNodes = this.options.get_param_or_def("DXOptions.dataSource", null);
            if(allNodes){
                filtered = filtered.filter((id) => {
                    var node = _findNodeById(allNodes, id);
                    return node && (node.level == levelIndex);
                });
            }
        }

        this.DXValue = filtered;
        console.log("[DX_dropDownTreeView] Updated DXValue", this.DXValue);

        if(this.input_elem){
            this.input_elem.value = this.format_input_value(this.DXValue);
			
            console.log("[DX_dropDownTreeView] Updated hidden input", this.input_elem.value);
        }

        this.on_change();

        function _findNodeById(nodes, id){
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].id == id) return nodes[i];
                if(nodes[i].items){
                    var res = _findNodeById(nodes[i].items, id);
                    if(res) return res;
                }
            }
            return null;
        }
    };

    this.set_input_value = function(val){
		console.log("[DX_dropDownTreeView] set_input_value", val);

		// Siempre parsea a array de IDs
		this.DXValue = this.parse_input_value(val);

		// Actualiza el input hidden
		if(this.input_elem){
			this.input_elem.value = this.format_input_value(this.DXValue);
			//console.log("[DX_dropDownTreeView] set_input_value - hidden updated", this.input_elem.value);
		}

		// Actualiza el DropDownBox
		this.updateDXValue();
	};

	this.updateDXValue = function(){
		if(this.dx_ctr){
			console.log("[DX_dropDownTreeView] updateDXValue to", this.DXValue);
			//var nvalue=this.parse_input_value(this.DXValue);
			this.dx_ctr.option("value", this.DXValue);
		}
	};

    this.format_input_value = function(val){
        if(Array.isArray(val)){
            return val.join(",");
        }
        return val != null ? val+"" : "";
    };

  
	this._safe_parse_id = function(v){
		if (typeof v === "number") {
       	 	return v;  
    	}
		var n = parseInt(v, 10);
		if (!isNaN(n) && (n + "") === v.trim()) {
			return n;
		}
		return v.trim();
	};

	this.parse_input_value = function(val) {
		//console.log("[DX_dropDownTreeView] parse_input_value", val);

		if (val === null || val === undefined || val === '') {
			return [];
		}

		if (Array.isArray(val)) {
			return val.map((v) => this._safe_parse_id(v));
		}

		if (typeof val === "string") {
			val = val.trim();
			if (val.indexOf(",") !== -1) {
				return val.split(",").map((v) => this._safe_parse_id(v));
			} else {
				return [this._safe_parse_id(val)];
			}
		}

		// Para números u otros tipos que sean un solo valor
		return [this._safe_parse_id(val)];
	};

    this.get_input_value = function(){
        return this.format_input_value(this.DXValue);
    };
}
