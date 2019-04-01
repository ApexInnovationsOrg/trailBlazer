import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveTree } from '../actions/saveTree'

export class NewTree extends Component {
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
        console.log(this.props);
        // this.props.dispatch(saveTree({ name: this.state.editingName, forestID: this.props.activeForest.ID} ));
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
    console.log('in test',state);
    return {
        tree: state.tree,
        activeTree:state.activeTree,
        activeForest:state.activeForest,
    }
}

// function matchDispatchToProps(dispatch)
// {
//     return bindActionCreators({submitAnswer:submitAnswer},dispatch);
// }


// export default connect(mapStateToProps,matchDispatchToProps)(Tree);

    export default connect(mapStateToProps,null)(NewTree);
