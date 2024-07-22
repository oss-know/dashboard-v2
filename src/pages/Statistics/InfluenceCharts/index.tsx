import { RegionSocialInfluenceChart } from '@/pages/Statistics/InfluenceCharts/components';
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
      chartDataList: [],
    };

    this.projectsSelectChange = this.projectsSelectChange.bind(this);
    this.projectsSelectDropdownChange = this.projectsSelectDropdownChange.bind(this);
    this.projectsSelectClear = this.projectsSelectClear.bind(this);
  }

  componentDidMount() {
    listRegionSocialInfluenceProjects().then((projects) => {
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
        // Split result into different groups by (owner, repo), since Ant Design chart can't be filtered like Excel chart
        const chartDataMap: any = {};
        for (const item of result) {
          const { owner, repo } = item;
          const key = `${owner}__${repo}`;
          if (chartDataMap.hasOwnProperty(key)) {
            chartDataMap[key].push(item);
          } else {
            chartDataMap[key] = [item];
          }
        }

        const chartDataList = [];
        for (const key in chartDataMap) {
          chartDataList.push(chartDataMap[key]);
        }

        this.setState({
          chartDataList,
        });
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
        <Row>
          {this.state.chartDataList.map((chartData, index) => {
            return (
              <Col span={12} key={`region_social_influence_chart__${index}`}>
                <RegionSocialInfluenceChart data={chartData} />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
