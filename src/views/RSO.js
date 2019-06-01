import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips"
import {getStyle, hexToRgba} from "@coreui/coreui/dist/js/coreui-utilities"
import dayjs from "dayjs"
import React, {useReducer} from "react"
import {Line} from "react-chartjs-2"
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap"

const brandPrimary = getStyle("--primary")
const brandSuccess = getStyle("--success")
const brandInfo = getStyle("--info")
const brandWarning = getStyle("--warning")
const brandDanger = getStyle("--danger")

/**
 * @param {number} min
 * @param {number} max
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Generates an array of smoothly random values
 *
 * @see https://gist.github.com/kevinlynx/68db41b95046b89259c5
 *
 * @param {number} delta inc/dec value to avg
 * @param {number} cnt
 * @param {number} avg
 * @param {number} drop smaller/bigger value around avg
 * @param {number} nProb odds to generate noise value
 * @param {number} nMin
 * @param {number} nMax
 * @return {number[]}
 */
const generate = (delta, cnt, avg, drop, nProb, nMin, nMax) => {
  const createVal = () => {
    if (Math.random() > nProb) {
      return Math.floor(Math.random() * (nMax - nMin) + nMin)
    }
    return Math.floor(
      Math.random() * drop * (Math.random() > 0.5 ? -1 : 1) + avg
    )
  }
  const rets = []
  for (var i = 0; i < cnt; ++i) {
    rets.push(createVal())
    avg += delta
  }
  return rets
}

const length = 30
const data = generate(1, length, 50, 10, 0.9, 0, 100)
const labels = []

const startDate = dayjs().startOf("year")

for (let i = 0; i < length; i++) {
  // data.push(random(50, 200))
  labels.push(startDate.add(i, "day").format("MMM DD"))
}

const mainChart = {
  labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: hexToRgba(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
      data
    }
  ]
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
          maxTicksLimit: 5,
          stepSize: Math.ceil(100 / 5),
          max: 100
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

            <div className="py-3">
              <Line data={mainChart} options={mainChartOpts} height={300} />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default RSO
