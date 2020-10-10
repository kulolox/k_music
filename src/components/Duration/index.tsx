import React from 'react';
import moment from 'moment';

interface IProps {
  className?: string;
  seconds: number;
}

const getDate = (seconds: number) => {
  return new Date(seconds * 1000);
};

const Duration = (props: IProps) => {
  return (
    <span className={props.className}>
      {moment(getDate(props.seconds)).utcOffset(0).format('mm:ss')}
    </span>
  );
};

export default Duration;
