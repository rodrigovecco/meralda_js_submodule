class MeraldaFileManagerHelper {

    constructor( opts = {}) {
        this.url = opts.url;
        this.opts = opts;
        this.debug = !!opts.debug;
        this.debug=true;
    }

    log() {
        if (this.debug) console.log("[MeraldaFM]", ...arguments);
    }

    // ============================================================
    // GET / POST NORMAL (con JSON)
    // ============================================================
    request(method, data = null) {
        this.log("REQUEST JSON", method, data);

        if (method === "GET") {
            return $.getJSON(this.url, data);
        }

        return $.ajax({
            url: this.url,
            method: "POST",
            data,
            dataType: "json"
        });
    }

    // ============================================================
    // FORM DATA -> Separa la URL + GET params del cuerpo FormData
    // ============================================================
    requestForm(action, formData, extraParams = {}) {

        this.log("REQUEST FORM", action, extraParams, formData);

        // --- Construimos URL con GET params ---
        let params = Object.assign({ action }, extraParams);
        console.log("url",this.url);
        let url = this.url + 
            (this.url.includes("?") ? "&" : "?") +
            $.param(params);

        this.log("UPLOAD URL:", url);

        return $.ajax({
            url: url,
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json"
        });
    }

    // ============================================================
    // PARSE TO DEVEXTREME
    // ============================================================
    parseResponse(promise, expectsItems = false, isChunk = false) {
        let self = this;

        return promise.then(resp => {

            self.log("Response:", resp);

            if (resp?.success) {

                if (expectsItems)
                    return resp.items || [];

                if (isChunk && !resp.name)
                    return { uploaded: false };

                if (resp.name) {
                    return {
                        uploaded: true,
                        name: resp.name,
                        fileName: resp.name,
                        path: resp.path,
                        isDirectory: false
                    };
                }

                return true;
            }

            let msg = resp?.msg || "Unknown error";
            return $.Deferred().reject(new Error(msg)).promise();
        });
    }

    // ============================================================
    // DEVEXTREME PROVIDER
    // ============================================================
    createProvider() {

        let self = this;

        return new DevExpress.fileManagement.CustomFileSystemProvider({

            // -------- LIST --------
            getItems(pathInfo) {
                return self.parseResponse(
                    self.request("GET", {
                        action: "list",
                        path: pathInfo?.path || ""
                    }),
                    true
                );
            },

            // -------- MKDIR --------
            createDirectory(parentDir, name) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "mkdir",
                        path: parentDir?.dataItem?.path || "",
                        name
                    })
                );
            },

            // -------- DELETE --------
            deleteItem(item) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "delete",
                        path: item.dataItem.path
                    })
                );
            },

            // -------- RENAME --------
            renameItem(item, newName) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "rename",
                        path: item.dataItem.path,
                        newName
                    })
                );
            },

            // -------- MOVE --------
            moveItem(item, destDir) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "move",
                        from: item.dataItem.path,
                        to: destDir.dataItem.path
                    })
                );
            },

            // -------- COPY --------
            copyItem(item, destDir) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "copy",
                        from: item.dataItem.path,
                        to: destDir.dataItem.path
                    })
                );
            },

            // ======================================================
            // UPLOAD CHUNK CORRECTO
            // ======================================================
            uploadFileChunk(file, info, destinationDirectory) {

                console.log("uploadFileChunk", file, info, destinationDirectory);

                // 1. Create uploadId once
                if (info.chunkIndex === 0) {
                    info.customData = info.customData || {};
                    info.customData.uploadId =
                        "upl_" + Math.random().toString(36).substring(2);
                }

                let uploadId = info.customData.uploadId;

                // 2. Destination (REAL argument #3)
                let dest = "";
                if (destinationDirectory && destinationDirectory.path !== undefined) {
                    dest = destinationDirectory.path;
                }

                // 3. Correct chunk field → chunkBlob (NOT fileChunk)
                let fd = new FormData();
                fd.append("chunk", info.chunkBlob);

                // 4. Send to server
                return self.parseResponse(
                    self.requestForm(
                        "uploadchunk",
                        fd,
                        {
                            uploadId,
                            destinationDirectory: dest,
                            chunkIndex: info.chunkIndex,
                            chunkCount: info.chunkCount,
                            fileName: file.name
                        }
                    ),
                    false,
                    true
                );
            },


            abortFileUpload(file, uploadInfo) {
                return self.parseResponse(
                    self.request("POST", {
                        action: "cancelUpload",
                        uploadId: uploadInfo.uploadId
                    })
                );
            },

            //uploadChunkSize: 1024 * 1024, // 1MB
        });
    }
}
