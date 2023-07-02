import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);

const LineGraph = ({
  chartTitle = null,
  xAxis = null,
  yLeftAxis = null,
  yRightAxis = null,
  yLeftAxisData = null,
  yRightAxisData = null,
}) => {
  // Aligns data to correct axes
  if(yLeftAxisData != null) {
    yLeftAxisData.map((value) => value.yAxis = 1);
  }
  if(yRightAxisData != null) {
    yRightAxisData.map((value) => value.yAxis = 0);
  }

  const renderedYLeftAxisData = yLeftAxisData != null ? yLeftAxisData : [];
  const renderedYRightAxisData = yRightAxisData != null ? yRightAxisData : [];

  const chartOptions = {
    title: {
      text: chartTitle ?? "Chart title that you should probably set :)) (pass in chart title)"
    },

    xAxis: {
      title: {
        text: xAxis.title
      },
    },

    yAxis: [{ // Primary yAxis
      labels: {
          style: {
              color: yRightAxis?.colour
          }
      },
      title: {
          text: yRightAxis?.axisTitle,
          style: {
              color: yRightAxis?.colour
          }
      },
      max: yRightAxis?.max,
      min: yRightAxis?.min,
      opposite: true
  }, { // Secondary yAxis
      gridLineWidth: 0,
      title: {
          text: yLeftAxis?.axisTitle,
          style: {
              color: yLeftAxis?.colour,
          }
      },
      labels: {
          style: {
              color: yLeftAxis?.colour
          }
      },
      max: yLeftAxis?.max,
      min: yLeftAxis?.min
  }],
  
    series: [
      ...renderedYLeftAxisData,
      ...renderedYRightAxisData 
    ],
    

    tooltip: {
      crosshairs: {
          color: '#808080',
          dashStyle: 'solid'
      },
      shared: true
    }
  };
  
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

export default LineGraph;