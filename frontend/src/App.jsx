import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from 'react-data-table-component';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  LineElement, 
  PointElement, 
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import "./App.css";

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
  BarElement, Title, LineElement, PointElement, Filler
);

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  // STATS STATE
  const [stats, setStats] = useState({
    total: 0,
    light: 0,
    heavy: 0,
    twoWheeler: 0,
    peakHour: "N/A"
  });

  // CHART DATA STATE
  const [timeData, setTimeData] = useState({ labels: [], datasets: [] });
  const [stackedData, setStackedData] = useState({ labels: [], datasets: [] });

  const BASE_URL = "https://trafficlogger.onrender.com/api/";

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}filter`;
      const params = new URLSearchParams();

      if (vehicleType) params.append("type", vehicleType);
      if (location) params.append("location", location);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      const res = await axios.get(url, { params });
      setLogs(res.data);
      computeAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  }, [vehicleType, location, startDate, endDate]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}locations`);
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  // ANALYTICS 
  const computeAnalytics = (data) => {
    const counts = { total: data.length, light: 0, heavy: 0, twoWheeler: 0, peakHour: "N/A" };
    const hoursMap = {}; 
    const stackedMap = {}; 

    data.forEach(log => {
      if (log.vehicle_type === 'Light Vehicle') counts.light++;
      else if (log.vehicle_type === 'Heavy Vehicle') counts.heavy++;
      else if (log.vehicle_type === 'Two Wheeler') counts.twoWheeler++;

      const date = new Date(log.timestamp);
      const hourLabel = date.getHours() + ":00";
      
      hoursMap[hourLabel] = (hoursMap[hourLabel] || 0) + 1;

      if (!stackedMap[hourLabel]) {
        stackedMap[hourLabel] = { light: 0, heavy: 0, twoWheeler: 0 };
      }
      if (log.vehicle_type === 'Light Vehicle') stackedMap[hourLabel].light++;
      else if (log.vehicle_type === 'Heavy Vehicle') stackedMap[hourLabel].heavy++;
      else if (log.vehicle_type === 'Two Wheeler') stackedMap[hourLabel].twoWheeler++;
    });

    let maxTraffic = 0;
    let busiestHour = "-";
    Object.entries(hoursMap).forEach(([hour, count]) => {
      if(count > maxTraffic) {
        maxTraffic = count;
        busiestHour = hour;
      }
    });
    counts.peakHour = busiestHour;
    setStats(counts);

    const sortedHours = Object.keys(hoursMap).sort((a,b) => parseInt(a) - parseInt(b));

    const hourlyCounts = sortedHours.map(h => hoursMap[h]);
    setTimeData({
      labels: sortedHours,
      datasets: [{
        label: 'Total Traffic Volume',
        data: hourlyCounts,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#667eea'
      }]
    });

    setStackedData({
      labels: sortedHours,
      datasets: [
        {
          label: 'Heavy Vehicle',
          data: sortedHours.map(h => stackedMap[h].heavy),
          backgroundColor: '#f5576c', 
          borderRadius: 4,
        },
        {
          label: 'Light Vehicle',
          data: sortedHours.map(h => stackedMap[h].light),
          backgroundColor: '#4facfe', 
          borderRadius: 4,
        },
        {
          label: 'Two Wheeler',
          data: sortedHours.map(h => stackedMap[h].twoWheeler),
          backgroundColor: '#f093fb', 
          borderRadius: 4,
        }
      ]
    });
  };

  useEffect(() => {
    fetchLogs();
    fetchLocations();
  }, [fetchLogs]);

  // CHARTS
  const doughnutData = {
    labels: ['Light', 'Heavy', '2-Wheeler'],
    datasets: [{
      data: [stats.light, stats.heavy, stats.twoWheeler],
      backgroundColor: ['#4facfe', '#f5576c', '#f093fb'],
      borderWidth: 0,
    }]
  };

  const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true }
    }
  };

  const columns = [
    { name: 'Vehicle Type', selector: row => row.vehicle_type, sortable: true },
    { name: 'Timestamp', selector: row => new Date(row.timestamp).toLocaleString(), sortable: true },
    { name: 'Location', selector: row => row.location, sortable: true },
  ];

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <h1>🚦 Traffic Intelligence Hub</h1>
          <p>Advanced Real-time Surveillance & Analytics</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="card total">
          <h3>Total Traffic</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card heavy">
          <h3>Heavy Load</h3>
          <p>{stats.heavy}</p>
        </div>
        <div className="card peak">
          <h3>Peak Hour</h3>
          <p className="peak-text">{stats.peakHour}</p>
        </div>
      </div>

      <div className="chart-section full-width">
        <div className="chart-card">
          <h3>📈 Total Volume Trends</h3>
          <div className="chart-wrapper-wide">
            <Line data={timeData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>
      </div>

      <div className="chart-section split">
        <div className="chart-card">
          <h3>🚦 Category Traffic over Time</h3>
          <div className="chart-wrapper">
            <Bar data={stackedData} options={stackedOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Overall Composition</h3>
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option value="">All Vehicle Types</option>
            <option value="Light Vehicle">Light Vehicle</option>
            <option value="Heavy Vehicle">Heavy Vehicle</option>
            <option value="Two Wheeler">Two Wheeler</option>
          </select>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <DatePicker selected={startDate} onChange={setStartDate} placeholderText="Start Date" className="date-picker" />
          <DatePicker selected={endDate} onChange={setEndDate} placeholderText="End Date" className="date-picker" />
        </div>
        
        <button className="btn-filter" onClick={fetchLogs} disabled={loading}>
          {loading ? 'Refreshing...' : 'Apply Filters'}
        </button>
      </div>

      <div className="table-section">
        <h3>📄 Recent Logs</h3>
        <div className="table-wrapper" style={{ position: 'relative', minHeight: '300px' }}>
          
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Fetching Live Data...</p>
            </div>
          )}

          <DataTable
            columns={columns}
            data={logs}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headCells: { style: { background: '#f7fafc', color: '#4a5568', fontWeight: 'bold' } },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;