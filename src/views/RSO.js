import React, {useState, useReducer} from "react"
import {Bar, Line} from "react-chartjs-2"
import {
  Col,
  Row,
  Card,
  Input,
  Label,
  FormGroup,
  CardHeader,
  CardBody
} from "reactstrap"
import {getStyle, hexToRgba} from "@coreui/coreui/dist/js/coreui-utilities"
import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips"

const brandPrimary = getStyle("--primary")
const brandSuccess = getStyle("--success")
const brandInfo = getStyle("--info")
const brandWarning = getStyle("--warning")
const brandDanger = getStyle("--danger")

// Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var elements = 27
var data1 = []

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200))
}

const mainChart = {
  labels: [
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su"
  ],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: hexToRgba(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
      data: data1
    }
  ]
}

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
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
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

const SELECT_DISTRICT = "SELECT_DISTRICT"
const SELECT_STREET = "SELECT_STREET"
const SELECT_BUILDING = "SELECT_BUILDING"
const SELECT_APARTMENT = "SELECT_APARTMENT"

const reducer = (state, action) => {
  switch (action.type) {
    case SELECT_DISTRICT: {
      return {
        district: action.payload,
        street: "",
        building: "",
        apartment: ""
      }
    }
    case SELECT_STREET: {
      return {
        ...state,
        street: action.payload,
        building: "",
        apartment: ""
      }
    }
    case SELECT_BUILDING: {
      return {
        ...state,
        building: action.payload,
        apartment: ""
      }
    }
    case SELECT_APARTMENT: {
      return {
        ...state,
        apartment: action.payload
      }
    }
    default: {
      return state
    }
  }
}

const initialState = {
  district: "",
  street: "",
  building: "",
  apartment: ""
}

const RSO = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Row>
      <Col>
        <Card>
          <CardHeader>Scope</CardHeader>

          <CardBody>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="district-select">Select district</Label>
              </Col>

              <Col xs="12" md="9">
                <Input
                  value={state.district}
                  onChange={event =>
                    dispatch({
                      type: SELECT_DISTRICT,
                      payload: event.currentTarget.value
                    })
                  }
                  type="select"
                  name="district"
                  id="district-select"
                >
                  <option value="" key="">
                    No district
                  </option>
                  {[...new Array(13)].map((_, i) => (
                    <option value={i} key={i}>{`District ${i + 1}`}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="street-select">Select street</Label>
              </Col>

              <Col xs="12" md="9">
                <Input
                  value={state.street}
                  onChange={event =>
                    dispatch({
                      type: SELECT_STREET,
                      payload: event.currentTarget.value
                    })
                  }
                  disabled={!state.district}
                  type="select"
                  name="street"
                  id="street-select"
                >
                  <option value="" key="">
                    No street
                  </option>
                  {[...new Array(13)].map((_, i) => (
                    <option value={i} key={i}>{`Street ${i + 1}`}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="building-select">Select building</Label>
              </Col>

              <Col xs="12" md="9">
                <Input
                  value={state.building}
                  onChange={event =>
                    dispatch({
                      type: SELECT_BUILDING,
                      payload: event.currentTarget.value
                    })
                  }
                  disabled={!state.district || !state.street}
                  type="select"
                  name="building"
                  id="building-select"
                >
                  <option value="" key="">
                    No building
                  </option>
                  {[...new Array(100)].map((_, i) => (
                    <option value={i} key={i}>{`Building ${i + 1}`}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="apartment-select">Select apartment</Label>
              </Col>

              <Col xs="12" md="9">
                <Input
                  value={state.apartment}
                  onChange={event =>
                    dispatch({
                      type: SELECT_APARTMENT,
                      payload: event.currentTarget.value
                    })
                  }
                  disabled={!state.district || !state.street || !state.building}
                  type="select"
                  name="apartment"
                  id="apartment-select"
                >
                  <option value="" key="">
                    No apartment
                  </option>
                  {[...new Array(100)].map((_, i) => (
                    <option value={i} key={i}>{`Apartment ${i + 1}`}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <div>
              <Line data={mainChart} options={mainChartOpts} height={300} />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default RSO
