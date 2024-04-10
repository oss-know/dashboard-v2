import React from "react";
import {request} from "@umijs/max";

import {ChoroplethLayer, ChoroplethLayerProps, LarkMap, LarkMapProps} from '@antv/larkmap';

const config: LarkMapProps = {
  mapType: "Gaode",
  mapOptions: {
    style: 'dark',
    center: [20.210792, 30.246026],
    zoom: 1.6,
    // center: [120.210792, 30.246026],
    // zoom: 16,
    token: process.env.UMI_APP_AMAP_TOKEN,
  },
};
console.log('index.tsx, process.env.AMAP_TOKEN:', process.env.UMI_APP_AMAP_TOKEN)


// const dataUrl = 'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json'
// const dataUrl = 'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
// const dataUrl = 'https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson'
// const dataUrl = 'https://raw.githubusercontent.com/rapomon/geojson-places/master/data/continents/EU.json'
const dataUrl = 'https://raw.githubusercontent.com/rapomon/geojson-places/master/data/countries/CN.json'


const layerOptions: Omit<ChoroplethLayerProps, 'source'> = {
  autoFit: true,
  fillColor: {
    field: 'adcode',
    value: ['#0f9960', '#33a02c', '#377eb8'],
  },
  opacity: 0.3,
  strokeColor: 'blue',
  lineWidth: 1,
  state: {
    active: {strokeColor: 'green', lineWidth: 1.5, lineOpacity: 0.8},
    select: {strokeColor: 'red', lineWidth: 1.5, lineOpacity: 0.8},
  },
  label: {
    field: 'name',
    visible: true,
    style: {fill: 'blue', fontSize: 12, stroke: '#fff', strokeWidth: 2},
  },
};


export default class OverallPage extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      source: {
        parser: { type: 'geojson' },
        data: null,
      }
    }
  }

  componentDidMount() {
    request(dataUrl, {
      method: 'get'
    }).then(res => {
      console.log(res)
      this.setState({
        source: {
          data: res
        }
      })
    })
  }

  render() {
    return <div>
      <LarkMap {...config} style={{width: '100%', height: '800px'}}>
        <ChoroplethLayer {...layerOptions} source={this.state.source}/>
      </LarkMap>
    </div>
  }
}
