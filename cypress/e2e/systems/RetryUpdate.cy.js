describe('Systems', () => {
  beforeEach(() => {
    cy.beforeTest('/inventory');
  });
  it('RetryPopover', function () {
    cy.intercept('POST', 'api/edge/v1/updates', {});

    cy.intercept('GET', '/api/edge/v1/devices/devicesview?*', {
      count: 2,
      data: {
        total: 2,
        devices: [
          {
            DeviceID: 141598,
            DeviceName: 'devicetest_test',
            DeviceUUID: '296c483d-5d24-4283-bd6e-fd451118fbd2',
            ImageID: 6148,
            ImageName: 'devicetest7',
            LastSeen: '2022-09-16T06:54:57.526838Z',
            UpdateAvailable: true,
            Status: 'RUNNING',
            ImageSetID: 3851,
            DeviceGroups: [],
            DispatcherStatus: 'UNRESPONSIVE',
            DispatcherReason: '',
          },
          {
            DeviceID: 141599,
            DeviceName: 'devicetest_test2',
            DeviceUUID: '296c483d-5d24-4283-bd6e-fd451118fbd3',
            ImageID: 6149,
            ImageName: 'devicetest72',
            LastSeen: '2022-09-16T06:54:57.526838Z',
            UpdateAvailable: true,
            Status: 'ERROR',
            ImageSetID: 3851,
            DeviceGroups: [],
            DispatcherStatus: 'ERROR',
            DispatcherReason: 'The playbook failed to run.',
          },
        ],
      },
    });

    cy.get('.pf-c-title', { timeout: 6000 }).should('include.text', 'Systems');
    cy.wait(1000);
    //Select first Unresponsive
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-m-width-25 > .pf-c-description-list__group > .pf-c-description-list__term > .pf-l-split > :nth-child(2) > p'
    )
      .should('include.text', 'Unresponsive')
      .click();
    // Ensure the Unresponsive popover is there with reasoning
    cy.get('.pf-c-popover__content').should('be.visible');
    cy.get('.pf-u-ml-xs').should('include.text', 'Unresponsive');
    cy.get('.pf-u-font-weight-bold').should('include.text', 'Last seen');
    cy.get('.pf-l-stack > :nth-child(2) > span').should('include.text', 'ago');
    //Select first Error
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-m-width-25 > .pf-c-description-list__group > .pf-c-description-list__term > .pf-l-split > :nth-child(2) > p'
    ).click();
    cy.get('.pf-u-ml-xs').should('include.text', 'Playbook error');
    cy.get('.pf-c-popover__content')
      .find('.pf-c-popover__body')
      .should(
        'include.text',
        'The playbook failed to run. You can retry the update or build a new one.'
      );
    cy.get('.pf-u-font-weight-bold').should('include.text', 'Last seen');
    cy.get('.pf-l-stack > :nth-child(2) > span').should('include.text', 'ago');
    //Check to see if the Retry Popover has button
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-m-width-25 > .pf-c-description-list__group > .pf-c-description-list__term > .pf-l-split > :nth-child(2) > p'
    );
    cy.get('.pf-c-popover__content')
      .find('footer > button')
      .contains('Retry')
      .click();
    //Toast
    cy.get('h4.pf-c-alert__title').should(
      'include.text',
      'Info alert:Updating system'
    );
    cy.get('.pf-c-alert__description').should(
      'include.text',
      'was added to the queue.'
    );
  });
});
