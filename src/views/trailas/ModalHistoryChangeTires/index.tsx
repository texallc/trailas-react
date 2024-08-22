import { useEffect, useMemo, useState } from "react";
import { Modal, ModalProps, Form } from "antd";
import { orderBy, QueryConstraint, where } from "firebase/firestore";
import BaseInputsTraila from "../../../components/baseInputsTraila";
import { TiresChangedByTraila, Traila } from "../../../interfaces/traila";
import Table from "../../../components/table";
import { ColumnsType } from "antd/es/table";
import ButtonDownloadExcel from "../../../components/buttonDownloadExcel";
import { Link } from "react-router-dom";

interface Props extends ModalProps {
  traila: Traila;
  onClose: () => void;
}

const ModalHistoryChangeTires = ({ traila, onClose, ...props }: Props) => {
  const [form] = Form.useForm<Traila>();
  const [tiresChangedByTraila, setTiresChangedByTraila] = useState<TiresChangedByTraila[]>([]);
  const query = useMemo<QueryConstraint[]>(() => {
    if (!traila.id) return [];

    return [where("idTraila", "==", traila.id), orderBy("createdAt", "desc")];
  }, [traila]);

  const columns = useMemo<ColumnsType<TiresChangedByTraila>>(() => {
    return [
      { title: "Creado por", dataIndex: "createdByEmail" },
      { title: "Fecha de cambio", dataIndex: "createdAtFormated" },
      {
        title: "Ordenes de reparación",
        dataIndex: "repairOrders",
        render: (_, { repairOrders }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            {
              (repairOrders as string[]).map((order, index) => (
                <Link
                  target="_blank"
                  to={order}
                  key={order}>
                  {`Orden ${index + 1}`}
                </Link>
              ))
            }
          </div>
        )
      },
      {
        title: "Llanta 1",
        dataIndex: "tire1",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire1}
            </div>
            {
              (tireChanged.tire1 > 0) && <div>
                Medida: {tireChanged.sizeTire1}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 2",
        dataIndex: "tire2",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire2}
            </div>
            {
              (tireChanged.tire2 > 0) && <div>
                Medida: {tireChanged.sizeTire2}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 3",
        dataIndex: "tire3",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire3}
            </div>
            {
              (tireChanged.tire3 > 0) && <div>
                Medida: {tireChanged.sizeTire3}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 4",
        dataIndex: "tire4",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire4}
            </div>
            {
              (tireChanged.tire4 > 0) && <div>
                Medida: {tireChanged.sizeTire4}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 5",
        dataIndex: "tire5",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire5}
            </div>
            {
              (tireChanged.tire5 > 0) && <div>
                Medida: {tireChanged.sizeTire5}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 6",
        dataIndex: "tire6",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire6}
            </div>
            {
              (tireChanged.tire6 > 0) && <div>
                Medida: {tireChanged.sizeTire6}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 7",
        dataIndex: "tire7",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire7}
            </div>
            {
              (tireChanged.tire7 > 0) && <div>
                Medida: {tireChanged.sizeTire7}
              </div>
            }
          </div>
        )
      },
      {
        title: "Llanta 8",
        dataIndex: "tire8",
        render: (_, tireChanged) => (
          <div>
            <div>
              Llantas cambiadas: {tireChanged.tire8}
            </div>
            {
              (tireChanged.tire8 > 0) && <div>
                Medida: {tireChanged.sizeTire8}
              </div>
            }
          </div>
        )
      },
    ];
  }, []);

  useEffect(() => {
    if (!traila.id) return;

    form.setFieldsValue(traila);
  }, [traila, form]);

  return (
    <Modal
      {...props}
      cancelButtonProps={{
        style: {
          display: "none"
        }
      }}
      okText="Cerrar"
      onClose={onClose}
      onOk={onClose}
      width={"85vw"}
    >
      <h3>Historial de cambios de llantas</h3>
      <ButtonDownloadExcel
        buttonText="Descargar historial"
        fileName={`Historial-${traila.name}`}
        nameWorksheet={`Historial-${traila.name}`}
        columns={[
          {
            header: "Creado por",
            key: "createdByEmail",
            width: 32
          },
          {
            header: "Fecha de creación",
            key: "createdAtFormated",
            width: 32
          },
          {
            header: "Llanta 1",
            key: "tire1",
          },
          {
            header: "Llanta 2",
            key: "tire2",
          },
          {
            header: "Llanta 3",
            key: "tire3",
          },
          {
            header: "Llanta 4",
            key: "tire4",
          },
          {
            header: "Llanta 5",
            key: "tire5",
          },
          {
            header: "Llanta 6",
            key: "tire6",
          },
          {
            header: "Llanta 7",
            key: "tire7",
          },
          {
            header: "Llanta 8",
            key: "tire8",
          },
          {
            header: "Medida llanta 1",
            key: "sizeTire1",
          },
          {
            header: "Medida llanta 2",
            key: "sizeTire2",
          },
          {
            header: "Medida llanta 3",
            key: "sizeTire3",
          },
          {
            header: "Medida llanta 4",
            key: "sizeTire4",
          },
          {
            header: "Medida llanta 5",
            key: "sizeTire5",
          },
          {
            header: "Medida llanta 6",
            key: "sizeTire6",
          },
          {
            header: "Medida llanta 7",
            key: "sizeTire7",
          },
          {
            header: "Medida llanta 8",
            key: "sizeTire8",
          }
        ]}
        data={tiresChangedByTraila}
      />
      <br />
      <br />
      <Form
        form={form}
        layout="vertical"
        clearOnDestroy
      >
        <BaseInputsTraila disableInputs />
      </Form>
      <Table
        collection="tiresChangedByTraila"
        columns={columns}
        pathEdit=""
        query={query}
        whitPropsDateFormated
        wait={!traila.id}
        onLoadData={setTiresChangedByTraila}
      />
    </Modal>
  );
};

export default ModalHistoryChangeTires;