import React, { useState, useEffect, useContext } from 'react';
import ImageCreator from '../../components/ImageCreator';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { review, packages, updateDetails, imageOutput } from './steps';
import { Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import { createNewImage, addImageToPoll } from '../../store/actions';
import { CREATE_NEW_IMAGE_RESET } from '../../store/action-types';
import { useDispatch } from 'react-redux';
import { useSelector, shallowEqual } from 'react-redux';
import { RegistryContext } from '../../store';
import { imageDetailReducer } from '../../store/reducers';
import { loadImageDetail } from '../../store/actions';
import { imageUpdateRepoURL } from '../../api/index';

const UpdateImage = ({ navigateBack, updateImageID }) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const [updateRepoURL, setUpdateRepoURL] = useState('');
  const closeAction = () => {
    navigateBack();
    dispatch({ type: CREATE_NEW_IMAGE_RESET });
  };

  const { getRegistry } = useContext(RegistryContext);
  const { data } = useSelector(
    ({ imageDetailReducer }) => ({ data: imageDetailReducer?.data || null }),
    shallowEqual
  );

  useEffect(() => {
    const registered = getRegistry().register({
      imageDetailReducer,
    });
    loadImageDetail(dispatch, updateImageID);
    return () => registered();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const userData = (await insights?.chrome?.auth?.getUser()) || {};
      setUser(() => userData);
    })();
    (async () => {
      const found = await imageUpdateRepoURL(updateImageID);
      setUpdateRepoURL(found);
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
          name: data?.Name,
          version: data?.Version + 1,
          architecture: 'x86_64',
          oSTreeParentCommit: updateRepoURL,
        };
        createNewImage(dispatch, payload, (data) => {
          closeAction();
          dispatch(
            addImageToPoll({ name: data.value.Name, id: data.value.ID })
          );
        });
      }}
      defaultArch="x86_64"
      initialValues={{
        name: data?.Name,
        isUpdate: true,
        description: data?.Description,
        version: data?.Version,
        'selected-packages': data?.Commit?.Packages.map((pkg) => ({
          ...pkg,
          name: pkg.Name,
        })),
      }}
      schema={{
        fields: [
          {
            component: componentTypes.WIZARD,
            name: 'image-builder-wizard',
            className: 'image-builder',
            isDynamic: true,
            inModal: true,
            buttonLabels: {
              submit: 'Create update',
            },
            showTitles: true,
            title: `Update image: ${data?.Name}`,
            crossroads: ['target-environment', 'release'],
            // order in this array does not reflect order in wizard nav, this order is managed inside
            // of each step by `nextStep` property!
            fields: [updateDetails, imageOutput, packages, review],
          },
        ],
      }}
    />
  ) : (
    <Spinner />
  );
};

UpdateImage.propTypes = {
  navigateBack: PropTypes.func,
  updateImageID: PropTypes.number,
};
UpdateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default UpdateImage;
