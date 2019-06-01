import React, { useState, useReducer } from "react";
import {
  Col,
  Row,
  Card,
  Input,
  Label,
  FormGroup,
  CardHeader,
  CardBody
} from "reactstrap";

const SELECT_DISTRICT = "SELECT_DISTRICT";
const SELECT_BUILDING = "SELECT_BUILDING";
const SELECT_APARTMENT = "SELECT_APARTMENT";

const reducer = (state, action) => {
  switch (action.type) {
    case SELECT_DISTRICT: {
      return {
        district: action.payload,
        building: "",
        apartment: ""
      };
    }
    case SELECT_BUILDING: {
      return {
        ...state,
        building: action.payload,
        apartment: ""
      };
    }
    case SELECT_APARTMENT: {
      return {
        ...state,
        apartment: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

const RSO = () => {
  const [state, dispatch] = useReducer(reducer, {
    district: "",
    building: "",
    apartment: ""
  });
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
                  disabled={!state.district}
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
                  disabled={!state.district || !state.building}
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default RSO;
