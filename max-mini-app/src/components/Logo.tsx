import React from 'react';
import logo from '/logo.jpg';
import {Flex} from '@maxhub/max-ui';

const Logo: React.FC = () =>{
    return(
        <Flex justify="center" align="center" style={{ padding: '0 0 16px 0' }}>
            <img
            src={logo} 
            alt="Логотип"
            style={{
                maxWidth: '300px',
                height: 'auto',
                objectFit: 'contain',
            }}
            />
        </Flex>
    );
}

export default Logo;