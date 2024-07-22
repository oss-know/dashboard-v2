import {
  listRegionSocialInfluenceProjects,
  projectRegionSocialInfluence,
} from '@/services/oss_know/influence';
import { Col, Divider, Row, Select } from 'antd';
import React from 'react';

export default class InfluenceChartsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      projectOptions: [],
      selectedProjects: [],
    };

    this.projectsSelectChange = this.projectsSelectChange.bind(this);
    this.projectsSelectDropdownChange = this.projectsSelectDropdownChange.bind(this);
    this.projectsSelectClear = this.projectsSelectClear.bind(this);
  }

  componentDidMount() {
    listRegionSocialInfluenceProjects().then((projects) => {
      console.log(projects);
      this.setState({
        projectOptions: projects.map((p) => {
          const { owner, repo } = p;
          return {
            label: `${owner}/${repo}`,
            value: `${owner}/${repo}`,
          };
        }),
      });
    });
  }

  projectsSelectChange(_, selectedOptions: any[]) {
    this.setState({
      selectedProjects: selectedOptions,
    });
  }

  projectsSelectDropdownChange(visible: boolean): void {
    if (!visible) {
      console.log('we should request with', this.state.selectedProjects);
      const ownerRepos = this.state.selectedProjects.map((option) => {
        const parts = option.value.split('/');
        const owner = parts[0];
        const repo = parts[1];
        return {
          owner,
          repo,
        };
      });
      projectRegionSocialInfluence(ownerRepos).then((result) => {
        console.log(result);
      });
    }
  }

  projectsSelectClear() {
    this.setState({
      selectedProjects: [],
    });
    // might be called unnecessarily, when projectsSelectDropdownChange is triggered with empty project selection
    console.log('we should request with empty owner repos(all data)');
  }

  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col span={6}>
            <Select
              options={this.state.projectOptions}
              allowClear
              style={{ width: '100%' }}
              mode="multiple"
              onChange={this.projectsSelectChange}
              onDropdownVisibleChange={this.projectsSelectDropdownChange}
              onClear={this.projectsSelectClear}
              placeholder="Select projects"
            />
          </Col>
        </Row>
        <Divider />
        <div>the charts</div>
      </div>
    );
  }
}
