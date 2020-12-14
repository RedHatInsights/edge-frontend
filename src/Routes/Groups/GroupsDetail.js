import React from 'react';
import { useParams } from 'react-router-dom';

const Groups = () => {
    const { uuid } = useParams();
    return <div>Here will be group detail of - {uuid}!</div>;
};

export default Groups;
