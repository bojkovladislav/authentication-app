import { FC, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import styled from 'styled-components';
import { NotificationType } from '../../utils/Types';

interface Props {
  title: string;
  notification: NotificationType;
  setNotification: (notification: NotificationType) => void;
}

const Container = styled.div({
  position: 'absolute',
  width: '500px',
  bottom: 10,
  left: 10,
});

export const Notification: FC<Props> = ({
  title,
  notification,
  setNotification,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let timeout: number | null;

    if (notification.message.length) {
      timeout = setTimeout(() => {
        setNotification({ message: '', error: false });
      }, 5000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [notification]);

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={5000}
            autohide
            bg={!notification.error ? 'success' : 'danger'}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};
