// ===============================================================
// mwuihelper_ajaxelem_devextreme_scheduler.js
// Reusable AJAX helper for DevExtreme Scheduler widgets.
// ---------------------------------------------------------------
// - Extends mwuihelper_ajaxelem
// - Dynamically loads scheduler configuration via AJAX
// - Creates the DevExtreme dxScheduler directly (no intermediate manager)
// - Uses mw_devextreme_data for remote data loading
// ===============================================================

function mwuihelper_ajaxelem_devextreme_scheduler(params) {
	mwuihelper_ajaxelem.call(this,params);
    /**
     * Called automatically when AJAX response is loaded successfully.
     * Expects the backend to return:
     *  - jsresponse.scheduleroptions → object with dxScheduler config
     *  - jsresponse.dataSourceMan   → object with remote DataSource parameters
     */
    this.onLoadedDataOK = function() {
        if (!this.loadedData) {
            return this.onLoadedDataFail();
        }

        // === 1️⃣ Extract Scheduler options (DevExtreme configuration)
        this.schedulerOptions = this.loadedData.get_param_if_object("jsresponse.scheduleroptions");
        if (!this.schedulerOptions) {
            console.log("❌ No scheduleroptions found in response");
            return this.onLoadedDataFail();
        }


        // === 2️⃣ Extract DataSource manager (mw_devextreme_data)
        var dsparams = this.loadedData.get_param_if_object("jsresponse.dataSourceMan", true);
        if (!dsparams) {
            console.log("❌ No dataSourceMan params found in response");
            return this.onLoadedDataFail();
        }

        // If the backend already passed an instantiated mw_devextreme_data object, reuse it.
        if (mw_is_function(dsparams["isDSMan"])) {
            this.dataSourceMan = dsparams;
        } else {
            this.dataSourceMan = new mw_devextreme_data(dsparams);
        }

        // === 3️⃣ Attach the remote DataSource to the Scheduler options
        this.schedulerOptions.dataSource = this.dataSourceMan.getDataSource();

		console.log("✅ Scheduler options and DataSource prepared", this.schedulerOptions);

        // === 4️⃣ Create the DevExtreme Scheduler
        this.createScheduler();
    };

    /**
     * Builds and renders the DevExtreme Scheduler on the target DOM element.
     */
    this.createScheduler = function() {
        if (!this.dom_body) {
            console.log("⚠️ No DOM body defined for scheduler");
            return false;
        }
        if (!this.schedulerOptions) {
            console.log("⚠️ Scheduler options not defined");
            return false;
        }

        // Clear any existing content before rendering
        this.clearBody();

        // Initialize DevExtreme Scheduler
        $(this.dom_body).dxScheduler(this.schedulerOptions);

        console.log("✅ Scheduler initialized successfully");
        return true;
    };
}

// Inherit all base methods (AJAX loading, container management, etc.)
//mwuihelper_ajaxelem_devextreme_scheduler.prototype = new mwuihelper_ajaxelem();
