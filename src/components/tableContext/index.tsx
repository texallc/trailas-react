import { useEffect, useMemo } from 'react';
import { Empty, Table as TableAnt } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useOnSnapshotContext } from "../../context/snapshotContext";
import TableActionsButtons from "../tableActionsButtons";

interface Props<T> {
  columns: ColumnsType<T>;
  placeholderSearch?: string;
  pathEdit: string;
  onLoadData?: (data: T[]) => void;
  showActionsButtons?: boolean;
}

const { PRESENTED_IMAGE_SIMPLE } = Empty;

const TableContext = <T extends {}>({ columns: columnsProps, onLoadData, showActionsButtons }: Props<T>) => {
  const { loading, data, snapshotProps } = useOnSnapshotContext<T>();

  useEffect(() => {
    if (loading) return;

    onLoadData?.(data);
  }, [loading, data]);

  const columns = useMemo<ColumnsType<T>>(() => {
    const columns = columnsProps.map(c => ({ ...c, width: c.width || 150 }));

    if (showActionsButtons) {
      columns.push({
        title: 'Acciones',
        key: 'actions',
        fixed: 'right',
        width: 100,
        render: (_, record: T) => {
          const r = record as T & { id: string; };

          return (
            <TableActionsButtons
              record={r}
              onDeleted={() => { }}
              pathEdit={""}
              path={snapshotProps.collection}
            />
          );
        },
      });
    }

    return columns;
  }, [columnsProps, data]);

  return (
    <div>
      <TableAnt
        sticky
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={data}
        loading={loading}
        locale={{ emptyText: <Empty image={PRESENTED_IMAGE_SIMPLE} description='Sin registros.' /> }}
        rowKey="id"
      />
    </div>
  );
};

export default TableContext;