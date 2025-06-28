import express from 'express';
import {CarDetection} from '../models/Log.js';
const router = express.Router();

router.post('/log', async (req, res) => {
  let { vehicle_type, timestamp, location } = req.body;

  if (!vehicle_type || !timestamp || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const typeMap = {
    car: 'Light Vehicle',
    truck: 'Heavy Vehicle',
    motorcycle: 'Two Wheeler',
    bus: 'Heavy Vehicle',
  };

  const storedType = typeMap[vehicle_type] || vehicle_type;

  try {
    const newLog = await CarDetection.create({
      vehicle_type: storedType,
      timestamp: new Date(timestamp),
      location,
    });

    console.log('New log entry added:', newLog);
    res.status(201).json({ message: 'Log entry added successfully', log: newLog });
  } catch (err) {
    console.error('Error adding log:', err);
    res.status(500).json({ message: 'Failed to add log' });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const locations = await CarDetection.distinct('location');
    res.status(200).json(locations);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});


router.get('/', async (req, res) => {
    
    console.log('Fetching all logs');
    try {
        const logs = await CarDetection.find().sort({ createdAt: -1 });
        res.status(200).json(logs);

    }catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/filter', async (req, res) => {
    const { type, startDate, endDate, location } = req.query;
    const query = {};
  
    if (type) {
      query.vehicle_type = type;
    }
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      query.timestamp = {
        $gte: start,
        $lte: end
      };
    }
    if (location) {
      query.location = location;
    }
  
    try {
        
      const logs = await CarDetection.find(query).sort({ timestamp: -1 });
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error filtering logs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
export {router}
