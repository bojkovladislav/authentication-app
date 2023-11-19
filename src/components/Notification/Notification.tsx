import { FC, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import styled from 'styled-components';

interface Props {
  message: string;
  title: string;
  variant: string;
}

const Container = styled.div({
  position: 'absolute',
  width: '500px',
  bottom: 10,
  left: 10,
});

export const Notification: FC<Props> = ({ message, title, variant }) => {
  const [show, setShow] = useState(true);

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={5000}
            autohide
            bg={variant}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{message}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};
