import React, { Component } from 'react';
import logo from '../logo.png';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HeaderComponent extends Component {

    getForest = ()=>
    {
        if(!this.props.activeForest.Name)
        {
            return
        }

        return <h3 className="newForest" style={{transform:this.props.forests.loading || this.props.activeTree.loading || this.props.activeForest.loading || this.props.singleForest.loading || this.props.tree.loading ? 'translateX(250%)':'translateX(0%)'}}>{this.props.activeForest.Name} {this.props.activeTree.Name ? '-':<FontAwesomeIcon icon="tree" />} {this.props.activeTree.Name}</h3>
        
        
    }

    render() {

        return (
            <header>
                <img src={logo} className="logo" alt="logo" />
                <div className="forestName">{this.getForest()}</div>
            </header>
        );
    }
}


function mapStateToProps(state)
{
    return {
        activeForest:state.activeForest,
        activeTree:state.activeTree,
        forests:state.forests,
        singleForest: state.singleForest,
        tree:state.tree
        
    }
}


export default connect(mapStateToProps)(HeaderComponent);