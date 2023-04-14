import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionCreators} from '../store/Leagues';
import {Link} from 'react-router-dom';


class Leagues extends Component {
    componentWillMount() {
        this.props.requestLeagues();
    }

    componentWillReceiveProps(nextProps) {
        // This method runs when incoming props (e.g., route params) change
        //const startDateIndex = parseInt(nextProps.match.params.startDateIndex, 10) || 0;
        //this.props.requestLeagues();
    }

    render() {
        return (
            <div>
                <h1>Leagues</h1>
                {this.props.leagues.map(league => (
                    <div key={league.id}>
                        <h2>
                            {league.name}&nbsp;
                            <small>
                                <Link to={`/l/${league.id}`}>Go to league</Link>
                            </small>
                        </h2>
                    </div>
                ))}
            </div>
        );
    }
}


export default connect(
    state => state.leagues,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Leagues);
