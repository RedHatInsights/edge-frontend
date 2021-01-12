import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';

export default {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'wizzard',
      fields: [
        {
          title: 'General information',
          name: 'step-1',
          nextStep: 'choos-systems',
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'group-name',
              type: 'text',
              label: 'Group name',
              isRequired: true,
              validate: [
                {
                  type: 'required',
                },
              ],
            },
            {
              component: componentTypes.SWITCH,
              name: 'is-secure',
              label: 'Is secure',
            },
          ],
        },
        {
          title: 'Choose systems',
          name: 'choos-systems',
          fields: [
            {
              component: componentTypes.PLAIN_TEXT,
              name: 'selected-systems',
              label: 'Here will be inventory table',
            },
          ],
        },
      ],
    },
  ],
};
