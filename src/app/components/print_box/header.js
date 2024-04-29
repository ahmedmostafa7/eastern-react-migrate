import React, { Component } from 'react'

class Header extends Component {
    render () {
        const {name} =this.props
        return (
            <div>
                   
                        <div className="container header-layout">
                            <div className="big-logo">
                                <img src="images/logo2.png" style={{ width: "55%" }} alt="" />
                            </div>
                            <div className="header-title">
                                <h1>{name}</h1>
                            </div>
                            <div className="navbar-header">
                                <span className="navbar-brand"><img src="images/saudiVision2.png" alt="logo" style={{ width: "50%" }} /></span>
                            </div>

                           
                        </div>
                   

               
            </div>
        )
    }
}

export default Header