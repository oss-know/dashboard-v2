// @ts-nocheck

import {Column, Line} from '@ant-design/plots'
import React from "react";
import {getRepoCommits, getRepoReleases} from "@/services/oss_know/contrib";

interface ProjectProps extends React.ComponentProps<any> {
  owner: string,
  repo: string,
}

// const commitsDemoData = await commitsSampleData()
//


export class CommitsLineChart extends React.Component<ProjectProps, any> {
  private static chartConf = {
    // title: "rust-lang/rust 提交量",
    // TODO description is removed in newer ant design charts
    // description: "rust是一种高性能、内存安全的系统编程语言，广泛应用于操作系统、驱动、基础中间件甚至游戏、计算机图形等领域",
    legend: {
      flipPage: false
    },
    xField: 'date',
    yField: 'commits',
    width: 600,
    height: 400,
  }

  private static getAnnotations = ((maxCommitItem: any, avgValue, firstCommitItem) => {
    const {date: maxCommitDate, commits: maxCommitCount} = maxCommitItem
    const dateStr = `${maxCommitDate.getFullYear()}-${maxCommitDate.getMonth() + 1}`
    return [
      {
        type: 'text',
        data: [maxCommitDate, maxCommitCount],
        style: {
          text: `max commits in history\n${maxCommitCount} commits @ ${dateStr}`,
          wordWrap: true,
          wordWrapWidth: 164,
          dx: 0,
          dy: -30,
          fill: '#2C3542',
          fillOpacity: 0.65,
          fontSize: 12,
          background: true,
          backgroundRadius: 2,
          connector: true,
          startMarker: true,
          startMarkerFill: '#2C3542',
          startMarkerFillOpacity: 0.65,
        },
        tooltip: false,
      },
      // TODO The document claim that yField should be the same type of value, it works in the online demo.
      //  But the code below will make compiler complain that 'number' can't be applied to type 'string'.
      //  If the yField is set to 'value'(the yField key), then all y values will take a horizontal line
      //  This seems to be a bug or incomplete documentation.
      //  For now, the temp solution is to add @ts-ignore or @ts-nocheck to skip the compiling errors.
      {
        type: 'lineY',
        yField: avgValue,
        style: {
          stroke: 'rgba(201,14,103,0.89)'
        }
      },
      {
        type: 'text',
        shape: 'text',
        encode: {
          text: `Average commits: ${avgValue}`
        },
        style: {
          textBaseline: 'bottom',
          fontSize: 12
        },
        yField: avgValue,
        xField: firstCommitItem.date,
      }

      // {
      //   type: 'rangeX',
      //   data: [
      //     {
      //       date: [new Date(2015, 8), new Date(2015, 12)],
      //       event: 'First stable release'
      //     }
      //   ],
      //   xField: 'date',
      //   yField: 'event',
      //   scale: {color: {independent: true, range: ["#FAAD14", "#30BF78"]}},
      //   style: {fillOpacity: 0.3},
      // }

      // {
      //     type: 'text',
      //     text: `Average ${avgValue}`,
      //     data: [maxCommitDate, avgValue],
      //     // dx: 10,
      //     // dy: 200,
      //     yField: avgValue,
      //     // style: {
      //     //     stroke: 'rgba(201,14,103,0.89)'
      //     // }
      //     style: {
      //         text: `Average ${avgValue}`,
      //         fill: 'black',
      //         textAlign: "left",
      //         dy: -10,
      //     },
      // }
    ]
  })

  constructor(props: any) {
    super(props)
    this.state = {
      commits: [],
      maxCommitItem: {},
    }

  }

  componentDidMount() {
    getRepoCommits(this.props.owner, this.props.repo).then((commits: any) => {
      console.debug('DEBUG: ', commits)
      const maxCommitItem = commits.reduce((prev: any, current: any) => {
        return (prev && prev.commits > current.commits) ? prev : current
      })

      const sumCommitValue = commits.reduce((accumulate, current) => accumulate + current.commits, 0)
      const averageCommitValue = Math.round(sumCommitValue / commits.length)
      this.setState({
        commits,
        maxCommitItem,
        annotations: CommitsLineChart.getAnnotations(maxCommitItem, averageCommitValue, commits[0]),
      })
    })

  }

  render() {
    return <Line
      title={`${this.props.owner}/${this.props.repo} commits history`}
      data={this.state.commits}
      annotations={this.state.annotations}
      {...CommitsLineChart.chartConf}
    />
  }
}

export class ReleaseColumnChart extends React.Component<ProjectProps, any> {
  private static chartConf = {
    xField: 'date',
    yField: 'releases',


    annotations: [
      // {
      //   type: 'lineY',
      //   yField: 10.5,
      // }
    ],

    width: 1000,
    height: 400,
    axis: {
      x: {
        labelFormatter: (datum: any, index: any) => {
          return datum.getFullYear() + '-' + datum.getMonth()
        }
      }
    }
  }

  constructor(props: ProjectProps) {
    super(props);

    this.state = {
      releases: [],
      maxReleaseItem: {},
    }
  }

  componentDidMount() {
    getRepoReleases(this.props.owner, this.props.repo).then((releases: any) => {
      console.debug('raw rels:', releases)
      console.log(typeof(releases[0].date))
      let maxReleaseItem = releases.reduce((prev: any, current: any) => {
        return (prev && prev.releases > current.releases) ? prev : current
      }, 0);

      const sumReleaseValue = releases.reduce((accumulate:any, current:any) => accumulate + current.releases, 0)
      const averageReleaseValue = sumReleaseValue / releases.length

      this.setState({
        releases,
        maxReleaseItem,
        label: {
          text: (d: any) => {
            if (d.releases === maxReleaseItem.releases) {
              return `Max release: ${d.releases}`
            }
            return d.releases
          },
          textBaseline: 'bottom',
        },

        style: {
          fill: (dataum: any) => {
            if (dataum.releases === maxReleaseItem.releases) {
              return '#22CBCC';
            }
            return '#2989FF';
          },
        },

      })
    })
  }

  render() {
    return <Column
      title={`${this.props.owner}/${this.props.repo} release history`}
      label={this.state.label}
      style={this.state.style}
      data={this.state.releases}
      {...ReleaseColumnChart.chartConf}
    />;
  }
}
