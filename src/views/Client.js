import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips"
import {getStyle, hexToRgba} from "@coreui/coreui/dist/js/coreui-utilities"
import dayjs from "dayjs"
import React, {useReducer, useEffect} from "react"
import {Line} from "react-chartjs-2"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row
} from "reactstrap"
import {
  reducer,
  SET_SMART_CITY,
  SELECT_DISTRICT,
  SELECT_STREET,
  SELECT_BUILDING,
  SELECT_APARTMENT,
  brandInfo,
  brandSuccess,
  ipfs
} from "./RSO"
import ipfsApi from "ipfs-api"
import * as R from "ramda"

const cost = 5.47

const length = 30
const startDate = dayjs().startOf("year")
// const data = generate(0, length, 50, 10, 0.9, 0, 100)
const labels = R.times(i => startDate.add(i, "day").format("MMM DD"), length)

/**
 * @return {Chart.ChartData} data
 */
export const mainChartWithData = data => {
  const avg = R.sum(data) / data.length
  return {
    labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: hexToRgba(brandInfo, 10),
        borderColor: brandInfo,
        pointHoverBackgroundColor: "#fff",
        borderWidth: 2,
        data
      },
      {
        label: "My Second dataset",
        backgroundColor: "transparent",
        borderColor: brandSuccess,
        pointHoverBackgroundColor: "#fff",
        borderWidth: 2,
        data: R.repeat(avg, data.length)
      }
    ]
  }
}

/**
 * @type {Chart.ChartOptions}
 */
const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: "index",
    position: "nearest",
    callbacks: {
      // @ts-ignore
      labelColor: function(tooltipItem, chart) {
        return {
          backgroundColor:
            chart.data.datasets[tooltipItem.datasetIndex].borderColor
        }
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
          maxTicksLimit: 5
          // stepSize: Math.ceil(250 / 5)
          // max:
          //   Math.max.apply(Math, IPFSData.map(o => o.value.doubleValue)) + 1000
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
}

const initialState = {
  district: "",
  street: "",
  building: "",
  apartment: "",
  data: undefined,
  smartCity: undefined
}

const Client = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!state.smartCity) {
      ipfs.files.get(
        "QmS2WuHc1ctYa3KaZZ6giovsjsb7FSJ84ZRGHZAv71T2bj",
        (err, files) => {
          if (files) {
            files.forEach(file => {
              dispatch({
                type: SET_SMART_CITY,
                payload: JSON.parse(file.content.toString("utf8"))
              })
            })
          }
        }
      )
    }
  })

  useEffect(() => {
    if (state.smartCity) {
      if (
        !state.district ||
        !state.street ||
        !state.building ||
        !state.apartment
      ) {
        dispatch({type: SELECT_DISTRICT, payload: "District 1"})
        dispatch({type: SELECT_STREET, payload: "Street 1"})
        dispatch({type: SELECT_BUILDING, payload: "Building 1"})
        dispatch({type: SELECT_APARTMENT, payload: "Apartment 1"})
      }
    }
  })

  const sum = state.data && R.sum(state.data)
  const avg = state.data && Math.round((sum / state.data.length) * 100) / 100
  const avgCost = Math.round(cost * avg * 100) / 100

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
                  <h3>{avgCost} Р</h3>
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
              {state.data && (
                <div
                  className="chart-wrapper"
                  style={{height: 300 + "px", marginTop: 40 + "px"}}
                >
                  <Line
                    data={mainChartWithData(state.data)}
                    options={mainChartOpts}
                    height={300}
                  />
                </div>
              )}
            </CardBody>
            <CardFooter>
              <Row className="text-center">
                <Col sm={6} md className="mb-sm-2 mb-0">
                  <div className="text-muted">Усредненное за день</div>
                  <strong>{avg} кВт</strong>
                </Col>
                <Col sm={6} md className="mb-sm-2 mb-0 d-md-down-none">
                  <div className="text-muted">Всего за период</div>
                  <strong>{sum} кВт</strong>
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Client
