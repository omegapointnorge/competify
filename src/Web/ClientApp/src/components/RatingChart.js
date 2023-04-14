import React, {Component} from 'react';
import {DiscreteColorLegend, FlexibleWidthXYPlot, HorizontalGridLines, LineSeries, YAxis,} from 'react-vis';


const COLORS = [
    '#6588cd',
    '#66b046',
    '#a361c7',
    '#ad953f',
    '#c75a87',
    '#55a47b',
    '#cb6141'
];

class RatingChart extends Component {

    state = {
        hoveredLabel: false,
    };

    render() {
        const {competitors, rounds} = this.props.league;
        const {hoveredLabel} = this.state;


        if (!competitors || !rounds) return null;

        const labelData = competitors.reduce((prev, competitor, idx) =>
            ({...prev, [competitor.id]: {color: COLORS[idx % COLORS.length], title: competitor.name}}), {})

        let dataSeries = {};
        competitors.forEach(competitor => {
            dataSeries[competitor.id] = [{x: 0, y: competitor.rating}];
        })

        let labelItems = Object.keys(labelData).map(id => ({
            id,
            color: labelData[id].color,
            title: hoveredLabel === id
                ? <b>{labelData[id].title}</b>
                : <span>{labelData[id].title}</span>
        }));

        rounds.forEach(round => {
            dataSeries[round.competitorA].unshift({
                x: dataSeries[round.competitorA][0].x - 1,
                y: dataSeries[round.competitorA][0].y - round.ratingChangeA
            });
            dataSeries[round.competitorB].unshift({
                x: dataSeries[round.competitorB][0].x - 1,
                y: dataSeries[round.competitorB][0].y - round.ratingChangeB
            });
            competitors
                .map(x => x.id)
                .filter(id => id !== round.competitorA && id !== round.competitorB)
                .forEach(id => {
                    dataSeries[id].unshift({
                        x: dataSeries[id][0].x - 1,
                        y: dataSeries[id][0].y,
                    })
                });
        })
        return (
            <figure>
                <FlexibleWidthXYPlot
                    height={300}>
                    <HorizontalGridLines/>
                    <YAxis/>
                    {Object.keys(dataSeries).map(competitorId => {
                        const toggleHighlight = () => hoveredLabel === competitorId
                            ? this.setState({hoveredLabel: false})
                            : this.setState({hoveredLabel: competitorId});

                        const opacity = hoveredLabel
                            ? hoveredLabel === competitorId
                                ? 1
                                : 0.5
                            : 1;
                        const props = {
                            data: dataSeries[competitorId],
                            color: labelData[competitorId].color,
                            opacity,
                            onSeriesClick: toggleHighlight,
                        };
                        return (
                            <LineSeries
                                key={competitorId}
                                {...props}
                            />
                        );
                    })}
                </FlexibleWidthXYPlot>
                <DiscreteColorLegend
                    onItemMouseEnter={item => this.setState({hoveredLabel: item.id})}
                    onItemMouseLeave={() => this.setState({hoveredLabel: false})}
                    orientation="horizontal"
                    items={labelItems}
                />
            </figure>
        );
    }
}

export default RatingChart;