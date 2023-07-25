import React from 'react';
import { Modal, ModalBoxFooter, Button } from '@patternfly/react-core';
import edgeIcon from '../../static/images/Icon-Red_Hat-Edge-A-Red-RGB.png';

const AuthModal = () => {
  return (
    <Modal
      style={{ padding: '15px' }}
      isOpen={true}
      variant="small"
      onClose={() => (window.location.href = `https://${window.location.host}`)}
      aria-label="auth-modal"
      header={
        <h2 className="pf-u-pr-xl pf-u-pl-xl pf-u-font-size-2xl pf-u-text-align-center pf-u-font-weight-bold">
          Edge management requires a valid Red Hat Satellite subscription
        </h2>
      }
      footer={
        <ModalBoxFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            flexDirection: 'column',
            paddingTop: 0,
          }}
        >
          <Button
            key="get-started"
            component="a"
            className="pf-u-mb-md"
            variant="primary"
            target="_blank"
            href="https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/try-it"
          >
            Get started
          </Button>
          <Button
            component="a"
            key="interactive-demo"
            className="pf-u-mb-md"
            variant="secondary"
            target="_blank"
            href="https://red.ht/edgemanagementlab"
          >
            Try the interactive demo
          </Button>
          <Button
            component="a"
            key="not-now"
            variant="link"
            href={`https://${window.location.host}`}
          >
            Not now
          </Button>
        </ModalBoxFooter>
      }
      title="Edge management requires a valid subscription"
      width="640px"
    >
      <img
        style={{ margin: '0 auto', display: 'block' }}
        src={edgeIcon}
        width="200px"
        alt="edge icon"
      />
      <p className="pf-u-pr-xl pf-u-pl-xl pf-u-text-align-center">
        Securely manage and scale deployments at the edge with zero-touch
        provisioning, system health visibility, and quick security remediations
        and more with a Red Hat Satellite subscription
      </p>
    </Modal>
  );
};

export default AuthModal;
