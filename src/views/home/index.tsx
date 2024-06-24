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

    const data: CH = {
      labels: categoires,
      datasets: [{
        label: "",
        data: categoires.map(category => {
          return trailas.filter(t => t.category === category).reduce((acc, t) => acc + t.tiresChanged, 0);
        }),
        backgroundColor: generateRandomColorWithBaseTone(),
      }]
    };

    return data;
  }, [trailas, loading]);

  return (
    <Bar options={options} data={data} />
  );
};

export default Home;