import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getAllForests,getSingleForest} from '../actions/getForest';
import {getTree} from '../actions/getTree';
import store from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NewTree from './NewTree';
import NewForest from './NewForest';

class Forest extends Component {

    constructor(){
        super();
        this.state = {
            savingTree:false
        }
    }
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

                if(this.props.activeTree.ID === tree.ID)
                {
                    return <li key={tree.ID} onClick={() => this.selectTree(tree)} style={{'cursor':'pointer'}}><span style={{background:'rgba(228, 228, 225, 0.7)',padding:'1em'}} >{tree.Name}</span></li>
                }
                else
                {
                    return <li key={tree.ID} onClick={() => this.selectTree(tree)} style={{'cursor':'pointer'}}><span>{tree.Name}</span></li>
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

        let treeListItems = '';
        if(this.props.singleForest.trees.length === 0)
        {
            treeListItems = <li>No Trees</li>;
        }
        else
        {
            treeListItems = this.listTrees();
        }

        return <div>
                    <ul className="treeList">
                        {treeListItems}
                        <li className="newTree"><NewTree/></li>
                    </ul>
                </div>
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
                    <ul key={forest.ID} className="activeForestContainer">

                        <li className="activeForest">
                        <span className="forest">{forest.Name} - {forest['Tree Count']} Trees {getTrees(forest)}</span>
                            {this.treeList()}
                        </li>
                    
                    </ul>
                    
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
                <li style={{color:'red'}}>Error loading forests!</li>
                </ul>
            )
        }

        if(this.props.forests.loading)
        {
            return (<div>Loading...</div>);
        }

        return (
            <ul className="forestList">
                { this.listForests() }
                
                <li className="newTree"><NewForest/></li>
            </ul>
        );
    }
}

function mapStateToProps(state){
    return {
        forests: state.forests,
        activeForest: state.activeForest,
        singleForest:state.singleForest,
        activeTree:state.activeTree
        // tree:state.trees
    }
}


export default connect(mapStateToProps)(Forest);