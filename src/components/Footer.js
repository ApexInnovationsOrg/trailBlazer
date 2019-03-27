import React, { Component } from 'react';
import logo from '../ApexLogo500.svg';
class Footer extends Component {
    render() {
        return (
            <footer>
                <div>
                    <img style={{maxHeight:'70px'}}src={logo} alt="Apex Innovations Logo"/>
                </div>
            </footer>
        );
    }
}

export default Footer;