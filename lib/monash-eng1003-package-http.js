'use babel';



export default class MonashEng1003PackageHTTP {

  _assignmentDetails: null;

  constructor() {
  }

  checkAssignment(url, hash, successCallback, failCallback) {
    let self = this;
    let fullURL = url + "api/v1/assignments.php";
    fullURL += ("?hash=" + hash);
    var xhttp = new XMLHttpRequest();

    // TODO: This needs some heavy checks
    xhttp.open("GET", fullURL, true);
    xhttp.onload = function()
    {
      if (this.status == 200)
      {
        var response = JSON.parse(this.responseText);
        self._assignmentDetails = response;
        successCallback(response);
      }
      else
      {
        failCallback(this.statusText);
      }
    };
    xhttp.onerror = function()
    {
      failCallback(this);
    };
    xhttp.send();
  }

  uploadAssignment(url, hash, teamDir, assignmentIndex, directoryIndex, successCallback, failCallback) {
    // TODO: Post to publishcheck2.php/publish2.php
    /*
    key = query
    assignment
    file
    isTeamDir (1)
    */
    let self = this;
    console.log(self._assignmentDetails);

    var fileScan = new Promise((resolve, reject) => {
      let FilesInJSON = [];

      let PromiseLand = [];

      let rootDirectory = atom.project.getDirectories()[directoryIndex];

      for(let i=0; i<self._assignmentDetails[assignmentIndex].files.length; i++)
      {
        let filePromise = new Promise((resolve, reject) => {
          rootDirectory.getFile(self._assignmentDetails[assignmentIndex].files[i].solutionPath).exists().then(
            function(exists)
            {
              if(exists)
                rootDirectory.getFile(self._assignmentDetails[assignmentIndex].files[i].solutionPath).read(true).then(
                  function(data)
                  {
                    resolve(data)
                  });
              else
                reject(self._assignmentDetails[assignmentIndex].files[i].solutionPath + " not found.");
          });
        });
        PromiseLand.push(filePromise);
      }
      Promise.all(PromiseLand).then((results) => {
        for (i=0; i<results.length; i++)
        {
          let fileObject = {
            filename: self._assignmentDetails[assignmentIndex].files[i].solutionPath,
            content: results[i]
          }
          FilesInJSON.push(fileObject);
        }
        console.log(FilesInJSON);
        resolve(FilesInJSON);
      },(error) => {
        failCallback(error);
      });
    });

    fileScan.then((fileJSON) => {
      console.log(fileJSON);
      webService = new Promise((resolve, reject) => {
        fileJSON = JSON.stringify(fileJSON);
        var xhttp = new XMLHttpRequest();

        let fullURL = url + 'uploader/publish2.php';
        params = ""
        params += ('key=' + hash);
        params += ('&isTeamDir=');

        if(teamDir)
          params += '1';
        else
          params += '0';

        params += ('&assignment=' + self._assignmentDetails[assignmentIndex].shortName);
        params += ('&files=' + encodeURIComponent(fileJSON));


        xhttp.open("POST", fullURL, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onload = function()
        {
          // TODO: Handle 403 status code
          if(this.status == 200)
          {
            resolve(this.statusText)
          }
          else
          {
            reject(this.statusText);
          }
        };
        xhttp.onerror = function()
        {
          reject(this);
        };
        xhttp.send(params);
      }).then( function(data) {
        console.log(data);
        successCallback(data);
      }).catch( function(data) {
        failCallback(data);
      });
    }).catch( function (data) {
      failCallback(data);
    })
;


    console.log("upload toggled");
  }

  directoryTransval(directory) {
    let fileList = [];
    let currentEntries = directory.getEntriesSync();

    for(let i = 0; i< currentEntries.length; i++)
    {
      if(currentEntries[i].isDirectory())
      {
        let childList = this.directoryTransval(currentEntries[i]);
        fileList.push.apply(fileList, childList);
      }
      else
      {
        fileList.push(currentEntries[i].getPath());
      }
    }

    return fileList;
  }
}
