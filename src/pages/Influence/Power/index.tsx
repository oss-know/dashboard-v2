import React from 'react';
import { Tabs } from 'antd';
import RegionSocialInfluence from '@/pages/Influence/Social/region';
import RegionPowerInfluence from '@/pages/Influence/Power/region';

export default class InfluenceChartsPage extends React.Component<any, any> {
  render() {
    return (
      <Tabs
        defaultActiveKey="region"
        items={[
          {
            label: 'Developer',
            key: 'developer',
            children: <div>implementing</div>,
          },
          {
            label: 'Organization',
            key: 'organization',
            children: <div>implementing</div>,
          },
          {
            label: 'Region',
            key: 'region',
            children: <RegionPowerInfluence />,
          },
        ]}
      />
    );
  }
}
