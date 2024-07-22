import { Line } from '@ant-design/plots';
import React from 'react';

export class RegionSocialInfluenceChart extends React.Component<any, any> {
  static config = {
    xField: (d) => {
      return d.year + ' Q' + d.quarter;
    },
    yField: 'social_influence_value',
    colorField: 'login_location',
    // The normalize might make some data into NaN or infinity
    // normalize: { basis: 'first', groupBy: 'color' },

    // scale: {
    //   y: { type: 'log' },
    // },
    // axis: {
    //   y: { title: '↑ Change in price (%)' },
    // },
    // label: {
    //   text: 'Symbol',
    //   selector: 'last',
    //   style: {
    //     fontSize: 10,
    //   },
    // },
    // tooltip: { channel: 'y', valueFormatter: '.1f' },
  };

  render() {
    return (
      <Line
        // xField={(d:any):string => {
        //   // The xField is required to be type 'string', while the sample tells it can be a func that return string
        //   return d.year + ' Q' + d.quarter;
        // }}
        // yField="social_influence_value"
        // colorField="login_location"
        {...RegionSocialInfluenceChart.config}
        data={this.props.data}
      />
    );
  }
}
