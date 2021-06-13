import React, { useEffect } from 'react';
import { Card, Layout } from 'antd';
import MainHeader from "./MainHeader";
import {
    useParams
} from "react-router-dom";
const { Content, Footer } = Layout;

const SaloonPage = () => {
    let { saloonUrl } = useParams();
    return (
        <div>
            <Layout>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 50px', marginTop: 10, marginLeft: '10%' }}>

                    <div className="site-layout-content">
                        <Card>
                            {saloonUrl}
                        </Card>
                    </div>

                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        </div>
    );
};

export default SaloonPage;