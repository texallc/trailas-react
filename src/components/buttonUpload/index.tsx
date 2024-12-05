import { FC, useMemo } from 'react';
import { Button, UploadFile } from "antd";
import { UploadOutlined } from '@ant-design/icons';

interface Props {
  value: UploadFile<any>[];
  multiple?: boolean;
  maxCount?: number;
}

const ButtonUpload: FC<Props> = ({ value, multiple, maxCount }) => {
  const disabled = useMemo(() => {
    const count = value.length;

    maxCount = maxCount || 1;

    return count >= maxCount;
  }, [value, maxCount]);

  const textButton = useMemo(() => {
    if (multiple) {
      return "Subir";
    }

    return value?.length && maxCount === 1 ? "Cambiar" : "Subir";
  }, [multiple, maxCount, value]);

  return (
    <Button style={{ width: "100%" }} disabled={Boolean(multiple) && disabled} icon={<UploadOutlined />} children={textButton} />
  );
};

export default ButtonUpload;