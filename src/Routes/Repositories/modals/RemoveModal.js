import React from 'react';
import Modal from '../../../components/Modal';
import { TextContent, Text } from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import PropTypes from 'prop-types';
import { removeCustomRepository } from '../../../api/repositories';
import apiWithToast from '../../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const LabelWithText = ({ label, text }) => {
  return (
    <TextContent>
      <Text component={'b'}>{label}</Text>
      <Text>{text}</Text>
    </TextContent>
  );
};

LabelWithText.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string,
};

const WarningIcon = () => (
  <ExclamationTriangleIcon color={warningColor.value} />
);

const RemoveModal = ({ openModal, id, isOpen, name, baseURL, reloadData }) => {
  const dispatch = useDispatch();

  const handleRemoveRepository = ({ id }) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${name} has been removed successfully`,
      },
      onError: { title: 'Error', description: 'Failed to remove a repository' },
    };
    apiWithToast(dispatch, () => removeCustomRepository(id), statusMessages);
  };
  const addSchema = {
    fields: [
      {
        component: 'plain-text',
        name: 'description',
        label:
          'Removing a repository could affect your ability to update images.',
      },
      {
        component: 'plain-text',
        name: 'name',
        label: <LabelWithText label="Name" text={name} />,
      },
      {
        component: 'plain-text',
        name: 'baseURL',
        label: <LabelWithText label="baseURL" text={baseURL} />,
      },
    ],
  };

  return (
    <Modal
      title="Remove repository"
      titleIconVariant={WarningIcon}
      isOpen={isOpen}
      openModal={() => openModal({ type: 'remove' })}
      submitLabel="Remove"
      schema={addSchema}
      initialValues={{ id }}
      variant="danger"
      onSubmit={handleRemoveRepository}
      reloadData={reloadData}
    />
  );
};

RemoveModal.propTypes = {
  openModal: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.bool,
  id: PropTypes.number,
  name: PropTypes.string,
  baseURL: PropTypes.string,
  setData: PropTypes.func,
};
export default RemoveModal;
