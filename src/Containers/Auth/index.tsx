'use client'
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Carousel from './Carousel';
import LoginScreen from './LoginScreen/index';
import './auth.scss'

interface ILoginType {
}

const Login: React.FC<ILoginType> = () => {

  return (
    <Row className="m-0 login-container">
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="carousel-screen p-0 align-self-center">
        <Carousel />
      </Col>
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="login-screen align-self-center">
        <LoginScreen />
      </Col>
    </Row>
  )
}

export default Login;
