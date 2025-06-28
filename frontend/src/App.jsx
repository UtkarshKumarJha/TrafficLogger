import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from 'react-data-table-component';
import { createTheme } from 'react-data-table-component';import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");

  const [summary, setSummary] = useState({
    total: 0,
    byType: {},
    byLocation: {},
  });

  const fetchLogs = async () => {
    try {
      let url = "http://localhost:5000/api/";
      const params = new URLSearchParams();

      if (vehicleType) params.append("type", vehicleType);
      if (location) params.append("location", location);
      if (startDate && endDate) {
        params.append("startDate", new Date(startDate).toISOString());
        params.append("endDate", new Date(endDate).toISOString());
      }

      if (params.toString()) {
        url += "filter?" + params.toString();
      }

      console.log("Fetching logs from:", url);
      const res = await axios.get(url);
      setLogs(res.data);
      computeSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchLocations();
  }, []);


  const computeSummary = (data) => {
    const byType = {};
    const byLocation = {};
    let total = 0;

    data.forEach((log) => {
      total += 1;
      byType[log.vehicle_type] = (byType[log.vehicle_type] || 0) + 1;
      byLocation[log.location] = (byLocation[log.location] || 0) + 1;
    });

    setSummary({ total, byType, byLocation });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      name: 'Vehicle Type',
      selector: row => row.vehicle_type,
      sortable: true,
    },
    {
      name: 'Timestamp',
      selector: row => new Date(row.timestamp).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
    },
  ];
  createTheme('solarized', {
    text: {
      primary: '#333',
      secondary: '#2aa198',
    },
    background: {
      default: '#f5f7fa',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#ccc',
    },
  });


  return (
    <div className="container">
      <h1 className="heading">🚗 Vehicle Detection Logs</h1>

      {/* Filters */}
      <div className="filters">
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Light Vehicle">Light Vehicle</option>
          <option value="Heavy Vehicle">Heavy Vehicle</option>
          <option value="Two Wheeler">Two Wheeler</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          <option value="Location A">Location A</option>
          <option value="Location B">Location B</option>
          {/* Add more if needed */}
        </select>

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          showTimeSelect
          dateFormat="Pp"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          showTimeSelect
          dateFormat="Pp"
        />

        <button onClick={fetchLogs}>Filter</button>
      </div>

      {/* Summary */}
      <div className="summary">
        <h3>📊 Summary</h3>
        <p>
          <strong>Total Vehicles:</strong> {summary.total}
        </p>

        <div>
          <strong>By Type:</strong>
          <ul>
            {Object.entries(summary.byType).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>By Location:</strong>
          <ul>
            {Object.entries(summary.byLocation).map(([loc, count]) => (
              <li key={loc}>
                {loc}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Vehicle Log Data"
        theme="solarized"
        columns={columns}
        data={logs}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        striped
        dense
        noDataComponent="No logs found"
      />
    </div>
  );
}

export default App;
