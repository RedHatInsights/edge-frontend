describe('System Details', () => {
  it('Retry Popover', () => {
    cy.intercept(
      '/api/edge/v1/devices/devicesview?uuid=296c483d-5d24-4283-bd6e-fd451118fbd2',
      { fixture: 'getDevicesView' }
    );

    cy.intercept('/api/edge/v1/devices/296c483d-5d24-4283-bd6e-fd451118fbd2', {
      fixture: 'getDevicesId',
    });

    cy.intercept(
      '/api/inventory/v1/hosts/296c483d-5d24-4283-bd6e-fd451118fbd2',
      { fixture: 'getInventoryHosts' }
    );

    cy.intercept(
      '/api/inventory/v1/hosts/296c483d-5d24-4283-bd6e-fd451118fbd2/system_profile?fields%5Bsystem_profile%5D%5B%5D=operating_system',
      { fixture: 'getInventoryHostsOperatingSystemVersion' }
    );

    cy.intercept(
      '/api/vulnerability/v1/systems/296c483d-5d24-4283-bd6e-fd451118fbd2/cves?page=1&page_size=20&sort=-public_date&show_advisories=true',
      { fixture: 'getVulnerabilitySystem' }
    );

    cy.intercept(
      '/api/edge/v1/image-sets/3851?limit=10&offset=0&sort_by=-created_at',
      { fixture: 'getImageSets' }
    );

    cy.intercept(
      '/api/inventory/v1/hosts/296c483d-5d24-4283-bd6e-fd451118fbd2/system_profile',
      { fixture: 'getInventoryHostsSystemProfile' }
    );

    cy.intercept(
      '/api/edge/v1/updates/device/296c483d-5d24-4283-bd6e-fd451118fbd2/image',
      { fixture: 'getUpdateDeviceImage' }
    );

    cy.beforeTest(
      '/inventory/296c483d-5d24-4283-bd6e-fd451118fbd2?page=1&page_size=20&show_advisories=true&sort=-public_date'
    );

    //Device is unresponsive
    cy.get('[id=device-status] > .pf-c-label__content', {
      timeout: 70000,
    })
      .should('have.text', 'Unresponsive')
      .click();

    cy.get('[id=popover-retry-update-header]')
      .invoke('text')
      .then((popoverTitle) => {
        expect(popoverTitle.trim()).to.eq('Unresponsive');
      });

    cy.fixture('contents').then((contents) => {
      cy.get('[id=popover-retry-update-body] > div')
        .should('include.text', contents.deviceUnresponsive)
        .find('.pf-l-stack__item.pf-u-font-weight-bold')
        .should('have.text', 'Last seen');
    });

    //Device has error for playbook failed
    cy.fixture('getDevicesView').then((jsonData) => {
      jsonData.data.devices[0].DispatcherStatus = 'ERROR';
      jsonData.data.devices[0].DispatcherReason = 'The playbook failed to run.';
      cy.intercept(
        '/api/edge/v1/devices/devicesview?uuid=296c483d-5d24-4283-bd6e-fd451118fbd2',
        jsonData
      );
    });

    cy.visit(
      '/inventory/296c483d-5d24-4283-bd6e-fd451118fbd2?page=1&page_size=20&show_advisories=true&sort=-public_date'
    );

    cy.get('[id=device-status] > .pf-c-label__content', {
      timeout: 70000,
    })
      .should('have.text', 'Error')
      .click();

    cy.get('[id=popover-retry-update-header]')
      .invoke('text')
      .then((popoverTitle) => {
        expect(popoverTitle.trim()).to.eq('Playbook error');
      });

    cy.fixture('contents').then((contents) => {
      cy.get('[id=popover-retry-update-body] > div')
        .should('include.text', contents.deviceErrorFailed)
        .find('.pf-l-stack__item.pf-u-font-weight-bold')
        .should('have.text', 'Last seen');
    });

    cy.intercept('POST', '/api/edge/v1/updates', (req) => {
      expect(req.body).to.deep.eq({
        DevicesUUID: ['296c483d-5d24-4283-bd6e-fd451118fbd2'],
      });
      req.reply({});
    }).as('requestUpdate');

    cy.get('[id=popover-retry-update-footer] > .pf-c-button').click();
    cy.wait('@requestUpdate');

    // Device has error for timeout
    cy.fixture('getDevicesView').then((jsonData) => {
      jsonData.data.devices[0].DispatcherStatus = 'ERROR';
      jsonData.data.devices[0].DispatcherReason =
        'The service timed out during the last update.';
      cy.intercept(
        '/api/edge/v1/devices/devicesview?uuid=296c483d-5d24-4283-bd6e-fd451118fbd2',
        jsonData
      );
    });

    cy.visit(
      '/inventory/296c483d-5d24-4283-bd6e-fd451118fbd2?page=1&page_size=20&show_advisories=true&sort=-public_date'
    );

    cy.get('[id=device-status] > .pf-c-label__content', {
      timeout: 70000,
    })
      .should('have.text', 'Error')
      .click();

    cy.get('[id=popover-retry-update-header]')
      .invoke('text')
      .then((popoverTitle) => {
        expect(popoverTitle.trim()).to.eq('Service timed out');
      });

    cy.fixture('contents').then((contents) => {
      cy.get('[id=popover-retry-update-body] > div')
        .should('include.text', contents.deviceErrorTimeout)
        .find('.pf-l-stack__item.pf-u-font-weight-bold')
        .should('have.text', 'Last seen');
    });

    cy.intercept('POST', '/api/edge/v1/updates', (req) => {
      expect(req.body).to.deep.eq({
        DevicesUUID: ['296c483d-5d24-4283-bd6e-fd451118fbd2'],
      });
      req.reply({});
    }).as('requestUpdate');

    cy.get('[id=popover-retry-update-footer] > .pf-c-button').click();
    cy.wait('@requestUpdate');
  });
});
