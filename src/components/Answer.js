import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Answer extends Component {
    constructor(props)
    {
        super(props);

        console.log(props);
        // this.props.selectAnswer = this.props.selectAnswer.bind(this);
    }

    render(i){

        let classNames = ["answer"]
        if(this.props.answer === this.props.choice)
        {
          classNames.push('selected')
        }
    
        return (
          <li
            className={
              classNames.join(' ')
            }
            onClick={this.props.selectAnswer}
          >
           
    
          </li>
        );
      }
}


Answer.propTypes = {
    selectAnswer: PropTypes.func
}
export default Answer;