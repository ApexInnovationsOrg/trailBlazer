import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { bindActionCreators } from 'redux';


class Tree extends Component {
    render() {
        return(
            <div>Tree</div>
        )
    }
}


// function mapStateToProps(state)
// {
//     return {
//         activeAnswer: state.activeAnswer,
//         answeredQuestions:state.answeredQuestions
//     }
// }

// function matchDispatchToProps(dispatch)
// {
//     return bindActionCreators({submitAnswer:submitAnswer},dispatch);
// }


// export default connect(mapStateToProps,matchDispatchToProps)(Tree);

export default Tree;