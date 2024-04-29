import React from 'react';
import { Icon as IconAntd } from 'antd';
import { startsWith } from 'lodash';

const Icon = ({ icon, ...props }) => {
    if (startsWith(icon, 'fa')) {
        return <IconAntd {...props} component={() => <span><i className={icon}></i></span>} />
    } else if (startsWith(icon, './')) {
        return <IconAntd {...props} component={() => <img src={icon} width='15px' height='15px' />} />
    } else {
        return <IconAntd {...props} type={icon} />
    }
};

export default Icon;

