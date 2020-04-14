import React from "react";
import PropTypes from "prop-types";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { reqDeleteImg } from "../../api";
import { BASE_IMG_URL } from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array,
  };

  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
  };

  constructor(props) {
    super(props);
    let fileList = [];
    // 若传入imgs属性
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img,
      }));
    }

    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList,
    };
  }

  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map((file) => file.name);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    // 一旦上传成功，修正当前file信息（url和name）
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("图片上传成功");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("图片上传失败");
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("图片删除成功");
      } else {
        message.error("图片删除失败");
      }
    }
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          name="image"
          listType="picture-card"
          fileList={fileList} // 所有已上传文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
