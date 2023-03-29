import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actionCreators} from "../store/Leagues";
import {Button, ButtonGroup, ButtonToolbar, Col, Glyphicon,} from "react-bootstrap";
import moment from "moment";
import "./League.css";
import RatingChart from "./RatingChart";
import LeaderBoard from "./LeaderBoard";

const CURRENT_LEAGUEID = 1;

class League extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            competitorA: null,
            competitorB: null,
            result: 1,
            nRounds: 10,
        };

        this.addRound = this.addRound.bind(this);
        this.undoAddRound = this.undoAddRound.bind(this);
        this.showMoreRounds = this.showMoreRounds.bind(this);
    }

    componentWillMount() {
        const leagueId = CURRENT_LEAGUEID;
        this.props.requestLeague(leagueId);
    }

    addRound() {
        const leagueId = CURRENT_LEAGUEID;
        const result = this.state.result;
        const reaction = this.state.reaction;
        const competitorA = this.state.competitorA.id;
        const competitorB = this.state.competitorB.id;
        this.props.addRound(leagueId, {
            competitorA,
            competitorB,
            result,
            reaction,
        });
    }

    undoAddRound() {
        const leagueId = CURRENT_LEAGUEID;
        const round = this.props.league.rounds[0];
        const competitors = this.props.league.competitors;
        this.setState({
            competitorA: competitors.find((x) => x.id === round.competitorA),
            competitorB: competitors.find((x) => x.id === round.competitorB),
            result: round.result,
            reaction: round.reaction,
        });

        this.props.undoAddRound(leagueId);
    }

    showMoreRounds() {
        this.setState({
            nRounds: this.state.nRounds + 10,
        })
    }

    render() {
        const competitors = this.props.league.competitors || [];
        const rounds = this.props.league.rounds || [];

        const RESULT = {
            A_WON: 0,
            DRAW: 1,
            B_WON: 2,
        };
        const REACTION = {
            NONE: 0,
            A_DOMINATED: 1,
            B_DOMINATED: 2,
            INACTIVITY_PUNISHMENT: 3,
        };

        const removeRoundCompetitor = (competitorPropName) => {
            if (competitorPropName === "competitorA") {
                let competitorA = this.state.competitorB;
                let competitorB = null;
                this.setState({competitorA, competitorB});
            } else if (competitorPropName === "competitorB") {
                let competitorB = null;
                this.setState({competitorB});
            }
        };

        const RoundCompetitor = (propName) => {
            const competitor = this.state[propName] || {};
            const result = this.state.result;
            let className = "competitor";
            if (propName === "competitorA" && result === RESULT.A_WON)
                className += " winner";
            if (propName === "competitorA" && result === RESULT.B_WON)
                className += " loser";
            if (propName === "competitorB" && result === RESULT.A_WON)
                className += " loser";
            if (propName === "competitorB" && result === RESULT.B_WON)
                className += " winner";

            return (
                <div className={className}>
                    <button
                        onClick={() => removeRoundCompetitor(propName)}
                        className="remove-btn"
                    >
                        <Glyphicon glyph="remove-circle"/>
                    </button>
                    <span>{competitor.name}</span>
                </div>
            );
        };

        const canSelectCompetitorA = this.state.competitorA === null;
        const canSelectCompetitorB =
            this.state.competitorB === null && !canSelectCompetitorA;

        const addCompetitorToRound = (competitor) => {
            if (canSelectCompetitorA) this.setState({competitorA: competitor});
            else if (canSelectCompetitorB) {
                this.setState({competitorB: competitor});
            }
        };

        const Placeholder = (text) => (
            <div className="placeholder">
                <p>{text}</p>
            </div>
        );

        const RoundEditorButtons = () => {
            const setRoundResult = (result, reaction) =>
                this.setState({result, reaction});
            const button = (result, reaction, label) => (
                <Button
                    className={
                        result === this.state.result && this.state.reaction === reaction
                            ? "selected"
                            : ""
                    }
                    onClick={() => setRoundResult(result, reaction)}
                >
                    {label}
                </Button>
            );

            return (
                <ButtonToolbar>
                    <ButtonGroup>
                        {button(
                            RESULT.A_WON,
                            REACTION.A_DOMINATED,
                            <span role="img" aria-label="reaction">
                &#x1f525;
              </span>
                        )}
                        {button(
                            RESULT.A_WON,
                            REACTION.NONE,
                            `${this.state.competitorA.name} won`
                        )}
                        {button(RESULT.DRAW, REACTION.NONE, `draw`)}
                        {button(
                            RESULT.B_WON,
                            REACTION.NONE,
                            `${this.state.competitorB.name} won`
                        )}
                        {button(
                            RESULT.B_WON,
                            REACTION.B_DOMINATED,
                            <span role="img" aria-label="reaction">
                &#x1f525;
              </span>
                        )}
                    </ButtonGroup>
                    <Button bsClass="btn btn-success" onClick={this.addRound}>
                        <Glyphicon glyph="floppy-disk"/>
                    </Button>
                </ButtonToolbar>
            );
        };

        const RoundEditor = (
            <Col bsClass="sm-12">
                <div className="round">
                    {this.state.competitorA && RoundCompetitor("competitorA")}
                    {this.state.competitorB && <div className="vs">vs</div>}
                    {this.state.competitorB && RoundCompetitor("competitorB")}
                </div>
                {this.state.competitorA &&
                    this.state.competitorB &&
                    RoundEditorButtons()}
            </Col>
        );

        const RoundEditorProxy = canSelectCompetitorA
            ? Placeholder("Click a row from the leaderboard to begin a new round.")
            : RoundEditor;

        const Rounds = (
            <table className="table table-condensed table-striped">
                <thead>
                <tr>
                    <th>P1</th>
                    <th>P2</th>
                    <th>Registered</th>
                </tr>
                </thead>
                <tbody>
                {rounds.slice(0, this.state.nRounds).map((round, idx) => {
                    const competitorA =
                        competitors.find((x) => x.id === round.competitorA) || {};
                    const competitorB =
                        competitors.find((x) => x.id === round.competitorB) || {};
                    const onClick = () => {
                        this.setState({
                            competitorA,
                            competitorB,
                            result: round.result,
                            reaction: round.reaction,
                        });
                    };

                    let classNameA = "draw";
                    let classNameB = "draw";
                    if (round.result === RESULT.A_WON) {
                        classNameA = "winner";
                        classNameB = "loser";
                    } else if (round.result === RESULT.B_WON) {
                        classNameA = "loser";
                        classNameB = "winner";
                    }

                    let reactionA = null;
                    let reactionB = null;

                    if (round.reaction === REACTION.A_DOMINATED) {
                        reactionB = (
                            <span role="img" aria-label="reaction">
                  &#x1f4a9;
                </span>
                        );
                    } else if (round.reaction === REACTION.B_DOMINATED) {
                        reactionA = (
                            <span role="img" aria-label="reaction">
                  &#x1f4a9;
                </span>
                        );
                    }

                    const fmtRatingChange = (ratingChange) => {
                        return `${ratingChange > 0 ? "+" : ""}${ratingChange}`;
                    };

                    return (
                        <tr key={idx} className="clickable" onClick={onClick}>
                            <td>
                  <span className="draw">
                    {competitorA.name}
                      {reactionA}
                  </span>
                                <span className={classNameA}>
                    {fmtRatingChange(
                        round.ratingChangeA - round.bonusRatingChange
                    )}
                  </span>
                                {round.bonusRatingChange !== 0 && (
                                    <span className="draw">
                      {fmtRatingChange(round.bonusRatingChange)}
                    </span>
                                )}
                            </td>
                            <td>
                                {round.reaction === REACTION.INACTIVITY_PUNISHMENT ? (
                                    <span className="draw" role="img" aria-label="reaction">
                      &#x1f634;
                    </span>
                                ) : (
                                    <span>
                      <span className="draw">
                        {competitorB.name}
                          {reactionB}
                      </span>
                      <span className={classNameB}>
                        {fmtRatingChange(
                            round.ratingChangeB - round.bonusRatingChange
                        )}
                      </span>
                                        {round.bonusRatingChange !== 0 && (
                                            <span className="draw">
                          {fmtRatingChange(round.bonusRatingChange)}
                        </span>
                                        )}
                    </span>
                                )}
                            </td>
                            <td>
                  <span className="timestamp" title={moment(round.created).toLocaleString()}>
                    {moment(round.created).fromNow()}
                  </span>
                                {idx === 0 && (
                                    <Button bsSize="xsmall" onClick={this.undoAddRound}>
                                        <Glyphicon glyph="remove"/>
                                    </Button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
                <button
                    onClick={() => this.showMoreRounds()}>Show more
                </button>
            </table>
        );

        const Stats = (
            <div>
                <table className="table table-condensed table-striped">
                    <thead>
                    <tr>
                        <th>Player</th>
                        <th>W/L</th>
                        <th>% Wins</th>
                        <th>% Losses</th>
                    </tr>
                    </thead>
                    <tbody>
                    {competitors.map((competitor) => {
                        const eligibleRounds = rounds.filter(
                            (x) => x.reaction !== REACTION.INACTIVITY_PUNISHMENT
                        );
                        const wins = eligibleRounds.filter(
                            (x) =>
                                (x.competitorA === competitor.id &&
                                    x.result === RESULT.A_WON) ||
                                (x.competitorB === competitor.id && x.result === RESULT.B_WON)
                        );
                        const draws = eligibleRounds.filter(
                            (x) =>
                                (x.competitorA === competitor.id &&
                                    x.result === RESULT.DRAW) ||
                                (x.competitorB === competitor.id && x.result === RESULT.DRAW)
                        );
                        const losses = eligibleRounds.filter(
                            (x) =>
                                (x.competitorA === competitor.id &&
                                    x.result === RESULT.B_WON) ||
                                (x.competitorB === competitor.id && x.result === RESULT.A_WON)
                        );
                        const numberOfResults =
                            wins.length + draws.length + losses.length;

                        const percentOfTotal = (results) => {
                            let percent = 0;
                            if (numberOfResults !== 0) {
                                percent = (100 * results.length) / numberOfResults;
                            }
                            return percent.toFixed(2);
                        };

                        return (
                            <tr key={competitor.id} onClick={e => window.location.href = "competitor/" + competitor.id}
                                name="playerProfile">
                                <td>{competitor.name}</td>
                                <td>{competitor.isPrivateMatches ?
                                    <span>&#x1F512;</span> : wins.length + "/" + losses.length}</td>
                                <td>{percentOfTotal(wins)}%</td>
                                <td>{percentOfTotal(losses)}%</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
        return (
            <main>
                <h1>{this.props.league.name}</h1>
                <small>Forked from <a href="https://github.com/itverket/competify"
                                      target="_blank">itverket/competify</a></small>
                <LeaderBoard
                    competitors={competitors}
                    competitorA={this.state.competitorA}
                    competitorB={this.state.competitorB}
                    addCompetitorToRound={addCompetitorToRound}
                    removeRoundCompetitor={removeRoundCompetitor}
                />

                <h2>Add round</h2>
                {RoundEditorProxy}

                <h2>Rounds</h2>
                {Rounds}

                <h2>Stats</h2>
                {Stats}

                <RatingChart league={this.props.league}/>
                <hr/>
                <small>Sourcecode: <a href={"https://github.com/BredeFK/competify"}>github.com/BredeFK/competify</a>
                </small>
            </main>
        );
    }
}

export default connect(
    (state) => state.leagues,
    (dispatch) => bindActionCreators(actionCreators, dispatch)
)(League);
