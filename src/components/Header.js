import React, {Component} from 'react';
import logo from '../ApexLogo500.svg';

class Header extends Component{
    render(){
       
       
       return (
            <header>
                <img src={logo} className="logo" alt="logo" />
                Trail Blazer
            </header>
       )
    }
}

export default Header;