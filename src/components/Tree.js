import React, { Component } from 'react';
import { connect } from 'react-redux';
// import store from '../store';
// import { bindActionCreators } from 'redux';
import Questions from './Question';


class Tree extends Component {

    render() {
        return(
            <div>
                <div>{this.props.activeForest.Name} - {this.props.activeTree.Name}</div>

                <Questions/>
            </div>
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

// function matchDispatchToProps(dispatch)
// {
//     return bindActionCreators({submitAnswer:submitAnswer},dispatch);
// }


// export default connect(mapStateToProps,matchDispatchToProps)(Tree);

export default connect(mapStateToProps,null)(Tree);
