import { RegionSocialInfluenceChart } from '@/pages/Statistics/InfluenceCharts/components';
import {
  downloadPivotTable,
  listRegionSocialInfluenceProjects,
  projectRegionSocialInfluence,
  projectRegionSocialInfluencePivotTable,
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
      dataLoaded: false,
    };

    this.projectsSelectChange = this.projectsSelectChange.bind(this);
    this.projectsSelectDropdownChange = this.projectsSelectDropdownChange.bind(this);
    this.projectsSelectClear = this.projectsSelectClear.bind(this);
    this.genAndDownloadPivotTable = this.genAndDownloadPivotTable.bind(this);
  }

  static projectOptions2ReqBody = (options) => {
    return options.map((option) => {
      const parts = option.value.split('/');
      const owner = parts[0];
      const repo = parts[1];
      return {
        owner,
        repo,
      };
    });
  };

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
    this.setState({
      dataLoaded: false,
    });
    if (!visible) {
      const ownerRepos = InfluenceChartsPage.projectOptions2ReqBody(this.state.selectedProjects);
      projectRegionSocialInfluence(ownerRepos).then((result) => {
        // Split result into different groups by (owner, repo), since Ant Design chart can't be filtered like Excel chart
        const chartDataMap: any = {};
        const chartMaxVals: any = {};

        for (const item of result) {
          const { owner, repo } = item;
          const key = `${owner}__${repo}`;

          if (chartMaxVals.hasOwnProperty(key)) {
            if (chartMaxVals[key] < item.social_influence_value) {
              chartMaxVals[key] = item.social_influence_value;
            }
          } else {
            chartMaxVals[key] = item.social_influence_value;
          }
        }

        for (const item of result) {
          const { owner, repo } = item;
          const key = `${owner}__${repo}`;
          const temp = { ...item };
          temp.mapped_social_influence_value =
            (temp.social_influence_value / chartMaxVals[key]) * 100;

          if (chartDataMap.hasOwnProperty(key)) {
            chartDataMap[key].push(temp);
          } else {
            chartDataMap[key] = [temp];
          }
        }

        const chartDataList = [];
        for (const key in chartDataMap) {
          chartDataList.push(chartDataMap[key]);
        }

        this.setState({
          chartDataList,
          dataLoaded: true,
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

  genAndDownloadPivotTable() {
    this.setState({
      dataLoaded: false,
    });
    const ownerRepos = InfluenceChartsPage.projectOptions2ReqBody(this.state.selectedProjects);
    projectRegionSocialInfluencePivotTable(ownerRepos).then((response) => {
      const downloadUrl = `/static/${response.headers.url}`;
      this.setState({
        dataLoaded: true,
      });

      downloadPivotTable(downloadUrl).then((blob) => {
        const eLink = document.createElement('a');
        eLink.download = downloadUrl.split('/').at(-1); // Set the download file name
        eLink.style.display = 'none';
        eLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eLink);
        eLink.click();
        URL.revokeObjectURL(eLink.href); // 释放URL 对象
        document.body.removeChild(eLink);
      });
    });
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
          {this.state.dataLoaded ? (
            <Col>
              <a onClick={this.genAndDownloadPivotTable}>Download pivot table</a>
            </Col>
          ) : (
            <></>
          )}
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
