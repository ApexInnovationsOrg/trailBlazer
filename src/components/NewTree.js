import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveTree } from '../actions/saveTree'

class NewTree extends Component {
    constructor(){
        super();
        this.state = {
            editing:false,
            savingTree:false,
            editingName:'',
        }
    }
    setEdit = (mode) =>
    {
        this.setState({
            editing:mode
        })
    }

    showEditingButtons = ()=>
    {
        this.setEdit(true)
    }
    hideEditingButtons = ()=>
    {
        this.setEdit(false)
    }

    changeName = (e)=>
    {
        this.setState({
            editingName : e.target.value
        })
    }
    cancelEdit = () =>
    {

        this.setState({
            editingName : ''
        })
        this.hideEditingButtons();
    }

    saveChanges =()=>
    {
        this.setState({
            savingTree:true
        })
        // //console.log(this.props);
        let nameParam = this.state.editingName;
        let forestID = this.props.activeForest.ID;
        this.props.dispatch(saveTree({ name: nameParam, forestID:forestID} ));
    }
    render() {
        if(this.state.editing)
        {
            return <div>
                        <div>
                            <input value={this.state.editingName} onChange={this.changeName}/>
                        </div>
                        <div>
                            <button onClick={this.cancelEdit}>Cancel</button><button onClick={this.saveChanges}>Save</button>
                        </div>
                    </div>
        }

        return(
            <div onClick={this.showEditingButtons}> New Tree </div>
        )
    }
}


function mapStateToProps(state)
{
    return {
        tree: state.tree,
        activeTree:state.activeTree,
        activeForest:state.activeForest,
    }
}


export default connect(mapStateToProps)(NewTree);
