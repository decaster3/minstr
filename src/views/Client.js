import React, { Component, lazy, Suspense } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table
} from "reactstrap";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import dayjs from "dayjs";

const IPFSData = [
  {
    id: "904",
    name: "cer_kv_4_f_a0",
    valueType: "DOUBLE",
    value: {
      doubleValue: 3809.0499999999383
    },
    visible: "RUNTIME",
    access: "READ_ONLY",
    displayName: "cer_kv_4_f_a0",
    createdAt: "2019-03-11 12:55:33"
  },
  {
    id: "905",
    name: "cer_kv_4_f_a0",
    valueType: "DOUBLE",
    value: {
      doubleValue: 2000
    },
    visible: "RUNTIME",
    access: "READ_ONLY",
    displayName: "cer_kv_4_f_a0",
    createdAt: "2019-03-12 10:55:33"
  },
  {
    id: "906",
    name: "cer_kv_4_f_a0",
    valueType: "DOUBLE",
    value: {
      doubleValue: 1000
    },
    visible: "RUNTIME",
    access: "READ_ONLY",
    displayName: "cer_kv_4_f_a0",
    createdAt: "2019-03-13 10:55:33"
  }
];

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
const brandInfo = getStyle("--info");
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

let data1 = [];
let data2 = [];

const summ = IPFSData.reduce((acc, cur) => acc + cur.value.doubleValue, 0);
console.log(summ);
IPFSData.forEach(el => {
  data1.push(el.value.doubleValue);
  data2.push(summ / IPFSData.length);
});
const cost = 5.47;

const mainChart = {
  labels: IPFSData.map(day => dayjs(day.createdAt).format("M ddd")),
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: hexToRgba(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
      data: data1
    },
    {
      label: "My Second dataset",
      backgroundColor: "transparent",
      borderColor: brandSuccess,
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
      data: data2
    }
  ]
};

const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: "index",
    position: "nearest",
    callbacks: {
      labelColor: function(tooltipItem, chart) {
        return {
          backgroundColor:
            chart.data.datasets[tooltipItem.datasetIndex].borderColor
        };
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max:
            Math.max.apply(Math, IPFSData.map(o => o.value.doubleValue)) + 1000
        }
      }
    ]
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3
    }
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm={10}>
                    <h3>Стоимость за кВт</h3>
                  </Col>
                  <Col sm={2}>
                    <h3>5.47 Р</h3>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={10}>
                    <h3>Cреднее дневное потребление</h3>
                  </Col>
                  <Col sm={2}>
                    <h3>{parseInt((cost * summ) / IPFSData.length)} Р</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">
                      Потребление электроэнергии одним юнитом
                    </CardTitle>
                    <div className="small text-muted">Май 2019</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right">
                      <i className="icon-cloud-download" />
                    </Button>
                  </Col>
                </Row>
                <div
                  className="chart-wrapper"
                  style={{ height: 300 + "px", marginTop: 40 + "px" }}
                >
                  <Line data={mainChart} options={mainChartOpts} height={300} />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={6} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Усредненное за день</div>
                    <strong>{parseInt(summ / IPFSData.length)} кВт</strong>
                  </Col>
                  <Col sm={6} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Всего за период</div>
                    <strong>{parseInt(summ)} кВт</strong>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
