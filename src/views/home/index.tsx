import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { generateRandomColorWithBaseTone, getMonthLabels } from "../../utils/functions";
import useOnSnapshot, { PropsUseOnSnapshot } from "../../hooks/useOnSnapshot";
import { useMemo } from "react";
import { Traila } from "../../interfaces/traila";
import ButtonDownloadExcel from "../../components/buttonDownloadExcel";
import { Column } from "exceljs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Consumo de llantas por categoria año actual',
    },
  },
};

type CH = ChartData<"bar", (number | [number, number] | null)[], unknown>;

const Home = () => {
  const propsOnSnapshot = useMemo<PropsUseOnSnapshot>(() => {
    return { collection: "trailas", query: [] };
  }, []);
  const { data: trailas, loading } = useOnSnapshot<Traila>(propsOnSnapshot);

  const data = useMemo<CH>(() => {
    if (loading) return {
      labels: [],
      datasets: []
    };



    const categoires = [...new Set(trailas.map(c => c.category))];

    const dataBar = categoires.map(category => {
      return trailas.filter(t => t.category === category).reduce((acc, t) => acc + t.tiresChanged, 0);
    });

    console.log(dataBar);

    const data: CH = {
      labels: categoires,
      datasets: [{
        label: "",
        data: dataBar,
        backgroundColor: generateRandomColorWithBaseTone(),
      }]
    };

    return data;
  }, [trailas, loading]);

  const { columnsDownload, dataDownload } = useMemo<{ columnsDownload: Partial<Column>[]; dataDownload: { [key: string]: number; }[]; }>(() => {
    const categoires = [...new Set(trailas.map(c => c.category))];

    const columnsDownload = categoires.map(category => ({
      header: category,
      key: category,
      width: 24,
    }));

    const dataDownload = categoires.reduce((acc, category) => ({
      ...acc,
      [category]: trailas.filter(t => t.category === category).reduce((acc, t) => acc + t.tiresChanged, 0)
    }), {});

    return {
      columnsDownload,
      dataDownload: [dataDownload]
    };
  }, [trailas]);

  return (
    <>
      <br />
      <br />
      <ButtonDownloadExcel
        buttonText="Descargar consumo de llantas"
        fileName="Consumo-de-llantas-por-categoria"
        nameWorksheet="Consumo-de-llantas-por-categoria"
        columns={columnsDownload}
        data={dataDownload}
      />
      <Bar options={options} data={data} />
    </>
  );
};

export default Home;