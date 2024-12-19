import { Empty, Table } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { PropsUseGet } from "../../hooks/useGet";
import { Get } from "../../interfaces";
import { TableProps } from "../../interfaces/components/serverTable";
import { ColumnsType } from "antd/es/table";
import TableEditButton from "./tableEditButton";
import TableDeleteButton from "./tableDeleteButton";
import useGetSearchURL from "../../hooks/useGestSearchURL";
import { useGetContext } from "../../context/getContext";
import { changePageAndLimitUrl } from "../../utils/functions";
import FormControlProvider from "../../context/formControl";
import Filters from "./filters";

const ServerTable = <T extends { id: number; }>({
  url: urlProp,
  propsUrl,
  columns: columnsProp,
  filters,
  showEdit,
  showDisabled,
  wait,
}: TableProps<T>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [propsUseGet, setPropsUseGet] = useState<PropsUseGet>({ url: "" });
  const { url } = useGetSearchURL({ urlProp, propsUrl });
  const page = searchParams.get("pagina") || 1;
  const limit = searchParams.get("limite") || 10;

  useEffect(() => {
    setPropsUseGet({ url, wait });
  }, [url, wait]);

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
          return (
            <TableEditButton
              id={record.id}
              url={url}
            />
          );
        },
      });
    }
    return columns;
  }, [columnsProp, showEdit, showDisabled, url]);

  const { response, loading, setGetProps } = useGetContext<Get<T>>();

  useEffect(() => {
    setGetProps(propsUseGet);
  }, [propsUseGet, setGetProps]);

  return (
    <>
      {
        (filters && filters?.length > 0) && <FormControlProvider<T>
          inputsProp={filters}
          isFiltersTable
        >
          <Filters />
        </FormControlProvider>
      }
      <br />
      <Table
        sticky
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={response?.list || []}
        loading={loading}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Sin registros.' /> }}
        rowKey="id"
        pagination={{
          total: response?.total,
          current: isFinite(+page) ? +page : 1,
          pageSize: limit && isFinite(+limit) ? +limit : 10,
          onChange: (_page: number, pageSize: number) => {
            const newUrl = changePageAndLimitUrl(url, _page, pageSize);

            navigate({
              search: newUrl.split("?")[1]
            });
          },
          showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} de ${total} registros.`,
          locale: { items_per_page: '/ página' },
          showSizeChanger: true,
        }}
      />
    </>

  );
};

export default ServerTable;