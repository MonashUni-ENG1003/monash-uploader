'use babel';

import MonashEng1003Package from '../lib/monash-eng1003-package';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('MonashEng1003Package', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('monash-eng1003-package');
  });

  describe('when the monash-eng1003-package:toggle event is triggered', () => {
    it('hides and shows the bottom panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.monash-eng1003-package')).not.toExist();

      waitsForPromise(() => {
        return activationPromise;
      });

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'monash-eng1003-package:toggle');

      runs(() => {
        expect(workspaceElement.querySelector('.monash-eng1003-package')).toExist();

        let monashEng1003PackageElement = workspaceElement.querySelector('.monash-eng1003-package');
        expect(monashEng1003PackageElement).toExist();

        let monashEng1003PackagePanel = atom.workspace.panelForItem(monashEng1003PackageElement);
        expect(monashEng1003PackagePanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'monash-eng1003-package:toggle');
        expect(monashEng1003PackagePanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.monash-eng1003-package')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'monash-eng1003-package:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let monashEng1003PackageElement = workspaceElement.querySelector('.monash-eng1003-package');
        expect(monashEng1003PackageElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'monash-eng1003-package:toggle');
        expect(monashEng1003PackageElement).not.toBeVisible();
      });
    });
  });
});
