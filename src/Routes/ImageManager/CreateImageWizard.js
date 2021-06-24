import React, { useState, useEffect } from 'react';
import ImageCreator from '../../components/ImageCreator';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { 
  registration, 
  review, 
  packages, 
  imageSetDetails, 
  imageOutput 
} from './steps';
import { Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import { createNewImage } from '../../store/actions';
import { CREATE_NEW_IMAGE_RESET } from '../../store/action-types';
import { useDispatch } from 'react-redux';

const CreateImage = ({ navigateBack }) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const closeAction = () => {
    navigateBack();
    dispatch({ type: CREATE_NEW_IMAGE_RESET });
  };
  useEffect(() => {
    (async () => {
      const userData = (await insights?.chrome?.auth?.getUser()) || {};
      setUser(() => userData);
    })();
  }, []);

  return user ? (
    <ImageCreator
      onClose={closeAction}
      customComponentMapper={{
        review: ReviewStep,
      }}
      onSubmit={(values) => {
        const payload = {
          ...values,
          architecture: 'x86_64',
        };
        createNewImage(dispatch, payload, closeAction);
      }}
      defaultArch="x86_64"
      schema={{
        fields: [
          {
            component: componentTypes.WIZARD,
            name: 'image-builder-wizard',
            className: 'image-builder',
            isDynamic: true,
            inModal: true,
            buttonLabels: {
              submit: 'Create',
            },
            showTitles: true,
            title: 'Create image',
            crossroads: ['target-environment', 'release'],
            description: 'Create RHEL for Edge image',
            // order in this array does not reflect order in wizard nav, this order is managed inside
            // of each step by `nextStep` property!
            fields: [
              imageSetDetails, 
              imageOutput, 
              registration, 
              packages, 
              review
            ],
          },
        ],
      }}
    />
  ) : (
    <Spinner />
  );
};

CreateImage.propTypes = {
  navigateBack: PropTypes.func,
};
CreateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default CreateImage;
