import CustomButtons from '../../../components/form/CustomSubmitButtons';

export default {
  name: 'review',
  title: 'Review',
  buttons: CustomButtons,
  fields: [
    {
      name: 'review',
      component: 'review',
    },
  ],
};
