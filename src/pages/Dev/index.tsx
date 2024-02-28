import React from "react";
import {Line} from "@ant-design/charts";
import {Col, Row} from "antd";
import {CommitsLineChart, ReleaseColumnChart} from "@/pages/Dev/components";

const owner: string = 'rust-lang'
const repo: string = 'rust'
export default class Dev extends React.Component<any, any> {
  // constructor(props:any) {
  //   super(props);
  //
  //   this.state={
  //     commitHistory: [],
  //   }
  //
  //   getRepoCommits('rust-lang', 'rust').then(commits=>{
  //     this.setState({
  //       commitHistory: commits
  //     })
  //   })
  // }
  render() {
    return <Row>
      <Col>
        <CommitsLineChart owner={owner} repo={repo}/>
      </Col>
      <Col>
        <ReleaseColumnChart owner={owner} repo={repo}/>
      </Col>
    </Row>
  }
}
