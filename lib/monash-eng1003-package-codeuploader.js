/*
 * vim: ts=4 sw=4 et tw=0 wm=0
 *
 * ENG1003 Assignment Uploader Brackets extension
 *
 * Written by Michael Wybrow
 *
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2016  Monash University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

 export default class Uploader {

   var self                   = this;
   var systemSettings         = systemSettingsPara;
   var Dialogs                = DialogsPara;
   var DefaultDialogs         = DefaultDialogsPara;
   var useIndividualDirOption = false;

   constructor(systemSettingsPara, DialogsPara, DefaultDialogsPara) {
     this.systemSettings = systemSettingsPara;
     this.Dialogs = DialogsPara;
     this.DefaultDialogs = DefaultDialogsPara;
     this.useIndividualDirOption = false;
   }

   post(path, params, method) {
     method = method || "post"; // Set method to post by default if not specified.

     var form = document.createElement("form");
     form.setAttribute("target", "_blank");
     form.setAttribute("method", method);
     form.setAttribute("action", path);

     for (var key in params) {
         if (params.hasOwnProperty(key)) {
             var hiddenField = document.createElement("input");
             hiddenField.setAttribute("type", "hidden");
             hiddenField.setAttribute("name", key);
             hiddenField.setAttribute("value", params[key]);

             form.appendChild(hiddenField);
         }
     }

     document.body.appendChild(form);
     form.submit();
   }

   publishFiles(listOfFiles) {
     if (listOfFiles.length === 0) {
         Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "ENG1003 Uploader", "No valid (correctly named) files for upload.");
         return;
     }

     var files2PublishJSON = JSON.stringify(listOfFiles);
     var server = systemSettings.server;
     var path = server + '/uploader/publish.php';
     var params            = {
         teamDir         : systemSettings.teamDir,
         user            : systemSettings.userName,
         files           : files2PublishJSON,
         assignment      : systemSettings.assignment,
         useIndividualDir: ((systemSettings.updateUserDir) ? "1" : "0")
     };
     post(path, params);

   }

   uploadToWebsite(listOfFiles, listFilesFullPath) {
     console.log('uploadToWebsite() called');
     var filesJSON             = encodeURIComponent(JSON.stringify(listOfFiles));
     var server                = systemSettings.server;
     var str                   = server + '/uploader/publishcheck.php?teamDir=' + systemSettings.teamDir + '&user=' +
         systemSettings.userName + '&assignment=' + systemSettings.assignment + '&files=' + filesJSON + '&callback=define';
     require([str], function (data) {
             if (data.error !== undefined) {
                 Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "ENG1003 Uploader", data.error);
                 console.log(data.error);
             } else {
                 var file2Upload = [];
                 var n           = data.files.length;
                 var i           = 0;
                 loadFilesContent(i, n, []);


             }
       //       console.log(data)
        },
         function (err) {
             Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "ENG1003 Uploader", err.message);
         }
     );

   }

   loadFilesContent(i, n, file2Upload) {
       console.log('i=' + i + '     and n=' + n);

       if (i < n) {
           if (data.files[i].valid) {
               var file = FileSystem.getFileForPath(listFilesFullPath[i]);
               FileUtils.readAsText(file)
                   .done(function (text, readTimeStamp) {
                       var fileInfo = {
                           filename: listOfFiles[i],
                           content : text
                       };
                       file2Upload.push(fileInfo);
                       loadFilesContent(i + 1, n, file2Upload);
                   })
                   ail(function (error) {
                       console.log(error);
                   `
                    `});
           } else {
               loadFilesContent(i + 1, n, file2Upload);
           }
       }
       else {
           publishFiles(file2Upload);
           console.log(file2Upload);
       }
   }

 }
