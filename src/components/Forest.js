import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getAllForests} from '../actions/getForest';
class Forest extends Component {

    componentDidMount()
    {
        this.props.dispatch(getAllForests());
    }

    listForests()
    {
        return this.props.forests.forests.map((forest)=>{
            return (
                <li key={forest.ID}>{forest.Name} - {forest['Tree Count']}</li>
            )
        })
    }
    render() {

        if(this.props.forests.error)
        {
            return (
                <ul>
                <li style={{color:'red'}}>Error! {this.props.forests.error}</li>
                </ul>
            )
        }

        if(this.props.forests.loading)
        {
            return (<div>Loading...</div>);
        }

        return (
            <ul>
                { this.listForests() }
            </ul>
        );
    }
}

function mapStateToProps(state){
    console.log('what state are we in',state);
    return {
        forests: state.forests
    }
}


export default connect(mapStateToProps)(Forest);