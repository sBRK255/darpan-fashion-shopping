import React from 'react';
import { Alert } from '@mui/material';

const Message = ({ severity = 'info', children }) => (
    <Alert severity={severity} sx={{ my: 2 }}>
        {children}
    </Alert>
);

export default Message; 