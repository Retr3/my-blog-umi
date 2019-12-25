import React from 'react'
import { Chart, Geom, Axis, Coord, Guide } from "bizcharts";
export default function PiePercent({peiheight,pieData,pieColor,pietitle,pieInfo}) {
    return (
        <div>
        <Chart
          height={peiheight}
          data={pieData}
          padding={[30, 30, 30, 30]}
          forceFit
        >
          <Coord type={"theta"} radius={1} innerRadius={0.9} />
          <Axis name="percent" />
          <Guide>
            <Guide.Html
              position={["50%", "50%"]}
              html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">${pietitle}<br><span style="font-size:2.5em;color:${pieColor}">${pieInfo}</span>%</div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            select={false}
            position="percent"
            color={['item', [`${pieColor}`, '#f0f2f5']]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
          </Geom>
        </Chart>
      </div>
    )
}