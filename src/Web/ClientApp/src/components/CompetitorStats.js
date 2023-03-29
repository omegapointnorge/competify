import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actionCreators} from "../store/Leagues";
import "./League.css";
import emotion from '../emotion.gif';
import warning from '../warning.png';

class CompetitorStats extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        const leagueId = 1;
        this.props.requestLeague(leagueId);
    }

    render() {
        const competitors = this.props.league.competitors || [];
        const rounds = this.props.league.rounds || [];
        const competitor = this.props.match.params.id;
        const competitorName = competitors.find(element => element.id == competitor)?.name;
        const competitorsRounds = rounds.filter(element => (element.competitorA == competitor) !== (element.competitorB == competitor))

        const aggregatedRounds = competitorsRounds.reduce((r, {competitorA, competitorB, result, matches = 0}) => {
            const opponent = competitorA == competitor ? competitorB : competitorA;
            r[opponent] = r[opponent] || {opponent, result: 0, matches};

            // Win condition for competitor
            if ((competitor == competitorB && result == 0) || (competitor == competitorA && result == 2)) {
                r[opponent].result += 1;
            }
            r[opponent].matches += 1;

            return r
        }, {})

        const emotionDisplay = () => {
            return <img src={warning} onMouseOver={e => e.currentTarget.src = emotion}
                        onMouseLeave={e => e.currentTarget.src = warning}/>
        }

        return (
            <div>
                <h1> Stats for {competitorName}</h1>
                <table className="table table-condensed table-striped">
                    <thead>
                    <tr>
                        <th>Against</th>
                        <th>Win%</th>
                    </tr>
                    </thead>
                    <tbody>

                    {Object.keys(aggregatedRounds).map((key) => {
                        const opponentName = competitors.find(element => element.id == key)?.name;
                        const totalGamesPlayed = aggregatedRounds[key].matches;
                        const numberOfWins = totalGamesPlayed - aggregatedRounds[key].result;
                        const winPercentage = (numberOfWins / aggregatedRounds[key].matches * 100).toFixed(2)

                        return (
                            <tr>
                                <td> {opponentName} </td>
                                <td> {winPercentage}% {numberOfWins === 0 ? emotionDisplay() : null} </td>
                            </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    (state) => state.leagues,
    (dispatch) => bindActionCreators(actionCreators, dispatch)
)(CompetitorStats);
