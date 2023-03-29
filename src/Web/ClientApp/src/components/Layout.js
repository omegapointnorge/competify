import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actionCreators} from "../store/Authentication";

import {Col, Grid, Row} from "react-bootstrap";
import NavMenu from "./NavMenu";

class Layout extends Component {
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={3}>
                        <NavMenu/>
                    </Col>
                    <Col sm={9}>{this.props.children}</Col>
                </Row>
            </Grid>
        );
    }
}

export default connect(
    (state) => state.authentication,
    (dispatch) => bindActionCreators(actionCreators, dispatch)
)(Layout);
