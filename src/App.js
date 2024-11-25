// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';
import Graph from './Graph';
import ReportSummaryPage from './ReportSummaryPage'; // Import the new ReportSummaryPage component
import SidePanel from './SidePanel'; // Import the new SidePanel component
//import Clock from './Clocks'; // Import the new Clock component
import Header from './Header'; // Import the new Header component
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import './App.css';

// Register required Chart.js components
ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

const Dashboard = () => {
  const [graphType, setGraphType] = useState(null);
  const [ehr, setEhr] = useState(null);
  const [agency, setAgency] = useState([]);
  const [botType, setBotType] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [agencyOptions, setAgencyOptions] = useState([{ value: 'select-all', label: 'Select All' }]);
  const [loading, setLoading] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [selectedEhrInfo, setSelectedEhrInfo] = useState(null);

  const sidePanelRef = useRef(null);
  const navigate = useNavigate();

  const graphTypeOptions = [
    { value: 'bar', label: 'Bar Graph' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'line', label: 'Line Graph' },
  ];

  const ehrOptions = [
    { value: 'Athena', label: 'Athena' },
    { value: 'HCHB', label: 'HCHB' },
    { value: 'Kinnser', label: 'Kinnser' },
    { value: 'Kantime', label: 'Kantime' },
    { value: 'Axxess', label: 'Axxess' },
  ];

  const botTypeOptions = [
    { value: 'signed', label: 'Signed' },
    { value: 'unsigned', label: 'Unsigned' },
    { value: 'patient', label: 'Patient' },
    { value: 'reverse_sync', label: 'Reverse Sync' },
  ];

  const getDateRanges = () => {
    const currentDate = new Date();
    const oneDay = new Date(currentDate);
    const oneWeek = new Date(currentDate);
    const oneMonth = new Date(currentDate);

    oneWeek.setDate(currentDate.getDate() - 7);
    oneMonth.setMonth(currentDate.getMonth() - 1);

    return {
      daily: { start: oneDay.toISOString().split('T')[0], end: oneDay.toISOString().split('T')[0] },
      weekly: { start: oneWeek.toISOString().split('T')[0], end: currentDate.toISOString().split('T')[0] },
      monthly: { start: oneMonth.toISOString().split('T')[0], end: currentDate.toISOString().split('T')[0] },
    };
  };

  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    const ranges = getDateRanges();
    setDateOptions([
      { value: 'daily', label: `Daily (${ranges.daily.start})` },
      { value: 'weekly', label: `Weekly (${ranges.weekly.start} - ${ranges.weekly.end})` },
      { value: 'monthly', label: `Monthly (${ranges.monthly.start} - ${ranges.monthly.end})` },
      { value: 'custom', label: 'Custom Range' },
    ]);
  }, []);

  const fetchAgencyOptions = async (ehrName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://da-web-app.azurewebsites.net/api/Config/GetConfigDataByName/${ehrName}`,
        {
          headers: {
            'X-SERVICE-KEY': '9A823946C424797374D357C436CEC',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch agency options');
      const data = await response.json();

      const credentials = data.credentials.map((credential) => ({
        value: credential.credentialName,
        label: credential.credentialName,
      }));
      setAgencyOptions([{ value: 'select-all', label: 'Select All' }, ...credentials]);
    } catch (error) {
      console.error('Error fetching agency options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadGraphs = () => {
    if (!ehr || !agency.length || !botType || !dateRange) {
      alert('Please select all filters.');
      return;
    }

    let updatedGraphData = null;

    // Check if 'Select All' is selected
    const selectAllSelected = agency.some((a) => a.value === 'select-all');

    let selectedAgencies = [];
    if (selectAllSelected) {
      selectedAgencies = agencyOptions.filter((a) => a.value !== 'select-all').map((a) => a.label);
    } else {
      selectedAgencies = agency.map((a) => a.label);
    }

    if (dateRange.value === 'daily') {
      updatedGraphData = {
        labels: selectAllSelected ? ['All Agencies'] : selectedAgencies, // Show 'All Agencies' if select all is chosen
        datasets: [
          {
            label: 'Total Orders Needed to Be Uploaded',
            data: selectAllSelected ? [30 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(30), // Cumulative value if select all is chosen
            backgroundColor: '#FF9500',
            borderColor: '#FF9500',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Orders Actually Uploaded',
            data: selectAllSelected ? [25 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(25),
            backgroundColor: '#34C759',
            borderColor: '#34C759',
            fill: false,
            tension: 0.1,
          },
        ],
      };
    } else if (dateRange.value === 'weekly') {
      updatedGraphData = {
        labels: selectAllSelected ? ['All Agencies'] : selectedAgencies, // Show 'All Agencies' if select all is chosen
        datasets: [
          {
            label: 'Total Orders Needed to Be Uploaded',
            data: selectAllSelected ? [50 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(50), // Cumulative value if select all is chosen
            backgroundColor: '#FF9500',
            borderColor: '#FF9500',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Orders Actually Uploaded',
            data: selectAllSelected ? [45 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(45),
            backgroundColor: '#34C759',
            borderColor: '#34C759',
            fill: false,
            tension: 0.1,
          },
        ],
      };
    } else if (dateRange.value === 'monthly') {
      updatedGraphData = {
        labels: selectAllSelected ? ['All Agencies'] : selectedAgencies, // Show 'All Agencies' if select all is chosen
        datasets: [
          {
            label: 'Total Orders Needed to Be Uploaded',
            data: selectAllSelected ? [200 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(200), // Cumulative value if select all is chosen
            backgroundColor: '#FF9500',
            borderColor: '#FF9500',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Orders Actually Uploaded',
            data: selectAllSelected ? [180 * selectedAgencies.length] : new Array(selectedAgencies.length).fill(180),
            backgroundColor: '#34C759',
            borderColor: '#34C759',
            fill: false,
            tension: 0.1,
          },
        ],
      };
    }

    setGraphData(updatedGraphData);
    setShowGraphs(true);
  };

  const handleReportSummaryClick = () => {
    navigate('/report-summary');
  };

  return (
    <div>
      <Header
        sidePanelOpen={sidePanelOpen}
        setSidePanelOpen={setSidePanelOpen}
        sidePanelRef={sidePanelRef}
      />
      <SidePanel
        ehrOptions={ehrOptions}
        selectedEhrInfo={selectedEhrInfo}
        setSelectedEhrInfo={setSelectedEhrInfo}
        sidePanelOpen={sidePanelOpen}
        setSidePanelOpen={setSidePanelOpen}
        sidePanelRef={sidePanelRef}
      />
      {/* Dashboard Content */}
      <Filters
        graphTypeOptions={graphTypeOptions}
        ehrOptions={ehrOptions}
        agencyOptions={agencyOptions}
        botTypeOptions={botTypeOptions}
        dateOptions={dateOptions}
        graphType={graphType}
        setGraphType={setGraphType}
        ehr={ehr}
        setEhr={setEhr}
        agency={agency}
        setAgency={setAgency}
        botType={botType}
        setBotType={setBotType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        customRange={customRange}
        setCustomRange={setCustomRange}
        loading={loading}
        fetchAgencyOptions={fetchAgencyOptions}
      />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleLoadGraphs}
          className="load-graphs-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Graphs'}
        </button>
      </div>
      {showGraphs && (
        <>
          <Graph graphType={graphType} data={graphData} />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleReportSummaryClick}
              className="report-summary-button"
            >
              Report Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report-summary" element={<ReportSummaryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
