
import { Empty, Table } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useGet, { PropsUseGet } from "../../hooks/useGet";
import { Get } from "../../interfaces";
import { TableProps } from "../../interfaces/components/serverTable";
import Filters from "./filters";
import FormControlProvider from "../../context/formControl";
import { ColumnsType } from "antd/es/table";
import useAbortController from "../../hooks/useAbortController";
import TableEditButton from "./tableEditButton";
import TableDeleteButton from "./tableDeleteButton";

const ServerTable = <T extends { id: number; }>({ url: urlProp, columns: columnsProp, filters, showEdit, showDisabled }: TableProps<T>) => {
  const abortController = useAbortController();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [propsUseGet, setPropsUseGet] = useState<PropsUseGet>({ url: "" });
  const [url, setUrl] = useState("");

  useEffect(() => {
    let _url = urlProp || `${pathname}/list`;

    for (const param of searchParams) {
      if (!_url.includes("?")) {
        _url += `?${param[0]}=${param[1]}`;
        continue;
      };

      _url += `&${param[0]}=${param[1]}`;
    }

    setUrl(_url);
    setPropsUseGet({ url: _url });
  }, [urlProp, searchParams]);

  const page = searchParams.get('pagina') || 1;
  const limit = searchParams.get('limite') || 10;

  const columns = useMemo<ColumnsType<T>>(() => {
    const columns = columnsProp.map(c => ({ ...c, width: c.width || 150 }));

    if (showDisabled) {
      columns.push({
        title: 'Activo',
        dataIndex: 'active',
        key: 'active',
        width: 100,
        render: (_, record) => {
          const { id, active } = record as T & { active: boolean; };

          return (
            <TableDeleteButton
              record={{ id, active }}
              onDeleted={() => {
                setPropsUseGet({ url: "" });

                setTimeout(() => {
                  setPropsUseGet({ url });
                }, 500);
              }}
            />
          );
        },
      });
    }

    if (showEdit) {
      columns.push({
        title: 'Editar',
        key: 'edit',
        fixed: 'right',
        width: 100,
        render: (_, record: T) => {
          const r = record as T & { active: boolean; };

          return (
            <TableEditButton
              id={record.id}
              onUpdated={() => {
                setPropsUseGet({ url: "" });

                setTimeout(() => {
                  setPropsUseGet({ url });
                }, 100);
              }}
            />
          );
        },
      });
    }
    return columns;
  }, [columnsProp, showEdit, showDisabled, abortController, url]);

  const { response, loading } = useGet<Get<T>>(propsUseGet);

  return (
    <>
      {
        filters && <FormControlProvider<T>
          itemsProp={filters}
        >
          <Filters />
        </FormControlProvider>
      }
      <br />
      <Table
        sticky
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={response?.list}
        loading={loading}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Sin registros.' /> }}
        rowKey="id"
        pagination={{
          total: response?.total,
          current: +page,
          pageSize: +limit,
          onChange: (_page: number, pageSize: number) => {
            navigate({
              search: `?pagina=${_page}&limite=${pageSize}`
            });
          },
          showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} de ${total} registros.`,
          locale: { items_per_page: '/ página' },
          showSizeChanger: true
        }}
      />
    </>

  );
};

export default ServerTable;