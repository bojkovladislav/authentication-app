import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  title: string;
  message?: string;
  children?: ReactNode;
  error?: boolean;
}

export const MessageBlock: FC<Props> = ({
  title,
  message,
  children,
  error,
}) => {
  const StyledMessageBlock = styled.div`
    background-color: ${error ? '#f8d7da' : '#d4edda'};
    color: ${error ? '#721c24' : '#155724'};
    padding: 10px;
    border: 1px solid ${error ? '#f5c6cb' : '#c3e6cb'};
    border-radius: 5px;
    margin-bottom: 15px;

    h1 {
      font-size: 1.5em;
      margin-bottom: 5px;
    }

    p {
      margin: 0;
    }
  `;

  return (
    <StyledMessageBlock>
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      {children && children}
    </StyledMessageBlock>
  );
};
