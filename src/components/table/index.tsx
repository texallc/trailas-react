import { useCallback, useMemo } from 'react';
import { Button, Empty, message, Table as TableAnt } from 'antd';
import { ColumnsType } from 'antd/es/table';
import useCollection, { PropsUseCollection } from "../../hooks/useCollection";
import TableActionsButtons from "./tableActionsButtons";
import { Traila } from "../../interfaces/trailas";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { create, update } from "../../services/firebase/firestore";
import { increment, sum } from "firebase/firestore";
import useOnSnapshot from "../../hooks/useOnSnapshot";

interface Props<T> extends PropsUseCollection {
	columns: ColumnsType<T>;
	placeholderSearch?: string;
	pathEdit: string;
	actionsTires?: boolean;
}

export interface Get<T> {
	total: number;
	list: Array<T>;
}

const { PRESENTED_IMAGE_SIMPLE } = Empty;

const Table = <T extends {}>({ columns: columnsProps, actionsTires, ...props }: Props<T>) => {
	const { loading, data, setData } = useOnSnapshot<T>(props);

	console.log(data);

	const updateTrailaTire = useCallback(async ({ id, name, category }: Traila, countTire: number) => {
		try {
			setData(d => d.map(item => ({ ...item, changingTire: (item as any).id === id })));

			await create("tiresChangedByTraila", {
				idTraila: id,
				nameTraila: name,
				categoryTraila: category,
				created_at: new Date,
				update_at: new Date(),
				countTire
			});
			await update("trailas", id!, { tiresChanged: increment(countTire) });
		} catch (error) {
			console.log(error);
			message.error("Error al actualizar el cambio de llanta", 4);
		}
	}, []);

	const columns = useMemo<ColumnsType<T>>(() => {
		const columns = columnsProps.map(c => ({ ...c, width: c.width || 150 }));

		if (actionsTires) {
			columns.push({
				width: 150,
				title: "Cambios de llantas",
				dataIndex: "tiresChanged",
				render: (_, t) => {
					const { id, tiresChanged, changingTire } = t as unknown as Traila;

					return (<div style={{
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}>
						{tiresChanged}
						<div
							style={{
								display: "grid",
								justifyContent: "center",
								alignItems: "center",
								gap: "10px",
							}}
						>
							<Button
								shape="circle"
								type="primary"
								icon={<PlusOutlined />}
								loading={changingTire}
								disabled={data.some(item => (item as any).changingTire)}
								onClick={() => updateTrailaTire(t as unknown as Traila, 1)}
							/>
							<Button
								shape="circle"
								type="primary"
								icon={<MinusOutlined />}
								disabled={data.some(item => (item as any).changingTire)}
								loading={changingTire}
								onClick={() => updateTrailaTire(t as unknown as Traila, -1)}
							/>
						</div >
					</div>);
				}
			});
		}

		columns.push({
			title: 'Acciones',
			key: 'actions',
			fixed: 'right',
			width: 100,
			render: (_, record: T) => {
				const r = record as T & { id: string; };

				return (
					<TableActionsButtons
						record={record}
						onDeleted={() => { }}
						fun={async () => { }}
						pathEdit={""}
					/>
				);
			},
		});

		return columns;
	}, [columnsProps, updateTrailaTire, data]);

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

export default Table;