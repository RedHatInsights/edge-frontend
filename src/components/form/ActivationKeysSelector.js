import React,  { useEffect, Fragment, useContext, useState }  from 'react';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import {
  FormGroup,
  TextArea,
  Text,
  TextVariants,
  Select,
  Button
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import {  fetchActivationKeys,
} from '../../api/images';


// if (!data) {
//   setHasNoSearchResults(true);
//   setHasMoreResults(false);
//   setAvailableOptions([]);
//   return;
// }
// const EmptyActivationsKeyState = ({ handleActivationKeyFn, isLoading }) => (

  
//   <EmptyState variant="xs">
//     <EmptyStateHeader
//       titleText="No activation keys found"
//       headingLevel="h4"
//       icon={<EmptyStateIcon icon={WrenchIcon} />}
//     />
//     <EmptyStateBody>
//       Get started by building a default key, which will be generated and present
//       for you.
//     </EmptyStateBody>
//     <EmptyStateFooter>
//       <EmptyStateActions>
//         <Button
//           onClick={handleActivationKeyFn}
//           icon={<AddCircleOIcon />}
//           isLoading={isLoading}
//           iconPosition="left"
//           variant="link"
//         >
//           Create activation key
//         </Button>
//       </EmptyStateActions>
//     </EmptyStateFooter>
//   </EmptyState>
// );

// EmptyActivationsKeyState.propTypes = {
//   handleActivationKeyFn: PropTypes.func.isRequired,
//   isLoading: PropTypes.bool,
// };



const ActivationKeysField = (props) => {
  const [activationKey, setActivationKey] = useState(null);
// ********************************************************* //
const { isProd } = false;//useGetEnvironment();
const { change, getState } = useFormApi();
const { input } = useFieldApi(props);
const [isOpen, setIsOpen] = useState(false);
const [activationKeySelected, selectActivationKey] = useState(
  getState()?.values?.['subscription-activation-key']
);

const dispatch = useDispatch();

(async () => {
  const data = await fetchActivationKeys(10)
  setActivationKey(data);
})();

useEffect(() => {
console.log(activationKey)},[activationKey])

// // const {
// //   data: activationKeys,
// //   isFetching: isFetchingActivationKeys,
// //   isSuccess: isSuccessActivationKeys,
// //   isError: isErrorActivationKeys,
// //   refetch,
// // } = useListActivationKeysQuery();

// const [createActivationKey, { isLoading: isLoadingActivationKey }] =
//   useCreateActivationKeysMutation();
// useEffect(() => {
//   // if (isProd()) {
//   //   change('subscription-server-url', 'subscription.rhsm.redhat.com');
//   //   change('subscription-base-url', 'https://cdn.redhat.com/');
//   // } else {
//     change('subscription-server-url', 'subscription.rhsm.stage.redhat.com');
//     change('subscription-base-url', 'https://cdn.stage.redhat.com/');
//   // }
// }, [isProd, change]);

// const setActivationKey = (_, selection) => {
//   selectActivationKey(selection);
//   setIsOpen(false);
//   change(input.name, selection);
// };

// const handleClear = () => {
//   selectActivationKey();
//   change(input.name, undefined);
// };

// const handleToggle = () => {
//   if (!isOpen) {
//     refetch();
//   }
//   setIsOpen(!isOpen);
// };

// const handleCreateActivationKey = async () => {
//   const res = await createActivationKey({
//     body: {
//       name: 'activation-key-default',
//       serviceLevel: 'Self-Support',
//     },
//   });
//   refetch();
//   if (res.error) {
//     dispatch(
//       addNotification({
//         variant: 'danger',
//         title: 'Error creating activation key',
//         description: res.error?.data?.error?.message,
//       })
//     );
//   }
// };

// const isActivationKeysEmpty =
//   isSuccessActivationKeys && activationKeys.body.length === 0;




// ********************************************************* //
  const { input: activationKeySelect, meta } = useFieldApi({
    name: 'activationKeys',
    ...props,
  });

  const ManageKeysButton = () => {
    return (
      <Button
        component="a"
        target="_blank"
        variant="link"
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        isInline
        href={
          // isProd()
            // ? 'https://console.redhat.com/insights/connector/activation-keys'
             'https://console.stage.redhat.com/insights/connector/activation-keys'
        }
      >
        Activation keys page
      </Button>
    );
  };
  return (
    <FormGroup>
      <FormGroup
        label="Activation key to use for this image"
        helperTextInvalid={meta.error}
        validated={meta.error && meta.touched ? 'error' : 'default'}

      >

        <Select
          ouiaId="activation_key_select"
          variant="typeahead"
          // onToggle={handleToggle}
          // onSelect={setActivationKey}
          // onClear={handleClear}
          // selections={activationKey}
          // isOpen={isOpen}
          placeholderText="Select activation key"
          typeAheadAriaLabel="Select activation key"
          // isDisabled={!isSuccessActivationKeys}
        >
          {/* {setSelectOptions()} */}
        </Select>
      </FormGroup>
      <br/>
      <Fragment>
     
        <Text >
          <Text>
            By default, activation key is generated and preset for you. Admins
            can create and manage keys by visiting the <ManageKeysButton />
          </Text>
        </Text>
      </Fragment>
    </FormGroup>
  );
};

export default ActivationKeysField;
