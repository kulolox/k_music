import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface IProps {
  text?: string;
}

export default (props: IProps) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '30vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip={props.text ?? ''} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
    </div>
  );
};
