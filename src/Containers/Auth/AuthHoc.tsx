// this component is hoc with static left side and dynamic right side

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Carousel from './Carousel';
import './auth.scss';

interface IAuthHocType {
  children: React.ReactElement;
}

const AuthHoc: React.FC<IAuthHocType> = ({ children }) => {
  return (
    <Row className="m-0 auth-container">
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="carousel-screen p-0 align-self-center">
        <Carousel />
      </Col>
      <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="auth-screen align-self-center">
        {children}
      </Col>
    </Row>
  );
};

export default AuthHoc;
