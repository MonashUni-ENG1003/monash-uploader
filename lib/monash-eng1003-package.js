'use babel';

import MonashEng1003PackageView from './monash-eng1003-package-view';
import MonashEng1003PackageHTTP from './monash-eng1003-package-http'
import { CompositeDisposable } from 'atom';

export default {

  monashEng1003PackageView: null,
  bottomPanel: null,
  subscriptions: null,
  monashEng1003http: null,

  activate(state) {
    this.monashEng1003PackageView = new MonashEng1003PackageView(state.monashEng1003PackageViewState);
    this.bottomPanel = atom.workspace.addBottomPanel({
      item: this.monashEng1003PackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'monash-eng1003-package:toggle': () => this.toggle(),
    }));

    this.monashEng1003http = new MonashEng1003PackageHTTP();
  },


  deactivate() {
    this.bottomPanel.destroy();
    this.subscriptions.dispose();
    this.monashEng1003PackageView.destroy();
  },

  serialize() {
    return {
      monashEng1003PackageViewState: this.monashEng1003PackageView.serialize()
    };
  },

  toggle() {
    console.log('MonashEng1003Package was toggled!');
    this.monashEng1003PackageView.listFolders();
    return (
      this.bottomPanel.isVisible() ?
      this.bottomPanel.hide() :
      this.bottomPanel.show()
    );
  },

  upload() {
    console.log("pre-upload");
    this.monashEng1003http.uploadAssignment(null, null);
  }

};
