'use babel';

import MonashEng1003PackageHTTP from './monash-eng1003-package-http';

export default class MonashEng1003PackageView {

  _http: null;

  constructor(serializedState) {
    var message;
    var divBlock;

    this._http = new MonashEng1003PackageHTTP();


    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('monash-eng1003-package');

    var close = document.createElement('span');
    close.classList.add('icon', 'icon-x', 'inline-block');
    close.id = "close";
    close.addEventListener('click', function() {
      atom.commands.dispatch(this, 'monash-eng1003-package:toggle');
    });
    this.element.appendChild(close);

    this.serverDiv = document.createElement('div');
    this.serverDiv.classList.add("block");
    this.serverDiv.id = "server"
    this.element.appendChild(this.serverDiv);


    // Server Address input block
    divBlock = document.createElement('div');
    divBlock.classList.add("block");
    message = document.createElement('label');
    message.textContent = "Server Address";
    this.serveraddress = document.createElement('input');
    this.serveraddress.type = "text";
    this.serveraddress.placeholder = "https://example.com/";
    this.serveraddress.value = "https://dev.eng1003.monash/";
    this.serveraddress.classList.add('input-text', 'native-key-bindings');
    this.serveraddress.id= "serveraddress";
    this.serverDiv.appendChild(divBlock);
    divBlock.appendChild(message);
    divBlock.appendChild(this.serveraddress);

    // User Hash input block
    divBlock = document.createElement('div');
    divBlock.classList.add("block");
    message = document.createElement('label');
    message.textContent = "User Hash";
    this.hash = document.createElement('input');
    this.hash.type = "text";
    this.hash.classList.add('input-text', 'native-key-bindings');
    this.hash.id = "hash";
    this.serverDiv.appendChild(divBlock);
    divBlock.appendChild(message);
    divBlock.appendChild(this.hash);

    divBlock = document.createElement('div');
    divBlock.classList.add('block');
    var submit = document.createElement('button');
    submit.classList.add('btn', 'btn-primary');
    submit.textContent = "Check";
    submit.addEventListener('click', function() {
      this.checkServer();
    }.bind(this));
    divBlock.appendChild(submit);
    this.serverDiv.appendChild(divBlock);


    divBlock = document.createElement('div');
    divBlock.classList.add('block');
    divBlock.id = "assignmentBlock";
    var divBlock2 = document.createElement('div');
    divBlock2.classList.add('block');
    message = document.createElement('label');
    message.classList.add('inline-block');
    message.textContent = "Directory:";
    divBlock2.appendChild(message);
    this.directory = document.createElement('select');
    this.directory.classList.add('input-select', "inline-block");
    this.directory.id = "directorySelect";
    this.directory.multiple = false;
    divBlock2.appendChild(this.directory);
    divBlock.appendChild(divBlock2);

    message = document.createElement('label');
    message.classList.add('inline-block');
    message.textContent = "Assignments:";
    divBlock.appendChild(message);
    this.assignment = document.createElement('select');
    this.assignment.classList.add('input-select', "inline-block");
    this.assignment.id = "assignmentSelect";
    this.assignment.multiple = false;
    divBlock.appendChild(this.assignment);
    divBlock2 = document.createElement('div');
    divBlock2.classList.add('block');
    var label = document.createElement('label');
    label.classList.add('input-label', 'inline-block');
    this.teamDir = document.createElement('input');
    this.teamDir.classList.add('input-checkbox');
    this.teamDir.type = 'checkbox';
    this.teamDir.checked = true;
    label.textContent = "Use Team Directory";
    label.prepend(this.teamDir);
    divBlock2.appendChild(label)
    divBlock.appendChild(divBlock2);

    divBlock2 = document.createElement('div')
    divBlock2.classList.add('block');
    var submit = document.createElement('button');
    submit.classList.add('btn', 'btn-success', "inline-block");
    submit.textContent = "Upload";
    submit.addEventListener('click', function() {
      this.uploadToServer();
    }.bind(this));
    divBlock2.appendChild(submit);
    var change = document.createElement('button');
    change.classList.add('btn', 'btn-error', "inline-block");
    change.textContent = "Change User/Server";
    change.addEventListener('click', function() {
      document.querySelector('#assignmentBlock').style.display = "none";
      document.querySelector('#server').style.display = "block";
    }.bind(this));
    divBlock2.appendChild(change);
    divBlock.appendChild(divBlock2);
    this.element.appendChild(divBlock);

    this.errormessage = document.createElement('div');
    this.errormessage.classList.add('error-message');
    var icon = document.createElement('span');
    icon.classList.add('icon', 'icon-stop');
    var message = document.createElement('span');
    message.classList.add("message");
    this.errormessage.appendChild(icon);
    this.errormessage.appendChild(message);
    this.element.appendChild(this.errormessage);


    if(serializedState != null)
    {
      this.serveraddress.value = serializedState.serveraddress;
      this.hash.value = serializedState.hash;
      this.assignment.value = serializedState.assignment;
      this.teamDir.checked = serializedState.teamDir;
    }

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    var state = {
      serveraddress: this.serveraddress.value,
      hash: this.hash.value,
      assignment: this.assignment.value,
      teamDir: this.teamDir.checked
    }

    return state;
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  listFolders()
  {
    if(document.getElementById('directorySelect') == null)
      return;

    try {
      while(document.getElementById('directorySelect').length > 0)
      {
        document.getElementById('directorySelect').remove(0);
      }
      for(var directoryIndex in atom.project.getDirectories())
      {
        var option = document.createElement("option");
        option.text = atom.project.getDirectories()[directoryIndex].getBaseName();
        option.value = directoryIndex;
        document.getElementById('directorySelect').add(option);
      }
      console.log("monashEng1003PackageView.listFolders() executed");
    } catch (e) {
      console.warn(e);
      atom.notifications.addError(e.message);
    }

  }

  checkServer()
  {
    try {
      var checkedURL = this.textFormatCheck();
      this.listFolders();

      this._http.checkAssignment(checkedURL, this.hash.value, function(response) {
        while(document.getElementById('assignmentSelect').length > 0)
        {
          document.getElementById('assignmentSelect').remove(0);
        }

        for(arrayIndex in response)
        {
          var option = document.createElement("option");
          option.text = response[arrayIndex]['title'];
          option.value = response[arrayIndex]['shortName'];
          document.getElementById('assignmentSelect').add(option);
        }
        document.querySelector(".error-message").style.display = "none";
        document.getElementById('assignmentBlock').style.display = "block";
        document.querySelector("#server").style.display = "none";
      }, function(event) {
        console.warn(event);
        atom.notifications.addError(event);
      });

      console.log("monashEng1003PackageView.checkServer() executed");
    } catch (e) {
      console.warn(e);
      atom.notifications.addError(e);
    }

  }

  uploadToServer()
  {
    var self = this;
    try {

      var checkedURL = this.textFormatCheck();

      this._http.uploadAssignment(checkedURL, this.hash.value, this.teamDir.checked, this.assignment.selectedIndex, this.directory.selectedIndex,
        function(event) {
          console.log(event);
          document.querySelector(".error-message").style.display = "none";
          atom.commands.dispatch(self.getElement(), "monash-eng1003-package:toggle");
          atom.notifications.addSuccess("Upload Successful");
        }, function(event){
          console.warn(event);
          atom.notifications.addError(event);
        });
        console.log("monashEng1003PackageView.uploadToServer() executed");
      } catch (e) {
        console.warn(e);
        atom.notifications.addError(e);
      }

  }

  textFormatCheck()
  {
    var url  = this.serveraddress.value;
    url = url.replace(/\s/g, "");
    if(url.match(/http:/g))
      throw "Must use HTTPS protocol";
    if(url.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g))
      throw "Must use Domain Server Name (eg. example.com)"
    if(!url.match(/:\/\//g))
      url = "https://" + url;
    if(url.charAt(url.length-1) != "/")
      url += "/";
    return url;

  }

}
