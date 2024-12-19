import { Dispatch, SetStateAction, useMemo } from "react";
import { Button, Form, Upload, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';

interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
}

const ButtonUploadOrderRepair = ({ fileList, setFileList }: Props) => {
  const propsUpload = useMemo(() => {
    const propsUpload: UploadProps = {
      accept: ".pdf",
      multiple: true,
      customRequest: ({ onSuccess }) => {
        setTimeout(() => {
          onSuccess!("ok");
        }, 0);
      },
      fileList,
      onChange: ({ fileList }) => setFileList(fileList)
    };

    return propsUpload;
  }, [fileList, setFileList]);

  return (
    <Form.Item name="repairOrders">
      <Upload {...propsUpload}>
        <Button icon={<UploadOutlined />}>Cargar orden de reparación</Button>
      </Upload>
    </Form.Item>
  );
};

export default ButtonUploadOrderRepair;