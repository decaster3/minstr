import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips"
import {getStyle, hexToRgba} from "@coreui/coreui/dist/js/coreui-utilities"
import dayjs from "dayjs"
import * as R from "ramda"
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
    } else {
      return Math.floor(
        Math.random() * drop * (Math.random() > 0.5 ? -1 : 1) + avg
      )
    }
  }
  const rets = []
  R.times(i => {
    rets.push(createVal())
    avg += delta
  }, cnt)
  return rets
}

const length = 30
const startDate = dayjs().startOf("year")
const data = generate(0, length, 50, 10, 0.9, 0, 100)
const labels = R.times(i => startDate.add(i, "day").format("MMM DD"), length)

const districtNames = R.times(i => `District ${i + 1}`, 13)
const streetNames = R.times(i => `Street ${i + 1}`, 13)
const buildingNames = R.times(i => `Building ${i + 1}`, 13)
const apartmentNames = R.times(i => `Apartment ${i + 1}`, 13)

const smartCity = {
  name: "Smart City 1",
  type: "city",
  districts: districtNames.map(districtName => {
    return {
      name: districtName,
      type: "district",
      streets: streetNames.map(streetName => {
        return {
          name: streetName,
          type: "street",
          buildings: buildingNames.map(buildingName => {
            return {
              name: buildingName,
              type: "building",
              apartments: apartmentNames.map(apartmentName => {
                return {
                  type: "apartment",
                  name: apartmentName,
                  data: generate(0, length, 50, 10, 0.9, 0, 100)
                }
              })
            }
          })
        }
      })
    }
  })
}

console.log("smartCity", smartCity)

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
 * @return {Chart.ChartData} data
 */
const mainChartWithData = data => ({
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
})

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
          stepSize: Math.ceil(100 / 5)
          // max: 100
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

const zipSum = R.unapply(
  R.converge(
    // @ts-ignore
    R.reduce(R.zipWith(R.add)),
    [R.head, R.tail]
  )
)

const sumApartmentsData = apartments => {
  const apartmentDatas = apartments.map(x => x.data)
  return zipSum(...apartmentDatas)
}

const sumBuildingsData = buildings => {
  const buildingDatas = buildings.map(x => sumApartmentsData(x.apartments))
  return zipSum(...buildingDatas)
}

const sumStreetsData = streets => {
  const streetDatas = streets.map(x => sumBuildingsData(x.buildings))
  return zipSum(...streetDatas)
}

const sumDistrictsData = districts => {
  const districtDatas = districts.map(x => sumStreetsData(x.streets))
  return zipSum(...districtDatas)
}

const sumStreetsDataOfDistrict = districtName =>
  sumStreetsData(smartCity.districts.find(x => x.name === districtName).streets)

const sumBuildingsDataOfStreetOfDistrict = (streetName, districtName) =>
  sumBuildingsData(
    smartCity.districts
      .find(x => x.name === districtName)
      .streets.find(x => x.name === streetName).buildings
  )

const sumApartmentsDataOfBuildingOfStreetOfDistrict = (
  buildingName,
  streetName,
  districtName
) =>
  sumApartmentsData(
    smartCity.districts
      .find(x => x.name === districtName)
      .streets.find(x => x.name === streetName)
      .buildings.find(x => x.name === buildingName).apartments
  )

const dataOfApartmentOfBuildingOfStreetOfDistrict = (
  apartmentName,
  buildingName,
  streetName,
  districtName
) =>
  smartCity.districts
    .find(x => x.name === districtName)
    .streets.find(x => x.name === streetName)
    .buildings.find(x => x.name === buildingName)
    .apartments.find(x => x.name === apartmentName).data

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
        apartment: "",
        data: action.payload
          ? sumStreetsDataOfDistrict(action.payload)
          : sumDistrictsData(smartCity.districts)
      }
    }
    case SELECT_STREET: {
      return {
        ...state,
        street: action.payload,
        building: "",
        apartment: "",
        data: action.payload
          ? sumBuildingsDataOfStreetOfDistrict(action.payload, state.district)
          : sumStreetsDataOfDistrict(state.district)
      }
    }
    case SELECT_BUILDING: {
      return {
        ...state,
        building: action.payload,
        apartment: "",
        data: action.payload
          ? sumApartmentsDataOfBuildingOfStreetOfDistrict(
              action.payload,
              state.street,
              state.district
            )
          : sumBuildingsDataOfStreetOfDistrict(state.street, state.district)
      }
    }
    case SELECT_APARTMENT: {
      return {
        ...state,
        apartment: action.payload,
        data: action.payload
          ? dataOfApartmentOfBuildingOfStreetOfDistrict(
              action.payload,
              state.building,
              state.street,
              state.district
            )
          : sumApartmentsDataOfBuildingOfStreetOfDistrict(
              state.building,
              state.street,
              state.district
            )
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
  apartment: "",
  data: sumDistrictsData(smartCity.districts)
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
                  {districtNames.map(districtName => (
                    <option value={districtName} key={districtName}>
                      {districtName}
                    </option>
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
                  {streetNames.map(streetName => (
                    <option value={streetName} key={streetName}>
                      {streetName}
                    </option>
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
                  {buildingNames.map(buildingName => (
                    <option value={buildingName} key={buildingName}>
                      {buildingName}
                    </option>
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
                  {apartmentNames.map(apartmentName => (
                    <option value={apartmentName} key={apartmentName}>
                      {apartmentName}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>

            <div className="py-3">
              <Line
                data={mainChartWithData(state.data)}
                options={mainChartOpts}
                height={300}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default RSO
