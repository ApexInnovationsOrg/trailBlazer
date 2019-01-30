import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getAllForests,getSingleForest} from '../actions/getForest';
import {getTree} from '../actions/getTree';
import store from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Forest extends Component {

    componentDidMount()
    {
        this.props.dispatch(getAllForests());
    }

    selectTree(tree)
    {
        this.props.dispatch(getTree(tree));
    }
    listTrees()
    {
        const trees = this.props.singleForest.trees.map((tree) => {

                if(this.props.activeTree.ID == tree.ID)
                {
                    return <li key={tree.ID} style={{'cursor':'pointer','background':'blue'}}><span onClick={() => this.selectTree(tree)}>{tree.Name}</span></li>
                }
                else
                {
                    return <li key={tree.ID} style={{'cursor':'pointer'}}><span onClick={() => this.selectTree(tree)}>{tree.Name}</span></li>
                }
            }
        )
        return trees;
    }
    treeList()
    {
        if(this.props.singleForest.error)
        {
            return (
                <div style={{'color':'red'}}>Error: {this.props.singleForest.error}</div>
            )
        }
        if(this.props.singleForest.loading)
        {
            return (
                <div>Loading...</div>
            )
        }
        if(this.props.singleForest.trees.length === 0)
        {
            return (
                <ul>
                    <li>No Trees</li>
                </ul>
            )
        }
        else
        {
            return(
                <div>
                    <ul>
                        {this.listTrees()}
                    </ul>
                </div>
            )
            

        }
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
            if(this.props.activeForest.ID === forest.ID)
            {
                return (
                    <li key={forest.ID}>
                       <span className="forest">  > {forest.Name} - {forest['Tree Count']} Trees {getTrees(forest)}</span>
                           {this.treeList()}
                    </li>
                    )
            }
            else
            {
                return (
                    <li onClick={() => store.dispatch(getSingleForest(forest))} key={forest.ID}><span className="forest">{forest.Name} - {forest['Tree Count']} Trees {getTrees(forest)}</span></li>
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
        activeForest: state.activeForest,
        singleForest:state.singleForest,
        activeTree:state.activeTree
        // tree:state.trees
    }
}


export default connect(mapStateToProps)(Forest);