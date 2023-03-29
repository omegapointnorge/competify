import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionCreators} from '../store/Authentication';


import {Button, FormControl} from 'react-bootstrap';


class Authenticate extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            secret: '',
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    handleChange(e) {
        this.setState({secret: e.target.value});
    }

    render() {
        return (
            <div>
                <h1>Competify 2.0</h1>
                <p>Enter the super secret passphrase to access the awesomeness!</p>
                <FormControl
                    type="text"
                    value={this.state.secret}
                    placeholder="Enter secret"
                    onChange={this.handleChange}
                />
                <Button
                    bsStyle="success"
                    onClick={() => this.props.authenticate(this.state.secret)}>
                    Authenticate
                </Button>
            </div>
        );
    }
}


export default connect(
    state => state.authentication,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Authenticate);
