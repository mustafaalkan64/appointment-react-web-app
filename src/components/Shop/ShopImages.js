import React, { useState, useContext, useEffect, useCallback } from "react";
import API from "../../api";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { Row, Button, Col, Skeleton, Card, message, Image } from "antd";
import { useHistory } from "react-router";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { imageUrlDirectory } from "../../constUrls";
import { UploadOutlined } from '@ant-design/icons';


export const ShopImages = () => {
  const history = useHistory();
  const [files, setFiles] = useState();
  const [modifiedCollection, setModifiedCollection] = useState([]);
  const token = localStorage.getItem("auth_token");
  const [loading, setLoading] = useState(false);
  const [saveLoading] = useState(false);


  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);

  const saveFile = (e) => {
    setFiles(e.target.files);
  };

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    await API.get(`shop/getShopImages`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        setLoading(false);
        if (res.data.length > 0) {
          let modifiedCollections = res.data.reduce((rows, key, index) => {
            return (index % 3 === 0 ? rows.push([key])
              : rows[rows.length - 1].push(key)) && rows;
          }, []);
          setModifiedCollection(modifiedCollections);
        }
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          history.push("/login");
        } else {
          message.error(error.response.data);
        }
        setLoading(false);
      });
  }, [history, token])


  useEffect(() => {
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Profil Bilgilerim");
    setLastBreadcrumb("Fotoğraflarım");
    fetchBusinesses();
  }, [setFirstBreadcrumb, setSecondBreadcrumb, setLastBreadcrumb, fetchBusinesses]);


  const deleteFile = async (fileId) => {

    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        setLoading(true);
        let imageId = fileId;
        await API.post("shop/removeShopImage", imageId, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            fetchBusinesses();
            setLoading(false);
            message.success(res.data.response);
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


    }
  }
  const uploadFile = async (e) => {
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("formFiles", files[i]);
    }
    try {
      await API.post("file/uploadMultipleFiles", formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          message.success(res.data.response);
          fetchBusinesses();
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

      {loading ? (<Row>
        <Col span={20} offset={2}><Card
          title="Fotoğraflarım"
          hoverable
          bordered={true}
          style={cardStyle}
          headStyle={headStyle}
        >
          <Row
            style={{ marginBottom: 10, marginLeft: 0 }}
            gutter={{ xs: 8, sm: 16, md: 20, lg: 32 }} span={20} offset={2}
          >
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>

          </Row>

          <Row
            style={{ marginBottom: 10, marginLeft: 0 }}
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          >
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>
            <Col><Skeleton.Image style={{ width: 400, height: 400 }}></Skeleton.Image>
            </Col>

          </Row>
        </Card></Col></Row>) : (<Row>
          <Col span={20} offset={2}>
            <Card
              title="Fotoğraflarım"
              hoverable
              bordered={true}
              style={cardStyle}
              headStyle={headStyle}
            >
              <Row
                style={{ marginBottom: 10, marginLeft: 0 }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col>
                  <input type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    className="form-control"
                    onChange={saveFile} />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    loading={saveLoading}
                    icon={<UploadOutlined />}
                    onClick={() => uploadFile()}
                    htmlType="button"
                  >
                    Yükle
                        </Button>
                </Col>

              </Row>
              {
                modifiedCollection.map((row) =>
                  <Row gutter={16} style={{ marginTop: 10 }}>
                    {row.map(image => (
                      <Col span={8}>
                        <Card key={"card-image-" + image.id}
                          hoverable
                          style={{ width: '100%' }}
                          cover={<Image.PreviewGroup key={"preview-image-" + image.id}> <Image key={image.id} src={imageUrlDirectory + image.imageUrl} /></Image.PreviewGroup>}
                        >
                          <Button
                            type="primary"
                            onClick={() => deleteFile(image.id)}
                            htmlType="button"
                          >
                            Sil
                                </Button>
                        </Card>
                      </Col>))}
                  </Row>
                )
              }

            </Card >
          </Col >
        </Row >)}


    </div >
  );
};

export default ShopImages;
