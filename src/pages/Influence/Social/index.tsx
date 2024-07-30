import { RegionSocialInfluenceChart } from '@/pages/Influence/Social/components';
import {
  downloadPivotTable,
  listRegionSocialInfluenceProjects,
  projectRegionSocialInfluence,
  projectRegionSocialInfluencePivotTable,
} from '@/services/oss_know/influence';
import { Col, Divider, Row, Select, Tabs } from 'antd';
import React from 'react';
import RegionInfluence from '@/pages/Influence/Social/region';

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
            children: <RegionInfluence />,
          },
        ]}
      />
    );
  }
}
