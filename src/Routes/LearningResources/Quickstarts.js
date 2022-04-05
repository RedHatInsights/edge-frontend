import React from 'react';
import {
  QuickStartTile,
  QuickStartCatalogSection,
} from '@patternfly/quickstarts';
import {
  Gallery,
  GalleryItem,
  TextContent,
  Text,
} from '@patternfly/react-core';
import { BookIcon } from '@patternfly/react-icons';

const quickstarts = [
  {
    apiVersion: '5',
    kind: 'documentation',
    metadata: {
      name: 'name',
    },
    spec: {
      displayName: 'Installing and configuring the rhoas CLI',
      icon: <BookIcon />,
      description:
        'Install and configure the rhoas CLI to start creating Kafka instances and other resources from the command line.',
      link: {
        href: 'https://console.redhat.com/application-services/learning-resources',
      },
      type: { text: 'Documentation', color: 'orange' },
    },
  },
  {
    apiVersion: '5',
    kind: 'documentation',
    metadata: {
      name: 'name',
    },
    spec: {
      displayName:
        'Getting started with the rhoas CLI for Red Hat OpenShift Streams for Apache Kafka',
      icon: <BookIcon />,
      description:
        'Create a Kafka instance, service account, and Kafka topics from the command line.',
      link: {
        href: 'https://console.redhat.com/application-services/learning-resources',
      },
      type: { text: 'Documentation', color: 'orange' },
    },
  },
];

const App = () => {
  return (
    <QuickStartCatalogSection>
      <TextContent className='pf-u-mb-md'>
        <Text component='h2'>Documentation</Text>
        <Text component='p' className='catalog-sub'>
          Technical information for using the service
        </Text>
      </TextContent>
      <Gallery className='pfext-quick-start-catalog__gallery' hasGutter>
        {quickstarts.map((quickStart, index) => {
          return (
            <GalleryItem
              key={index}
              className='pfext-quick-start-catalog__gallery-item'
            >
              <QuickStartTile quickStart={quickStart} />
            </GalleryItem>
          );
        })}
      </Gallery>
    </QuickStartCatalogSection>
  );
};

export default App;
