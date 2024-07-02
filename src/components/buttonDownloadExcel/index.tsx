import { Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import { useState } from "react";
import { downLoadExcel } from "../../utils/functions";
import { DownloadExcel } from "../../interfaces/functions";

interface Props extends DownloadExcel {
  buttonText: string;
}

const ButtonDownloadExcel = (props: Props) => {
  const [donwloading, setDownloading] = useState(false);

  const downloadTrailas = async () => {
    if (donwloading) return;

    setDownloading(false);

    try {
      await downLoadExcel(props);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      loading={donwloading}
      type="primary"
      icon={<DownloadOutlined />}
      onClick={downloadTrailas}
    >
      {props.buttonText}
    </Button>
  );
};

export default ButtonDownloadExcel;