import React, { useState, useContext, useEffect } from "react";
import API from "../../api";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { Row, Button, Col, Spin, Card, message, Image } from "antd";
import { useHistory } from "react-router";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { imageUrlDirectory } from "../../constUrls";

export const ShopImages = () => {
  const history = useHistory();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const token = localStorage.getItem("auth_token");
  const [loading, setLoading] = useState(false);
  const [saveLoading] = useState(false);
  const [logo, setLogo] = useState("");

  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);

  const saveFile = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  useEffect(() => {
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Profil Bilgilerim");
    setLastBreadcrumb("Fotoğraflarım");
  }, [setFirstBreadcrumb, setSecondBreadcrumb, setLastBreadcrumb]);

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("formFile", file);
    formData.append("fileName", fileName);
    try {
      await API.post("file/uploadFile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLogo(imageUrlDirectory + res.data.response);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
          } else {
            message.error(error.response.data);
          }
          setLoading(false);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <Row>
        <Col span={20} offset={2}>
          <Card
            title="Fotoğraflarım"
            hoverable
            bordered={true}
            style={cardStyle}
            headStyle={headStyle}
          >
            <Spin spinning={loading} delay={500}>
              <Row
                style={{ marginBottom: 10, marginLeft: 0 }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <input type="file" onChange={saveFile} />
              </Row>
              <Row style={{ marginLeft: 0 }}>
                <Col>
                  <Button
                    type="primary"
                    loading={saveLoading}
                    onClick={() => uploadFile()}
                    htmlType="button"
                  >
                    Yükle
                  </Button>
                </Col>
              </Row>
              <Row style={{ marginTop: 10, marginLeft: 0 }}>
                <Col>
                  <Image.PreviewGroup>
                    <Image width={150} src={logo} />
                  </Image.PreviewGroup>
                </Col>
              </Row>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShopImages;
