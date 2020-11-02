import React from 'react';
import moment from 'moment';

interface IProps {
  className?: string;
  seconds: number;
}

const Duration = (props: IProps) => {
  return (
    <span className={props.className}>
      {moment(new Date(props.seconds * 1000))
        .utcOffset(0)
        .format('mm:ss')}
    </span>
  );
};

export default Duration;
