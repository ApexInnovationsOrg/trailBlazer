import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getAllForests,setActiveForest} from '../actions/getForest';
import store from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Forest extends Component {

    componentDidMount()
    {
        this.props.dispatch(getAllForests());
    }

    listForests()
    {
        function getTrees(forest)
        {
            
            switch(parseInt(forest['Tree Count']))
            {
                case 0:
                    return <span> :( </span>;
                case 1: 
                        return <span><FontAwesomeIcon icon="tree"/></span>;
                case 2: 
                        return <span><FontAwesomeIcon icon="tree"/><FontAwesomeIcon icon="tree"/></span>;
                default:
                        return <span><FontAwesomeIcon icon="tree"/><FontAwesomeIcon icon="tree"/><FontAwesomeIcon icon="tree"/><span>+</span></span>;
            }
                
                
        }



        return this.props.forests.forests.map((forest)=>{
            console.log('prop',this.props.activeForest);
            if(this.props.activeForest.ID === forest.ID)
            {
                return (
                    <li className="forest" onClick={() => store.dispatch(setActiveForest(forest))} key={forest.ID}>> {forest.Name} - {forest['Tree Count']} Trees {getTrees(forest)}</li>
                    )
            }
            else
            {
                return (
                    <li className="forest" onClick={() => store.dispatch(setActiveForest(forest))} key={forest.ID}>{forest.Name} - {forest['Tree Count']} Trees {getTrees(forest)}</li>
                    )
            }
            
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
        forests: state.forests,
        activeForest: state.activeForest
    }
}


export default connect(mapStateToProps)(Forest);