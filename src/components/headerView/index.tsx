import { FC, useMemo } from 'react';
import { Col, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateButton from '../registerButton';
import BackButton from '../backButton';
import useGetSearchURL from "../../hooks/useGestSearchURL";

interface Props {
  urlProp?: string;
  goBack?: boolean;
  showButton?: boolean;
  showTitle?: boolean;
}

const HeaderView: FC<Props> = ({ urlProp, goBack, showButton = true, showTitle = true }) => {
  const { url } = useGetSearchURL({ urlProp });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const moduleName = useMemo(() => {
    const moduleName = pathname.split("/")[1];

    return (moduleName.charAt(0).toUpperCase() + moduleName.slice(1)).replaceAll("-", " ");
  }, [pathname]);

  return (
    <>
      <Row justify='space-between' align="middle">
        <Col>
          {
            showTitle && <h1>
              {moduleName}
            </h1>
          }
        </Col>
        {
          showButton &&
          <Col>
            {
              goBack
                ? <BackButton onClick={() => navigate(pathname)} />
                : <CreateButton onClick={() => navigate(`${url.replace("/list", "")}&id=0`)}>
                  {"Registar " + moduleName.slice(0, -1)}
                </CreateButton>
            }
          </Col>
        }
      </Row>
    </>
  );
};

export default HeaderView;;;;;