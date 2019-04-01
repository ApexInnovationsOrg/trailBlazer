import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveForest } from '../actions/saveForest'

class NewForest extends Component {
    constructor(){
        super();
        this.state = {
            editing:false,
            savingForest:false,
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
            savingForest:true
        })
        let nameParam = this.state.editingName;
        this.props.dispatch(saveForest({ name: nameParam}));
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
            <div onClick={this.showEditingButtons}> New Forest </div>
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


export default connect(mapStateToProps)(NewForest);
