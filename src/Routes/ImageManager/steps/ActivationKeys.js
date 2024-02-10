import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  Text,
  HelperText,
  HelperTextItem,
  Button,
} from '@patternfly/react-core';

export default {
  title: 'Activation Keys',
  name: 'activationKey',
  nextStep: 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          Automatically register your systems with Red Hat to enhance security
          and track your spending.
        </Text>
      ),
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'method',
      label: 'Registration Method',
    },

    {
      component: 'activation-keys-selector',
      name: 'activationKey',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'subscription-register-later',
      label: (
        <Text>
          <Text>Register Later</Text>
          <Text>
            On initial boot, systems will need to be registered manually before
            having access to updates or Red Hat services. Registering and
            connecting your systems during the image creation is recommended.
          </Text>
          <Text>
            If you prefer to register later, review the instructions for manual
            registration with remote host configuration.
          </Text>
          <Button
            component="a"
            target="_blank"
            variant="link"
            // icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            // isInline
            href="https://access.redhat.com/articles/rhc"
          >
            Registering with remote host configuration
          </Button>
        </Text>
      ),
      condition: {
        or: [{ when: 'register-system', is: 'register-later' }],
      },
    },
  ],
};
